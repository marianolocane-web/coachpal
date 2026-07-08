function DayDetailScreen({ day, onBack }) {
  const { HabitCard } = window.CoachPalDesignSystem_c83b94;
  const pct = Math.round((day?.progress || 0) * 100);
  const moods = ['feliz', 'ansioso', 'sorprendido'];
  const dayHabits = [
    { id: 1, name: 'Meditar 10 min', streak: 12, time: '08:00', done: true, comment: 'Muy relajante hoy.', identity: { negativeEmoji: '🤯', positiveEmoji: '🧘‍♂️', votes: 7 } },
    { id: 2, name: 'Leer 20 páginas', streak: 3, time: '21:00', done: false, missed: true, identity: { negativeEmoji: '📵', positiveEmoji: '📚', votes: 2 } },
    { id: 3, name: 'Beber 2L de agua', streak: 0, time: 'Todo el día', done: false, missed: true, comment: 'Se me pasó, muy ocupada.', identity: { negativeEmoji: '🥤', positiveEmoji: '💧', votes: -1 } },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-surface)', cursor: 'pointer', fontSize: 16 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ font: 'var(--text-title-md)', color: 'var(--color-text-primary)' }}>{day?.date || 'Hoy'}</div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)' }}>{day?.emoji || '✕'} · {pct}% completado</div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginBottom: 6 }}>Qué afectó mi ánimo</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {moods.map((m) => (
              <span key={m} style={{ padding: '5px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--color-bg-surface-2)', font: 'var(--text-label-sm)', color: 'var(--color-text-secondary)' }}>{m}</span>
            ))}
          </div>
        </div>

        <div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginBottom: 6 }}>Hábitos de ese día</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {dayHabits.map((h) => (
              <div key={h.id}>
                <HabitCard habit={h} readOnly />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
