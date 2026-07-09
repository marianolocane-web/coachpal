function TabBar({ active, onChange }) {
  const items = [
    { key: 'home', label: 'Hoy', icon: '⌂' },
    { key: 'stats', label: 'Progreso', icon: '◔' },
    { key: 'diary', label: 'Diario', icon: '▤' },
    { key: 'profile', label: 'Perfil', icon: '○' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 'var(--tabbar-height)',
      display: 'flex', background: 'rgba(253,251,247,0.85)', backdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--color-border-subtle)',
    }}>
      {items.map((it) => {
        const isActive = it.key === active;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            style={{
              flex: 1, border: 'none', background: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              color: isActive ? 'var(--color-brand)' : 'var(--color-text-tertiary)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <span style={{ fontSize: 20 }}>{it.icon}</span>
            <span style={{ font: 'var(--text-label-sm)' }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
