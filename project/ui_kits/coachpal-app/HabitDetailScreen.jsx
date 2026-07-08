function HabitDetailScreen({ habit, onBack, onEdit, onDelete }) {
  const { useState } = React;
  const { StreakBadge, Tabs, IconButton, Dialog, Button, IdentityVoteBar } = window.CoachPalDesignSystem_c83b94;
  const [range, setRange] = useState('week');
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!habit) return null;

  const rangeDays = { week: 7, month: 30, year: 30 }[range];
  const hasGoal = !!(habit.goalLabel && habit.goalValue);
  const goalNum = hasGoal ? parseFloat(habit.goalValue) : null;
  const currentNum = hasGoal ? parseFloat(habit.goalCurrent ?? 0) : null;
  const goalPct = hasGoal && goalNum > 0 ? Math.max(0, Math.min(1, currentNum / goalNum)) : 0;
  const remaining = hasGoal ? Math.max(0, goalNum - currentNum) : 0;
  const charts = habit.charts || [];

  const week = Array.from({ length: rangeDays }, (_, i) => ({
    label: rangeDays === 7 ? ['L', 'M', 'X', 'J', 'V', 'S', 'D'][i] : String(i + 1),
    done: ((habit.id * 13 + i * 7) % 10) >= 4 ? true : ((habit.id * 13 + i * 7) % 10) >= 1 ? false : null,
  }));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <IconButton label="Volver" variant="ghost" onClick={onBack} icon={<span style={{ fontSize: 18 }}>←</span>} />
        <div style={{ flex: 1, font: 'var(--text-title-md)', color: 'var(--color-text-primary)' }}>{habit.name}</div>
        <IconButton label="Editar" variant="ghost" onClick={onEdit} icon={<span style={{ fontSize: 16 }}>✎</span>} />
        <IconButton label="Eliminar" variant="ghost" onClick={() => setConfirmOpen(true)} icon={<span style={{ fontSize: 16 }}>🗑</span>} />
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {/* Summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: 32 }}>{habit.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>{habit.category} · {habit.time}</div>
            <div style={{ marginTop: 6 }}><StreakBadge days={habit.streak} /></div>
          </div>
        </div>

        {/* Identity duality bar */}
        {habit.identity && (
          <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4) var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
            <IdentityVoteBar negativeEmoji={habit.identity.negativeEmoji} positiveEmoji={habit.identity.positiveEmoji} votes={habit.identity.votes} />
          </div>
        )}

        {/* Goal progress */}
        {hasGoal && (
          <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ font: 'var(--text-body-md)', color: 'var(--color-text-primary)' }}>
              {remaining > 0
                ? <>Faltan <strong>{remaining}{habit.unit ? ` ${habit.unit}` : ''}</strong> para tu meta de {habit.goalValue}{habit.unit ? ` ${habit.unit}` : ''}{habit.goalDate ? ` · ${habit.goalDate}` : ''}</>
                : <>🎉 Alcanzaste tu meta de {habit.goalValue}{habit.unit ? ` ${habit.unit}` : ''}</>}
            </div>
            <div style={{ position: 'relative', height: 10, borderRadius: 'var(--radius-pill)', background: 'var(--sand-200)', overflow: 'hidden', marginTop: 'var(--space-3)' }}>
              <div style={{ position: 'absolute', inset: 0, width: `${goalPct * 100}%`, background: goalPct >= 1 ? 'var(--color-success)' : 'var(--color-brand)', transition: 'width var(--duration-slow) var(--ease-standard)' }} />
            </div>
            <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>{habit.goalCurrent}{habit.unit ? ` ${habit.unit}` : ''} de {habit.goalValue}{habit.unit ? ` ${habit.unit}` : ''}</div>
          </div>
        )}

        {/* Range tabs */}
        <div>
          <Tabs value={range} onChange={setRange} tabs={[{ value: 'week', label: 'Semana' }, { value: 'month', label: 'Mes' }, { value: 'year', label: 'Año' }]} />
        </div>

        {/* Calendar of points */}
        <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: range === 'week' ? 0 : 6, justifyContent: range === 'week' ? 'space-between' : 'flex-start' }}>
            {week.map((d, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: range === 'week' ? 'auto' : 26 }}>
                <div style={{
                  width: range === 'week' ? 32 : 18, height: range === 'week' ? 32 : 18, borderRadius: '50%',
                  background: d.done === true ? 'var(--color-brand)' : d.done === false ? 'var(--color-danger-subtle)' : 'var(--sand-100)',
                  border: d.done === null ? '1.5px dashed var(--sand-300)' : 'none',
                }} />
                {range === 'week' && <div style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-tertiary)' }}>{d.label}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        {charts.includes('Everest') && (
          <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
            <EverestChart habitId={habit.id} goal={habit.streakGoal || 21} rangeDays={rangeDays} />
          </div>
        )}
        {charts.includes('Termómetro') && (
          <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Progreso de hoy</div>
            <ThermometerChart current={parseFloat(habit.goalCurrent ?? 0)} goal={parseFloat(habit.goalValue ?? 1)} unit={habit.unit ? ` ${habit.unit}` : ''} />
          </div>
        )}
        {charts.includes('Valor diario') && (
          <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Valor diario</div>
            <DailyValueChart habitId={habit.id} rangeDays={rangeDays} unit={habit.unit ? ` ${habit.unit}` : ''} />
          </div>
        )}
        {charts.includes('Promedio semanal') && (
          <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Tendencia — promedio semanal</div>
            <WeeklyAverageChart habitId={habit.id} points={range === 'year' ? 12 : 6} />
          </div>
        )}

        {/* Comment history */}
        {(habit.commentHistory || []).length > 0 && (
          <div>
            <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', marginBottom: 8 }}>Historial de comentarios</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {habit.commentHistory.map((c, i) => (
                <div key={i} style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-3) var(--space-4)' }}>
                  <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)' }}>{c.date}</div>
                  <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-primary)', marginTop: 2 }}>{c.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)' }}>
          Racha más larga: <strong style={{ color: 'var(--color-text-primary)' }}>{habit.streak + 15} días</strong>
        </div>
      </div>

      <Dialog
        open={confirmOpen}
        title="¿Eliminar hábito?"
        onClose={() => setConfirmOpen(false)}
        actions={<>
          <Button variant="secondary" onClick={() => setConfirmOpen(false)} fullWidth>Cancelar</Button>
          <Button variant="danger" onClick={() => { setConfirmOpen(false); onDelete(habit); }} fullWidth>Eliminar</Button>
        </>}
      >
        Esta acción no se puede deshacer.
      </Dialog>
    </div>
  );
}
