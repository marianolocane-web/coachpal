import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useHabits, useLogsRange, useMoodsRange } from '../lib/data/hooks';
import { computeDayAggregate } from '../lib/data/stats';
import { isoDate, mondayFirstWeekday, startOfDay, MONTH_NAMES_SHORT, WEEKDAY_LETTERS } from '../lib/data/dateUtils';
import { IconButton } from '../components/forms/IconButton';
import { DayMoodRing } from '../components/habit/DayMoodRing';

function MultiFilterDropdown({ label, options, selected, onChange }: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const allSelected = selected.length === 0;
  const summary = allSelected ? label : selected.length === 1 ? selected[0] : `${selected.length} seleccionados`;

  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter((o) => o !== opt));
    else onChange([...selected, opt]);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          font: 'var(--text-caption)', color: allSelected ? 'var(--color-text-tertiary)' : 'var(--color-brand)',
          padding: '4px 10px', background: allSelected ? 'var(--color-bg-surface-2)' : 'var(--color-brand-subtle)',
          borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
          display: 'flex', alignItems: 'center', gap: 4,
        }}
      >
        {summary} ▾
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: 4, zIndex: 30, minWidth: 180,
          background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-border-subtle)', padding: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 2,
          maxHeight: 260, overflowY: 'auto',
        }}>
          <button
            onClick={() => { onChange([]); setOpen(false); }}
            style={{ textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 'var(--radius-sm)', font: 'var(--text-body-sm)', color: allSelected ? 'var(--color-brand)' : 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}
          >
            {allSelected ? '✓ ' : ''}{label}
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              style={{ textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 'var(--radius-sm)', font: 'var(--text-body-sm)', color: selected.includes(opt) ? 'var(--color-brand)' : 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}
            >
              {selected.includes(opt) ? '✓ ' : ''}{opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CalendarScreen() {
  const navigate = useNavigate();
  const today = startOfDay(new Date());
  const currentYear = today.getFullYear();
  const currentMonthIdx = today.getMonth();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonthIdx);
  const [habitFilter, setHabitFilter] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  const { data: habits = [] } = useHabits();

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const fromIso = isoDate(monthStart);
  const toIso = isoDate(monthEnd);
  const { data: logs = [] } = useLogsRange(fromIso, toIso);
  const { data: moods = [] } = useMoodsRange(fromIso, toIso);

  const years = [currentYear - 1, currentYear, currentYear + 1];
  const habitNames = habits.map((h) => h.name);
  const allTags = [...new Set(habits.flatMap((h) => h.tags))];

  const filteredHabits = useMemo(
    () =>
      habits.filter(
        (h) => (habitFilter.length === 0 || habitFilter.includes(h.name)) && (tagFilter.length === 0 || h.tags.some((t) => tagFilter.includes(t))),
      ),
    [habits, habitFilter, tagFilter],
  );

  const moodByDate = new Map(moods.map((m) => [m.logDate, m]));
  const daysInMonth = monthEnd.getDate();
  const leadingBlanks = mondayFirstWeekday(monthStart);

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    const dIso = isoDate(d);
    const dayLogs = logs.filter((l) => l.logDate === dIso);
    const agg = computeDayAggregate(filteredHabits, dayLogs, d);
    return { n: i + 1, date: d, emoji: moodByDate.get(dIso)?.emoji ?? null, progress: agg.progress };
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <IconButton label="Volver" onClick={() => navigate(-1)} icon={<ArrowLeft size={18} />} />
        <div style={{ font: 'var(--text-title-md)', color: 'var(--color-text-primary)' }}>Vista calendario</div>
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '0 var(--space-5) var(--space-3)', justifyContent: 'center' }}>
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            style={{
              padding: '6px 16px', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer',
              font: 'var(--text-label-md)', fontFamily: 'var(--font-body)',
              background: y === year ? 'var(--color-brand)' : 'var(--color-bg-surface-2)',
              color: y === year ? 'white' : 'var(--color-text-secondary)',
            }}
          >
            {y}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, padding: '0 var(--space-5) var(--space-3)' }}>
        {MONTH_NAMES_SHORT.map((m, i) => {
          const isFuture = year > currentYear || (year === currentYear && i > currentMonthIdx);
          const isSelected = i === month && !isFuture;
          return (
            <button
              key={m}
              disabled={isFuture}
              onClick={() => setMonth(i)}
              style={{
                padding: '8px 0', borderRadius: 'var(--radius-pill)', border: 'none',
                cursor: isFuture ? 'not-allowed' : 'pointer',
                font: 'var(--text-label-sm)', fontFamily: 'var(--font-body)',
                background: isSelected ? 'var(--sand-900)' : 'var(--color-bg-surface-2)',
                color: isFuture ? 'var(--sand-400)' : isSelected ? 'white' : 'var(--color-text-secondary)',
                opacity: isFuture ? 0.6 : 1,
              }}
            >
              {m}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '0 var(--space-4) var(--space-3)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <MultiFilterDropdown label="Todos los hábitos" options={habitNames} selected={habitFilter} onChange={setHabitFilter} />
        <MultiFilterDropdown label="Todas las etiquetas" options={allTags} selected={tagFilter} onChange={setTagFilter} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, padding: '0 var(--space-2)' }}>
        {WEEKDAY_LETTERS.map((d) => (
          <div key={d} style={{ textAlign: 'center', font: 'var(--text-label-sm)', color: 'var(--color-text-tertiary)', padding: '4px 0' }}>{d}</div>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: '0 var(--space-2) var(--space-8)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <div key={'b' + i} />
          ))}
          {days.map((d) => (
            <div key={d.n} style={{ display: 'flex', justifyContent: 'center', padding: 2, minWidth: 0 }}>
              <DayMoodRing label={String(d.n)} emoji={d.emoji} progress={d.progress} size={34} onClick={() => navigate(`/day/${isoDate(d.date)}`)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
