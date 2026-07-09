import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandling } from '../_lib/handler.js';
import { HttpError } from '../_lib/supabaseServer.js';
import { callClaudeWithTool, DEFAULT_MODEL } from '../_lib/claude.js';

interface PickDayMoodResult {
  day_emoji: string;
}

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  const { entries } = (req.body || {}) as {
    entries?: { time: string; emoji: string; summary: string }[];
  };
  if (!entries?.length) throw new HttpError(400, 'Missing entries');

  const entriesText = entries.map((e) => `- ${e.time} ${e.emoji}: ${e.summary}`).join('\n');

  const result = await callClaudeWithTool<PickDayMoodResult>({
    model: DEFAULT_MODEL,
    system: `Elegís el emoji que mejor representa el estado de ánimo general de un día
con múltiples entradas de diario. No es necesariamente el de la última
entrada — considerá el conjunto del día.`,
    messages: [{ role: 'user', content: `Entradas del día, en orden cronológico:\n${entriesText}` }],
    tool: {
      name: 'pick_day_mood',
      description: 'Elige el emoji que mejor representa el estado de ánimo general de un día con múltiples entradas de diario.',
      input_schema: {
        type: 'object',
        properties: {
          day_emoji: { type: 'string', description: 'Un único emoji representando el día completo.' },
        },
        required: ['day_emoji'],
      },
    },
  });

  res.status(200).json({ dayEmoji: result.day_emoji });
});
