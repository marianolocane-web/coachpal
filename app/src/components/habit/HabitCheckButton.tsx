export interface HabitCheckButtonProps {
  done?: boolean;
  onClick?: () => void;
  size?: number;
}

export function HabitCheckButton({ done, onClick, size = 40 }: HabitCheckButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={done}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: done ? 'none' : '2px solid var(--color-border-strong)',
        background: done ? 'var(--color-brand)' : 'transparent',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'transform var(--duration-fast) var(--ease-out-back), background var(--duration-base) var(--ease-standard)',
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.88)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1.06)';
        setTimeout(() => {
          e.currentTarget.style.transform = 'scale(1)';
        }, 120);
      }}
    >
      {done && (
        <svg width="18" height="14" viewBox="0 0 13 10" fill="none">
          <path d="M1 5L4.5 8.5L12 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
