import React from 'react';

export function Input({ label, placeholder, value, onChange, error, icon, type = 'text' }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)' }}>
      {label && (
        <span style={{ font: 'var(--text-label-md)', color: 'var(--color-text-secondary)' }}>{label}</span>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--color-bg-surface)',
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border-default)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
        }}
      >
        {icon}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            font: 'var(--text-body-md)',
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-primary)',
            width: '100%',
          }}
        />
      </div>
      {error && <span style={{ font: 'var(--text-caption)', color: 'var(--color-danger)' }}>{error}</span>}
    </label>
  );
}
