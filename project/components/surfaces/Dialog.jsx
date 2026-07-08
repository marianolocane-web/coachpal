import React from 'react';

export function Dialog({ open, title, children, onClose, actions }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'absolute', inset: 0, background: 'rgba(36,31,25,0.4)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          padding: 'var(--space-6)',
          width: '100%',
          maxWidth: 'var(--mobile-max-width)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--sand-300)', margin: '0 auto var(--space-5)' }} />
        {title && <div style={{ font: 'var(--text-title-lg)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>{title}</div>}
        <div style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)' }}>{children}</div>
        {actions && <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>{actions}</div>}
      </div>
    </div>
  );
}
