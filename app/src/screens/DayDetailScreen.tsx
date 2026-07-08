import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useHabits, useLogsRange, useMoodsRange } from '../lib/data/hooks';
import { computeDayAggregate, habitAppliesOnDate } from '../lib/data/stats';
import { formatLongEs, parseIsoDate } from '../lib/data/dateUtils';
import { IconButton } from '../components/forms/IconButton';
import { HabitCard, type HabitCardData } from '../components/habit/HabitCard';

export function DayDetailScreen() {
  const navigate = useNavigate();
  const { date } = useParams<{ date: string }>();
  const day = date ? parseIsoDate(date) : new Date();

  const { data: habits = [] } = useHabits();
  const { data: logs = [] } = useLogsRange(date || '', date || '');
  const { data: moods = [] } = useMoodsRange(date || '', date || '');

  const mood = moods[0];
  const scheduled = habits.filter((h) => habitAppliesOnDate(h, day));
  const agg = computeDayAggregate(habits, logs, day);
  const pct = Math.round(agg.progress * 100);

  const logByHabit = new Map(logs.map((l) => [l.habitId, l]));
  const dayHabits: HabitCardData[] = scheduled
    .map((h) => {
      const log = logByHabit.get(h.id);
      return {
        id: h.id,
        name: h.name,
        streak: undefined,
        time: h.timeOfDay,
        identity: h.identity ? { negativeEmoji: h.identity.negativeEmoji, positiveEmoji: h.identity.positiveEmoji, votes: 0 } : null,
        done: !!log?.done,
        missed: !log?.done,
        comment: log?.comment,
      };
    })
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <IconButton label="Volver" onClick={() => navigate(-1)} icon={<ArrowLeft size={18} />} />
        <div style={{ flex: 1 }}>
          <div style={{ font: 'var(--text-title-md)', color: 'var(--color-text-primary)' }}>{formatLongEs(day)}</div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)' }}>{mood?.emoji || '✕'} · {pct}% completado</div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {mood && mood.moodTags.length > 0 && (
          <div>
            <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginBottom: 6 }}>Qué afectó mi ánimo</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {mood.moodTags.map((m) => (
                <span key={m} style={{ padding: '5px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--color-bg-surface-2)', font: 'var(--text-label-sm)', color: 'var(--color-text-secondary)' }}>{m}</span>
              ))}
            </div>
          </div>
        )}

        <div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginBottom: 6 }}>Hábitos de ese día</div>
          {dayHabits.length === 0 ? (
            <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Ningún hábito estaba programado este día.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {dayHabits.map((h) => (
                <HabitCard key={h.id} habit={h} readOnly />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
