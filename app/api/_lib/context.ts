import type { SupabaseClient } from '@supabase/supabase-js';
import { habitFromRow, logFromRow } from '../../src/lib/data/types';
import { addDays, isoDate, startOfDay } from '../../src/lib/data/dateUtils';
import { computeCompletionRate, computeCurrentStreak } from '../../src/lib/data/stats';
import { embedText } from './voyage';

const CONTEXT_LOOKBACK_DAYS = 14;

/**
 * Assembles the shared "one brain" context: recent habits/streaks, recent
 * habit_log comments, recent moods, and relevant diario entries (recency +
 * semantic match to `focusQuery`). Used by the Diario conversation and,
 * eventually, by the habit coach — same data, same shape, one source of truth.
 */
export async function buildUserContext(
  supabase: SupabaseClient,
  userId: string,
  opts: { focusQuery?: string } = {},
): Promise<string> {
  const today = startOfDay(new Date());
  const fromIso = isoDate(addDays(today, -CONTEXT_LOOKBACK_DAYS));
  const todayIso = isoDate(today);

  const [habitsRes, logsRes, moodsRes, recentEntriesRes] = await Promise.all([
    supabase.from('habits').select('*').eq('user_id', userId).is('deleted_at', null).eq('status', 'Activo'),
    supabase.from('habit_logs').select('*').eq('user_id', userId).gte('log_date', fromIso).lte('log_date', todayIso),
    supabase.from('day_moods').select('log_date, emoji').eq('user_id', userId).gte('log_date', fromIso).lte('log_date', todayIso),
    supabase
      .from('diario_entries')
      .select('title, summary_markdown, entry_date')
      .eq('user_id', userId)
      .in('status', ['active', 'archived'])
      .order('entry_date', { ascending: false })
      .limit(5),
  ]);

  const habits = (habitsRes.data || []).map(habitFromRow);
  const logs = (logsRes.data || []).map(logFromRow);

  const habitLines = habits.map((h) => {
    const habitLogs = logs.filter((l) => l.habitId === h.id);
    const streak = computeCurrentStreak(h, habitLogs, today);
    const rate = computeCompletionRate(h, habitLogs, addDays(today, -6), today, today);
    return `- ${h.name}: racha actual ${streak} día(s), ${Math.round(rate * 100)}% de cumplimiento en los últimos 7 días`;
  });

  const commentLines = logs
    .filter((l) => l.comment)
    .sort((a, b) => (a.logDate < b.logDate ? 1 : -1))
    .map((l) => {
      const habit = habits.find((h) => h.id === l.habitId);
      return `- ${l.logDate} (${habit?.name ?? 'hábito'}): "${l.comment}"`;
    });

  const moodLines = (moodsRes.data || [])
    .filter((m) => m.emoji)
    .sort((a, b) => (a.log_date < b.log_date ? 1 : -1))
    .map((m) => `- ${m.log_date}: ${m.emoji}`);

  let relatedEntries = recentEntriesRes.data || [];
  if (opts.focusQuery) {
    try {
      const queryEmbedding = await embedText(opts.focusQuery, 'query');
      const { data: semanticMatches } = await supabase.rpc('diario_semantic_search', {
        query_embedding: queryEmbedding,
        match_count: 5,
      });
      if (semanticMatches?.length) {
        const seen = new Set(relatedEntries.map((e: { title: string; entry_date: string }) => `${e.title}|${e.entry_date}`));
        for (const m of semanticMatches as { title: string; summary_markdown: string; entry_date: string }[]) {
          const key = `${m.title}|${m.entry_date}`;
          if (!seen.has(key)) {
            relatedEntries = [...relatedEntries, m];
            seen.add(key);
          }
        }
      }
    } catch {
      // Semantic search is a nice-to-have for context; never block the
      // conversation if Voyage is briefly unavailable.
    }
  }

  const entryLines = relatedEntries
    .slice(0, 8)
    .map((e: { title: string; summary_markdown: string; entry_date: string }) => `- ${e.entry_date} — "${e.title}": ${e.summary_markdown}`);

  return [
    'Hábitos activos:',
    habitLines.length ? habitLines.join('\n') : '(sin hábitos activos todavía)',
    '',
    'Comentarios recientes en check-ins de hábitos:',
    commentLines.length ? commentLines.join('\n') : '(sin comentarios recientes)',
    '',
    'Estados de ánimo recientes:',
    moodLines.length ? moodLines.join('\n') : '(sin registros de ánimo recientes)',
    '',
    'Entradas de diario relevantes:',
    entryLines.length ? entryLines.join('\n') : '(sin entradas de diario previas)',
  ].join('\n');
}
