import type { VercelRequest, VercelResponse } from '@vercel/node';
import { HttpError } from './supabaseServer';

export function withErrorHandling(fn: (req: VercelRequest, res: VercelResponse) => Promise<void>) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }
      await fn(req, res);
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.status).json({ error: err.message });
        return;
      }
      console.error('[api/diario] unhandled error', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
