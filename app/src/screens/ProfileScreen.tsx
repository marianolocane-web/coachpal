import { useMemo, useState } from 'react';
import { useAuth } from '../lib/auth';
import { useHabits, useLogsRange, useSeedDemoData } from '../lib/data/hooks';
import { computeLongestStreak } from '../lib/data/stats';
import { addDays, isoDate, startOfDay } from '../lib/data/dateUtils';
import { StreakBadge } from '../components/habit/StreakBadge';
import { Switch } from '../components/forms/Switch';
import { Button } from '../components/forms/Button';

const HISTORY_DAYS = 400;

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { data: habits = [] } = useHabits();
  const today = startOfDay(new Date());
  const { data: logs = [] } = useLogsRange(isoDate(addDays(today, -HISTORY_DAYS)), isoDate(today));
  const seedDemoData = useSeedDemoData();
  const [reminders, setReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [celebrationSounds, setCelebrationSounds] = useState(true);

  const logsByHabitId = useMemo(() => {
    const m = new Map<string, typeof logs>();
    for (const l of logs) m.set(l.habitId, [...(m.get(l.habitId) || []), l]);
    return m;
  }, [logs]);

  const longestStreak = Math.max(0, ...habits.map((h) => computeLongestStreak(h, logsByHabitId.get(h.id) || [], today)));
  const totalDays = new Set(logs.filter((l) => l.done).map((l) => l.logDate)).size;
  const habitsActive = habits.filter((h) => h.status === 'Activo').length;
  const name = (user?.email || 'Tú').split('@')[0];

  const stats = [
    { label: 'Racha más larga', value: `${longestStreak} días` },
    { label: 'Días completados', value: totalDays },
    { label: 'Hábitos activos', value: habitsActive },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-6) var(--space-5) var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-brand)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', font: 'var(--text-title-lg)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
          {name[0]}
        </div>
        <div>
          <div style={{ font: 'var(--text-title-lg)', color: 'var(--color-text-primary)' }}>{name}</div>
          <div style={{ marginTop: 4 }}><StreakBadge days={longestStreak} size="sm" /></div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) var(--space-8)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ flex: 1, background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)', textAlign: 'center' }}>
              <div style={{ font: 'var(--text-display-sm)', color: 'var(--color-brand)', fontFamily: 'var(--font-display)' }}>{s.value}</div>
              <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-7)', font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>Ajustes</div>
        <div style={{ marginTop: 'var(--space-3)', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <Switch checked={reminders} onChange={setReminders} label="Recordatorios" />
          <Switch checked={darkMode} onChange={setDarkMode} label="Modo oscuro" />
          <Switch checked={celebrationSounds} onChange={setCelebrationSounds} label="Sonidos de celebración" />
        </div>

        {habits.length === 0 && (
          <div style={{ marginTop: 'var(--space-6)' }}>
            <Button variant="secondary" fullWidth onClick={() => seedDemoData.mutate()} disabled={seedDemoData.isPending}>
              {seedDemoData.isPending ? 'Cargando…' : 'Cargar hábitos de ejemplo'}
            </Button>
          </div>
        )}

        <div style={{ marginTop: 'var(--space-6)' }}>
          <Button variant="ghost" fullWidth onClick={() => signOut()}>Cerrar sesión</Button>
        </div>
      </div>
    </div>
  );
}
