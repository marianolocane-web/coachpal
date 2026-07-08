/**
 * Placeholder rotating quotes standing in for the AI-coach-generated daily message from the spec.
 * Real generation would need an LLM call (e.g. a Supabase Edge Function) — out of scope for this pass.
 */
const QUOTES = [
  'Pequeñas acciones, tomadas consistentemente, crean resultados extraordinarios.',
  'No necesitas motivación, necesitas un sistema. Hoy, cumple el tuyo.',
  'Cada check es un voto por la persona que quieres ser.',
  'El progreso no es lineal. Presentarte hoy ya cuenta.',
  'Una racha se construye un día a la vez. Hoy es ese día.',
  'No busques la perfección, busca la constancia.',
];

export function quoteOfTheDay(date: Date): string {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000);
  return QUOTES[dayOfYear % QUOTES.length];
}
