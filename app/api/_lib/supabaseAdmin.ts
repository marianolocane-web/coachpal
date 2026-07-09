import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * Service-role Supabase client — bypasses RLS entirely. Used only by
 * api/telegram-webhook.ts, which has no user session to scope queries with
 * (Telegram calls the webhook directly, not the browser). Every function it
 * calls into (see diarioCore.ts) re-checks entry ownership against the
 * resolved `userId` explicitly, since that check is the only thing
 * enforcing per-user isolation on this path.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!client) {
    const url = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRoleKey) throw new Error('Missing VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
    client = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return client;
}
