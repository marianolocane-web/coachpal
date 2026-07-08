function HomeScreen({ habits, onToggle, onOpenHabit, onAddHabit, onOpenDay, dayHistory, quote, onOpenAllHabits, onOpenCalendar, onSaveComment }) {
  const { useState } = React;
  const { HabitCard, DayMoodRing, IconButton, Dialog, Button } = window.CoachPalDesignSystem_c83b94;
  const doneCount = habits.filter((h) => h.done).length;
  const pct = habits.length ? Math.round((doneCount / habits.length) * 100) : 0;
  const [commentHabit, setCommentHabit] = useState(null);
  const [commentText, setCommentText] = useState('');

  const openComment = (h) => { setCommentHabit(h); setCommentText(h.comment || ''); };
  const closeComment = () => setCommentHabit(null);
  const saveComment = () => {
    onSaveComment(commentHabit, commentText.trim());
    setCommentHabit(null);
  };

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)',
    }}>
      <div style={{ padding: 'var(--space-6) var(--space-5) 0' }}>
        <div style={{ font: 'var(--text-display-sm)', color: 'var(--color-text-primary)' }}>Hola, Marta 👋</div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) calc(var(--tabbar-height) + var(--space-5))' }}>
        {/* Welcome / AI coach quote */}
        <div style={{ margin: 'var(--space-4) 0', padding: 'var(--space-4)', background: 'var(--color-brand-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ font: 'var(--text-body-md)', color: 'var(--green-700)', fontStyle: 'italic' }}>&ldquo;{quote}&rdquo;</div>
        </div>

        {/* Last 4 days */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 var(--space-3)' }}>
          <div style={{ font: 'var(--text-title-sm)', color: 'var(--color-text-primary)' }}>Últimos 4 días</div>
          <button onClick={onOpenCalendar} style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'var(--text-label-md)', color: 'var(--color-brand)', fontFamily: 'var(--font-body)' }}>Ver más</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
          {dayHistory.map((d) => (
            <DayMoodRing key={d.label} label={d.label} emoji={d.emoji} progress={d.progress} alert={d.alert} onClick={() => onOpenDay(d)} size={60} />
          ))}
        </div>

        {/* Habits of the day */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <div style={{ font: 'var(--text-title-sm)', color: 'var(--color-text-primary)' }}>Hábitos del día</div>
          <button onClick={onOpenAllHabits} style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'var(--text-label-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)' }}>Todos los Hábitos</button>
        </div>

        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-secondary)', marginBottom: 6 }}>Hábitos para el día 05/07</div>
          <div style={{ position: 'relative', height: 10, borderRadius: 'var(--radius-pill)', background: 'var(--sand-200)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: pct >= 80 ? 'var(--color-success)' : pct >= 50 ? 'var(--color-warning)' : 'var(--color-danger)', transition: 'width var(--duration-slow) var(--ease-standard)' }} />
          </div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>{pct}% de hábitos diarios completados</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {habits.map((h) => (
            <HabitCard key={h.id} habit={h} onToggle={onToggle} onOpen={() => onOpenHabit(h)} onComment={() => openComment(h)} />
          ))}
        </div>

        <button
          onClick={onAddHabit}
          style={{
            marginTop: 'var(--space-5)', width: '100%', padding: '14px', borderRadius: 'var(--radius-pill)',
            border: '1.5px dashed var(--color-border-strong)', background: 'none', cursor: 'pointer',
            font: 'var(--text-label-md)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)',
          }}
        >
          + Añadir hábito
        </button>
      </div>

      <Dialog
        open={!!commentHabit}
        title={commentHabit ? `Comentario · ${commentHabit.name}` : ''}
        onClose={closeComment}
        actions={(
          <>
            <Button variant="secondary" onClick={closeComment}>Cancelar</Button>
            <Button variant="primary" onClick={saveComment}>Guardar</Button>
          </>
        )}
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
            width: '100%', boxSizing: 'border-box', resize: 'vertical', border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-md)', padding: '12px 14px', font: 'var(--text-body-md)',
            fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)', background: 'var(--color-bg-surface)',
          }}
        />
      </Dialog>
    </div>
  );
}
