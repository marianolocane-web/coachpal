-- CoachPal core schema: habits, daily logs, custom units, day moods.
-- Run against a Supabase project (Dashboard -> SQL Editor, or `supabase db push`).

create extension if not exists pgcrypto;

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon text default '✨',
  category text,
  color text,
  tags text[] not null default '{}',
  description text,
  question text,
  response_type text not null default 'boolean' check (response_type in ('boolean', 'number', 'text')),
  cue_visual text,
  context_todo text,
  identity_negative_emoji text,
  identity_negative_label text,
  identity_positive_emoji text,
  identity_positive_label text,
  goal_label text,
  goal_value numeric,
  unit text,
  goal_date date,
  charts text[] not null default '{}',
  streak_goal integer,
  -- weekday indices, Monday-first: 0=L 1=M 2=X 3=J 4=V 5=S 6=D
  days smallint[] not null default '{0,1,2,3,4,5,6}',
  time_of_day text not null default '08:00',
  status text not null default 'Activo' check (status in ('Activo', 'Pausado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists habits_user_id_idx on public.habits(user_id) where deleted_at is null;

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  done boolean not null default false,
  value_number numeric,
  value_text text,
  comment text,
  comment_locked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

create index if not exists habit_logs_habit_id_idx on public.habit_logs(habit_id);
create index if not exists habit_logs_user_date_idx on public.habit_logs(user_id, log_date);

create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  value text not null,
  label text not null,
  created_at timestamptz not null default now(),
  unique (user_id, value)
);

create table if not exists public.day_moods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  emoji text,
  mood_tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

-- Keep updated_at fresh on writes.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists habits_set_updated_at on public.habits;
create trigger habits_set_updated_at before update on public.habits
  for each row execute function public.set_updated_at();

drop trigger if exists habit_logs_set_updated_at on public.habit_logs;
create trigger habit_logs_set_updated_at before update on public.habit_logs
  for each row execute function public.set_updated_at();

-- Row Level Security: every table is scoped to its owning user.
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.units enable row level security;
alter table public.day_moods enable row level security;

drop policy if exists "habits_owner_all" on public.habits;
create policy "habits_owner_all" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "habit_logs_owner_all" on public.habit_logs;
create policy "habit_logs_owner_all" on public.habit_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "units_owner_all" on public.units;
create policy "units_owner_all" on public.units
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "day_moods_owner_all" on public.day_moods;
create policy "day_moods_owner_all" on public.day_moods
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
