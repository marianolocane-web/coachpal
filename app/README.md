# CoachPal

Production implementation of the CoachPal design system's `ui_kits/coachpal-app` prototype: a mobile-web habit tracker (React + TypeScript + Vite, backed by Supabase).

## Stack

- **React 19 + TypeScript + Vite** — no server-side rendering, pure SPA.
- **react-router-dom** — client-side routing (see `src/App.tsx` for the route map).
- **@tanstack/react-query** — data fetching/caching/mutations for every screen.
- **@supabase/supabase-js** — Postgres + Auth backend.
- **lucide-react** — the design system's documented icon set (swapped in for the prototype's placeholder unicode glyphs).

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

## 2. Run the app

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
    layout/          TabBar
  screens/          one file per route (Auth, Onboarding, Home, HabitsList, HabitDetail, AddEditHabit, Calendar, DayDetail, GeneralStats, Profile)
  lib/
    supabaseClient.ts, auth.tsx       Supabase client + session context
    queryClient.ts                    react-query client
    quotes.ts                         placeholder rotating "AI coach" quotes (see Caveats)
    data/
      types.ts                        Habit/HabitLog/Unit/DayMood types + DB row <-> app object mappers
      habitsApi.ts, logsApi.ts, unitsApi.ts, moodsApi.ts    thin Supabase query/mutation wrappers
      stats.ts                        streak / identity-vote / completion-rate / goal-progress math
      chartSeries.ts                  turns raw logs into the shapes the chart components draw
      hooks.ts                        react-query hooks every screen uses (useHabits, useUpsertLog, ...)
      dateUtils.ts, timeUtils.ts       date/weekday/time-of-day helpers
      seedDemoData.ts                 writes demo habits + history through the real API, for a fresh account
supabase/
  migrations/0001_init.sql            schema + RLS policies
```

Every screen reads and writes through `lib/data/hooks.ts` — there is no mock
data path in the shipped app; the only synthetic data is what
`seedDemoData.ts` writes into your real Supabase tables on request.

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

- **AI coach copy is a placeholder.** The spec calls for an LLM-generated
  daily quote and a 10pm "habits about to expire" push notification. Neither
  requires new schema — they'd be a Supabase Edge Function (or any backend)
  calling an LLM and, for the notification, a scheduled job + web push. Out of
  scope for this pass; `lib/quotes.ts` rotates a small fixed set instead.
- **Mood check-in has no dedicated UI yet.** `day_moods.emoji` exists and is
  read on Home/Calendar/Day Detail, but nothing in the shipped UI lets a user
  set it — only `seedDemoData` populates it. A reasonable follow-up is a
  small "¿cómo te sientes hoy?" picker on Home.
- **Not tested against a live Supabase project** (no credentials were
  available in this environment). It's covered by: a clean `tsc -b` build, a
  successful `vite build`, and a rendered/interactive smoke test of the Auth
  screen in a real browser. Once you connect a project per the setup steps
  above, please click through the full flow (sign up → onboarding → seed demo
  data → toggle a habit → add/edit a habit → calendar → habit detail charts)
  and report anything that looks off.
- The production bundle is a single ~560KB (~158KB gzip) JS chunk; splitting
  routes with `React.lazy` would shrink the initial load if that starts to
  matter.
