import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandling } from '../_lib/handler.js';
import { getSupabaseForRequest, getAuthedUserId, HttpError } from '../_lib/supabaseServer.js';
import { buildUserContext } from '../_lib/context.js';
import { callClaudeForText, CONVERSATION_MODEL, type ClaudeMessage } from '../_lib/claude.js';
import { DEFAULT_DIARIO_PERSONA } from '../_lib/personas.js';

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

  const reply = await callClaudeForText({ system, messages, model: CONVERSATION_MODEL });

  res.status(200).json({ reply });
});
