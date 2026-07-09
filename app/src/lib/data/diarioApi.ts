import { supabase } from '../supabaseClient';
import {
  diaryCommentFromRow,
  diaryEntryFromRow,
  diaryMessageFromRow,
  diarySemanticMatchFromRow,
  type DiaryComment,
  type DiaryEntry,
  type DiaryMessage,
  type DiaryMessageContentType,
  type DiaryMessageRole,
  type DiarySemanticMatch,
} from './types';

const AUDIO_BUCKET = 'diario-audio';

async function callDiarioApi<T>(path: string, body: unknown): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const res = await fetch(`/api/diario/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `Request to /api/diario/${path} failed`);
  return json as T;
}

// ---- Entries ----

export async function listEntries(userId: string, status: ('active' | 'archived')[] = ['active']): Promise<DiaryEntry[]> {
  const { data, error } = await supabase
    .from('diario_entries')
    .select('*')
    .eq('user_id', userId)
    .in('status', status)
    .order('entry_date', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(diaryEntryFromRow);
}

export async function getEntry(id: string): Promise<DiaryEntry | null> {
  const { data, error } = await supabase.from('diario_entries').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? diaryEntryFromRow(data) : null;
}

export async function startEntry(userId: string): Promise<DiaryEntry> {
  const { data, error } = await supabase
    .from('diario_entries')
    .insert({ user_id: userId, status: 'in_progress' })
    .select('*')
    .single();
  if (error) throw error;
  return diaryEntryFromRow(data);
}

export async function archiveEntry(id: string): Promise<void> {
  const { error } = await supabase
    .from('diario_entries')
    .update({ status: 'archived', archived_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

// ---- Messages ----

export async function listMessages(entryId: string): Promise<DiaryMessage[]> {
  const { data, error } = await supabase
    .from('diario_messages')
    .select('*')
    .eq('entry_id', entryId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map(diaryMessageFromRow);
}

export async function addMessage(input: {
  entryId: string;
  role: DiaryMessageRole;
  contentType: DiaryMessageContentType;
  textContent?: string | null;
  audioStoragePath?: string | null;
}): Promise<DiaryMessage> {
  const { data, error } = await supabase
    .from('diario_messages')
    .insert({
      entry_id: input.entryId,
      role: input.role,
      content_type: input.contentType,
      text_content: input.textContent ?? null,
      audio_storage_path: input.audioStoragePath ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return diaryMessageFromRow(data);
}

/** Uploads a recorded/imported audio clip (e.g. an .m4a exported from iPhone Voice Memos) to private Storage. */
export async function uploadAudio(userId: string, entryId: string, file: Blob, ext: string): Promise<string> {
  const path = `${userId}/${entryId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(AUDIO_BUCKET).upload(path, file);
  if (error) throw error;
  return path;
}

export async function getAudioSignedUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(AUDIO_BUCKET).createSignedUrl(path, 60 * 10);
  if (error || !data) throw error || new Error('Could not sign audio URL');
  return data.signedUrl;
}

/** Sends an audio clip to the transcription proxy and returns the recognized text. */
export async function transcribeAudio(storagePath: string): Promise<string> {
  const { text } = await callDiarioApi<{ text: string }>('transcribe', { storagePath });
  return text;
}

/** Asks the Diario companion to reply to the latest message of the conversation. */
export async function getCompanionReply(entryId: string): Promise<string> {
  const { reply } = await callDiarioApi<{ reply: string }>('chat', { entryId });
  return reply;
}

// ---- Finalize ----

export interface FinalizeResult {
  title: string;
  summaryMarkdown: string;
  moodEmoji: string;
  tags: string[];
  embedding: number[];
  transcriptMarkdown: string;
}

export async function computeFinalization(entryId: string): Promise<FinalizeResult> {
  return callDiarioApi<FinalizeResult>('finalize', { entryId });
}

export async function persistFinalization(entryId: string, result: FinalizeResult): Promise<DiaryEntry> {
  const { data, error } = await supabase
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
    .select('*')
    .single();
  if (error) throw error;
  return diaryEntryFromRow(data);
}

/**
 * After finalizing an entry, reconciles `day_moods` for that day: if it's
 * the only entry of the day, its own mood_emoji wins outright (no need to
 * call the AI for that); if there are several, asks Claude which emoji best
 * represents the day as a whole.
 */
export async function reconcileDayMood(userId: string, entryDate: string): Promise<void> {
  const { data: dayEntries, error } = await supabase
    .from('diario_entries')
    .select('created_at, mood_emoji, title, summary_markdown')
    .eq('user_id', userId)
    .eq('entry_date', entryDate)
    .eq('status', 'active')
    .order('created_at', { ascending: true });
  if (error) throw error;
  if (!dayEntries?.length) return;

  let dayEmoji: string | null = dayEntries[0].mood_emoji;
  if (dayEntries.length > 1) {
    const { dayEmoji: picked } = await callDiarioApi<{ dayEmoji: string }>('pick-day-mood', {
      entries: dayEntries.map((e) => ({ time: e.created_at, emoji: e.mood_emoji, summary: e.summary_markdown })),
    });
    dayEmoji = picked;
  }

  const { error: upsertError } = await supabase
    .from('day_moods')
    .upsert({ user_id: userId, log_date: entryDate, emoji: dayEmoji }, { onConflict: 'user_id,log_date' });
  if (upsertError) throw upsertError;
}

// ---- Comments ----

export async function listComments(entryId: string): Promise<DiaryComment[]> {
  const { data, error } = await supabase
    .from('diario_entry_comments')
    .select('*')
    .eq('entry_id', entryId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map(diaryCommentFromRow);
}

export async function addComment(entryId: string, userId: string, comment: string): Promise<DiaryComment> {
  const { data, error } = await supabase
    .from('diario_entry_comments')
    .insert({ entry_id: entryId, user_id: userId, comment })
    .select('*')
    .single();
  if (error) throw error;
  return diaryCommentFromRow(data);
}

// ---- Search ----

export async function searchByKeyword(userId: string, query: string): Promise<DiaryEntry[]> {
  const { data, error } = await supabase
    .from('diario_entries')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['active', 'archived'])
    .textSearch('search_vector', query, { type: 'websearch', config: 'spanish' })
    .order('entry_date', { ascending: false });
  if (error) throw error;
  return (data || []).map(diaryEntryFromRow);
}

export async function searchByDateRange(userId: string, fromIso: string, toIso: string): Promise<DiaryEntry[]> {
  const { data, error } = await supabase
    .from('diario_entries')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['active', 'archived'])
    .gte('entry_date', fromIso)
    .lte('entry_date', toIso)
    .order('entry_date', { ascending: false });
  if (error) throw error;
  return (data || []).map(diaryEntryFromRow);
}

export async function searchSemantic(query: string): Promise<DiarySemanticMatch[]> {
  const { embedding } = await callDiarioApi<{ embedding: number[] }>('embed-query', { query });
  const { data, error } = await supabase.rpc('diario_semantic_search', { query_embedding: embedding, match_count: 8 });
  if (error) throw error;
  return (data || []).map(diarySemanticMatchFromRow);
}

// ---- Persona (Perfil) ----

export async function getDiarioPersonaPrompt(userId: string): Promise<string | null> {
  const { data, error } = await supabase.from('user_settings').select('diario_persona_prompt').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return data?.diario_persona_prompt ?? null;
}

export async function setDiarioPersonaPrompt(userId: string, prompt: string | null): Promise<void> {
  const { error } = await supabase
    .from('user_settings')
    .upsert({ user_id: userId, diario_persona_prompt: prompt }, { onConflict: 'user_id' });
  if (error) throw error;
}
