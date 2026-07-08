import { HabitCheckButton } from './HabitCheckButton';

export interface HabitRowData {
  name: string;
  time?: string;
  streak?: number;
  done?: boolean;
  color?: string;
}

export interface HabitRowProps {
  habit: HabitRowData;
  onToggle?: (habit: HabitRowData) => void;
}

export function HabitRow({ habit, onToggle }: HabitRowProps) {
  const { name, time, streak, done, color } = habit;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-2) 0' }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          background: color || 'var(--color-brand-subtle)',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: 'var(--text-title-sm)', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name}
        </div>
        <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
          {time} {streak ? `· 🔥 ${streak} días` : ''}
        </div>
      </div>
      <HabitCheckButton done={done} onClick={() => onToggle?.(habit)} />
    </div>
  );
}
