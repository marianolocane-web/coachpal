import { useEffect, useState } from 'react';

export interface EverestPoint {
  date: string;
  done: boolean;
}

export interface EverestChartProps {
  series: EverestPoint[];
  goalDays: number;
}

/** Cumulative streak walk: climbs on done days, falls (and can go negative) on missed days. */
function computeStreakSeries(daily: boolean[]): number[] {
  let streak = 0;
  return daily.map((v) => {
    if (v) {
      streak = streak < 0 ? 1 : streak + 1;
    } else {
      streak = streak > 0 ? 0 : streak - 1;
    }
    return streak;
  });
}

export function EverestChart({ series, goalDays }: EverestChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(false);

  const daily = series.map((p) => p.done);
  const values = computeStreakSeries(daily);
  const goal = goalDays || 21;

  const W = 320;
  const H = 200;
  const padL = 28;
  const padR = 12;
  const padT = 28;
  const padB = 24;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const yMin = Math.min(-3, Math.min(...values, 0) - 1);
  const yMax = Math.max(goal + 1, Math.max(...values, 0) + 1);
  const x = (i: number) => padL + (values.length > 1 ? (i / (values.length - 1)) * plotW : plotW / 2);
  const y = (v: number) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 60);
    return () => clearTimeout(t);
  }, []);

  const pathLen = plotW * 1.4;

  if (values.length === 0) return null;

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-primary)', textAlign: 'center', marginBottom: 8 }}>
        Escalando el Everest de tu Hábito
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', overflow: 'visible' }}>
        {Array.from({ length: 5 }, (_, i) => yMin + (i * (yMax - yMin)) / 4).map((gv, i) => (
          <line key={i} x1={padL} x2={W - padR} y1={y(gv)} y2={y(gv)} stroke="var(--color-border-subtle)" strokeWidth="1" opacity="0.5" />
        ))}
        <line x1={padL} x2={W - padR} y1={y(0)} y2={y(0)} stroke="var(--color-text-tertiary)" strokeWidth="1" opacity="0.6" />

        <line x1={padL} x2={W - padR} y1={y(goal)} y2={y(goal)} stroke="var(--amber-600)" strokeWidth="1.5" strokeDasharray="4 3" />
        <circle cx={W - padR} cy={y(goal)} r="3.5" fill="var(--amber-600)" />
        <text x={W - padR - 4} y={y(goal) - 6} textAnchor="end" style={{ font: '9px var(--font-body)', fill: 'var(--amber-600)' }}>
          Meta: {goal} días
        </text>

        {values.map((v, i) => {
          if (i === 0) return null;
          const color = daily[i] ? 'var(--color-success)' : 'var(--color-danger)';
          return (
            <line
              key={i}
              x1={x(i - 1)}
              y1={y(values[i - 1])}
              x2={x(i)}
              y2={y(v)}
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                strokeDasharray: pathLen,
                strokeDashoffset: drawn ? 0 : pathLen,
                transition: `stroke-dashoffset 1.1s ease ${i * 0.01}s`,
              }}
            />
          );
        })}
        {values.map((v, i) => (
          <circle
            key={i}
            cx={x(i)}
            cy={y(v)}
            r={hover === i ? 5 : 3.5}
            fill={daily[i] ? 'var(--color-success)' : 'var(--color-danger)'}
            stroke="var(--color-bg-surface)"
            strokeWidth="1"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ cursor: 'pointer' }}
          >
            <title>{`${series[i].date} — Progreso: ${v} · ${daily[i] ? 'Cumplido' : 'No cumplido'}`}</title>
          </circle>
        ))}

        {values.map((_, i) =>
          i % 2 === 0 ? (
            <text key={i} x={x(i)} y={H - 4} textAnchor="middle" style={{ font: '8px var(--font-body)', fill: 'var(--color-text-tertiary)' }}>
              {i + 1}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  );
}
