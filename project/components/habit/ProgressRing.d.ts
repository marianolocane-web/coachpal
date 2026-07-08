import React from 'react';
export interface ProgressRingProps {
  /** 0 to 1 */
  progress?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}
export declare function ProgressRing(props: ProgressRingProps): JSX.Element;
