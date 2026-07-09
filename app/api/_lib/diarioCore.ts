import type { SupabaseClient } from '@supabase/supabase-js';
import { buildUserContext } from './context.js';
import { callClaudeForText, callClaudeWithTool, CONVERSATION_MODEL, DEFAULT_MODEL, type ClaudeMessage } from './claude.js';
import { DEFAULT_DIARIO_PERSONA } from './personas.js';
import { embedText } from './voyage.js';
import { HttpError } from './supabaseServer.js';

// Shared, transport-agnostic Diario logic: reused by the browser-facing
// endpoints (api/diario/chat.ts, finalize.ts, pick-day-mood.ts — which take
// a request-scoped, RLS-authenticated Supabase client) and by
// api/telegram-webhook.ts (which has no user session at all and instead
// passes a service-role admin client + a `userId` resolved from the linked
// chat_id). Every function below still re-checks entry ownership against
// the given `userId` explicitly — for the Telegram path, backed by the
// admin client, that check is the ONLY thing enforcing per-user isolation,
// since the admin client bypasses RLS entirely.

async function loadInProgressEntry(supabase: SupabaseClient, userId: string, entryId: string) {
  const { data: entry, error } = await supabase.from('diario_entries').select('id, user_id, status').eq('id', entryId).single();
  if (error || !entry) throw new HttpError(404, 'Entry not found');
  if (entry.user_id !== userId) throw new HttpError(403, 'Not your entry');
  if (entry.status !== 'in_progress') throw new HttpError(400, 'Entry is already finalized');
  return entry;
}

export async function computeCompanionReply(supabase: SupabaseClient, userId: string, entryId: string): Promise<string> {
  await loadInProgressEntry(supabase, userId, entryId);

  const { data: messageRows, error: messagesError } = await supabase
    .from('diario_messages')
    .select('role, text_content, created_at')
    .eq('entry_id', entryId)
    .order('created_at', { ascending: true });
  if (messagesError) throw new HttpError(500, messagesError.message);
  if (!messageRows?.length) throw new HttpError(400, 'No messages yet for this entry');

  const lastUserMessage = [...messageRows].reverse().find((m) => m.role === 'user');

  const { data: settings } = await supabase
    .from('user_settings')
    .select('diario_persona_prompt')
    .eq('user_id', userId)
    .maybeSingle();

  const persona = settings?.diario_persona_prompt || DEFAULT_DIARIO_PERSONA;
  const context = await buildUserContext(supabase, userId, { focusQuery: lastUserMessage?.text_content ?? undefined });

  const system = `${persona}\n\nContexto reciente del usuario (usalo solo si es genuinamente relevante para lo que está contando ahora — no lo fuerces ni lo menciones todo de una):\n\n${context}`;

  const messages: ClaudeMessage[] = messageRows.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.text_content || '',
  }));

  return callClaudeForText({ system, messages, model: CONVERSATION_MODEL });
}

export interface FinalizationResult {
  title: string;
  summaryMarkdown: string;
  moodEmoji: string;
  tags: string[];
  embedding: number[];
  transcriptMarkdown: string;
}

export async function computeEntryFinalization(supabase: SupabaseClient, userId: string, entryId: string): Promise<FinalizationResult> {
  await loadInProgressEntry(supabase, userId, entryId);

  const { data: messageRows, error: messagesError } = await supabase
    .from('diario_messages')
    .select('role, content_type, text_content, created_at')
    .eq('entry_id', entryId)
    .order('created_at', { ascending: true });
  if (messagesError) throw new HttpError(500, messagesError.message);
  if (!messageRows?.length) throw new HttpError(400, 'No messages yet for this entry');

  const transcriptMarkdown = messageRows
    .map((m) => `**${m.role === 'user' ? 'Vos' : 'Acompañante'}:** ${m.text_content ?? '(audio)'}`)
    .join('\n\n');

  const summaryResult = await callClaudeWithTool<{ title: string; summary_markdown: string; mood_emoji: string }>({
    model: DEFAULT_MODEL,
    system: `Vas a recibir la transcripción completa de una conversación de diario entre
un usuario y su acompañante de IA en la app CoachPal. Tu tarea es llamar a
finalize_entry_summary con un resumen fiel y útil como memoria futura.

Reglas:
- El resumen es para consumo de otra IA en el futuro, no para el usuario —
  priorizá precisión y densidad de información útil sobre estilo literario.
- No inventes ni interpretes más allá de lo que la persona efectivamente
  compartió.
- mood_emoji: elegí el que mejor represente el tono emocional predominante,
  no necesariamente el primero o el último mencionado.`,
    messages: [{ role: 'user', content: transcriptMarkdown }],
    tool: {
      name: 'finalize_entry_summary',
      description: 'Genera el título, resumen en markdown y emoji de una entrada de diario ya finalizada.',
      input_schema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Título breve (3-6 palabras) que resuma la entrada.' },
          summary_markdown: {
            type: 'string',
            description:
              'Resumen en markdown (2-4 párrafos cortos o una lista con puntos clave) de lo conversado, escrito en tercera persona, para servir como memoria en futuras conversaciones.',
          },
          mood_emoji: { type: 'string', description: 'Un único emoji que represente el estado de ánimo predominante de la entrada.' },
        },
        required: ['title', 'summary_markdown', 'mood_emoji'],
      },
    },
  });

  const suggestResult = await callClaudeWithTool<{ suggested_tags: string[] }>({
    model: DEFAULT_MODEL,
    system: `Sugerí entre 1 y 5 etiquetas de tema para esta entrada de diario, en base a
la transcripción y el resumen que recibís. Cada etiqueta: 1-2 palabras, en
minúscula, en español, sin artículos. Priorizá los temas más centrales, no
menciones de paso.`,
    messages: [{ role: 'user', content: `Resumen: ${summaryResult.summary_markdown}\n\nTranscripción: ${transcriptMarkdown}` }],
    tool: {
      name: 'suggest_tags',
      description: 'Sugiere entre 1 y 5 etiquetas de temas tratados en una entrada de diario.',
      input_schema: {
        type: 'object',
        properties: {
          suggested_tags: { type: 'array', items: { type: 'string' }, description: 'Entre 1 y 5 etiquetas cortas en minúscula.' },
        },
        required: ['suggested_tags'],
      },
    },
  });

  const { data: pastEntries } = await supabase
    .from('diario_entries')
    .select('tags')
    .eq('user_id', userId)
    .in('status', ['active', 'archived']);
  const existingVocabulary = Array.from(new Set((pastEntries || []).flatMap((e) => e.tags || [])));

  const normalizeResult = existingVocabulary.length
    ? await callClaudeWithTool<{ final_tags: string[] }>({
        model: DEFAULT_MODEL,
        system: `Recibís una lista de etiquetas SUGERIDAS para una entrada nueva, y la lista
de etiquetas que el usuario ya usó en el pasado. Tu tarea es devolver la
lista final de etiquetas a guardar, evitando fragmentar el vocabulario del
usuario.

Reglas:
- Si una etiqueta sugerida es semánticamente equivalente a una ya existente
  (ej. sugerida "laboral", existente "trabajo"), usá la EXISTENTE, no la
  sugerida.
- Si una etiqueta sugerida es genuinamente un tema nuevo que ninguna
  etiqueta existente cubre, mantenela tal cual.
- No agregues etiquetas que no estén ni sugeridas ni sean necesarias.`,
        messages: [
          {
            role: 'user',
            content: `Etiquetas sugeridas para esta entrada: ${JSON.stringify(suggestResult.suggested_tags)}\nEtiquetas ya existentes del usuario: ${JSON.stringify(existingVocabulary)}`,
          },
        ],
        tool: {
          name: 'normalize_tags',
          description: 'Normaliza etiquetas sugeridas contra el vocabulario existente del usuario.',
          input_schema: {
            type: 'object',
            properties: {
              final_tags: { type: 'array', items: { type: 'string' }, description: 'Lista final de etiquetas a guardar.' },
            },
            required: ['final_tags'],
          },
        },
      })
    : { final_tags: suggestResult.suggested_tags };

  const embedding = await embedText(`${summaryResult.title}\n\n${summaryResult.summary_markdown}`, 'document');

  return {
    title: summaryResult.title,
    summaryMarkdown: summaryResult.summary_markdown,
    moodEmoji: summaryResult.mood_emoji,
    tags: normalizeResult.final_tags,
    embedding,
    transcriptMarkdown,
  };
}

export async function pickDayMoodForEntries(entries: { time: string; emoji: string; summary: string }[]): Promise<string> {
  const entriesText = entries.map((e) => `- ${e.time} ${e.emoji}: ${e.summary}`).join('\n');

  const result = await callClaudeWithTool<{ day_emoji: string }>({
    model: DEFAULT_MODEL,
    system: `Elegís el emoji que mejor representa el estado de ánimo general de un día
con múltiples entradas de diario. No es necesariamente el de la última
entrada — considerá el conjunto del día.`,
    messages: [{ role: 'user', content: `Entradas del día, en orden cronológico:\n${entriesText}` }],
    tool: {
      name: 'pick_day_mood',
      description: 'Elige el emoji que mejor representa el estado de ánimo general de un día con múltiples entradas de diario.',
      input_schema: {
        type: 'object',
        properties: {
          day_emoji: { type: 'string', description: 'Un único emoji representando el día completo.' },
        },
        required: ['day_emoji'],
      },
    },
  });

  return result.day_emoji;
}

/** Persists a computed finalization and reconciles that day's day_moods — the part the app's frontend does itself via diarioApi.ts, needed server-side too for the Telegram path which has no frontend to do it. */
export async function persistFinalizationAndReconcileMood(
  supabase: SupabaseClient,
  userId: string,
  entryId: string,
  result: FinalizationResult,
): Promise<void> {
  const { data: entry, error } = await supabase
    .from('diario_entries')
    .update({
      status: 'active',
      title: result.title,
      summary_markdown: result.summaryMarkdown,
      transcript_markdown: result.transcriptMarkdown,
      mood_emoji: result.moodEmoji,
      tags: result.tags,
      embedding: result.embedding,
      finalized_at: new Date().toISOString(),
    })
    .eq('id', entryId)
    .select('entry_date')
    .single();
  if (error || !entry) throw new HttpError(500, error?.message || 'Failed to persist finalization');

  const { data: dayEntries } = await supabase
    .from('diario_entries')
    .select('created_at, mood_emoji, title, summary_markdown')
    .eq('user_id', userId)
    .eq('entry_date', entry.entry_date)
    .eq('status', 'active')
    .order('created_at', { ascending: true });
  if (!dayEntries?.length) return;

  let dayEmoji: string | null = dayEntries[0].mood_emoji;
  if (dayEntries.length > 1) {
    dayEmoji = await pickDayMoodForEntries(
      dayEntries.map((e) => ({ time: e.created_at, emoji: e.mood_emoji, summary: e.summary_markdown })),
    );
  }

  await supabase.from('day_moods').upsert({ user_id: userId, log_date: entry.entry_date, emoji: dayEmoji }, { onConflict: 'user_id,log_date' });
}
