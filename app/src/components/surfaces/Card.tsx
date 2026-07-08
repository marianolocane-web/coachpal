import type { ReactNode } from 'react';

export interface CardProps {
  children?: ReactNode;
  padding?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function Card({ children, padding = 'var(--space-5)', onClick, selected = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        border: selected ? '1.5px solid var(--color-brand)' : '1px solid transparent',
        padding,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow var(--duration-base) var(--ease-standard)',
      }}
    >
      {children}
    </div>
  );
}
