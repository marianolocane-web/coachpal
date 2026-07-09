import type { SupabaseClient } from '@supabase/supabase-js';
import { embedText } from './voyage.js';

const CONTEXT_LOOKBACK_DAYS = 14;

// Self-contained on purpose: this file is bundled into a Vercel Node
// function, a different build target than the Vite frontend, so it does not
// import from `src/lib/data/*` (kept those two build targets fully decoupled
// after hitting an ERR_MODULE_NOT_FOUND from mixing them).

interface HabitRow {
  id: string;
  name: string;
  days: number[];
  created_at: string;
}

interface HabitLogRow {
  habit_id: string;
  log_date: string;
  done: boolean;
  comment: string | null;
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

/** Monday-first weekday index: 0=L 1=M 2=X 3=J 4=V 5=S 6=D — matches `habits.days` in the schema. */
function mondayFirstWeekday(d: Date): number {
  return (d.getDay() + 6) % 7;
}

function isScheduledOn(habit: HabitRow, date: Date): boolean {
  return habit.days.includes(mondayFirstWeekday(date));
}

function computeCurrentStreak(habit: HabitRow, logs: HabitLogRow[], today: Date): number {
  const byDate = new Map(logs.map((l) => [l.log_date, l]));
  let cursor = startOfDay(today);
  const todayLog = byDate.get(isoDate(cursor));
  if (isScheduledOn(habit, cursor) && !todayLog) cursor = addDays(cursor, -1);
  let streak = 0;
  const createdAt = startOfDay(new Date(habit.created_at));
  for (let i = 0; i < 3650; i++) {
    if (startOfDay(cursor).getTime() < createdAt.getTime()) break;
    if (!isScheduledOn(habit, cursor)) {
      cursor = addDays(cursor, -1);
      continue;
    }
    const log = byDate.get(isoDate(cursor));
    if (log?.done) {
      streak += 1;
      cursor = addDays(cursor, -1);
      continue;
    }
    break;
  }
  return streak;
}

function computeCompletionRate(habit: HabitRow, logs: HabitLogRow[], from: Date, to: Date, today: Date): number {
  const byDate = new Map(logs.map((l) => [l.log_date, l]));
  const createdAt = startOfDay(new Date(habit.created_at));
  let total = 0;
  let done = 0;
  for (let d = startOfDay(from); d.getTime() <= startOfDay(to).getTime(); d = addDays(d, 1)) {
    if (d.getTime() < createdAt.getTime() || !isScheduledOn(habit, d)) continue;
    const isToday = isoDate(d) === isoDate(today);
    const log = byDate.get(isoDate(d));
    if (isToday && !log) continue;
    total += 1;
    if (log?.done) done += 1;
  }
  return total ? done / total : 0;
}

/**
 * Assembles the shared "one brain" context: recent habits/streaks, recent
 * habit_log comments, recent moods, and relevant diario entries (recency +
 * semantic match to `focusQuery`). Used by the Diario conversation and,
 * eventually, by the habit coach — same data, same shape, one source of truth.
 */
export async function buildUserContext(
  supabase: SupabaseClient,
  userId: string,
  opts: { focusQuery?: string } = {},
): Promise<string> {
  const today = startOfDay(new Date());
  const fromIso = isoDate(addDays(today, -CONTEXT_LOOKBACK_DAYS));
  const todayIso = isoDate(today);

  const [habitsRes, logsRes, moodsRes, recentEntriesRes] = await Promise.all([
    supabase.from('habits').select('id, name, days, created_at').eq('user_id', userId).is('deleted_at', null).eq('status', 'Activo'),
    supabase
      .from('habit_logs')
      .select('habit_id, log_date, done, comment')
      .eq('user_id', userId)
      .gte('log_date', fromIso)
      .lte('log_date', todayIso),
    supabase.from('day_moods').select('log_date, emoji').eq('user_id', userId).gte('log_date', fromIso).lte('log_date', todayIso),
    supabase
      .from('diario_entries')
      .select('title, summary_markdown, entry_date')
      .eq('user_id', userId)
      .in('status', ['active', 'archived'])
      .order('entry_date', { ascending: false })
      .limit(5),
  ]);

  const habits = (habitsRes.data || []) as HabitRow[];
  const logs = (logsRes.data || []) as HabitLogRow[];

  const habitLines = habits.map((h) => {
    const habitLogs = logs.filter((l) => l.habit_id === h.id);
    const streak = computeCurrentStreak(h, habitLogs, today);
    const rate = computeCompletionRate(h, habitLogs, addDays(today, -6), today, today);
    return `- ${h.name}: racha actual ${streak} día(s), ${Math.round(rate * 100)}% de cumplimiento en los últimos 7 días`;
  });

  const commentLines = logs
    .filter((l) => l.comment)
    .sort((a, b) => (a.log_date < b.log_date ? 1 : -1))
    .map((l) => {
      const habit = habits.find((h) => h.id === l.habit_id);
      return `- ${l.log_date} (${habit?.name ?? 'hábito'}): "${l.comment}"`;
    });

  const moodLines = (moodsRes.data || [])
    .filter((m) => m.emoji)
    .sort((a, b) => (a.log_date < b.log_date ? 1 : -1))
    .map((m) => `- ${m.log_date}: ${m.emoji}`);

  let relatedEntries = recentEntriesRes.data || [];
  if (opts.focusQuery) {
    try {
      const queryEmbedding = await embedText(opts.focusQuery, 'query');
      const { data: semanticMatches } = await supabase.rpc('diario_semantic_search', {
        query_embedding: queryEmbedding,
        match_count: 5,
      });
      if (semanticMatches?.length) {
        const seen = new Set(relatedEntries.map((e: { title: string; entry_date: string }) => `${e.title}|${e.entry_date}`));
        for (const m of semanticMatches as { title: string; summary_markdown: string; entry_date: string }[]) {
          const key = `${m.title}|${m.entry_date}`;
          if (!seen.has(key)) {
            relatedEntries = [...relatedEntries, m];
            seen.add(key);
          }
        }
      }
    } catch {
      // Semantic search is a nice-to-have for context; never block the
      // conversation if Voyage is briefly unavailable.
    }
  }

  const entryLines = relatedEntries
    .slice(0, 8)
    .map((e: { title: string; summary_markdown: string; entry_date: string }) => `- ${e.entry_date} — "${e.title}": ${e.summary_markdown}`);

  return [
    'Hábitos activos:',
    habitLines.length ? habitLines.join('\n') : '(sin hábitos activos todavía)',
    '',
    'Comentarios recientes en check-ins de hábitos:',
    commentLines.length ? commentLines.join('\n') : '(sin comentarios recientes)',
    '',
    'Estados de ánimo recientes:',
    moodLines.length ? moodLines.join('\n') : '(sin registros de ánimo recientes)',
    '',
    'Entradas de diario relevantes:',
    entryLines.length ? entryLines.join('\n') : '(sin entradas de diario previas)',
  ].join('\n');
}
