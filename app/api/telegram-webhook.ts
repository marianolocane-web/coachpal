import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandling } from './_lib/handler.js';
import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';
import { transcribeAudio } from './_lib/groq.js';
import { sendTelegramMessage, downloadTelegramVoice } from './_lib/telegram.js';
import { computeCompanionReply, computeEntryFinalization, persistFinalizationAndReconcileMood } from './_lib/diarioCore.js';

// The Claude calls in computeEntryFinalization run sequentially (summary,
// tag suggestion, tag normalization, embedding) and can take longer than the
// platform's 10s default — request the full 60s Hobby allows.
export const maxDuration = 60;

const FINALIZE_HINT = '\n\nPara finalizar escribir: "guardar"';

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    text?: string;
    voice?: { file_id: string };
  };
}

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  const secret = req.headers['x-telegram-bot-api-secret-token'];
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    res.status(401).json({ error: 'Invalid secret' });
    return;
  }

  const update = (req.body || {}) as TelegramUpdate;
  const message = update.message;
  if (!message) {
    // Ignore update types we don't handle (edited messages, reactions, etc).
    res.status(200).json({ ok: true });
    return;
  }

  const chatId = message.chat.id;
  const supabase = getSupabaseAdmin();

  if (typeof message.text === 'string' && message.text.startsWith('/start')) {
    await handleStart(chatId, message.text);
    res.status(200).json({ ok: true });
    return;
  }

  const { data: settings } = await supabase.from('user_settings').select('user_id').eq('telegram_chat_id', chatId).maybeSingle();
  if (!settings) {
    await sendTelegramMessage(
      chatId,
      'Todavía no vinculaste tu cuenta de CoachPal a este chat. Andá a Perfil → Diario en la app y tocá "Conectar Telegram".',
    );
    res.status(200).json({ ok: true });
    return;
  }
  const userId = settings.user_id as string;

  let text: string;
  let audioStoragePath: string | null = null;

  if (message.voice) {
    // The entry needs to exist before we can key the storage path off its id.
    const entryId = await getOrCreateOpenTelegramEntry(userId);
    const audioBuffer = await downloadTelegramVoice(message.voice.file_id);
    const path = `${userId}/${entryId}/${crypto.randomUUID()}.ogg`;
    const { error: uploadError } = await supabase.storage.from('diario-audio').upload(path, audioBuffer, { contentType: 'audio/ogg' });
    if (uploadError) {
      await sendTelegramMessage(chatId, 'No pude guardar el audio, ¿lo probás de nuevo?');
      res.status(200).json({ ok: true });
      return;
    }
    text = await transcribeAudio(audioBuffer, 'voice.ogg');
    audioStoragePath = path;
    await handleTurn(userId, chatId, entryId, text, audioStoragePath);
  } else if (typeof message.text === 'string') {
    text = message.text;
    const entryId = await getOrCreateOpenTelegramEntry(userId);
    await handleTurn(userId, chatId, entryId, text, null);
  } else {
    await sendTelegramMessage(chatId, 'Por ahora solo entiendo texto o notas de voz.');
  }

  res.status(200).json({ ok: true });
});

async function handleStart(chatId: number, text: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const token = text.split(' ')[1]?.trim();
  if (!token) {
    await sendTelegramMessage(chatId, 'Para vincular tu cuenta, generá un link desde Perfil → Diario → "Conectar Telegram" en la app.');
    return;
  }

  const { data: tokenRow } = await supabase.from('telegram_link_tokens').select('*').eq('token', token).maybeSingle();
  if (!tokenRow || tokenRow.used_at || new Date(tokenRow.expires_at) < new Date()) {
    await sendTelegramMessage(chatId, 'Ese link ya no es válido. Generá uno nuevo desde el Perfil de la app.');
    return;
  }

  await supabase.from('user_settings').upsert({ user_id: tokenRow.user_id, telegram_chat_id: chatId }, { onConflict: 'user_id' });
  await supabase.from('telegram_link_tokens').update({ used_at: new Date().toISOString() }).eq('token', token);
  await sendTelegramMessage(chatId, '✅ Tu cuenta de CoachPal quedó vinculada a este chat. Mandame un audio o un mensaje para empezar una entrada de diario.');
}

async function getOrCreateOpenTelegramEntry(userId: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from('diario_entries')
    .select('id')
    .eq('user_id', userId)
    .eq('source', 'telegram')
    .eq('status', 'in_progress')
    .maybeSingle();
  if (existing) return existing.id as string;

  const { data: created, error } = await supabase
    .from('diario_entries')
    .insert({ user_id: userId, status: 'in_progress', source: 'telegram' })
    .select('id')
    .single();
  if (error || !created) throw new Error(`Could not create diario entry: ${error?.message}`);
  return created.id as string;
}

async function handleTurn(userId: string, chatId: number, entryId: string, text: string, audioStoragePath: string | null): Promise<void> {
  const supabase = getSupabaseAdmin();

  if (text.trim().toLowerCase() === 'guardar') {
    const { count } = await supabase
      .from('diario_messages')
      .select('id', { count: 'exact', head: true })
      .eq('entry_id', entryId)
      .eq('role', 'user');
    if (!count) {
      await sendTelegramMessage(chatId, 'Todavía no hay nada que guardar en esta entrada — mandame un audio o mensaje primero.');
      return;
    }
    const result = await computeEntryFinalization(supabase, userId, entryId);
    await persistFinalizationAndReconcileMood(supabase, userId, entryId, result);
    await sendTelegramMessage(chatId, `✅ Entrada guardada: "${result.title}" ${result.moodEmoji}`);
    return;
  }

  await supabase.from('diario_messages').insert({
    entry_id: entryId,
    role: 'user',
    content_type: audioStoragePath ? 'audio' : 'text',
    text_content: text,
    audio_storage_path: audioStoragePath,
  });

  const reply = await computeCompanionReply(supabase, userId, entryId);
  await supabase.from('diario_messages').insert({ entry_id: entryId, role: 'assistant', content_type: 'text', text_content: reply });

  await sendTelegramMessage(chatId, reply + FINALIZE_HINT);
}
