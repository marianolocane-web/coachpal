import React from 'react';

export function IconButton({ icon, size = 'md', variant = 'secondary', label, onClick }) {
  const dims = { sm: 32, md: 40, lg: 48 }[size] || 40;
  const variants = {
    secondary: { background: 'var(--color-bg-surface-2)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-default)' },
    ghost: { background: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid transparent' },
    brand: { background: 'var(--color-brand-subtle)', color: 'var(--color-brand)', border: '1px solid transparent' },
  };
  const v = variants[variant] || variants.secondary;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        width: dims,
        height: dims,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform var(--duration-fast) var(--ease-standard)',
        ...v,
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.9)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {icon}
    </button>
  );
}
