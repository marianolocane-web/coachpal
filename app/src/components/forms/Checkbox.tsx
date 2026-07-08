export interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
      <span
        onClick={() => onChange?.(!checked)}
        style={{
          width: 22,
          height: 22,
          borderRadius: 7,
          border: `1.5px solid ${checked ? 'var(--color-brand)' : 'var(--color-border-strong)'}`,
          background: checked ? 'var(--color-brand)' : 'transparent',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all var(--duration-fast) var(--ease-standard)',
          flexShrink: 0,
        }}
      >
        {checked && (
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
            <path d="M1 5L4.5 8.5L12 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label && <span style={{ font: 'var(--text-body-md)', color: 'var(--color-text-primary)' }}>{label}</span>}
    </label>
  );
}
