import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export interface TooltipProps {
  children: ReactNode;
  label: string;
  side?: 'top' | 'bottom';
}

export function Tooltip({ children, label, side = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false);
  const posStyles: Record<string, CSSProperties> = {
    top: { bottom: '120%', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top: '120%', left: '50%', transform: 'translateX(-50%)' },
  };
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          style={{
            position: 'absolute',
            ...posStyles[side],
            background: 'var(--sand-900)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            font: 'var(--text-caption)',
            fontFamily: 'var(--font-body)',
            whiteSpace: 'nowrap',
            boxShadow: 'var(--shadow-sm)',
            zIndex: 20,
          }}
        >
          {label}
        </span>
      )}
    </span>
  );
}
