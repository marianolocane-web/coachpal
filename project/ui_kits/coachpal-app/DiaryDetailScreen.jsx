function DiaryDetailScreen({ entry, onBack, onSave, onArchive }) {
  const { useState } = React;
  const { Badge, Button } = window.CoachPalDesignSystem_c83b94;
  const [comment, setComment] = useState('');
  const [playing, setPlaying] = useState(false);
  const [tags, setTags] = useState(entry?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [addingTag, setAddingTag] = useState(false);

  if (!entry) return null;

  const removeTag = (t) => setTags((ts) => ts.filter((x) => x !== t));
  const commitTag = () => {
    const t = newTag.trim();
    if (t && !tags.includes(t)) setTags((ts) => [...ts, t]);
    setNewTag('');
    setAddingTag(false);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-surface)', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: 'var(--text-title-md)', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.title}</div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)' }}>{entry.date}</div>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-brand-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{entry.emoji || '📝'}</div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {tags.map((t) => (
            <span key={t} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 6px 4px 10px',
              borderRadius: 'var(--radius-pill)', background: 'var(--color-brand-subtle)', color: 'var(--green-700)',
              font: 'var(--text-label-sm)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
            }}>
              {t}
              <button
                onClick={() => removeTag(t)}
                aria-label={`Quitar tag ${t}`}
                style={{ width: 16, height: 16, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.08)', color: 'var(--green-700)', cursor: 'pointer', fontSize: 10, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >✕</button>
            </span>
          ))}
          {addingTag ? (
            <input
              autoFocus
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') commitTag(); if (e.key === 'Escape') { setNewTag(''); setAddingTag(false); } }}
              onBlur={commitTag}
              placeholder="Nuevo tag"
              style={{
                border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-pill)', padding: '4px 10px',
                font: 'var(--text-label-sm)', fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)',
                background: 'var(--color-bg-surface)', width: 90, outline: 'none',
              }}
            />
          ) : (
            <button
              onClick={() => setAddingTag(true)}
              style={{
                padding: '4px 10px', borderRadius: 'var(--radius-pill)', border: '1px dashed var(--color-border-strong)',
                background: 'none', cursor: 'pointer', font: 'var(--text-label-sm)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)',
              }}
            >+ tag</button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {(entry.content || []).map((m, i) => (
            typeof m === 'string' ? (
              <div key={i} style={{ font: 'var(--text-body-md)', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>{m}</div>
            ) : (
              <ChatBubble key={i} msg={m} />
            )
          ))}
        </div>

        {entry.hasAudio && (
          <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', boxShadow: 'var(--shadow-xs)' }}>
            <button
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pausar' : 'Reproducir'}
              style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'var(--color-brand)', color: 'var(--color-text-on-brand)', cursor: 'pointer', fontSize: 15, flexShrink: 0 }}
            >{playing ? '❚❚' : '▶'}</button>
            <div style={{ flex: 1 }}>
              <div style={{ height: 6, borderRadius: 'var(--radius-pill)', background: 'var(--sand-200)', overflow: 'hidden' }}>
                <div style={{ width: playing ? '55%' : '0%', height: '100%', background: 'var(--color-brand)', transition: 'width 400ms var(--ease-standard)' }} />
              </div>
              <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>Nota de voz · {entry.audioDuration}</div>
            </div>
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ font: 'var(--text-title-sm)', color: 'var(--color-text-primary)' }}>Añade un comentario</div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)' }}>
            Esta entrada ya quedó registrada y no se puede editar. Puedes sumar una reflexión nueva al releerla.
          </div>

          {entry.commentHistory && entry.commentHistory.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', margin: '4px 0 var(--space-2)' }}>
              {entry.commentHistory.map((c, i) => (
                <div key={i} style={{ background: 'var(--color-bg-surface-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
                  <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-primary)' }}>{c.text}</div>
                  <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>{c.timestamp}</div>
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
              width: '100%', boxSizing: 'border-box', resize: 'vertical', border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)', padding: '12px 14px', font: 'var(--text-body-md)',
              fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)', background: 'var(--color-bg-surface)',
              marginTop: 4,
            }}
          />
        </div>
      </div>

      <div style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', gap: 'var(--space-3)' }}>
        <Button variant="secondary" fullWidth onClick={() => onArchive(entry)}>Archivar</Button>
        <Button variant="primary" fullWidth onClick={() => onSave(entry, comment, tags)}>Guardar</Button>
      </div>
    </div>
  );
}
