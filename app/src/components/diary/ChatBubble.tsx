import { Play } from 'lucide-react';
import type { DiaryMessage } from '../../lib/data/types';

export function ChatBubble({ msg }: { msg: Pick<DiaryMessage, 'role' | 'contentType' | 'textContent'> }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      {!isUser && (
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'var(--color-brand)',
            color: 'var(--color-text-on-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: 'var(--text-label-sm)',
            marginRight: 8,
            flexShrink: 0,
          }}
        >
          IA
        </div>
      )}
      <div
        style={{
          maxWidth: '75%',
          padding: '10px 14px',
          borderRadius: 'var(--radius-lg)',
          borderBottomRightRadius: isUser ? 4 : 'var(--radius-lg)',
          borderBottomLeftRadius: isUser ? 'var(--radius-lg)' : 4,
          background: isUser ? 'var(--color-brand)' : 'var(--color-bg-surface-2)',
          color: isUser ? 'var(--color-text-on-brand)' : 'var(--color-text-primary)',
          font: 'var(--text-body-md)',
        }}
      >
        {msg.contentType === 'audio' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Play size={14} />
            <span>{msg.textContent}</span>
          </div>
        ) : (
          msg.textContent
        )}
      </div>
    </div>
  );
}
