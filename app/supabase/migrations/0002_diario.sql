-- Diario AI: configuración de usuario, entradas de diario, turnos de
-- conversación, comentarios, y búsqueda semántica (pgvector).

create extension if not exists vector;

-- Configuración por usuario (zona horaria, personalidad del acompañante del
-- Diario). Un registro por usuario, creado on-demand (upsert) la primera vez
-- que hace falta.
create table public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  timezone text not null default 'America/Argentina/Buenos_Aires',
  diario_persona_prompt text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "user_settings_owner_all" on public.user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_settings_set_updated_at on public.user_settings;
create trigger user_settings_set_updated_at before update on public.user_settings
  for each row execute function public.set_updated_at();

-- Entradas de diario. Se crea en 'in_progress' cuando arranca la
-- conversación y pasa a 'active' recién al finalizarla (ahí se generan
-- título, resumen, tags, emoji y embedding). 'archived' la saca del listado
-- principal pero sigue siendo buscable.
create table public.diario_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'active', 'archived')),
  title text,
  entry_date date not null default (now()::date),
  summary_markdown text,
  transcript_markdown text,
  mood_emoji text,
  tags text[] not null default '{}',
  embedding vector(1024),
  created_at timestamptz not null default now(),
  finalized_at timestamptz,
  archived_at timestamptz,
  search_vector tsvector
);

create index diario_entries_user_id_idx on public.diario_entries(user_id, status);
create index diario_entries_entry_date_idx on public.diario_entries(user_id, entry_date);
create index diario_entries_fulltext_idx on public.diario_entries using gin (search_vector);

-- `to_tsvector('spanish', ...)` is only STABLE, not IMMUTABLE, so it can't be
-- used directly in a `generated always as` column — Postgres would reject
-- it. A plain trigger-maintained column sidesteps that restriction.
create or replace function public.diario_entries_set_search_vector()
returns trigger language plpgsql as $$
begin
  new.search_vector := to_tsvector('spanish', coalesce(new.title, '') || ' ' || coalesce(new.summary_markdown, '') || ' ' || coalesce(new.transcript_markdown, ''));
  return new;
end;
$$;

drop trigger if exists diario_entries_set_search_vector on public.diario_entries;
create trigger diario_entries_set_search_vector before insert or update on public.diario_entries
  for each row execute function public.diario_entries_set_search_vector();

alter table public.diario_entries enable row level security;

-- Sin política de delete: a nivel de base de datos, borrar una entrada es
-- imposible desde el cliente, incluso ante un bug del frontend.
create policy "diario_entries_owner_select" on public.diario_entries
  for select using (auth.uid() = user_id);
create policy "diario_entries_owner_insert" on public.diario_entries
  for insert with check (auth.uid() = user_id);
create policy "diario_entries_owner_update" on public.diario_entries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Turnos de la conversación (usuario y asistente). Solo insert/select: un
-- turno, una vez escrito, no se corrige.
create table public.diario_messages (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.diario_entries(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content_type text not null default 'text' check (content_type in ('text', 'audio')),
  text_content text,
  audio_storage_path text,
  created_at timestamptz not null default now()
);

create index diario_messages_entry_id_idx on public.diario_messages(entry_id, created_at);

alter table public.diario_messages enable row level security;

create policy "diario_messages_owner_select" on public.diario_messages
  for select using (
    exists (select 1 from public.diario_entries e where e.id = entry_id and e.user_id = auth.uid())
  );
create policy "diario_messages_owner_insert" on public.diario_messages
  for insert with check (
    exists (select 1 from public.diario_entries e where e.id = entry_id and e.user_id = auth.uid())
  );

-- Comentarios agregados al releer una entrada vieja. Misma filosofía: solo
-- insert/select, nunca se editan ni se borran.
create table public.diario_entry_comments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.diario_entries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  comment text not null,
  created_at timestamptz not null default now()
);

alter table public.diario_entry_comments enable row level security;

create policy "diario_entry_comments_owner_select" on public.diario_entry_comments
  for select using (auth.uid() = user_id);
create policy "diario_entry_comments_owner_insert" on public.diario_entry_comments
  for insert with check (auth.uid() = user_id);

-- Índice vectorial para búsqueda semántica. Con pocos registros (uso
-- personal) no aporta mucho al principio, pero no cuesta nada crearlo ya.
create index diario_entries_embedding_idx on public.diario_entries
  using hnsw (embedding vector_cosine_ops);

-- Función auxiliar de búsqueda semántica, respetando RLS via security invoker
-- (se ejecuta con los privilegios del usuario que la llama, no del dueño de
-- la función), para que cada usuario solo pueda buscar entre sus propias
-- entradas.
create or replace function public.diario_semantic_search(
  query_embedding vector(1024),
  match_count int default 8
)
returns table (
  id uuid,
  title text,
  summary_markdown text,
  entry_date date,
  mood_emoji text,
  tags text[],
  similarity float
)
language sql
security invoker
stable
as $$
  select
    d.id, d.title, d.summary_markdown, d.entry_date, d.mood_emoji, d.tags,
    1 - (d.embedding <=> query_embedding) as similarity
  from public.diario_entries d
  where d.status in ('active', 'archived')
    and d.embedding is not null
  order by d.embedding <=> query_embedding
  limit match_count;
$$;

grant execute on function public.diario_semantic_search(vector, int) to authenticated;
