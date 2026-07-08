function StatsScreen({ habits }) {
  const { useState } = React;
  const { Tabs, StreakBadge, ProgressRing } = window.CoachPalDesignSystem_c83b94;
  const [range, setRange] = useState('week');

  const week = [
    { day: 'L', pct: 1 }, { day: 'M', pct: 1 }, { day: 'X', pct: 0.66 },
    { day: 'J', pct: 0.33 }, { day: 'V', pct: 1 }, { day: 'S', pct: 0.66 }, { day: 'D', pct: 0 },
  ];
  const totalDays = 132;
  const bestStreak = Math.max(...habits.map((h) => h.streak), 0);
  const avgPct = Math.round((week.reduce((a, d) => a + d.pct, 0) / week.length) * 100);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-6) var(--space-5) var(--space-4)' }}>
        <div style={{ font: 'var(--text-display-sm)', color: 'var(--color-text-primary)' }}>Tu progreso</div>
        <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>Así te ha ido últimamente.</div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) var(--space-8)' }}>
        <div style={{ margin: 'var(--space-2) 0 var(--space-4)' }}>
          <Tabs value={range} onChange={setRange} tabs={[{ value: 'week', label: 'Semana' }, { value: 'month', label: 'Mes' }, { value: 'year', label: 'Año' }]} />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{ flex: 1, background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)', textAlign: 'center' }}>
            <div style={{ font: 'var(--text-display-sm)', color: 'var(--color-brand)', fontFamily: 'var(--font-display)' }}>{avgPct}%</div>
            <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>Cumplimiento</div>
          </div>
          <div style={{ flex: 1, background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)', textAlign: 'center' }}>
            <div style={{ font: 'var(--text-display-sm)', color: 'var(--amber-600)', fontFamily: 'var(--font-display)' }}>{bestStreak}</div>
            <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>Mejor racha</div>
          </div>
          <div style={{ flex: 1, background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)', textAlign: 'center' }}>
            <div style={{ font: 'var(--text-display-sm)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>{totalDays}</div>
            <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>Días totales</div>
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-6)', font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>
          Esta semana
        </div>
        <div style={{ marginTop: 'var(--space-3)', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-5)', display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)', height: 140 }}>
          {week.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{
                width: '100%', maxWidth: 22, borderRadius: 'var(--radius-pill)',
                height: `${Math.max(d.pct, 0.06) * 76}px`,
                background: d.pct >= 1 ? 'var(--color-brand)' : d.pct > 0 ? 'var(--green-300)' : 'var(--sand-200)',
                transition: 'height var(--duration-slow) var(--ease-standard)',
              }} />
              <div style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-tertiary)' }}>{d.day}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-6)', font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>
          Por hábito
        </div>
        <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {habits.map((h) => (
            <div key={h.id} style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <ProgressRing progress={Math.min(h.streak / 30, 1)} size={44} strokeWidth={5}>{h.icon}</ProgressRing>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: 'var(--text-title-sm)', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.name}</div>
                <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>{h.category}</div>
              </div>
              <StreakBadge days={h.streak} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
