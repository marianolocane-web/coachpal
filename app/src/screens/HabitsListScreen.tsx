import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, BarChart2 } from 'lucide-react';
import { useHabits } from '../lib/data/hooks';
import { IconButton } from '../components/forms/IconButton';
import { Input } from '../components/forms/Input';
import { Badge } from '../components/feedback/Badge';

export function HabitsListScreen() {
  const navigate = useNavigate();
  const { data: habits = [] } = useHabits();
  const [query, setQuery] = useState('');

  const filtered = habits
    .filter(
      (h) => h.name.toLowerCase().includes(query.toLowerCase()) || h.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <IconButton label="Volver" onClick={() => navigate('/')} icon={<ArrowLeft size={18} />} />
        <div style={{ flex: 1, font: 'var(--text-title-md)', color: 'var(--color-text-primary)' }}>Todos los hábitos</div>
        <IconButton label="Añadir hábito" variant="brand" onClick={() => navigate('/habits/new')} icon={<Plus size={20} />} />
      </div>

      <div style={{ padding: '0 var(--space-5) var(--space-3)' }}>
        <Input placeholder="Buscar por nombre o etiqueta…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {filtered.length === 0 && (
          <div style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)', padding: 'var(--space-5) 0', textAlign: 'center' }}>
            Todavía no tienes hábitos. Empieza por uno pequeño.
          </div>
        )}
        {filtered.map((h) => (
          <div key={h.id} style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
              <button
                onClick={() => navigate(`/habits/${h.id}/edit`)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', font: 'var(--text-title-sm)', fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}
              >
                {h.name}
              </button>
              <Badge variant={h.status === 'Pausado' ? 'neutral' : 'brand'}>{h.status}</Badge>
            </div>
            {h.goalLabel && (
              <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
                🎯 {h.goalLabel} {h.goalValue}
                {h.goalDate ? ` · al ${h.goalDate}` : ''}
              </div>
            )}
            {h.identity && (
              <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                {h.identity.positiveEmoji} vs {h.identity.negativeEmoji}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                {h.tags.map((t) => (
                  <Badge key={t} variant="neutral">{t}</Badge>
                ))}
                <span style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)' }}>{h.timeOfDay}</span>
              </div>
              <button
                onClick={() => navigate(`/habits/${h.id}`)}
                style={{
                  border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                  font: 'var(--text-label-sm)', color: 'var(--color-brand)', fontFamily: 'var(--font-body)',
                }}
              >
                <BarChart2 size={14} /> Stats
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
