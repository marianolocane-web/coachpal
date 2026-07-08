import React from 'react';
import { IdentityVoteBar } from './IdentityVoteBar';
import { HabitCheckButton } from './HabitCheckButton';

export function HabitCard({ habit, onToggle, onComment, onOpen, readOnly = false }) {
  const { name, streak, goalLabel, goalValue, unit, goalDate, time, identity, done, overdue, missed, comment } = habit;
  const isMissed = missed && !done;

  return (
    <div style={{
      background: isMissed ? 'var(--color-danger-subtle)' : 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      border: isMissed ? '1px solid var(--coral-100)' : '1px solid transparent',
      padding: 'var(--space-4)',
      display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
            <button
              onClick={onOpen}
              style={{
                border: 'none', background: 'none', cursor: 'pointer', padding: 0, textAlign: 'left',
                font: 'var(--text-title-sm)', fontFamily: 'var(--font-body)',
                color: isMissed ? 'var(--coral-700)' : (overdue && !done ? 'var(--color-danger)' : 'var(--color-text-primary)'),
                textDecoration: done ? 'line-through' : 'none',
              }}
            >
              {name}
            </button>
            {streak > 0 && <span style={{ font: 'var(--text-label-sm)', color: 'var(--amber-600)' }}>+{streak}</span>}
            {goalLabel && (
              <span style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)' }}>
                · {goalLabel} {goalValue}{unit ? ` ${unit}` : ''} {goalDate ? `al ${goalDate}` : ''}
              </span>
            )}
            {isMissed && (
              <span style={{
                font: 'var(--text-label-sm)', color: 'var(--coral-700)', background: 'var(--coral-100)',
                padding: '1px 8px', borderRadius: 'var(--radius-pill)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)',
              }}>
                No completado
              </span>
            )}
          </div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>{time}</div>
        </div>
        <HabitCheckButton done={!!done} onClick={() => onToggle?.(habit)} size={36} />
      </div>

      {identity && <IdentityVoteBar negativeEmoji={identity.negativeEmoji} positiveEmoji={identity.positiveEmoji} votes={identity.votes} />}

      {readOnly ? (
        comment && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, font: 'var(--text-caption)', color: 'var(--color-text-secondary)' }}>
            <span>💬</span>
            <span>{comment}</span>
          </div>
        )
      ) : (
        <button
          onClick={() => onComment?.(habit)}
          style={{
            alignSelf: 'flex-start', border: 'none', background: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4, padding: 0,
            font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)',
          }}
        >
          💬 Comentar
        </button>
      )}
    </div>
  );
}
