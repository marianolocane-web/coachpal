import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useDiaryEntries } from '../lib/data/hooks';
import { DiaryEntryCard } from '../components/diary/DiaryEntryCard';

export function DiaryListScreen() {
  const navigate = useNavigate();
  const { data: entries = [], isLoading } = useDiaryEntries(['active']);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)', position: 'relative' }}>
      <div style={{ padding: 'var(--space-6) var(--space-5) 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ font: 'var(--text-display-sm)', color: 'var(--color-text-primary)' }}>Diario AI</div>
        <button
          onClick={() => navigate('/diario/buscar')}
          aria-label="Buscar en el diario"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '1px solid var(--color-border-default)',
            background: 'var(--color-bg-surface)',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Search size={17} />
        </button>
      </div>

      <div style={{ padding: '0 var(--space-5)', margin: 'var(--space-4) 0 var(--space-2)' }}>
        <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
          Un espacio para pensar en voz alta. Escribe o habla, tu coach te escucha.
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 'var(--space-3) var(--space-5) calc(var(--tabbar-height) + var(--space-8))' }}>
        {!isLoading && entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-9) var(--space-4)', color: 'var(--color-text-tertiary)', font: 'var(--text-body-md)' }}>
            Todavía no tienes entradas.
            <br />
            Empieza por contar cómo ha ido tu día.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {entries.map((e) => (
              <DiaryEntryCard key={e.id} entry={e} onClick={() => navigate(`/diario/${e.id}`)} />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/diario/nueva')}
        aria-label="Nueva entrada"
        style={{
          position: 'absolute',
          right: 'var(--space-5)',
          bottom: 'calc(var(--tabbar-height) + var(--space-5))',
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: 'var(--color-brand)',
          color: 'var(--color-text-on-brand)',
          fontSize: 26,
          lineHeight: 1,
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Plus size={26} />
      </button>
    </div>
  );
}
