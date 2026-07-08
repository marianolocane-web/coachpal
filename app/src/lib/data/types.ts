export type ResponseType = 'boolean' | 'number' | 'text';
export type HabitStatus = 'Activo' | 'Pausado';
export type ChartType = 'Everest' | 'Termómetro' | 'Valor diario' | 'Promedio semanal';

export interface HabitIdentity {
  negativeEmoji: string;
  negativeLabel: string;
  positiveEmoji: string;
  positiveLabel: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  icon: string;
  category: string | null;
  color: string | null;
  tags: string[];
  description: string;
  question: string;
  responseType: ResponseType;
  cueVisual: string;
  contextTodo: string;
  identity: HabitIdentity | null;
  goalLabel: string;
  goalValue: string;
  unit: string;
  goalDate: string;
  charts: ChartType[];
  streakGoal: number | null;
  /** Monday-first weekday indices this habit is scheduled on: 0=L .. 6=D */
  days: number[];
  timeOfDay: string;
  status: HabitStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface HabitInput {
  name: string;
  icon?: string;
  category?: string | null;
  color?: string | null;
  tags?: string[];
  description?: string;
  question?: string;
  responseType?: ResponseType;
  cueVisual?: string;
  contextTodo?: string;
  identity?: HabitIdentity | null;
  goalLabel?: string;
  goalValue?: string;
  unit?: string;
  goalDate?: string;
  charts?: ChartType[];
  streakGoal?: number | null;
  days?: number[];
  timeOfDay?: string;
  status?: HabitStatus;
}

export interface HabitLog {
  id: string;
  habitId: string;
  userId: string;
  logDate: string; // YYYY-MM-DD
  done: boolean;
  valueNumber: number | null;
  valueText: string | null;
  comment: string | null;
  commentLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  userId: string;
  value: string;
  label: string;
}

export interface DayMood {
  id: string;
  userId: string;
  logDate: string;
  emoji: string | null;
  moodTags: string[];
}

// ---- snake_case (DB) <-> camelCase (app) mappers ----

export function habitFromRow(row: any): Habit {
  const hasIdentity = row.identity_negative_emoji || row.identity_positive_emoji;
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    icon: row.icon || '✨',
    category: row.category,
    color: row.color,
    tags: row.tags || [],
    description: row.description || '',
    question: row.question || '',
    responseType: row.response_type || 'boolean',
    cueVisual: row.cue_visual || '',
    contextTodo: row.context_todo || '',
    identity: hasIdentity
      ? {
          negativeEmoji: row.identity_negative_emoji || '',
          negativeLabel: row.identity_negative_label || '',
          positiveEmoji: row.identity_positive_emoji || '',
          positiveLabel: row.identity_positive_label || '',
        }
      : null,
    goalLabel: row.goal_label || '',
    goalValue: row.goal_value != null ? String(row.goal_value) : '',
    unit: row.unit || '',
    goalDate: row.goal_date || '',
    charts: row.charts || [],
    streakGoal: row.streak_goal,
    days: row.days || [0, 1, 2, 3, 4, 5, 6],
    timeOfDay: row.time_of_day || '08:00',
    status: row.status || 'Activo',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

export function habitToRow(input: HabitInput, userId: string) {
  return {
    user_id: userId,
    name: input.name,
    icon: input.icon ?? '✨',
    category: input.category ?? null,
    color: input.color ?? null,
    tags: input.tags ?? [],
    description: input.description ?? '',
    question: input.question ?? '',
    response_type: input.responseType ?? 'boolean',
    cue_visual: input.cueVisual ?? '',
    context_todo: input.contextTodo ?? '',
    identity_negative_emoji: input.identity?.negativeEmoji || null,
    identity_negative_label: input.identity?.negativeLabel || null,
    identity_positive_emoji: input.identity?.positiveEmoji || null,
    identity_positive_label: input.identity?.positiveLabel || null,
    goal_label: input.goalLabel || null,
    goal_value: input.goalValue ? Number(input.goalValue) : null,
    unit: input.unit || null,
    goal_date: input.goalDate || null,
    charts: input.charts ?? [],
    streak_goal: input.streakGoal ?? null,
    days: input.days ?? [0, 1, 2, 3, 4, 5, 6],
    time_of_day: input.timeOfDay ?? '08:00',
    status: input.status ?? 'Activo',
  };
}

export function logFromRow(row: any): HabitLog {
  return {
    id: row.id,
    habitId: row.habit_id,
    userId: row.user_id,
    logDate: row.log_date,
    done: row.done,
    valueNumber: row.value_number,
    valueText: row.value_text,
    comment: row.comment,
    commentLocked: row.comment_locked,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function unitFromRow(row: any): Unit {
  return { id: row.id, userId: row.user_id, value: row.value, label: row.label };
}

export function moodFromRow(row: any): DayMood {
  return { id: row.id, userId: row.user_id, logDate: row.log_date, emoji: row.emoji, moodTags: row.mood_tags || [] };
}
