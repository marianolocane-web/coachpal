function GeneralStatsScreen({ habits, onBack, onOpenHabit }) {
  const { useState } = React;
  const { Tabs } = window.CoachPalDesignSystem_c83b94;
  const [range, setRange] = useState('week');
  const days = { week: 7, month: 30, year: 90 }[range];

  const dayLabels = Array.from({ length: days }, (_, i) => i + 1);
  const heatmap = habits.map((h) => ({
    name: h.name,
    cells: seededDaily(h.id, days).map((v, i) => (((h.id * 13 + i * 7) % 10) < 1 ? 'n/a' : v ? 'done' : 'missed')),
  }));

  // Aggregate completion rate + longest streak across all habits
  const completionRate = Math.round(
    (heatmap.reduce((sum, row) => sum + row.cells.filter((c) => c === 'done').length, 0) /
      Math.max(1, heatmap.reduce((sum, row) => sum + row.cells.filter((c) => c !== 'n/a').length, 0))) * 100
  );
  const longestStreak = Math.max(0, ...habits.map((h) => h.streak || 0)) + 15;

  // Weekly trend (aggregate completion % per week) across the selected range
  const weeks = range === 'year' ? 12 : Math.ceil(days / 7);
  const weeklyTrend = Array.from({ length: weeks }, (_, w) => {
    let done = 0, total = 0;
    habits.forEach((h) => {
      const week = seededDaily(h.id, 7, w * 7);
      done += week.reduce((a, b) => a + b, 0);
      total += week.length;
    });
    return total ? done / total : 0;
  });

  // By-tag completion (real, from habit tags)
  const tagStats = {};
  habits.forEach((h, hi) => {
    (h.tags || []).forEach((t) => {
      if (!tagStats[t]) tagStats[t] = { done: 0, total: 0 };
      const daily = seededDaily(h.id, days);
      tagStats[t].done += daily.reduce((a, b) => a + b, 0);
      tagStats[t].total += daily.length;
    });
  });
  const tags = Object.keys(tagStats);

  const everestHabits = habits.filter((h) => (h.charts || []).includes('Everest'));
  const thermoHabits = habits.filter((h) => (h.charts || []).includes('Termómetro'));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-surface)', cursor: 'pointer', fontSize: 16 }}>←</button>
        <div style={{ font: 'var(--text-title-md)', color: 'var(--color-text-primary)' }}>Estadísticas generales</div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) calc(var(--tabbar-height) + var(--space-5))', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Tabs value={range} onChange={setRange} tabs={[{ value: 'week', label: 'Semana' }, { value: 'month', label: 'Mes' }, { value: 'year', label: 'Año' }]} />

        {/* Summary cards */}
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{ flex: 1, background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)', textAlign: 'center' }}>
            <div style={{ font: 'var(--text-display-sm)', color: 'var(--color-brand)', fontFamily: 'var(--font-display)' }}>{completionRate}%</div>
            <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>Tasa de cumplimiento</div>
          </div>
          <div style={{ flex: 1, background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)', textAlign: 'center' }}>
            <div style={{ font: 'var(--text-display-sm)', color: 'var(--amber-600)', fontFamily: 'var(--font-display)' }}>{longestStreak}</div>
            <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>Racha más larga</div>
          </div>
        </div>

        {/* Heatmap */}
        <div>
          <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', marginBottom: 8 }}>Heatmap</div>
          <div style={{ overflowX: 'auto', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `100px repeat(${days}, 14px)`, gap: 3, alignItems: 'center' }}>
              <div></div>
              {dayLabels.map((d) => <div key={d} style={{ font: '8px var(--font-body)', color: 'var(--color-text-tertiary)', textAlign: 'center', writingMode: 'vertical-rl' }}>{d}</div>)}
              {heatmap.map((row) => (
                <React.Fragment key={row.name}>
                  <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.name}</div>
                  {row.cells.map((c, i) => (
                    <div key={i} style={{
                      width: 12, height: 12, borderRadius: 3,
                      background: c === 'done' ? 'var(--color-success)' : c === 'missed' ? 'var(--color-danger)' : 'var(--sand-200)',
                    }} />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly trend */}
        <div>
          <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', marginBottom: 8 }}>Tendencia — cumplimiento semanal</div>
          <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-5)' }}>
            <WeeklyTrendChart data={weeklyTrend} />
          </div>
        </div>

        {/* By tag */}
        {tags.length > 0 && (
          <div>
            <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', marginBottom: 8 }}>Por etiqueta</div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              {tags.map((t) => {
                const pct = tagStats[t].total ? Math.round((tagStats[t].done / tagStats[t].total) * 100) : 0;
                return (
                  <div key={t} style={{ flex: '1 1 30%', minWidth: 90, background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)', textAlign: 'center' }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%', margin: '0 auto',
                      background: `conic-gradient(var(--color-brand) ${pct}%, var(--sand-200) 0)`,
                    }} />
                    <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-secondary)', marginTop: 8 }}>{t}</div>
                    <div style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-tertiary)' }}>{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Everest per habit */}
        {everestHabits.length > 0 && (
          <div>
            <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', marginBottom: 8 }}>Metas (Everest)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {everestHabits.map((h) => (
                <button key={h.id} onClick={() => onOpenHabit(h)} style={{ textAlign: 'left', border: 'none', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-primary)', marginBottom: 6 }}>{h.icon} {h.name}</div>
                  <EverestChart habitId={h.id} goal={h.streakGoal || 21} rangeDays={Math.min(days, 30)} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Thermómetro per habit */}
        {thermoHabits.length > 0 && (
          <div>
            <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', marginBottom: 8 }}>Metas diarias</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {thermoHabits.map((h) => (
                <button key={h.id} onClick={() => onOpenHabit(h)} style={{ textAlign: 'left', border: 'none', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-primary)', marginBottom: 10 }}>{h.icon} {h.name}</div>
                  <ThermometerChart current={parseFloat(h.goalCurrent ?? 0)} goal={parseFloat(h.goalValue ?? 1)} unit={h.unit ? ` ${h.unit}` : ''} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
