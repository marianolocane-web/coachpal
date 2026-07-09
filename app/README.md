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

## 3. Diario por Telegram setup (optional — "mini entradas" on the go)

Lets you text or send voice notes to a Telegram bot; the companion replies in Telegram, and the whole
exchange is saved as a Diario entry (`diario_entries.source = 'telegram'`), visible in the app like any other.

1. In the SQL Editor, run `supabase/migrations/0003_diario_storage_policies.sql` (Storage RLS policies for the
   `diario-audio` bucket — needed for audio uploads from *either* channel, app or Telegram) and
   `supabase/migrations/0004_diario_telegram.sql` (adds `user_settings.telegram_chat_id`, `diario_entries.source`,
   and the `telegram_link_tokens` table used by the "Conectar Telegram" flow in Perfil).
2. Create a bot with **[@BotFather](https://t.me/BotFather)** on Telegram: `/newbot`, pick a name and a
   `@username`. Save the token it gives you and the username.
3. Add 4 more environment variables (server-side, except the last one):
   - `TELEGRAM_BOT_TOKEN` — from BotFather.
   - `TELEGRAM_WEBHOOK_SECRET` — any random string you make up yourself (e.g. `openssl rand -hex 32`); verifies
     incoming requests are really from Telegram, not a public-URL guesser.
   - `SUPABASE_SERVICE_ROLE_KEY` — **Project Settings → API → service_role** in Supabase. Used only by
     `api/telegram-webhook.ts`, since Telegram calls it directly with no browser session to scope RLS by — every
     function it calls still re-checks the resolved `userId` against the entry's owner explicitly, since that
     check is the only thing enforcing per-user isolation on this path. Never expose this key to the browser.
   - `VITE_TELEGRAM_BOT_USERNAME` — the bot's `@username` (without the `@`). This one *is* client-side (bot
     usernames are public) — it's how Perfil builds the `t.me/<username>?start=<token>` deep link.
4. Redeploy so the functions and the frontend pick up the new variables.
5. Register the webhook with Telegram (run once, replace both placeholders):

   ```bash
   curl -X POST "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
     -d "url=https://coachpal.xyz/api/telegram-webhook" \
     -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>"
   ```

6. In the app, go to **Perfil → Diario por Telegram → "Conectar Telegram"**, open the link it gives you, and
   send `/start` in Telegram if it doesn't fire automatically. From then on, any text or voice message you send
   the bot becomes (or continues) a Diario entry; send **"guardar"** whenever you want to close and save it.

## 4. Run the app

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
                    (RLS-scoped client from the caller's own access token, used by the browser-facing endpoints),
                    supabaseAdmin.ts (service-role client, used only by telegram-webhook.ts), telegram.ts
                    (sendMessage / voice download), diarioCore.ts (transport-agnostic conversation/finalization
                    logic shared by both the HTTP endpoints and the Telegram webhook)
  diario/          transcribe, chat, finalize, pick-day-mood, embed-query — thin per-request wrappers around
                    diarioCore.ts; every actual database read/write for the in-app flow still happens from the
                    frontend via diarioApi.ts, same pattern as the rest of the app
  telegram-webhook.ts   receives Telegram updates directly (no browser session) — resolves chat_id -> userId,
                        calls the same diarioCore.ts functions with a service-role client, replies via Telegram
supabase/
  migrations/0001_init.sql                       habits/habit_logs/units/day_moods schema + RLS policies
  migrations/0002_diario.sql                     user_settings, diario_entries/messages/comments, pgvector, semantic search RPC
  migrations/0003_diario_storage_policies.sql    RLS policies for the diario-audio Storage bucket (app + Telegram uploads)
  migrations/0004_diario_telegram.sql            telegram_chat_id, diario_entries.source, telegram_link_tokens
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
- **Via Telegram**: a linked chat (`user_settings.telegram_chat_id`, set through a one-time deep-link token from
  Perfil) can open/continue a `source='telegram'` entry by sending text or voice notes — same `diarioCore.ts`
  functions as the in-app chat, so the same persona, context, transcription and finalization logic applies. Unlike
  the app (an explicit "Finalizar entrada" button), Telegram entries stay open across multiple messages until the
  user types **"guardar"**, which triggers finalization *and* persistence *and* day-mood reconciliation all in the
  same webhook call (the app instead does those as separate steps driven by the frontend, since there the browser
  is available to do them) — every reply appends a reminder of that command. Entries made this way show a "vía
  Telegram" badge in the list and detail screens, and are otherwise indistinguishable from ones made in the app —
  same tables, same search, same immutability rules.

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
- **In-app Diario flow has been exercised end-to-end against live
  Anthropic/Groq/Voyage APIs** (text, live-recorded audio, and imported
  `.m4a` files, plus finalize/search) — this environment itself has no
  outbound network access to those hosts, so all of that testing happened
  live in production with the app's actual user. Two real bugs were caught
  and fixed this way that no amount of local type-checking would have
  caught: (1) `api/*` functions crashing at runtime with
  `ERR_MODULE_NOT_FOUND` because Node's native ESM loader (this package is
  `"type": "module"`) requires explicit `.js` extensions on relative
  imports, which esbuild-based bundlers don't enforce; (2) audio uploads
  failing RLS because a fresh Storage bucket ships with zero policies until
  you add them (`0003_diario_storage_policies.sql`). If you extend `api/`
  further, watch for both.
- **Diario via Telegram has not been exercised end-to-end yet** — same
  network limitation, but this path is newer and untested even by proxy
  (no prior similar feature to have already shaken out its bugs). Walk
  through: BotFather setup → the 4 new env vars → `setWebhook` → "Conectar
  Telegram" in Perfil → send text, then a voice note → send "guardar" →
  confirm the entry shows up in the app's Diario list with the "vía
  Telegram" badge, and that the mood ring updated. Report anything that
  breaks — the `ERR_MODULE_NOT_FOUND`-style failure mode above is exactly
  the kind of thing to watch for again in `telegram-webhook.ts` and its new
  `_lib` modules, even though it was verified with the same
  compile-and-dynamically-import smoke test before pushing.
- **Migration numbering**: `0002_diario.sql` creates `user_settings` itself
  (timezone + `diario_persona_prompt`) since no other module had created it
  yet; `0004_diario_telegram.sql` extends it with `telegram_chat_id`. If the
  separate habit-coach plan (`ai-integration-plan.md`) is implemented later,
  its migration should `alter table user_settings add column ...` rather
  than recreating the table — check what already exists first.
- **Storage bucket `diario-audio` must be created manually** in the Supabase
  dashboard (see setup step above) — it isn't created by the SQL migration,
  since bucket creation isn't a plain SQL statement in Supabase.
- The production bundle is a single ~560KB (~158KB gzip) JS chunk; splitting
  routes with `React.lazy` would shrink the initial load if that starts to
  matter.
