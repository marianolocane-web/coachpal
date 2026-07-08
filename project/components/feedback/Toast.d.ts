import React from 'react';
export interface ToastProps {
  message: React.ReactNode;
  variant?: 'success' | 'info' | 'danger';
  onDismiss?: () => void;
  autoHideMs?: number;
}
export declare function Toast(props: ToastProps): JSX.Element;
