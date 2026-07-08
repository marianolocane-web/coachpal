import React from 'react';
export interface DayMoodRingProps {
  label: string;
  /** Emoji reflecting the user's mood that day, or omitted/"✕" if not logged */
  emoji?: string;
  /** 0 to 1 — share of daily habits completed; colors the ring green/amber/red */
  progress?: number;
  /** Highlights the label in red (e.g. today) */
  alert?: boolean;
  onClick?: () => void;
  size?: number;
}
export declare function DayMoodRing(props: DayMoodRingProps): JSX.Element;
