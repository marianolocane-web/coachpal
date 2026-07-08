import { Home, PieChart, CircleUser } from 'lucide-react';

export type TabKey = 'home' | 'stats' | 'profile';

export interface TabBarProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const items: { key: TabKey; label: string; Icon: typeof Home }[] = [
  { key: 'home', label: 'Hoy', Icon: Home },
  { key: 'stats', label: 'Progreso', Icon: PieChart },
  { key: 'profile', label: 'Perfil', Icon: CircleUser },
];

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--tabbar-height)',
        display: 'flex',
        background: 'rgba(253,251,247,0.85)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--color-border-subtle)',
        zIndex: 40,
      }}
    >
      {items.map(({ key, label, Icon }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              flex: 1,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              color: isActive ? 'var(--color-brand)' : 'var(--color-text-tertiary)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <Icon size={20} strokeWidth={2} fill={isActive ? 'currentColor' : 'none'} fillOpacity={isActive ? 0.15 : 0} />
            <span style={{ font: 'var(--text-label-sm)' }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
