function DiaryEntryCard({ entry, onClick }) {
  const { Badge } = window.CoachPalDesignSystem_c83b94;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '100%', textAlign: 'left',
        background: 'var(--color-bg-surface)', border: 'none', borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-xs)', padding: 'var(--space-4)', cursor: 'pointer', fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
        background: 'var(--color-brand-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20,
      }}>
        {entry.emoji || '📝'}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ font: 'var(--text-title-sm)', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {entry.title}
        </div>
        <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', overflow: 'hidden' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.date}</span>
          {entry.hasAudio && <span style={{ flexShrink: 0 }}>· 🎙 {entry.audioDuration}</span>}
        </div>
        {entry.tags && entry.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
            {entry.tags.map((t) => <Badge key={t} variant="neutral">{t}</Badge>)}
          </div>
        )}
      </div>
      <div style={{ color: 'var(--color-text-tertiary)', fontSize: 18, flexShrink: 0 }}>›</div>
    </button>
  );
}
