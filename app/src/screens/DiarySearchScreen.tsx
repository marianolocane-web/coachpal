import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../lib/auth';
import * as diarioApi from '../lib/data/diarioApi';
import type { DiaryEntry, DiarySemanticMatch } from '../lib/data/types';
import { IconButton } from '../components/forms/IconButton';
import { Input } from '../components/forms/Input';
import { Button } from '../components/forms/Button';
import { DiaryEntryCard } from '../components/diary/DiaryEntryCard';

export function DiarySearchScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [keywordResults, setKeywordResults] = useState<DiaryEntry[]>([]);
  const [semanticResults, setSemanticResults] = useState<DiarySemanticMatch[]>([]);
  const [searched, setSearched] = useState(false);

  const runSearch = async () => {
    if (!user) return;
    setLoading(true);
    setSearched(true);
    try {
      if (query.trim()) {
        const [keyword, semantic] = await Promise.all([
          diarioApi.searchByKeyword(user.id, query.trim()).catch(() => []),
          diarioApi.searchSemantic(query.trim()).catch(() => []),
        ]);
        setKeywordResults(keyword);
        setSemanticResults(semantic.filter((s) => !keyword.some((k) => k.id === s.id)));
      } else if (from || to) {
        const results = await diarioApi.searchByDateRange(user.id, from || '0001-01-01', to || '9999-12-31');
        setKeywordResults(results);
        setSemanticResults([]);
      } else {
        setKeywordResults([]);
        setSemanticResults([]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <IconButton label="Volver" onClick={() => navigate('/diario')} icon={<ArrowLeft size={18} />} />
        <div style={{ font: 'var(--text-title-lg)', color: 'var(--color-text-primary)' }}>Buscar en el diario</div>
      </div>

      <div style={{ padding: '0 var(--space-5) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Input placeholder="Palabra clave…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <Button onClick={runSearch} disabled={loading} fullWidth>
          {loading ? 'Buscando…' : 'Buscar'}
        </Button>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {searched && keywordResults.length === 0 && semanticResults.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-tertiary)', font: 'var(--text-body-md)' }}>
            No se encontraron entradas.
          </div>
        )}

        {keywordResults.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {keywordResults.map((e) => (
              <DiaryEntryCard key={e.id} entry={e} onClick={() => navigate(`/diario/${e.id}`)} />
            ))}
          </div>
        )}

        {semanticResults.length > 0 && (
          <div>
            <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', marginBottom: 'var(--space-3)' }}>
              Relacionadas
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {semanticResults.map((m) => (
                <button
                  key={m.id}
                  onClick={() => navigate(`/diario/${m.id}`)}
                  style={{
                    textAlign: 'left',
                    background: 'var(--color-bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-sm)',
                    padding: 'var(--space-4)',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ font: 'var(--text-title-sm)', color: 'var(--color-text-primary)' }}>{m.title}</div>
                    <span style={{ fontSize: 16 }}>{m.moodEmoji}</span>
                  </div>
                  <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>{m.summaryMarkdown}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
