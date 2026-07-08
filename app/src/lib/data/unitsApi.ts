import { supabase } from '../supabaseClient';
import { unitFromRow, type Unit } from './types';

/** Seeded into every new account's `units` row on first use, so they're fully editable/deletable like any other unit. */
const DEFAULT_UNITS: { value: string; label: string }[] = [
  { value: 'kg', label: 'Kgs' },
  { value: 'reps', label: 'Repeticiones' },
  { value: 'min', label: 'Minutos' },
  { value: 'sleep', label: 'Sleep Score' },
];

/** Returns the user's units, seeding the built-in defaults the first time they have none. */
export async function listOrSeedUnits(userId: string): Promise<Unit[]> {
  const existing = await listUnits(userId);
  if (existing.length > 0) return existing;
  const { data, error } = await supabase
    .from('units')
    .insert(DEFAULT_UNITS.map((u) => ({ user_id: userId, value: u.value, label: u.label })))
    .select('*');
  if (error) throw error;
  return (data || []).map(unitFromRow);
}

export async function listUnits(userId: string): Promise<Unit[]> {
  const { data, error } = await supabase.from('units').select('*').eq('user_id', userId).order('created_at');
  if (error) throw error;
  return (data || []).map(unitFromRow);
}

export async function createUnit(userId: string, label: string): Promise<Unit> {
  const value = 'custom_' + Date.now();
  const { data, error } = await supabase.from('units').insert({ user_id: userId, value, label }).select('*').single();
  if (error) throw error;
  return unitFromRow(data);
}

export async function updateUnit(id: string, label: string): Promise<Unit> {
  const { data, error } = await supabase.from('units').update({ label }).eq('id', id).select('*').single();
  if (error) throw error;
  return unitFromRow(data);
}

export async function deleteUnit(id: string): Promise<void> {
  const { error } = await supabase.from('units').delete().eq('id', id);
  if (error) throw error;
}
