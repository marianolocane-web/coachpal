import React from 'react';
export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'neutral' | 'brand' | 'accent' | 'danger';
  icon?: React.ReactNode;
}
export declare function Badge(props: BadgeProps): JSX.Element;
