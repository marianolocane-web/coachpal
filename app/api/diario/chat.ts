import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandling } from '../_lib/handler.js';
import { getSupabaseForRequest, getAuthedUserId, HttpError } from '../_lib/supabaseServer.js';
import { computeCompanionReply } from '../_lib/diarioCore.js';

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  const { entryId } = (req.body || {}) as { entryId?: string };
  if (!entryId) throw new HttpError(400, 'Missing entryId');

  const { supabase } = getSupabaseForRequest(req);
  const userId = await getAuthedUserId(supabase);

  const reply = await computeCompanionReply(supabase, userId, entryId);
  res.status(200).json({ reply });
});
