import { useEffect } from 'react';
import type { CSSProperties } from 'react';

export interface ToastProps {
  message: string;
  variant?: 'success' | 'info' | 'danger';
  onDismiss?: () => void;
  autoHideMs?: number;
}

const variants: Record<string, CSSProperties> = {
  success: { background: 'var(--green-600)', color: 'white' },
  info: { background: 'var(--sand-800)', color: 'white' },
  danger: { background: 'var(--coral-600)', color: 'white' },
};

export function Toast({ message, variant = 'success', onDismiss, autoHideMs = 3000 }: ToastProps) {
  useEffect(() => {
    if (!autoHideMs) return;
    const t = setTimeout(() => onDismiss?.(), autoHideMs);
    return () => clearTimeout(t);
  }, [autoHideMs, onDismiss]);

  const v = variants[variant] || variants.success;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        font: 'var(--text-body-sm)',
        fontFamily: 'var(--font-body)',
        ...v,
      }}
    >
      {message}
    </div>
  );
}
