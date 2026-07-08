export interface ThermometerChartProps {
  current?: number;
  goal?: number;
  unit?: string;
}

export function ThermometerChart({ current = 0, goal = 1, unit = '' }: ThermometerChartProps) {
  const pct = goal > 0 ? Math.max(0, Math.min(1, current / goal)) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', fontFamily: 'var(--font-body)' }}>
      <div style={{ width: 36, height: 140, borderRadius: 'var(--radius-pill)', background: 'var(--sand-200)', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${pct * 100}%`,
            background: pct >= 1 ? 'var(--color-success)' : 'var(--color-brand)',
            transition: 'height var(--duration-slow) var(--ease-standard)',
          }}
        />
      </div>
      <div>
        <div style={{ font: 'var(--text-title-md)', color: 'var(--color-text-primary)' }}>
          {current}
          {unit} <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>/ {goal}{unit}</span>
        </div>
        <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>{Math.round(pct * 100)}% de tu meta diaria</div>
      </div>
    </div>
  );
}
