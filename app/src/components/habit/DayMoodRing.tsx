import { progressColorToken } from '../../lib/data/stats';

export interface DayMoodRingProps {
  label: string;
  emoji?: string | null;
  progress?: number;
  alert?: boolean;
  onClick?: () => void;
  size?: number;
}

export function DayMoodRing({ label, emoji, progress = 0, alert = false, onClick, size = 64 }: DayMoodRingProps) {
  const r = (size - 6) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.min(Math.max(progress, 0), 1));
  const color = progressColorToken(progress);
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        background: 'none',
        border: 'none',
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: 'var(--font-body)',
      }}
    >
      <span style={{ font: 'var(--text-label-sm)', color: alert ? 'var(--color-danger)' : 'var(--color-text-tertiary)' }}>{label}</span>
      <span style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--sand-200)" strokeWidth={5} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={5}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span style={{ position: 'absolute', fontSize: size * 0.44 }}>{emoji || '✕'}</span>
      </span>
    </button>
  );
}
