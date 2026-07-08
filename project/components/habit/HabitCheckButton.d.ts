import React from 'react';
export interface HabitCheckButtonProps {
  done: boolean;
  onClick?: () => void;
  size?: number;
}
export declare function HabitCheckButton(props: HabitCheckButtonProps): JSX.Element;
