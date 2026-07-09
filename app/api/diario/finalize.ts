import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandling } from '../_lib/handler.js';
import { getSupabaseForRequest, getAuthedUserId, HttpError } from '../_lib/supabaseServer.js';
import { callClaudeWithTool, DEFAULT_MODEL } from '../_lib/claude.js';
import { embedText } from '../_lib/voyage.js';

interface FinalizeSummaryResult {
  title: string;
  summary_markdown: string;
  mood_emoji: string;
}

interface SuggestTagsResult {
  suggested_tags: string[];
}

interface NormalizeTagsResult {
  final_tags: string[];
}

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  const { entryId } = (req.body || {}) as { entryId?: string };
  if (!entryId) throw new HttpError(400, 'Missing entryId');

  const { supabase } = getSupabaseForRequest(req);
  const userId = await getAuthedUserId(supabase);

  const { data: entry, error: entryError } = await supabase
    .from('diario_entries')
    .select('id, user_id, status')
    .eq('id', entryId)
    .single();
  if (entryError || !entry) throw new HttpError(404, 'Entry not found');
  if (entry.user_id !== userId) throw new HttpError(403, 'Not your entry');
  if (entry.status !== 'in_progress') throw new HttpError(400, 'Entry is already finalized');

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

  const summaryResult = await callClaudeWithTool<FinalizeSummaryResult>({
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

  const suggestResult = await callClaudeWithTool<SuggestTagsResult>({
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
    ? await callClaudeWithTool<NormalizeTagsResult>({
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

  res.status(200).json({
    title: summaryResult.title,
    summaryMarkdown: summaryResult.summary_markdown,
    moodEmoji: summaryResult.mood_emoji,
    tags: normalizeResult.final_tags,
    embedding,
    transcriptMarkdown,
  });
});
