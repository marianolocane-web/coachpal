import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useArchiveDiaryEntry, useDiaryComments, useDiaryEntry, useDiaryMessages, useAddDiaryComment } from '../lib/data/hooks';
import { formatDDMMYYYY, parseIsoDate } from '../lib/data/dateUtils';
import { Button } from '../components/forms/Button';
import { Badge } from '../components/feedback/Badge';
import { IconButton } from '../components/forms/IconButton';
import { AudioMessagePlayer } from '../components/diary/AudioMessagePlayer';
import { ChatBubble } from '../components/diary/ChatBubble';

export function DiaryDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useAuth();
  const { data: entry } = useDiaryEntry(id);
  const { data: messages = [] } = useDiaryMessages(id);
  const { data: comments = [] } = useDiaryComments(id);
  const addComment = useAddDiaryComment(id || '');
  const archiveEntry = useArchiveDiaryEntry();
  const [comment, setComment] = useState('');
  const [showConversation, setShowConversation] = useState(false);

  const audioMessages = useMemo(() => messages.filter((m) => m.contentType === 'audio' && m.audioStoragePath), [messages]);

  if (!entry) return null;

  const onSaveComment = async () => {
    const t = comment.trim();
    if (!t) return;
    await addComment.mutateAsync(t);
    setComment('');
  };

  const onArchive = async () => {
    if (!id) return;
    await archiveEntry.mutateAsync(id);
    navigate('/diario');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <IconButton label="Volver" onClick={() => navigate('/diario')} icon={<ArrowLeft size={18} />} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: 'var(--text-title-md)', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {entry.title || 'Entrada sin título'}
          </div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)' }}>{formatDDMMYYYY(parseIsoDate(entry.entryDate))}</div>
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--color-brand-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {entry.moodEmoji || '📝'}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {(entry.status === 'archived' || entry.source === 'telegram') && (
          <div style={{ display: 'flex', gap: 6 }}>
            {entry.status === 'archived' && <Badge variant="neutral">Archivada</Badge>}
            {entry.source === 'telegram' && (
              <Badge variant="neutral" icon={<Send size={11} />}>
                vía Telegram
              </Badge>
            )}
          </div>
        )}

        {entry.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {entry.tags.map((t) => (
              <Badge key={t} variant="brand">
                {t}
              </Badge>
            ))}
          </div>
        )}

        <div style={{ font: 'var(--text-body-md)', color: 'var(--color-text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {entry.summaryMarkdown}
        </div>

        <div>
          <button
            onClick={() => setShowConversation((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: 0,
              font: 'var(--text-label-md)',
              color: 'var(--color-brand)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {showConversation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showConversation ? 'Ocultar conversación completa' : 'Ver conversación completa'}
          </button>

          {showConversation && (
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {messages.map((m) => (
                <ChatBubble key={m.id} msg={m} />
              ))}
            </div>
          )}
        </div>

        {audioMessages.map((m) => (
          <AudioMessagePlayer key={m.id} storagePath={m.audioStoragePath!} label={m.textContent || 'Nota de voz'} />
        ))}

        <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ font: 'var(--text-title-sm)', color: 'var(--color-text-primary)' }}>Añade un comentario</div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)' }}>
            Esta entrada ya quedó registrada y no se puede editar. Puedes sumar una reflexión nueva al releerla.
          </div>

          {comments.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', margin: '4px 0 var(--space-2)' }}>
              {comments.map((c) => (
                <div key={c.id} style={{ background: 'var(--color-bg-surface-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
                  <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-primary)' }}>{c.comment}</div>
                  <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>
                    {formatDDMMYYYY(new Date(c.createdAt))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="¿Qué piensas ahora al releer esto?"
            rows={4}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              resize: 'vertical',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              font: 'var(--text-body-md)',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-primary)',
              background: 'var(--color-bg-surface)',
              marginTop: 4,
            }}
          />
        </div>
      </div>

      <div style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', gap: 'var(--space-3)' }}>
        <Button variant="secondary" fullWidth onClick={onArchive} disabled={entry.status === 'archived'}>
          {entry.status === 'archived' ? 'Archivada' : 'Archivar'}
        </Button>
        <Button variant="primary" fullWidth onClick={onSaveComment} disabled={!comment.trim() || addComment.isPending}>
          Guardar
        </Button>
      </div>
    </div>
  );
}
