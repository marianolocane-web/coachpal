export interface WeeklyAverageChartProps {
  data: number[];
}

export function WeeklyAverageChart({ data }: WeeklyAverageChartProps) {
  if (data.length === 0) return null;
  const W = 320;
  const H = 130;
  const padL = 12;
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
      <line x1={padL} x2={W - padR} y1={y(0)} y2={y(0)} stroke="var(--color-border-subtle)" strokeWidth="1" />
      <path d={dPath} fill="none" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="var(--color-brand)" />
      ))}
      {data.map((_, i) => (
        <text key={i} x={x(i)} y={H - 4} textAnchor="middle" style={{ font: '8px var(--font-body)', fill: 'var(--color-text-tertiary)' }}>
          S{i + 1}
        </text>
      ))}
    </svg>
  );
}
