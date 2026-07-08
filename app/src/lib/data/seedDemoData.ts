import { supabase } from '../supabaseClient';
import { createHabit } from './habitsApi';
import type { HabitInput } from './types';
import { addDays, isoDate, mondayFirstWeekday, startOfDay } from './dateUtils';

/** Deterministic pseudo-random in [0,1) — same shape as the design prototype's mulberry-style hash. */
function seededRandom(seed: number, i: number): number {
  let h = (seed * 2654435761 + i * 40503) >>> 0;
  h = (h ^ (h >>> 15)) >>> 0;
  return (h % 1000) / 1000;
}

const DEMO_HABITS: (HabitInput & { seedRate: number })[] = [
  {
    name: 'Meditar 10 min',
    icon: '🧘',
    category: 'Bienestar',
    color: 'var(--color-brand-subtle)',
    tags: ['Bienestar', 'Mañana'],
    timeOfDay: '08:00',
    days: [0, 1, 2, 3, 4, 5, 6],
    charts: ['Everest'],
    streakGoal: 21,
    identity: { negativeEmoji: '🤯', negativeLabel: 'Burnout', positiveEmoji: '🧘‍♂️', positiveLabel: 'Paz mental' },
    question: '¿Meditaste hoy?',
    responseType: 'boolean',
    seedRate: 0.8,
  },
  {
    name: 'Leer 20 páginas',
    icon: '📖',
    category: 'Aprendizaje',
    color: 'var(--color-accent-subtle)',
    tags: ['Aprendizaje', 'Noche'],
    timeOfDay: '21:00',
    days: [0, 1, 2, 3, 4, 5, 6],
    charts: ['Valor diario'],
    unit: 'páginas',
    identity: { negativeEmoji: '📵', negativeLabel: 'Distraído', positiveEmoji: '📚', positiveLabel: 'Curioso' },
    question: '¿Cuántas páginas leíste?',
    responseType: 'number',
    seedRate: 0.5,
  },
  {
    name: 'Beber 2L de agua',
    icon: '💧',
    category: 'Salud',
    color: 'var(--color-danger-subtle)',
    tags: ['Salud'],
    timeOfDay: 'Todo el día',
    days: [0, 1, 2, 3, 4, 5, 6],
    charts: ['Termómetro'],
    goalLabel: 'Meta diaria',
    goalValue: '2',
    unit: 'L',
    identity: { negativeEmoji: '🥤', negativeLabel: 'Deshidratado', positiveEmoji: '💧', positiveLabel: 'Hidratado' },
    question: '¿Cuántos litros tomaste?',
    responseType: 'number',
    seedRate: 0.35,
  },
  {
    name: 'Estirar 5 min',
    icon: '🤸',
    category: 'Salud',
    color: 'var(--color-brand-subtle)',
    tags: ['Salud', 'Mañana'],
    timeOfDay: '07:30',
    days: [0, 1, 2, 3, 4, 5],
    charts: ['Everest', 'Promedio semanal'],
    streakGoal: 30,
    goalLabel: 'Pesar',
    goalValue: '90',
    unit: 'kgs',
    goalDate: '31/12/2026',
    identity: { negativeEmoji: '🪑', negativeLabel: 'Sedentario', positiveEmoji: '🤸', positiveLabel: 'Activo' },
    question: '¿Estiraste hoy?',
    responseType: 'boolean',
    seedRate: 0.9,
  },
];

const HISTORY_DAYS = 60;

/** Populates the current account with demo habits + ~60 days of history so every screen has real data to show. */
export async function seedDemoData(userId: string): Promise<void> {
  const today = startOfDay(new Date());

  for (let hi = 0; hi < DEMO_HABITS.length; hi++) {
    const { seedRate, ...input } = DEMO_HABITS[hi];
    const habit = await createHabit(input, userId);

    const logRows = [];
    for (let i = HISTORY_DAYS; i >= 0; i--) {
      const date = addDays(today, -i);
      if (!input.days!.includes(mondayFirstWeekday(date))) continue;
      const roll = seededRandom(hi + 1, i);
      const done = roll < seedRate;
      const row: Record<string, unknown> = {
        habit_id: habit.id,
        user_id: userId,
        log_date: isoDate(date),
        done,
      };
      if (input.responseType === 'number') {
        row.value_number = done ? Math.round((1 + roll * 4) * 10) / 10 : 0;
      }
      logRows.push(row);
    }
    if (logRows.length) {
      const { error } = await supabase.from('habit_logs').upsert(logRows, { onConflict: 'habit_id,log_date' });
      if (error) throw error;
    }
  }

  const moodEmojis = ['🤩', '😊', '😐', '😵‍💫', '😢'];
  const moodRows = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, -i);
    const roll = seededRandom(99, i);
    return {
      user_id: userId,
      log_date: isoDate(date),
      emoji: roll < 0.15 ? null : moodEmojis[Math.floor(roll * moodEmojis.length)],
      mood_tags: [],
    };
  });
  const { error: moodError } = await supabase.from('day_moods').upsert(moodRows, { onConflict: 'user_id,log_date' });
  if (moodError) throw moodError;
}
