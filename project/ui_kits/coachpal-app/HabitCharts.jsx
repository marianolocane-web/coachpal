// Chart components for HabitDetailScreen. Plain React, inline SVG, no external libs.

function computeStreakSeries(daily) {
  let streak = 0;
  return daily.map((v) => {
    if (v === 1) {
      streak = streak < 0 ? 1 : streak + 1;
    } else {
      streak = streak > 0 ? 0 : streak - 1;
    }
    return streak;
  });
}

function seededDaily(seed, n, offset = 0) {
  return Array.from({ length: n }, (_, i) => {
    let h = (seed * 2654435761 + (i + offset) * 40503) >>> 0;
    h = (h ^ (h >>> 15)) >>> 0;
    return (h % 100) < (30 + (seed * 17) % 55) ? 1 : 0;
  });
}

function EverestChart({ habitId, goal = 21, rangeDays = 14 }) {
  const { useState, useRef, useEffect } = React;
  const [hover, setHover] = useState(null);
  const [drawn, setDrawn] = useState(false);
  const pathRef = useRef(null);

  const daily = seededDaily(habitId, rangeDays);
  const series = computeStreakSeries(daily);

  const W = 320, H = 200, padL = 28, padR = 12, padT = 28, padB = 24;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const yMin = Math.min(-3, Math.min(...series) - 1);
  const yMax = Math.max(goal + 1, Math.max(...series) + 1);
  const x = (i) => padL + (i / (series.length - 1)) * plotW;
  const y = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 60);
    return () => clearTimeout(t);
  }, []);

  const pathLen = plotW * 1.4; // approximation, good enough for a stroke reveal

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-primary)', textAlign: 'center', marginBottom: 8 }}>
        Escalando el Everest de tu Hábito
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', overflow: 'visible' }}>
        {/* grid */}
        {Array.from({ length: 5 }, (_, i) => yMin + (i * (yMax - yMin)) / 4).map((gv, i) => (
          <line key={i} x1={padL} x2={W - padR} y1={y(gv)} y2={y(gv)} stroke="var(--color-border-subtle)" strokeWidth="1" opacity="0.5" />
        ))}
        {/* baseline y=0 */}
        <line x1={padL} x2={W - padR} y1={y(0)} y2={y(0)} stroke="var(--color-text-tertiary)" strokeWidth="1" opacity="0.6" />

        {/* goal line */}
        <line x1={padL} x2={W - padR} y1={y(goal)} y2={y(goal)} stroke="var(--amber-600)" strokeWidth="1.5" strokeDasharray="4 3" />
        <circle cx={W - padR} cy={y(goal)} r="3.5" fill="var(--amber-600)" />
        <text x={W - padR - 4} y={y(goal) - 6} textAnchor="end" style={{ font: '9px var(--font-body)', fill: 'var(--amber-600)' }}>
          Meta: {goal} días
        </text>

        {/* series line, segment colored by arrival day value */}
        {series.map((v, i) => {
          if (i === 0) return null;
          const color = daily[i] === 1 ? 'var(--color-success)' : 'var(--color-danger)';
          return (
            <line
              key={i}
              x1={x(i - 1)} y1={y(series[i - 1])} x2={x(i)} y2={y(v)}
              stroke={color} strokeWidth="2.5" strokeLinecap="round"
              style={{
                strokeDasharray: pathLen, strokeDashoffset: drawn ? 0 : pathLen,
                transition: `stroke-dashoffset 1.1s ease ${i * 0.01}s`,
              }}
            />
          );
        })}
        {series.map((v, i) => (
          <circle
            key={i} cx={x(i)} cy={y(v)} r={hover === i ? 5 : 3.5}
            fill={daily[i] === 1 ? 'var(--color-success)' : 'var(--color-danger)'}
            stroke="var(--color-bg-surface)" strokeWidth="1"
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            style={{ cursor: 'pointer' }}
          >
            <title>{`Día ${i + 1} — Progreso: ${v} · ${daily[i] === 1 ? 'Cumplido' : 'No cumplido'}`}</title>
          </circle>
        ))}

        {/* x ticks every 2 days */}
        {series.map((_, i) => (i % 2 === 0 ? (
          <text key={i} x={x(i)} y={H - 4} textAnchor="middle" style={{ font: '8px var(--font-body)', fill: 'var(--color-text-tertiary)' }}>{i + 1}</text>
        ) : null))}
      </svg>
    </div>
  );
}

function ThermometerChart({ current = 0, goal = 1, unit = '' }) {
  const pct = goal > 0 ? Math.max(0, Math.min(1, current / goal)) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', fontFamily: 'var(--font-body)' }}>
      <div style={{ width: 36, height: 140, borderRadius: 'var(--radius-pill)', background: 'var(--sand-200)', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: `${pct * 100}%`,
          background: pct >= 1 ? 'var(--color-success)' : 'var(--color-brand)',
          transition: 'height var(--duration-slow) var(--ease-standard)',
        }} />
      </div>
      <div>
        <div style={{ font: 'var(--text-title-md)', color: 'var(--color-text-primary)' }}>{current}{unit} <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>/ {goal}{unit}</span></div>
        <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>{Math.round(pct * 100)}% de tu meta diaria</div>
      </div>
    </div>
  );
}

function DailyValueChart({ habitId, rangeDays = 7, unit = '' }) {
  const raw = seededDaily(habitId, rangeDays).map((v, i) => v * (1 + ((habitId + i) % 4)));
  const max = Math.max(1, ...raw);
  const W = 320, H = 160, padL = 26, padR = 8, padT = 8, padB = 20;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const barW = plotW / raw.length * 0.6;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
      {[0, 0.5, 1].map((f, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={padT + plotH * (1 - f)} y2={padT + plotH * (1 - f)} stroke="var(--color-border-subtle)" strokeWidth="1" opacity="0.5" />
          <text x={padL - 4} y={padT + plotH * (1 - f) + 3} textAnchor="end" style={{ font: '8px var(--font-body)', fill: 'var(--color-text-tertiary)' }}>{Math.round(max * f)}{unit}</text>
        </g>
      ))}
      {raw.map((v, i) => {
        const bx = padL + (i + 0.2) * (plotW / raw.length);
        const bh = (v / max) * plotH;
        return (
          <rect key={i} x={bx} y={padT + plotH - bh} width={barW} height={bh} rx="3"
            fill={v > 0 ? 'var(--color-brand)' : 'var(--sand-200)'} />
        );
      })}
      {raw.map((_, i) => ((i % Math.ceil(raw.length / 6) === 0) ? (
        <text key={i} x={padL + (i + 0.5) * (plotW / raw.length)} y={H - 4} textAnchor="middle" style={{ font: '8px var(--font-body)', fill: 'var(--color-text-tertiary)' }}>{i + 1}</text>
      ) : null))}
    </svg>
  );
}

function WeeklyTrendChart({ data }) {
  const W = 320, H = 140, padL = 30, padR = 12, padT = 12, padB = 20;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const x = (i) => padL + (data.length > 1 ? (i / (data.length - 1)) * plotW : plotW / 2);
  const y = (v) => padT + plotH - v * plotH;
  const dPath = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
      {[0, 0.5, 1].map((f, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={y(f)} y2={y(f)} stroke="var(--color-border-subtle)" strokeWidth="1" opacity="0.5" />
          <text x={padL - 4} y={y(f) + 3} textAnchor="end" style={{ font: '8px var(--font-body)', fill: 'var(--color-text-tertiary)' }}>{Math.round(f * 100)}%</text>
        </g>
      ))}
      <path d={dPath} fill="none" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="var(--color-brand)">
          <title>{`Semana ${i + 1}: ${Math.round(v * 100)}%`}</title>
        </circle>
      ))}
      {data.map((_, i) => (
        <text key={i} x={x(i)} y={H - 4} textAnchor="middle" style={{ font: '8px var(--font-body)', fill: 'var(--color-text-tertiary)' }}>S{i + 1}</text>
      ))}
    </svg>
  );
}

function WeeklyAverageChart({ habitId, points = 6 }) {
  const weeklyAvg = Array.from({ length: points }, (_, i) => {
    const week = seededDaily(habitId, 7, i * 7);
    return week.reduce((a, b) => a + b, 0) / 7;
  });
  const W = 320, H = 130, padL = 12, padR = 12, padT = 12, padB = 20;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const x = (i) => padL + (i / (weeklyAvg.length - 1)) * plotW;
  const y = (v) => padT + plotH - v * plotH;
  const dPath = weeklyAvg.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
      <line x1={padL} x2={W - padR} y1={y(0)} y2={y(0)} stroke="var(--color-border-subtle)" strokeWidth="1" />
      <path d={dPath} fill="none" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {weeklyAvg.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="var(--color-brand)" />
      ))}
      {weeklyAvg.map((_, i) => (
        <text key={i} x={x(i)} y={H - 4} textAnchor="middle" style={{ font: '8px var(--font-body)', fill: 'var(--color-text-tertiary)' }}>S{i + 1}</text>
      ))}
    </svg>
  );
}
