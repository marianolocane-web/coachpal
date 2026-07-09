import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandling } from '../_lib/handler';
import { getSupabaseForRequest, HttpError } from '../_lib/supabaseServer';
import { transcribeAudio } from '../_lib/groq';

const AUDIO_BUCKET = 'diario-audio';

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  const { storagePath } = (req.body || {}) as { storagePath?: string };
  if (!storagePath) throw new HttpError(400, 'Missing storagePath');

  const { supabase } = getSupabaseForRequest(req);

  // Downloading via the user-scoped client means this fails with a storage
  // permission error unless the file actually belongs to this user's own
  // folder (bucket policy keyed on auth.uid()), same guarantee as RLS.
  const { data, error } = await supabase.storage.from(AUDIO_BUCKET).download(storagePath);
  if (error || !data) throw new HttpError(404, `Could not download audio: ${error?.message ?? 'not found'}`);

  const buffer = Buffer.from(await data.arrayBuffer());
  const filename = storagePath.split('/').pop() || 'audio.m4a';
  const text = await transcribeAudio(buffer, filename);

  res.status(200).json({ text });
});
