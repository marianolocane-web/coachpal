import React from 'react';
export interface CardProps {
  children?: React.ReactNode;
  padding?: string;
  onClick?: () => void;
  selected?: boolean;
}
export declare function Card(props: CardProps): JSX.Element;
