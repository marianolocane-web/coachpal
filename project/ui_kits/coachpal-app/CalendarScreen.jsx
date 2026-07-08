function MultiFilterDropdown({ label, options, selected, onChange }) {
  const { useState } = React;
  const [open, setOpen] = useState(false);
  const allSelected = selected.length === 0;
  const summary = allSelected ? label : selected.length === 1 ? selected[0] : `${selected.length} seleccionados`;

  const toggle = (opt) => {
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

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function CalendarScreen({ habits = [], onBack, onOpenDay }) {
  const { useState } = React;
  const { DayMoodRing } = window.CoachPalDesignSystem_c83b94;
  const today = new Date(2026, 6, 5); // Jul 5, 2026 — app "now"
  const currentYear = today.getFullYear();
  const currentMonthIdx = today.getMonth();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonthIdx);
  const [habitFilter, setHabitFilter] = useState([]);
  const [tagFilter, setTagFilter] = useState([]);

  const years = [currentYear - 1, currentYear, currentYear + 1];
  const habitNames = habits.filter((h) => h.status !== 'Eliminado').map((h) => h.name);
  const allTags = [...new Set(habits.filter((h) => h.status !== 'Eliminado').flatMap((h) => h.tags || []))];

  const days = Array.from({ length: 31 }, (_, i) => {
    const seed = (i * 37) % 100;
    return {
      n: i + 1,
      emoji: seed > 70 ? '🤩' : seed > 45 ? '😊' : seed > 25 ? '😐' : seed > 10 ? '😢' : null,
      progress: (seed % 100) / 100,
    };
  });
  // pad to start on correct weekday (assume month starts on Wed for demo)
  const leadingBlanks = 2;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-surface)', cursor: 'pointer', fontSize: 16 }}>←</button>
        <div style={{ font: 'var(--text-title-md)', color: 'var(--color-text-primary)' }}>Vista calendario</div>
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '0 var(--space-5) var(--space-3)', justifyContent: 'center' }}>
        {years.map((y) => (
          <button key={y} onClick={() => setYear(y)} style={{
            padding: '6px 16px', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer',
            font: 'var(--text-label-md)', fontFamily: 'var(--font-body)',
            background: y === year ? 'var(--color-brand)' : 'var(--color-bg-surface-2)',
            color: y === year ? 'white' : 'var(--color-text-secondary)',
          }}>{y}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, padding: '0 var(--space-5) var(--space-3)' }}>
        {MONTHS.map((m, i) => {
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
            >{m}</button>
          );
        })}
      </div>

      <div style={{ padding: '0 var(--space-4) var(--space-3)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <MultiFilterDropdown label="Todos los hábitos" options={habitNames} selected={habitFilter} onChange={setHabitFilter} />
        <MultiFilterDropdown label="Todas las etiquetas" options={allTags} selected={tagFilter} onChange={setTagFilter} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, padding: '0 var(--space-2)' }}>
        {WEEKDAYS.map((d) => (
          <div key={d} style={{ textAlign: 'center', font: 'var(--text-label-sm)', color: 'var(--color-text-tertiary)', padding: '4px 0' }}>{d}</div>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: '0 var(--space-2) var(--space-8)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {Array.from({ length: leadingBlanks }).map((_, i) => <div key={'b' + i} />)}
          {days.map((d) => (
            <div key={d.n} style={{ display: 'flex', justifyContent: 'center', padding: 2, minWidth: 0 }}>
              <DayMoodRing label={String(d.n)} emoji={d.emoji} progress={d.progress} size={34} onClick={() => onOpenDay({ date: `${d.n} ${MONTHS[month]}`, emoji: d.emoji, progress: d.progress })} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
