import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { VercelRequest } from '@vercel/node';

/**
 * Builds a Supabase client scoped to the calling user's own access token
 * (passed from the browser as `Authorization: Bearer <token>`), so every
 * query made with it is subject to the same RLS policies as if the browser
 * had made it directly. No service role key is needed for the Diario module.
 */
export function getSupabaseForRequest(req: VercelRequest): { supabase: SupabaseClient; accessToken: string } {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;
  if (!accessToken) throw new HttpError(401, 'Missing Authorization header');

  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new HttpError(500, 'Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY');

  const supabase = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return { supabase, accessToken };
}

export async function getAuthedUserId(supabase: SupabaseClient): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new HttpError(401, 'Invalid or expired session');
  return data.user.id;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
