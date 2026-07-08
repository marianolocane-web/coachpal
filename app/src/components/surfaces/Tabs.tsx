export interface TabItem {
  value: string;
  label: string;
}

export interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
}

export function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div style={{ display: 'flex', gap: 4, background: 'var(--color-bg-surface-2)', padding: 4, borderRadius: 'var(--radius-pill)' }}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            style={{
              flex: 1,
              padding: '8px 14px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              font: 'var(--text-label-md)',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              background: active ? 'var(--color-bg-surface)' : 'transparent',
              color: active ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
              boxShadow: active ? 'var(--shadow-xs)' : 'none',
              transition: 'all var(--duration-fast) var(--ease-standard)',
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
