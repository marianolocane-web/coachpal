-- Diario AI via Telegram: link a Telegram chat to a CoachPal account so
-- quick "mini entradas" (audio or text) can be captured on the go, with the
-- companion replying in Telegram, and the whole exchange landing in the same
-- diario_entries/diario_messages tables the app itself reads.

alter table public.user_settings
  add column telegram_chat_id bigint unique;

-- Distinguishes entries started from the in-app chat vs. from Telegram —
-- surfaced in the app so it's clear where an entry came from.
alter table public.diario_entries
  add column source text not null default 'app' check (source in ('app', 'telegram'));

-- One-time, short-lived tokens for the "Conectar Telegram" deep-link flow
-- from Perfil (https://t.me/<bot>?start=<token>).
create table public.telegram_link_tokens (
  token uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '10 minutes'),
  used_at timestamptz
);

alter table public.telegram_link_tokens enable row level security;

-- The user can create and read their own tokens (to build the deep link).
-- The webhook itself runs with the service-role key, which bypasses RLS
-- entirely, so no policy is needed for that path.
create policy "telegram_link_tokens_owner_insert" on public.telegram_link_tokens
  for insert with check (auth.uid() = user_id);
create policy "telegram_link_tokens_owner_select" on public.telegram_link_tokens
  for select using (auth.uid() = user_id);
