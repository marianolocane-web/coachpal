import React from 'react';

export function StreakBadge({ days = 0, size = 'md' }) {
  const sizes = {
    sm: { font: 'var(--text-label-md)', pad: '4px 10px' },
    md: { font: 'var(--text-title-sm)', pad: '6px 14px' },
    lg: { font: 'var(--text-display-sm)', pad: '10px 18px' },
  };
  const s = sizes[size] || sizes.md;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: s.pad,
        borderRadius: 'var(--radius-pill)',
        background: 'var(--color-accent-subtle)',
        color: 'var(--amber-700)',
        font: s.font,
        fontFamily: 'var(--font-display)',
      }}
    >
      🔥 {days}
    </span>
  );
}
