import React from 'react';
export interface Habit {
  id?: string;
  name: string;
  time?: string;
  streak?: number;
  done?: boolean;
  color?: string;
}
export interface HabitRowProps {
  habit: Habit;
  onToggle?: (habit: Habit) => void;
}
export declare function HabitRow(props: HabitRowProps): JSX.Element;
