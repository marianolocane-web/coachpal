import type { CSSProperties, ReactNode } from 'react';

export interface BadgeProps {
  children?: ReactNode;
  variant?: 'neutral' | 'brand' | 'accent' | 'danger';
  icon?: ReactNode;
}

const variants: Record<string, CSSProperties> = {
  neutral: { background: 'var(--color-bg-surface-2)', color: 'var(--color-text-secondary)' },
  brand: { background: 'var(--color-brand-subtle)', color: 'var(--green-700)' },
  accent: { background: 'var(--color-accent-subtle)', color: 'var(--amber-700)' },
  danger: { background: 'var(--color-danger-subtle)', color: 'var(--coral-700)' },
};

export function Badge({ children, variant = 'neutral', icon = null }: BadgeProps) {
  const v = variants[variant] || variants.neutral;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 10px',
        borderRadius: 'var(--radius-pill)',
        font: 'var(--text-label-sm)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-body)',
        ...v,
      }}
    >
      {icon}
      {children}
    </span>
  );
}
