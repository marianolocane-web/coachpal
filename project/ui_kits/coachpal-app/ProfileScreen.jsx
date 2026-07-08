function ProfileScreen({ user, onBack }) {
  const { StreakBadge, Switch, IconButton } = window.CoachPalDesignSystem_c83b94;
  const stats = [
    { label: 'Racha más larga', value: `${user.longestStreak} días` },
    { label: 'Días completados', value: user.totalDays },
    { label: 'Hábitos activos', value: user.habitsActive },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-6) var(--space-5) var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: 'var(--color-brand)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', font: 'var(--text-title-lg)', fontFamily: 'var(--font-display)',
        }}>
          {user.name[0]}
        </div>
        <div>
          <div style={{ font: 'var(--text-title-lg)', color: 'var(--color-text-primary)' }}>{user.name}</div>
          <div style={{ marginTop: 4 }}><StreakBadge days={user.longestStreak} size="sm" /></div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) var(--space-8)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ flex: 1, background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)', textAlign: 'center' }}>
              <div style={{ font: 'var(--text-display-sm)', color: 'var(--color-brand)', fontFamily: 'var(--font-display)' }}>{s.value}</div>
              <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-7)', font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>Ajustes</div>
        <div style={{ marginTop: 'var(--space-3)', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <Switch checked={true} label="Recordatorios" />
          <Switch checked={false} label="Modo oscuro" />
          <Switch checked={true} label="Sonidos de celebración" />
        </div>
      </div>
    </div>
  );
}
