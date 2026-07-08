import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useHabit, useHabitLogs, useDeleteHabit } from '../lib/data/hooks';
import type { Habit, HabitLog } from '../lib/data/types';
import {
  computeCurrentStreak,
  computeGoalCurrent,
  computeIdentityVotes,
  computeLongestStreak,
  habitAppliesOnDate,
} from '../lib/data/stats';
import { buildDailyValuePoints, buildEverestSeries, buildWeeklyAverage } from '../lib/data/chartSeries';
import { addDays, formatDDMM, isoDate, MONTH_NAMES_SHORT, parseIsoDate, startOfDay } from '../lib/data/dateUtils';
import { IconButton } from '../components/forms/IconButton';
import { StreakBadge } from '../components/habit/StreakBadge';
import { IdentityVoteBar } from '../components/habit/IdentityVoteBar';
import { Tabs } from '../components/surfaces/Tabs';
import { Dialog } from '../components/surfaces/Dialog';
import { Button } from '../components/forms/Button';
import { EverestChart } from '../components/charts/EverestChart';
import { ThermometerChart } from '../components/charts/ThermometerChart';
import { DailyValueChart } from '../components/charts/DailyValueChart';
import { WeeklyAverageChart } from '../components/charts/WeeklyAverageChart';

type Range = 'week' | 'month' | 'year';
const HISTORY_DAYS = 400;

export function HabitDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: habit } = useHabit(id);
  const today = startOfDay(new Date());
  const fromIso = isoDate(addDays(today, -HISTORY_DAYS));
  const { data: logs = [] } = useHabitLogs(id, fromIso, isoDate(today));
  const deleteHabit = useDeleteHabit();

  const [range, setRange] = useState<Range>('week');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const rangeDays = { week: 7, month: 30, year: 365 }[range];

  const derived = useMemo(() => {
    if (!habit) return null;
    const hasGoal = !!(habit.goalLabel && habit.goalValue);
    const goalNum = hasGoal ? parseFloat(habit.goalValue) : null;
    const currentNum = hasGoal ? computeGoalCurrent(habit, logs, today) : null;
    const goalPct = hasGoal && goalNum && goalNum > 0 ? Math.max(0, Math.min(1, (currentNum || 0) / goalNum)) : 0;
    const remaining = hasGoal && goalNum ? Math.max(0, goalNum - (currentNum || 0)) : 0;
    const streak = computeCurrentStreak(habit, logs, today);
    const longestStreak = computeLongestStreak(habit, logs, today);
    const votes = habit.identity ? computeIdentityVotes(habit, logs, today) : 0;
    const commentHistory = logs
      .filter((l) => !!l.comment)
      .sort((a, b) => (a.logDate < b.logDate ? 1 : -1))
      .map((l) => ({ date: formatDDMM(parseIsoDate(l.logDate)), text: l.comment as string }));
    return { hasGoal, goalNum, currentNum, goalPct, remaining, streak, longestStreak, votes, commentHistory };
  }, [habit, logs, today]);

  if (!habit || !derived) return null;

  const charts = habit.charts;
  const weeks = range === 'year' ? 12 : 6;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <IconButton label="Volver" variant="ghost" onClick={() => navigate(-1)} icon={<ArrowLeft size={18} />} />
        <div style={{ flex: 1, font: 'var(--text-title-md)', color: 'var(--color-text-primary)' }}>{habit.name}</div>
        <IconButton label="Editar" variant="ghost" onClick={() => navigate(`/habits/${habit.id}/edit`)} icon={<Pencil size={16} />} />
        <IconButton label="Eliminar" variant="ghost" onClick={() => setConfirmOpen(true)} icon={<Trash2 size={16} />} />
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: 32 }}>{habit.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>{habit.category} · {habit.timeOfDay}</div>
            <div style={{ marginTop: 6 }}><StreakBadge days={derived.streak} /></div>
          </div>
        </div>

        {habit.identity && (
          <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4) var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
            <IdentityVoteBar negativeEmoji={habit.identity.negativeEmoji} positiveEmoji={habit.identity.positiveEmoji} votes={derived.votes} />
          </div>
        )}

        {derived.hasGoal && (
          <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ font: 'var(--text-body-md)', color: 'var(--color-text-primary)' }}>
              {derived.remaining > 0 ? (
                <>
                  Faltan <strong>{derived.remaining}{habit.unit ? ` ${habit.unit}` : ''}</strong> para tu meta de {habit.goalValue}
                  {habit.unit ? ` ${habit.unit}` : ''}
                  {habit.goalDate ? ` · ${habit.goalDate}` : ''}
                </>
              ) : (
                <>🎉 Alcanzaste tu meta de {habit.goalValue}{habit.unit ? ` ${habit.unit}` : ''}</>
              )}
            </div>
            <div style={{ position: 'relative', height: 10, borderRadius: 'var(--radius-pill)', background: 'var(--sand-200)', overflow: 'hidden', marginTop: 'var(--space-3)' }}>
              <div style={{ position: 'absolute', inset: 0, width: `${derived.goalPct * 100}%`, background: derived.goalPct >= 1 ? 'var(--color-success)' : 'var(--color-brand)', transition: 'width var(--duration-slow) var(--ease-standard)' }} />
            </div>
            <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>
              {derived.currentNum}{habit.unit ? ` ${habit.unit}` : ''} de {habit.goalValue}{habit.unit ? ` ${habit.unit}` : ''}
            </div>
          </div>
        )}

        <Tabs value={range} onChange={(v) => setRange(v as Range)} tabs={[{ value: 'week', label: 'Semana' }, { value: 'month', label: 'Mes' }, { value: 'year', label: 'Año' }]} />

        <PointsCalendar habit={habit} logs={logs} range={range} today={today} />

        {charts.includes('Everest') && (
          <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
            <EverestChart series={buildEverestSeries(habit, logs, rangeDays, today)} goalDays={habit.streakGoal || 21} />
          </div>
        )}
        {charts.includes('Termómetro') && (
          <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Progreso de hoy</div>
            <ThermometerChart current={computeGoalCurrent(habit, logs, today)} goal={parseFloat(habit.goalValue || '1')} unit={habit.unit ? ` ${habit.unit}` : ''} />
          </div>
        )}
        {charts.includes('Valor diario') && (
          <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Valor diario</div>
            <DailyValueChart points={buildDailyValuePoints(habit, logs, Math.min(rangeDays, 30), today)} unit={habit.unit ? ` ${habit.unit}` : ''} />
          </div>
        )}
        {charts.includes('Promedio semanal') && (
          <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Tendencia — promedio semanal</div>
            <WeeklyAverageChart data={buildWeeklyAverage(habit, logs, weeks, today)} />
          </div>
        )}

        {derived.commentHistory.length > 0 && (
          <div>
            <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', marginBottom: 8 }}>Historial de comentarios</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {derived.commentHistory.map((c, i) => (
                <div key={i} style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-3) var(--space-4)' }}>
                  <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)' }}>{c.date}</div>
                  <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-primary)', marginTop: 2 }}>{c.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)' }}>
          Racha más larga: <strong style={{ color: 'var(--color-text-primary)' }}>{derived.longestStreak} días</strong>
        </div>
      </div>

      <Dialog
        open={confirmOpen}
        title="¿Eliminar hábito?"
        onClose={() => setConfirmOpen(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)} fullWidth>Cancelar</Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => {
                setConfirmOpen(false);
                deleteHabit.mutate(habit.id, { onSuccess: () => navigate('/habits') });
              }}
            >
              Eliminar
            </Button>
          </>
        }
      >
        Esta acción no se puede deshacer.
      </Dialog>
    </div>
  );
}

function PointsCalendar({ habit, logs, range, today }: { habit: Habit; logs: HabitLog[]; range: Range; today: Date }) {
  const byDate = new Map(logs.map((l) => [l.logDate, l]));

  if (range === 'year') {
    const cells = Array.from({ length: 12 }, (_, m) => {
      const monthStart = new Date(today.getFullYear(), m, 1);
      let done = 0;
      let total = 0;
      for (let d = 1; d <= new Date(today.getFullYear(), m + 1, 0).getDate(); d++) {
        const day = new Date(today.getFullYear(), m, d);
        if (day > today) continue;
        if (!habitAppliesOnDate(habit, day)) continue;
        total += 1;
        if (byDate.get(isoDate(day))?.done) done += 1;
      }
      return { label: MONTH_NAMES_SHORT[m], pct: total ? done / total : null, isFuture: monthStart > today };
    });
    return (
      <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {cells.map((c, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 26 }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: c.pct === null ? 'var(--sand-100)' : c.pct >= 0.8 ? 'var(--color-success)' : c.pct >= 0.5 ? 'var(--color-warning)' : 'var(--color-danger-subtle)',
                  border: c.pct === null ? '1.5px dashed var(--sand-300)' : 'none',
                }}
              />
              <div style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-tertiary)' }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const days = range === 'week' ? 7 : 30;
  const cells = Array.from({ length: days }, (_, i) => {
    const d = addDays(today, -(days - 1 - i));
    const applies = habitAppliesOnDate(habit, d);
    const log = byDate.get(isoDate(d));
    const done = applies ? log?.done ?? null : null;
    return {
      label: range === 'week' ? ['L', 'M', 'X', 'J', 'V', 'S', 'D'][(d.getDay() + 6) % 7] : String(d.getDate()),
      done,
    };
  });

  return (
    <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: range === 'week' ? 0 : 6, justifyContent: range === 'week' ? 'space-between' : 'flex-start' }}>
        {cells.map((d, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: range === 'week' ? 'auto' : 26 }}>
            <div
              style={{
                width: range === 'week' ? 32 : 18,
                height: range === 'week' ? 32 : 18,
                borderRadius: '50%',
                background: d.done === true ? 'var(--color-brand)' : d.done === false ? 'var(--color-danger-subtle)' : 'var(--sand-100)',
                border: d.done === null ? '1.5px dashed var(--sand-300)' : 'none',
              }}
            />
            {range === 'week' && <div style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-tertiary)' }}>{d.label}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
