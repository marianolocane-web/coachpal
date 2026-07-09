function DiarySearchScreen({ entries, onBack, onOpenEntry }) {
  const { useState, useMemo } = React;
  const { Input } = window.CoachPalDesignSystem_c83b94;
  const [keyword, setKeyword] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const toISO = (label) => {
    // labels like "08/07/2026" -> "2026-07-08" for comparison
    const [d, m, y] = label.split('/');
    return `${y}-${m}-${d}`;
  };

  const results = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return entries.filter((e) => {
      const matchesKw = !kw || e.title.toLowerCase().includes(kw) || (e.preview || '').toLowerCase().includes(kw) || (e.tags || []).some((t) => t.toLowerCase().includes(kw));
      const iso = toISO(e.date);
      const matchesFrom = !from || iso >= from;
      const matchesTo = !to || iso <= to;
      return matchesKw && matchesFrom && matchesTo;
    });
  }, [entries, keyword, from, to]);

  const hasFilters = keyword.trim() || from || to;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-surface)', cursor: 'pointer', fontSize: 16 }}>←</button>
        <div style={{ font: 'var(--text-title-lg)', color: 'var(--color-text-primary)' }}>Buscar en tu diario</div>
      </div>

      <div style={{ padding: '0 var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Input placeholder='Palabra clave, ej. "ansiedad"' value={keyword} onChange={(e) => setKeyword(e.target.value)} icon={<span style={{ color: 'var(--color-text-tertiary)' }}>⌕</span>} />
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ font: 'var(--text-label-md)', color: 'var(--color-text-secondary)' }}>Desde</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              style={{ border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', padding: '12px 14px', font: 'var(--text-body-sm)', fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)', background: 'var(--color-bg-surface)' }} />
          </label>
          <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ font: 'var(--text-label-md)', color: 'var(--color-text-secondary)' }}>Hasta</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              style={{ border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', padding: '12px 14px', font: 'var(--text-body-sm)', fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)', background: 'var(--color-bg-surface)' }} />
          </label>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 'var(--space-5)' }}>
        {!hasFilters ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-tertiary)', font: 'var(--text-body-md)' }}>
            Escribe una palabra o elige un rango de fechas para buscar en tus entradas.
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-tertiary)', font: 'var(--text-body-md)' }}>
            No hay entradas que coincidan con tu búsqueda.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {results.map((e) => (
              <DiaryEntryCard key={e.id} entry={e} onClick={() => onOpenEntry(e)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
