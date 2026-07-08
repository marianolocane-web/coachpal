import React from 'react';
export interface IconButtonProps {
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'secondary' | 'ghost' | 'brand';
  label: string;
  onClick?: () => void;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
