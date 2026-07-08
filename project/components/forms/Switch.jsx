import React from 'react';

export function Switch({ checked, onChange, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
      {label && <span style={{ font: 'var(--text-body-md)', color: 'var(--color-text-primary)' }}>{label}</span>}
      <span
        onClick={() => onChange?.(!checked)}
        style={{
          width: 44, height: 26, borderRadius: 'var(--radius-pill)',
          background: checked ? 'var(--color-brand)' : 'var(--sand-300)',
          position: 'relative', flexShrink: 0,
          transition: 'background var(--duration-base) var(--ease-standard)',
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3,
          width: 20, height: 20, borderRadius: '50%', background: 'white',
          boxShadow: 'var(--shadow-xs)',
          transition: 'left var(--duration-base) var(--ease-standard)',
        }} />
      </span>
    </label>
  );
}
