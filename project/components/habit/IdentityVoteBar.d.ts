import React from 'react';
export interface IdentityVoteBarProps {
  /** Emoji for the identity you don't want to become (left) */
  negativeEmoji: string;
  /** Emoji for the identity you want to become (right) */
  positiveEmoji: string;
  /** Running vote count: positive (green), 0 (neutral), negative (red) */
  votes?: number;
}
export declare function IdentityVoteBar(props: IdentityVoteBarProps): JSX.Element;
