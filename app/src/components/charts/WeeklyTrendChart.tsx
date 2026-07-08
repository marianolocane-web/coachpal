export interface WeeklyTrendChartProps {
  data: number[];
}

export function WeeklyTrendChart({ data }: WeeklyTrendChartProps) {
  if (data.length === 0) return null;
  const W = 320;
  const H = 140;
  const padL = 30;
  const padR = 12;
  const padT = 12;
  const padB = 20;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const x = (i: number) => padL + (data.length > 1 ? (i / (data.length - 1)) * plotW : plotW / 2);
  const y = (v: number) => padT + plotH - v * plotH;
  const dPath = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
      {[0, 0.5, 1].map((f, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={y(f)} y2={y(f)} stroke="var(--color-border-subtle)" strokeWidth="1" opacity="0.5" />
          <text x={padL - 4} y={y(f) + 3} textAnchor="end" style={{ font: '8px var(--font-body)', fill: 'var(--color-text-tertiary)' }}>
            {Math.round(f * 100)}%
          </text>
        </g>
      ))}
      <path d={dPath} fill="none" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="var(--color-brand)">
          <title>{`Semana ${i + 1}: ${Math.round(v * 100)}%`}</title>
        </circle>
      ))}
      {data.map((_, i) => (
        <text key={i} x={x(i)} y={H - 4} textAnchor="middle" style={{ font: '8px var(--font-body)', fill: 'var(--color-text-tertiary)' }}>
          S{i + 1}
        </text>
      ))}
    </svg>
  );
}
