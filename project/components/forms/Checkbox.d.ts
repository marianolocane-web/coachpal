import React from 'react';
export interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
