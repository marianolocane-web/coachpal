import React, { useState } from 'react';

export function Select({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value) || options[0];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)', position: 'relative' }}>
      {label && <span style={{ font: 'var(--text-label-md)', color: 'var(--color-text-secondary)' }}>{label}</span>}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          font: 'var(--text-body-md)',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
        }}
      >
        {current?.label}
        <span style={{ color: 'var(--color-text-tertiary)' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
          background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', overflow: 'hidden', zIndex: 10,
        }}>
          {options.map((o) => (
            <div
              key={o.value}
              onClick={() => { onChange?.(o.value); setOpen(false); }}
              style={{
                padding: '10px 14px', font: 'var(--text-body-md)', cursor: 'pointer',
                background: o.value === value ? 'var(--color-brand-subtle)' : 'transparent',
                color: o.value === value ? 'var(--color-brand)' : 'var(--color-text-primary)',
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
