import React from 'react';
export interface TooltipProps {
  children: React.ReactNode;
  label: React.ReactNode;
  side?: 'top' | 'bottom';
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
