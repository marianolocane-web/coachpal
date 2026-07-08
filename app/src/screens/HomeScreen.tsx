import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useHabits, useLogsRange, useMoodsRange, useUpsertLog } from '../lib/data/hooks';
import { addDays, formatDDMM, isoDate, isSameDay, startOfDay } from '../lib/data/dateUtils';
import { computeCurrentStreak, computeDayAggregate, computeIdentityVotes, habitAppliesOnDate } from '../lib/data/stats';
import { sortByProximityToNow, timeToMinutes } from '../lib/data/timeUtils';
import { quoteOfTheDay } from '../lib/quotes';
import { HabitCard, type HabitCardData } from '../components/habit/HabitCard';
import { DayMoodRing } from '../components/habit/DayMoodRing';
import { Dialog } from '../components/surfaces/Dialog';
import { Button } from '../components/forms/Button';

const HISTORY_DAYS = 370;

export function HomeScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const today = startOfDay(new Date());
  const todayIso = isoDate(today);
  const fromIso = isoDate(addDays(today, -HISTORY_DAYS));

  const { data: habits = [] } = useHabits();
  const { data: logs = [] } = useLogsRange(fromIso, todayIso);
  const { data: moods = [] } = useMoodsRange(isoDate(addDays(today, -3)), todayIso);
  const upsertLog = useUpsertLog();

  const [commentHabit, setCommentHabit] = useState<HabitCardData | null>(null);
  const [commentText, setCommentText] = useState('');

  const logsByHabit = useMemo(() => {
    const m = new Map<string, typeof logs>();
    for (const l of logs) m.set(l.habitId, [...(m.get(l.habitId) || []), l]);
    return m;
  }, [logs]);

  const todaysHabits = useMemo(() => {
    const scheduled = habits.filter((h) => h.status === 'Activo' && habitAppliesOnDate(h, today));
    return sortByProximityToNow(scheduled, (h) => h.timeOfDay, new Date());
  }, [habits, today]);

  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();

  const habitCards: HabitCardData[] = todaysHabits.map((h) => {
    const hLogs = logsByHabit.get(h.id) || [];
    const todayLog = hLogs.find((l) => l.logDate === todayIso);
    const tMin = timeToMinutes(h.timeOfDay);
    const overdue = tMin !== null && tMin < nowMin && !todayLog;
    return {
      id: h.id,
      name: h.name,
      streak: computeCurrentStreak(h, hLogs, today),
      goalLabel: h.goalLabel || undefined,
      goalValue: h.goalValue || undefined,
      unit: h.unit || undefined,
      goalDate: h.goalDate || undefined,
      time: h.timeOfDay,
      identity: h.identity ? { negativeEmoji: h.identity.negativeEmoji, positiveEmoji: h.identity.positiveEmoji, votes: computeIdentityVotes(h, hLogs, today) } : null,
      done: !!todayLog?.done,
      overdue,
      comment: todayLog?.comment,
    };
  });

  const doneCount = habitCards.filter((h) => h.done).length;
  const pct = habitCards.length ? Math.round((doneCount / habitCards.length) * 100) : 0;

  const last4Days = useMemo(() => {
    const moodByDate = new Map(moods.map((m) => [m.logDate, m]));
    return Array.from({ length: 4 }, (_, i) => {
      const d = addDays(today, -(3 - i));
      const dIso = isoDate(d);
      const dayLogs = logs.filter((l) => l.logDate === dIso);
      const agg = computeDayAggregate(habits, dayLogs, d);
      const isToday = isSameDay(d, today);
      return {
        date: d,
        label: formatDDMM(d),
        emoji: moodByDate.get(dIso)?.emoji ?? null,
        progress: agg.progress,
        alert: isToday && agg.totalCount > 0 && agg.doneCount < agg.totalCount,
      };
    });
  }, [today, moods, logs, habits]);

  const toggleHabit = (h: HabitCardData) => {
    upsertLog.mutate({ habitId: h.id, logDate: todayIso, done: !h.done });
  };

  const openComment = (h: HabitCardData) => {
    setCommentHabit(h);
    setCommentText(h.comment || '');
  };
  const closeComment = () => setCommentHabit(null);
  const saveComment = () => {
    if (!commentHabit) return;
    upsertLog.mutate({ habitId: commentHabit.id, logDate: todayIso, comment: commentText.trim() });
    setCommentHabit(null);
  };

  const firstName = (user?.email || 'Ahí').split('@')[0];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-6) var(--space-5) 0' }}>
        <div style={{ font: 'var(--text-display-sm)', color: 'var(--color-text-primary)' }}>Hola, {firstName} 👋</div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) calc(var(--tabbar-height) + var(--space-5))' }}>
        <div style={{ margin: 'var(--space-4) 0', padding: 'var(--space-4)', background: 'var(--color-brand-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ font: 'var(--text-body-md)', color: 'var(--green-700)', fontStyle: 'italic' }}>&ldquo;{quoteOfTheDay(today)}&rdquo;</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 var(--space-3)' }}>
          <div style={{ font: 'var(--text-title-sm)', color: 'var(--color-text-primary)' }}>Últimos 4 días</div>
          <button
            onClick={() => navigate('/calendar')}
            style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'var(--text-label-md)', color: 'var(--color-brand)', fontFamily: 'var(--font-body)' }}
          >
            Ver más
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
          {last4Days.map((d) => (
            <DayMoodRing key={d.label} label={d.label} emoji={d.emoji} progress={d.progress} alert={d.alert} onClick={() => navigate(`/day/${isoDate(d.date)}`)} size={60} />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <div style={{ font: 'var(--text-title-sm)', color: 'var(--color-text-primary)' }}>Hábitos del día</div>
          <button
            onClick={() => navigate('/habits')}
            style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'var(--text-label-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)' }}
          >
            Todos los Hábitos
          </button>
        </div>

        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-secondary)', marginBottom: 6 }}>Hábitos para el día {formatDDMM(today)}</div>
          <div style={{ position: 'relative', height: 10, borderRadius: 'var(--radius-pill)', background: 'var(--sand-200)', overflow: 'hidden' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                width: `${pct}%`,
                background: pct >= 80 ? 'var(--color-success)' : pct >= 50 ? 'var(--color-warning)' : 'var(--color-danger)',
                transition: 'width var(--duration-slow) var(--ease-standard)',
              }}
            />
          </div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>{pct}% de hábitos diarios completados</div>
        </div>

        {habitCards.length === 0 ? (
          <div style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)', padding: 'var(--space-5) 0', textAlign: 'center' }}>
            Todavía no tienes hábitos. Empieza por uno pequeño.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {habitCards.map((h) => (
              <HabitCard key={h.id} habit={h} onToggle={toggleHabit} onOpen={() => navigate(`/habits/${h.id}`)} onComment={() => openComment(h)} />
            ))}
          </div>
        )}

        <button
          onClick={() => navigate('/habits/new')}
          style={{
            marginTop: 'var(--space-5)',
            width: '100%',
            padding: '14px',
            borderRadius: 'var(--radius-pill)',
            border: '1.5px dashed var(--color-border-strong)',
            background: 'none',
            cursor: 'pointer',
            font: 'var(--text-label-md)',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          + Añadir hábito
        </button>
      </div>

      <Dialog
        open={!!commentHabit}
        title={commentHabit ? `Comentario · ${commentHabit.name}` : ''}
        onClose={closeComment}
        actions={
          <>
            <Button variant="secondary" onClick={closeComment}>Cancelar</Button>
            <Button variant="primary" onClick={saveComment}>Guardar</Button>
          </>
        }
      >
        <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>
          Puedes editar este comentario mientras el día siga en curso. Una vez finalizado, quedará registrado y no podrá modificarse.
        </div>
        <textarea
          autoFocus
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Escribe tu comentario…"
          rows={4}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            resize: 'vertical',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            font: 'var(--text-body-md)',
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-primary)',
            background: 'var(--color-bg-surface)',
          }}
        />
      </Dialog>
    </div>
  );
}
