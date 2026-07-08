import type { Habit, HabitLog } from './types';
import { addDays, formatDDMM, isoDate, startOfDay } from './dateUtils';
import { habitAppliesOnDate, logsByDate } from './stats';
import type { EverestPoint } from '../../components/charts/EverestChart';
import type { DailyValuePoint } from '../../components/charts/DailyValueChart';

/** Scheduled days for `habit` in the last `rangeDays` (inclusive of today), oldest first. */
export function buildEverestSeries(habit: Habit, logs: HabitLog[], rangeDays: number, today: Date): EverestPoint[] {
  const byDate = logsByDate(logs);
  const points: EverestPoint[] = [];
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = addDays(startOfDay(today), -i);
    if (!habitAppliesOnDate(habit, d)) continue;
    const log = byDate.get(isoDate(d));
    points.push({ date: formatDDMM(d), done: !!log?.done });
  }
  return points;
}

export function buildDailyValuePoints(habit: Habit, logs: HabitLog[], rangeDays: number, today: Date): DailyValuePoint[] {
  const byDate = logsByDate(logs);
  const points: DailyValuePoint[] = [];
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = addDays(startOfDay(today), -i);
    if (!habitAppliesOnDate(habit, d)) continue;
    const log = byDate.get(isoDate(d));
    points.push({ date: formatDDMM(d), value: log?.valueNumber ?? (log?.done ? 1 : 0) });
  }
  return points;
}

/** Per-week completion rate (0-1) for one habit's scheduled days, most recent week last. */
export function buildWeeklyAverage(habit: Habit, logs: HabitLog[], weeks: number, today: Date): number[] {
  const byDate = logsByDate(logs);
  const out: number[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    let total = 0;
    let done = 0;
    for (let i = 6; i >= 0; i--) {
      const d = addDays(startOfDay(today), -(w * 7 + i));
      if (!habitAppliesOnDate(habit, d)) continue;
      total += 1;
      if (byDate.get(isoDate(d))?.done) done += 1;
    }
    out.push(total ? done / total : 0);
  }
  return out;
}

/** Aggregate completion rate (0-1) across every habit, per week, most recent week last. */
export function buildAggregateWeeklyTrend(habits: Habit[], logsAll: HabitLog[], weeks: number, today: Date): number[] {
  const logsByHabitId = new Map<string, HabitLog[]>();
  for (const l of logsAll) {
    const arr = logsByHabitId.get(l.habitId) || [];
    arr.push(l);
    logsByHabitId.set(l.habitId, arr);
  }
  const out: number[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    let total = 0;
    let done = 0;
    for (const h of habits) {
      const byDate = logsByDate(logsByHabitId.get(h.id) || []);
      for (let i = 6; i >= 0; i--) {
        const d = addDays(startOfDay(today), -(w * 7 + i));
        if (!habitAppliesOnDate(h, d) || h.status !== 'Activo') continue;
        total += 1;
        if (byDate.get(isoDate(d))?.done) done += 1;
      }
    }
    out.push(total ? done / total : 0);
  }
  return out;
}
