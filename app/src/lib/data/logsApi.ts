import { supabase } from '../supabaseClient';
import { logFromRow, type HabitLog } from './types';

export async function getLogsForHabit(habitId: string, fromIso?: string, toIso?: string): Promise<HabitLog[]> {
  let query = supabase.from('habit_logs').select('*').eq('habit_id', habitId).order('log_date', { ascending: true });
  if (fromIso) query = query.gte('log_date', fromIso);
  if (toIso) query = query.lte('log_date', toIso);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(logFromRow);
}

/** All logs for a user across every habit within a date range — used by Home, Calendar, General Stats. */
export async function getLogsForUserRange(userId: string, fromIso: string, toIso: string): Promise<HabitLog[]> {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('log_date', fromIso)
    .lte('log_date', toIso);
  if (error) throw error;
  return (data || []).map(logFromRow);
}

export async function getLog(habitId: string, logDate: string): Promise<HabitLog | null> {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', habitId)
    .eq('log_date', logDate)
    .maybeSingle();
  if (error) throw error;
  return data ? logFromRow(data) : null;
}

interface UpsertLogInput {
  habitId: string;
  userId: string;
  logDate: string;
  done?: boolean;
  valueNumber?: number | null;
  valueText?: string | null;
  comment?: string | null;
}

export async function upsertLog(input: UpsertLogInput): Promise<HabitLog> {
  const { data, error } = await supabase
    .from('habit_logs')
    .upsert(
      {
        habit_id: input.habitId,
        user_id: input.userId,
        log_date: input.logDate,
        ...(input.done !== undefined ? { done: input.done } : {}),
        ...(input.valueNumber !== undefined ? { value_number: input.valueNumber } : {}),
        ...(input.valueText !== undefined ? { value_text: input.valueText } : {}),
        ...(input.comment !== undefined ? { comment: input.comment } : {}),
      },
      { onConflict: 'habit_id,log_date' },
    )
    .select('*')
    .single();
  if (error) throw error;
  return logFromRow(data);
}
