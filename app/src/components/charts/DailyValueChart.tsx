export interface DailyValuePoint {
  date: string;
  value: number;
}

export interface DailyValueChartProps {
  points: DailyValuePoint[];
  unit?: string;
}

export function DailyValueChart({ points, unit = '' }: DailyValueChartProps) {
  if (points.length === 0) return null;
  const max = Math.max(1, ...points.map((p) => p.value));
  const W = 320;
  const H = 160;
  const padL = 26;
  const padR = 8;
  const padT = 8;
  const padB = 20;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const barW = (plotW / points.length) * 0.6;
  const labelStep = Math.max(1, Math.ceil(points.length / 6));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
      {[0, 0.5, 1].map((f, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={padT + plotH * (1 - f)} y2={padT + plotH * (1 - f)} stroke="var(--color-border-subtle)" strokeWidth="1" opacity="0.5" />
          <text x={padL - 4} y={padT + plotH * (1 - f) + 3} textAnchor="end" style={{ font: '8px var(--font-body)', fill: 'var(--color-text-tertiary)' }}>
            {Math.round(max * f)}
            {unit}
          </text>
        </g>
      ))}
      {points.map((p, i) => {
        const bx = padL + (i + 0.2) * (plotW / points.length);
        const bh = (p.value / max) * plotH;
        return <rect key={i} x={bx} y={padT + plotH - bh} width={barW} height={bh} rx="3" fill={p.value > 0 ? 'var(--color-brand)' : 'var(--sand-200)'} />;
      })}
      {points.map((p, i) =>
        i % labelStep === 0 ? (
          <text key={i} x={padL + (i + 0.5) * (plotW / points.length)} y={H - 4} textAnchor="middle" style={{ font: '8px var(--font-body)', fill: 'var(--color-text-tertiary)' }}>
            {p.date}
          </text>
        ) : null,
      )}
    </svg>
  );
}
