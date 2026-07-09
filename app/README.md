# CoachPal

Production implementation of the CoachPal design system's `ui_kits/coachpal-app` prototype: a mobile-web habit tracker (React + TypeScript + Vite, backed by Supabase).

## Stack

- **React 19 + TypeScript + Vite** — no server-side rendering, pure SPA.
- **react-router-dom** — client-side routing (see `src/App.tsx` for the route map).
- **@tanstack/react-query** — data fetching/caching/mutations for every screen.
- **@supabase/supabase-js** — Postgres + Auth backend (+ Storage, + pgvector for Diario AI's semantic search).
- **lucide-react** — the design system's documented icon set (swapped in for the prototype's placeholder unicode glyphs).
- **Vercel Serverless Functions** (`api/`, Node runtime) — the app's only backend code, used exclusively by the Diario AI module to keep the Anthropic/Groq/Voyage API keys off the client. Everything else (habits, logs, moods, auth) talks to Supabase directly from the browser under RLS, same as before.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com), create a new project.
2. In **Project Settings → API**, copy the **Project URL** and **anon public** key.
3. Copy `.env.example` to `.env.local` and fill in both values:

   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. In the Supabase dashboard, open **SQL Editor** and run the contents of
   `supabase/migrations/0001_init.sql`. This creates four tables (`habits`,
   `habit_logs`, `units`, `day_moods`), all scoped with row-level security to
   `auth.uid()` — every user only ever sees their own data.
5. In **Authentication → Providers**, email/password sign-up is enabled by
   default. For local development you can also disable "Confirm email" under
   **Authentication → Settings** so sign-up logs you straight in without
   checking an inbox.

## 2. Diario AI setup (optional, but required for the Diario tab to work)

1. In the SQL Editor, also run `supabase/migrations/0002_diario.sql`. This
   enables the `vector` extension and creates `user_settings`,
   `diario_entries`, `diario_messages`, `diario_entry_comments`, plus the
   `diario_semantic_search` RPC function.
2. In **Storage**, create a new bucket named exactly `diario-audio`, **not
   public**. This is where recorded/imported voice notes are stored; the app
   always reads them back through short-lived signed URLs, never a public
   link.
3. Get API keys from three providers and add them as environment variables
   (in Vercel: **Settings → Environment Variables** on the project; locally:
   `.env.local`, same as the Supabase ones):
   - `ANTHROPIC_API_KEY` — [console.anthropic.com](https://console.anthropic.com). Powers the conversation, the entry
     summary/title/mood-emoji, and the tag suggestion + normalization steps.
   - `VOYAGE_API_KEY` — [dashboard.voyageai.com](https://dashboard.voyageai.com). Anthropic's recommended embeddings
     provider (Claude has no embeddings endpoint of its own). Free tier is
     200M tokens — a personal journal won't come close to that.
   - `GROQ_API_KEY` — [console.groq.com](https://console.groq.com). Transcribes voice notes (live-recorded or
     imported audio files, e.g. an `.m4a` exported from the iPhone Voice
     Memos app) with the free-tier Whisper endpoint.

   These three are **server-side only** — they're read by the functions in
   `api/` (Node runtime on Vercel), never bundled into the browser build, so
   they must **not** be prefixed `VITE_`.
4. Redeploy (or restart `npm run dev`) after adding the keys so the
   serverless functions pick them up.

## 3. Run the app

```bash
npm install
npm run dev
```

Open the printed localhost URL, create an account on the sign-up screen, and
you'll land on a 3-step onboarding (shown once per account, tracked in
`localStorage`) before the empty Home screen.

To populate the account with realistic demo data (4 habits + ~60 days of
history) instead of starting from a blank slate, go to **Perfil** and tap
**"Cargar hábitos de ejemplo"** — this only appears while the account has zero
habits, and it writes through the same Supabase client every other screen
uses (see `src/lib/data/seedDemoData.ts`).

## Architecture

```
src/
  styles/          tokens (colors/typography/spacing) ported verbatim from the design system + a global reset
  components/
    forms/          Button, IconButton, Input, Select, Checkbox, Switch
    feedback/        Badge, Toast, Tooltip
    surfaces/        Card, Dialog, Tabs
    habit/           ProgressRing, StreakBadge, HabitRow, HabitCheckButton, DayMoodRing, IdentityVoteBar, HabitCard
    charts/          Everest, Thermometer, DailyValue, WeeklyTrend, WeeklyAverage (real SVG, no chart library)
    diary/           ChatBubble, DiaryEntryCard, AudioMessagePlayer
    layout/          TabBar
  screens/          one file per route (Auth, Onboarding, Home, HabitsList, HabitDetail, AddEditHabit, Calendar, DayDetail, GeneralStats, Profile, DiaryList, DiarySearch, DiaryConversation, DiaryDetail)
  lib/
    supabaseClient.ts, auth.tsx       Supabase client + session context
    queryClient.ts                    react-query client
    quotes.ts                         placeholder rotating "AI coach" quotes (see Caveats)
    data/
      types.ts                        Habit/HabitLog/Unit/DayMood/Diary* types + DB row <-> app object mappers
      habitsApi.ts, logsApi.ts, unitsApi.ts, moodsApi.ts    thin Supabase query/mutation wrappers
      diarioApi.ts                    Diario AI: entries/messages/comments CRUD + calls into api/diario/*
      diarioPersonaDefault.ts         default system prompt for the Diario companion (editable per-user from Perfil)
      stats.ts                        streak / identity-vote / completion-rate / goal-progress math
      chartSeries.ts                  turns raw logs into the shapes the chart components draw
      hooks.ts                        react-query hooks every screen uses (useHabits, useUpsertLog, useDiaryEntries, ...)
      dateUtils.ts, timeUtils.ts       date/weekday/time-of-day helpers
      seedDemoData.ts                 writes demo habits + history through the real API, for a fresh account
api/
  _lib/            server-only helpers: claude.ts (Anthropic + tool-use), voyage.ts (embeddings), groq.ts
                    (transcription), context.ts (cross-module "one brain" context builder), supabaseServer.ts
                    (RLS-scoped client built from the caller's own access token — no service role key used)
  diario/          transcribe, chat, finalize, pick-day-mood, embed-query — thin stateless proxies to the
                   three AI providers; every actual database read/write still happens from the frontend via
                   diarioApi.ts, same pattern as the rest of the app
supabase/
  migrations/0001_init.sql            habits/habit_logs/units/day_moods schema + RLS policies
  migrations/0002_diario.sql          user_settings, diario_entries/messages/comments, pgvector, semantic search RPC
```

Every screen reads and writes through `lib/data/hooks.ts` — there is no mock
data path in the shipped app; the only synthetic data is what
`seedDemoData.ts` writes into your real Supabase tables on request.

### Diario AI module

- **Everything the user does is immutable once an entry is finalized** — enforced at the RLS level: `diario_entries`
  has no `delete` policy at all, so removing an entry is impossible from the client even if a bug tried to. "Archivar"
  only flips a `status` column; it never deletes anything. Re-reading an old entry lets you append a comment
  (`diario_entry_comments`, insert-only, same philosophy), never edit the original.
- **Conversation flow**: opening "Nueva entrada" immediately creates an `in_progress` `diario_entries` row and seeds
  an assistant greeting message. Every user turn (typed, live-recorded, or an imported audio file — tested against
  iPhone Voice Memos `.m4a` exports) is inserted into `diario_messages`, then `api/diario/chat` is called to get the
  companion's reply, which is inserted as its own row. "Finalizar entrada" calls `api/diario/finalize` (title +
  markdown summary + mood emoji + a two-step tag-suggest/tag-normalize pipeline + a Voyage embedding of the summary),
  persists all of that from the frontend, and reconciles that day's `day_moods` row — if it's the only entry of the
  day its emoji wins outright, otherwise `api/diario/pick-day-mood` asks Claude which emoji represents the whole day.
- **"One brain" context** (`api/_lib/context.ts`): every conversation turn is grounded in a compact bundle of the
  user's active habits + current streaks, recent `habit_logs` comments, recent `day_moods`, and diario entries that
  are either recent or semantically related to what's just been said (pgvector search over the Voyage embedding of
  the user's message). This is meant to be reused later by a habit-coaching feature, not just the Diario.
- **Personality is data, not code**: `user_settings.diario_persona_prompt` holds the system prompt for the
  companion; editable from **Perfil**. `null` falls back to `diarioPersonaDefault.ts`'s default prompt.
- **Search**: keyword/date search is plain Postgres full-text search (a trigger-maintained `search_vector` column —
  `to_tsvector` isn't `IMMUTABLE` so it can't live in a `generated always as` column, hence the trigger instead of a
  generated column). Semantic search embeds the query with Voyage and calls the `diario_semantic_search` RPC, which
  runs as the calling user (`security invoker`) so RLS still scopes results to their own entries.

## Deviations from the design prototype (and why)

- **Auth screen + accounts** — not in the original click-through prototype
  (which had no login), but required once data is real and per-user. Built
  from the same Button/Input primitives and copy voice as the rest of the app.
- **Icons** — the design system's guidelines specify Lucide as the icon
  system, but the prototype itself used raw unicode glyphs (`←`, `✎`, `🗑`,
  `▲/▼`, tab bar `⌂/◔/○`) as placeholders. This build uses real `lucide-react`
  icons everywhere a functional UI icon is needed, matching the documented
  guideline rather than the prototype's placeholder. Emoji usage that's part
  of the actual content model (streak 🔥, milestones 🎉, mood emoji, habit
  icons like 🧘/📖/💧) is unchanged.
- **"Racha más larga" / streaks / identity votes / goal progress** are
  computed from real `habit_logs` history (see `lib/data/stats.ts`) instead of
  the prototype's per-habit seeded pseudo-random arrays.
- **Everest / Valor diario / Promedio semanal charts** now plot real per-day
  logs instead of a seeded hash function standing in for history.
- **Unit manager** — the four built-in units (Kgs, Repeticiones, Minutos,
  Sleep Score) are seeded as real per-user rows on first use, so — per the
  original spec — *every* unit (including the built-ins) can be edited or
  deleted from the "Otra unidad de medida…" manager, not just custom ones.
- **Onboarding gating** — shown once per account (a `localStorage` flag),
  rather than the prototype's always-onboarding-first flow, so returning
  users land on Home.

## Known caveats / good next steps

- **AI coach copy on the Home screen is still a placeholder.** `lib/quotes.ts`
  rotates a small fixed set instead of an LLM-generated, context-aware
  message. This is designed (see the separate AI-integration plan document)
  but not implemented in this pass — Diario AI's `api/_lib/context.ts` and
  `api/_lib/claude.ts` are reusable building blocks for it whenever that's
  picked up.
- **Mood check-in**: `day_moods` is now written for real — every finalized
  Diario entry sets/updates that day's emoji (see "Diario AI module" above).
  There's still no *standalone* quick mood picker outside the Diario flow
  (e.g. a lightweight "¿cómo te sientes hoy?" tap on Home) if you want one
  independent of writing a full entry.
- **Diario AI has not been exercised end-to-end against live
  Anthropic/Groq/Voyage APIs** (this environment has no outbound network
  access to those hosts, confirmed while building it). The code path, tool
  schemas, and RLS policies were written and reviewed carefully, but you are
  the first real test — walk through: connect the 3 API keys → create an
  entry with typed text → one with a live-recorded voice note → one
  attaching an `.m4a` file exported from iPhone Voice Memos → finalize each
  → confirm the Home/Calendar mood ring updates → try keyword and semantic
  search → reread an old entry, add a comment, archive it. Report anything
  that breaks.
- **Migration numbering**: `0002_diario.sql` creates `user_settings` itself
  (timezone + `diario_persona_prompt`) since no other module had created it
  yet. If the separate Telegram/habit-coach plans are implemented later,
  their own migrations should `alter table user_settings add column ...`
  rather than recreating the table — check what already exists first.
- **Storage bucket `diario-audio` must be created manually** in the Supabase
  dashboard (see setup step above) — it isn't created by the SQL migration,
  since bucket creation isn't a plain SQL statement in Supabase.
- The production bundle is a single ~560KB (~158KB gzip) JS chunk; splitting
  routes with `React.lazy` would shrink the initial load if that starts to
  matter.
