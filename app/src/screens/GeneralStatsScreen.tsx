import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits, useLogsRange } from '../lib/data/hooks';
import { computeGoalCurrent, computeLongestStreak, habitAppliesOnDate } from '../lib/data/stats';
import { buildAggregateWeeklyTrend, buildEverestSeries } from '../lib/data/chartSeries';
import { addDays, isoDate, startOfDay } from '../lib/data/dateUtils';
import { Tabs } from '../components/surfaces/Tabs';
import { EverestChart } from '../components/charts/EverestChart';
import { ThermometerChart } from '../components/charts/ThermometerChart';
import { WeeklyTrendChart } from '../components/charts/WeeklyTrendChart';

type Range = 'week' | 'month' | 'year';
const HISTORY_DAYS = 400;

export function GeneralStatsScreen() {
  const navigate = useNavigate();
  const [range, setRange] = useState<Range>('week');
  const days = { week: 7, month: 30, year: 90 }[range];
  const today = startOfDay(new Date());
  const todayIso = isoDate(today);

  const { data: habits = [] } = useHabits();
  const { data: logsAll = [] } = useLogsRange(isoDate(addDays(today, -HISTORY_DAYS)), todayIso);

  const logsByHabitId = useMemo(() => {
    const m = new Map<string, typeof logsAll>();
    for (const l of logsAll) m.set(l.habitId, [...(m.get(l.habitId) || []), l]);
    return m;
  }, [logsAll]);

  const windowFromIso = isoDate(addDays(today, -(days - 1)));
  const windowLogs = useMemo(() => logsAll.filter((l) => l.logDate >= windowFromIso), [logsAll, windowFromIso]);

  const activeHabits = habits.filter((h) => h.status === 'Activo');

  const dayLabels = Array.from({ length: days }, (_, i) => i + 1);
  const heatmap = activeHabits.map((h) => {
    const byDate = new Map((logsByHabitId.get(h.id) || []).map((l) => [l.logDate, l]));
    const cells = Array.from({ length: days }, (_, i) => {
      const d = addDays(today, -(days - 1 - i));
      if (!habitAppliesOnDate(h, d)) return 'n/a' as const;
      return byDate.get(isoDate(d))?.done ? ('done' as const) : ('missed' as const);
    });
    return { habit: h, cells };
  });

  const completionRate = Math.round(
    (heatmap.reduce((sum, row) => sum + row.cells.filter((c) => c === 'done').length, 0) /
      Math.max(1, heatmap.reduce((sum, row) => sum + row.cells.filter((c) => c !== 'n/a').length, 0))) *
      100,
  );
  const longestStreak = Math.max(0, ...habits.map((h) => computeLongestStreak(h, logsByHabitId.get(h.id) || [], today)));

  const weeks = range === 'year' ? 12 : Math.ceil(days / 7);
  const weeklyTrend = buildAggregateWeeklyTrend(activeHabits, windowLogs, weeks, today);

  const tagStats = useMemo(() => {
    const stats: Record<string, { done: number; total: number }> = {};
    for (const h of activeHabits) {
      const byDate = new Map((logsByHabitId.get(h.id) || []).map((l) => [l.logDate, l]));
      for (const t of h.tags) {
        if (!stats[t]) stats[t] = { done: 0, total: 0 };
        for (let i = 0; i < days; i++) {
          const d = addDays(today, -(days - 1 - i));
          if (!habitAppliesOnDate(h, d)) continue;
          stats[t].total += 1;
          if (byDate.get(isoDate(d))?.done) stats[t].done += 1;
        }
      }
    }
    return stats;
  }, [activeHabits, logsByHabitId, days, today]);
  const tags = Object.keys(tagStats);

  const everestHabits = habits.filter((h) => h.charts.includes('Everest'));
  const thermoHabits = habits.filter((h) => h.charts.includes('Termómetro'));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)' }}>
        <div style={{ font: 'var(--text-title-md)', color: 'var(--color-text-primary)' }}>Estadísticas generales</div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) calc(var(--tabbar-height) + var(--space-5))', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Tabs value={range} onChange={(v) => setRange(v as Range)} tabs={[{ value: 'week', label: 'Semana' }, { value: 'month', label: 'Mes' }, { value: 'year', label: 'Año' }]} />

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{ flex: 1, background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)', textAlign: 'center' }}>
            <div style={{ font: 'var(--text-display-sm)', color: 'var(--color-brand)', fontFamily: 'var(--font-display)' }}>{completionRate}%</div>
            <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>Tasa de cumplimiento</div>
          </div>
          <div style={{ flex: 1, background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)', textAlign: 'center' }}>
            <div style={{ font: 'var(--text-display-sm)', color: 'var(--amber-600)', fontFamily: 'var(--font-display)' }}>{longestStreak}</div>
            <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>Racha más larga</div>
          </div>
        </div>

        <div>
          <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', marginBottom: 8 }}>Heatmap</div>
          <div style={{ overflowX: 'auto', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `100px repeat(${days}, 14px)`, gap: 3, alignItems: 'center' }}>
              <div />
              {dayLabels.map((d) => (
                <div key={d} style={{ font: '8px var(--font-body)', color: 'var(--color-text-tertiary)', textAlign: 'center', writingMode: 'vertical-rl' }}>{d}</div>
              ))}
              {heatmap.map((row) => (
                <div key={row.habit.id} style={{ display: 'contents' }}>
                  <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.habit.name}</div>
                  {row.cells.map((c, i) => (
                    <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c === 'done' ? 'var(--color-success)' : c === 'missed' ? 'var(--color-danger)' : 'var(--sand-200)' }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', marginBottom: 8 }}>Tendencia — cumplimiento semanal</div>
          <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-5)' }}>
            <WeeklyTrendChart data={weeklyTrend} />
          </div>
        </div>

        {tags.length > 0 && (
          <div>
            <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', marginBottom: 8 }}>Por etiqueta</div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              {tags.map((t) => {
                const pct = tagStats[t].total ? Math.round((tagStats[t].done / tagStats[t].total) * 100) : 0;
                return (
                  <div key={t} style={{ flex: '1 1 30%', minWidth: 90, background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)', textAlign: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', margin: '0 auto', background: `conic-gradient(var(--color-brand) ${pct}%, var(--sand-200) 0)` }} />
                    <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-secondary)', marginTop: 8 }}>{t}</div>
                    <div style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-tertiary)' }}>{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {everestHabits.length > 0 && (
          <div>
            <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', marginBottom: 8 }}>Metas (Everest)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {everestHabits.map((h) => (
                <button
                  key={h.id}
                  onClick={() => navigate(`/habits/${h.id}`)}
                  style={{ textAlign: 'left', border: 'none', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                >
                  <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-primary)', marginBottom: 6 }}>{h.icon} {h.name}</div>
                  <EverestChart series={buildEverestSeries(h, logsByHabitId.get(h.id) || [], Math.min(days, 30), today)} goalDays={h.streakGoal || 21} />
                </button>
              ))}
            </div>
          </div>
        )}

        {thermoHabits.length > 0 && (
          <div>
            <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', marginBottom: 8 }}>Metas diarias</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {thermoHabits.map((h) => (
                <button
                  key={h.id}
                  onClick={() => navigate(`/habits/${h.id}`)}
                  style={{ textAlign: 'left', border: 'none', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                >
                  <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-primary)', marginBottom: 10 }}>{h.icon} {h.name}</div>
                  <ThermometerChart current={computeGoalCurrent(h, logsByHabitId.get(h.id) || [], today)} goal={parseFloat(h.goalValue || '1')} unit={h.unit ? ` ${h.unit}` : ''} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
