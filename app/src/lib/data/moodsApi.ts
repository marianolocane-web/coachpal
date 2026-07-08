import { supabase } from '../supabaseClient';
import { moodFromRow, type DayMood } from './types';

export async function getMoodsForUserRange(userId: string, fromIso: string, toIso: string): Promise<DayMood[]> {
  const { data, error } = await supabase
    .from('day_moods')
    .select('*')
    .eq('user_id', userId)
    .gte('log_date', fromIso)
    .lte('log_date', toIso);
  if (error) throw error;
  return (data || []).map(moodFromRow);
}

export async function upsertMood(userId: string, logDate: string, emoji: string | null, moodTags: string[] = []): Promise<DayMood> {
  const { data, error } = await supabase
    .from('day_moods')
    .upsert({ user_id: userId, log_date: logDate, emoji, mood_tags: moodTags }, { onConflict: 'user_id,log_date' })
    .select('*')
    .single();
  if (error) throw error;
  return moodFromRow(data);
}
