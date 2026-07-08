import React from 'react';

const sizeStyles = {
  md: { padding: '10px 18px', font: 'var(--text-body-md)', gap: 8 },
  sm: { padding: '7px 14px', font: 'var(--text-body-sm)', gap: 6 },
  lg: { padding: '14px 22px', font: 'var(--text-title-sm)', gap: 8 },
};

const variantStyles = {
  primary: {
    background: 'var(--color-brand)',
    color: 'var(--color-text-on-brand)',
    border: '1px solid transparent',
  },
  accent: {
    background: 'var(--color-accent)',
    color: 'var(--sand-900)',
    border: '1px solid transparent',
  },
  secondary: {
    background: 'var(--color-bg-surface-2)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border-default)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-brand)',
    border: '1px solid transparent',
  },
  danger: {
    background: 'var(--color-danger-subtle)',
    color: 'var(--color-danger)',
    border: '1px solid transparent',
  },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon = null,
  fullWidth = false,
  onClick,
  type = 'button',
}) {
  const v = variantStyles[variant] || variantStyles.primary;
  const s = sizeStyles[size] || sizeStyles.md;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        padding: s.padding,
        font: s.font,
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        borderRadius: 'var(--radius-pill)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.45 : 1,
        transition: 'transform var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard)',
        ...v,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {icon}
      {children}
    </button>
  );
}
