import { Send } from 'lucide-react';
import type { DiaryEntry } from '../../lib/data/types';
import { formatDDMM, parseIsoDate } from '../../lib/data/dateUtils';
import { Badge } from '../feedback/Badge';

export function DiaryEntryCard({ entry, onClick }: { entry: DiaryEntry; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: 'left',
        background: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--space-4)',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        <div style={{ font: 'var(--text-title-sm)', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {entry.title || 'Entrada sin título'}
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--color-brand-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          {entry.moodEmoji || '📝'}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--text-caption)', color: 'var(--color-text-tertiary)' }}>
        <span>{formatDDMM(parseIsoDate(entry.entryDate))}</span>
        {entry.source === 'telegram' && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <Send size={11} /> vía Telegram
          </span>
        )}
      </div>
      {entry.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {entry.tags.map((t) => (
            <Badge key={t} variant="brand">
              {t}
            </Badge>
          ))}
        </div>
      )}
    </button>
  );
}
