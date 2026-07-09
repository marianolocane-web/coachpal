import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandling } from '../_lib/handler.js';
import { HttpError } from '../_lib/supabaseServer.js';
import { pickDayMoodForEntries } from '../_lib/diarioCore.js';

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  const { entries } = (req.body || {}) as {
    entries?: { time: string; emoji: string; summary: string }[];
  };
  if (!entries?.length) throw new HttpError(400, 'Missing entries');

  const dayEmoji = await pickDayMoodForEntries(entries);
  res.status(200).json({ dayEmoji });
});
