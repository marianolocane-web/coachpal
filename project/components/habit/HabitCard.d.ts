import React from 'react';
export interface HabitCardIdentity {
  negativeEmoji: string;
  positiveEmoji: string;
  votes: number;
}
export interface HabitCardData {
  name: string;
  streak?: number;
  goalLabel?: string;
  goalValue?: string;
  goalDate?: string;
  time?: string;
  identity?: HabitCardIdentity;
  done?: boolean;
  /** Same day, hour already passed and not yet answered — highlights the name in red */
  overdue?: boolean;
  /** The day is closed (past) and this habit was never completed — tints the whole card coral */
  missed?: boolean;
  /** Existing comment text for this habit on this day — only shown (never editable) when readOnly */
  comment?: string;
}
export interface HabitCardProps {
  habit: HabitCardData;
  onToggle?: (habit: HabitCardData) => void;
  onComment?: (habit: HabitCardData) => void;
  onOpen?: () => void;
  /** Past/closed day: hides the "Comentar" action and shows the existing comment as read-only text instead */
  readOnly?: boolean;
}
export declare function HabitCard(props: HabitCardProps): JSX.Element;
