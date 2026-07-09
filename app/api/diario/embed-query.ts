import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandling } from '../_lib/handler.js';
import { HttpError } from '../_lib/supabaseServer.js';
import { embedText } from '../_lib/voyage.js';

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  const { query } = (req.body || {}) as { query?: string };
  if (!query) throw new HttpError(400, 'Missing query');

  const embedding = await embedText(query, 'query');
  res.status(200).json({ embedding });
});
