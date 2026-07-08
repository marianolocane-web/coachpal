import { supabase } from '../supabaseClient';
import { habitFromRow, habitToRow, type Habit, type HabitInput } from './types';

export async function listHabits(userId: string): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('name', { ascending: true });
  if (error) throw error;
  return (data || []).map(habitFromRow);
}

export async function getHabit(id: string): Promise<Habit | null> {
  const { data, error } = await supabase.from('habits').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? habitFromRow(data) : null;
}

export async function createHabit(input: HabitInput, userId: string): Promise<Habit> {
  const { data, error } = await supabase.from('habits').insert(habitToRow(input, userId)).select('*').single();
  if (error) throw error;
  return habitFromRow(data);
}

export async function updateHabit(id: string, input: HabitInput, userId: string): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .update(habitToRow(input, userId))
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return habitFromRow(data);
}

export async function softDeleteHabit(id: string): Promise<void> {
  const { error } = await supabase.from('habits').update({ deleted_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}
