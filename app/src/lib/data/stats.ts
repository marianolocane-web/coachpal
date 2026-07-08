import type { Habit, HabitLog } from './types';
import { addDays, isFutureDay, isSameDay, isoDate, mondayFirstWeekday, startOfDay } from './dateUtils';

export function isScheduledOn(habit: Habit, date: Date): boolean {
  return habit.days.includes(mondayFirstWeekday(date));
}

/** A habit only "counts" on a date once it existed — used so history before creation reads as n/a, not missed. */
export function habitAppliesOnDate(habit: Habit, date: Date): boolean {
  return isScheduledOn(habit, date) && startOfDay(new Date(habit.createdAt)).getTime() <= startOfDay(date).getTime();
}

export function logsByDate(logs: HabitLog[]): Map<string, HabitLog> {
  const m = new Map<string, HabitLog>();
  for (const l of logs) m.set(l.logDate, l);
  return m;
}

/** Consecutive scheduled+done days walking back from today (today doesn't break the streak while still unanswered). */
export function computeCurrentStreak(habit: Habit, logs: HabitLog[], today: Date): number {
  const byDate = logsByDate(logs);
  let cursor = startOfDay(today);
  const todayLog = byDate.get(isoDate(cursor));
  if (isScheduledOn(habit, cursor) && !todayLog) {
    cursor = addDays(cursor, -1);
  }
  let streak = 0;
  for (let i = 0; i < 3650; i++) {
    if (startOfDay(cursor).getTime() < startOfDay(new Date(habit.createdAt)).getTime()) break;
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

export function computeLongestStreak(habit: Habit, logs: HabitLog[], today: Date): number {
  if (logs.length === 0) return 0;
  const byDate = logsByDate(logs);
  const start = startOfDay(new Date(habit.createdAt));
  let longest = 0;
  let current = 0;
  for (let d = new Date(start); !isFutureDay(d, today); d = addDays(d, 1)) {
    if (!isScheduledOn(habit, d)) continue;
    const log = byDate.get(isoDate(d));
    if (log?.done) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
}

/** James Clear identity votes: +1 per resolved scheduled day completed, -1 per resolved scheduled day missed. */
export function computeIdentityVotes(habit: Habit, logs: HabitLog[], today: Date): number {
  const byDate = logsByDate(logs);
  const start = startOfDay(new Date(habit.createdAt));
  let votes = 0;
  for (let d = new Date(start); !isFutureDay(d, today); d = addDays(d, 1)) {
    if (!isScheduledOn(habit, d)) continue;
    const log = byDate.get(isoDate(d));
    if (isSameDay(d, today) && !log) continue; // today still open and unanswered — not resolved yet
    votes += log?.done ? 1 : -1;
  }
  return votes;
}

export function computeCompletionRate(habit: Habit, logs: HabitLog[], from: Date, to: Date, today: Date): number {
  const byDate = logsByDate(logs);
  const end = isFutureDay(to, today) ? today : to;
  let total = 0;
  let done = 0;
  for (let d = startOfDay(from); d.getTime() <= startOfDay(end).getTime(); d = addDays(d, 1)) {
    if (!habitAppliesOnDate(habit, d)) continue;
    if (isSameDay(d, today) && !byDate.get(isoDate(d))) continue; // today still open
    total += 1;
    if (byDate.get(isoDate(d))?.done) done += 1;
  }
  return total ? done / total : 0;
}

export interface DayAggregate {
  date: string;
  doneCount: number;
  totalCount: number;
  progress: number;
}

/** % of that day's active, scheduled habits that were completed — drives DayMoodRing color banding. */
export function computeDayAggregate(habits: Habit[], logsForDay: HabitLog[], date: Date): DayAggregate {
  const scheduled = habits.filter((h) => h.status === 'Activo' && habitAppliesOnDate(h, date));
  const byHabit = new Map(logsForDay.map((l) => [l.habitId, l]));
  const doneCount = scheduled.filter((h) => byHabit.get(h.id)?.done).length;
  return {
    date: isoDate(date),
    doneCount,
    totalCount: scheduled.length,
    progress: scheduled.length ? doneCount / scheduled.length : 0,
  };
}

export function progressColorToken(pct: number): string {
  if (pct >= 0.8) return 'var(--color-success)';
  if (pct >= 0.5) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

/**
 * "Current" value toward a habit's goal. Termómetro goals are daily (resets each day, e.g. water intake);
 * everything else is a long-term target, so we take the most recently logged numeric value (e.g. latest weigh-in).
 */
export function computeGoalCurrent(habit: Habit, logs: HabitLog[], today: Date): number {
  if (habit.charts.includes('Termómetro')) {
    const todayLog = logs.find((l) => l.logDate === isoDate(today));
    return todayLog?.valueNumber ?? 0;
  }
  const withValue = [...logs].filter((l) => l.valueNumber != null).sort((a, b) => (a.logDate < b.logDate ? 1 : -1));
  return withValue[0]?.valueNumber ?? 0;
}
