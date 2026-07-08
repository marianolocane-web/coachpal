export interface IdentityVoteBarProps {
  negativeEmoji?: string;
  positiveEmoji?: string;
  votes?: number;
}

export function IdentityVoteBar({ negativeEmoji, positiveEmoji, votes = 0 }: IdentityVoteBarProps) {
  const color = votes > 0 ? 'var(--color-success)' : votes < 0 ? 'var(--color-danger)' : 'var(--color-text-secondary)';
  const clamped = Math.max(-10, Math.min(10, votes));
  const pct = ((clamped + 10) / 20) * 100;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)' }}>
      <span style={{ fontSize: 16 }}>{negativeEmoji}</span>
      <div
        style={{
          position: 'relative',
          flex: 1,
          height: 6,
          borderRadius: 'var(--radius-pill)',
          background: 'linear-gradient(90deg, var(--coral-300), var(--sand-200) 50%, var(--green-300))',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${pct}%`,
            transform: 'translate(-50%, -50%)',
            minWidth: 26,
            height: 20,
            padding: '0 6px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--color-bg-surface)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: 'var(--text-label-sm)',
            color,
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          {votes > 0 ? `+${votes}` : votes}
        </div>
      </div>
      <span style={{ fontSize: 16 }}>{positiveEmoji}</span>
    </div>
  );
}
