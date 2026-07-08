function HabitsListScreen({ habits, onBack, onOpenHabit, onOpenStats, onAddHabit }) {
  const { useState } = React;
  const { Input, Badge } = window.CoachPalDesignSystem_c83b94;
  const [query, setQuery] = useState('');

  const filtered = habits
    .filter((h) => h.name.toLowerCase().includes(query.toLowerCase()) || (h.tags || []).some((t) => t.toLowerCase().includes(query.toLowerCase())))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-surface)', cursor: 'pointer', fontSize: 16 }}>←</button>
        <div style={{ flex: 1, font: 'var(--text-title-md)', color: 'var(--color-text-primary)' }}>Todos los hábitos</div>
        <button onClick={onAddHabit} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'var(--color-brand)', color: 'white', cursor: 'pointer', fontSize: 20 }}>+</button>
      </div>

      <div style={{ padding: '0 var(--space-5) var(--space-3)' }}>
        <Input placeholder="Buscar por nombre o etiqueta…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {filtered.map((h) => (
          <div key={h.id} style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
              <button onClick={() => onOpenHabit(h)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', font: 'var(--text-title-sm)', fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                {h.name}
              </button>
              <Badge variant={h.status === 'Pausado' ? 'neutral' : 'brand'}>{h.status || 'Activo'}</Badge>
            </div>
            {h.goalLabel && (
              <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
                🎯 {h.goalLabel} {h.goalValue} · al {h.goalDate}
              </div>
            )}
            {h.identity && (
              <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                {h.identity.positiveEmoji} vs {h.identity.negativeEmoji}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {(h.tags || []).map((t) => <Badge key={t} variant="neutral">{t}</Badge>)}
                <span style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)' }}>{h.time}</span>
              </div>
              <button onClick={() => onOpenStats(h)} style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'var(--text-label-sm)', color: 'var(--color-brand)', fontFamily: 'var(--font-body)' }}>📊 Stats</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
