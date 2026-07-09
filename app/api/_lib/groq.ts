const GROQ_MODEL = 'whisper-large-v3-turbo';

/**
 * Transcribes an audio buffer with Groq's hosted Whisper (free tier: 2000
 * requests/day, up to 25MB per file). Accepts m4a/mp3/wav/ogg/webm/flac
 * natively — no conversion needed for iPhone Voice Memos exports (.m4a).
 */
export async function transcribeAudio(audio: Buffer, filename: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('Missing GROQ_API_KEY');

  const form = new FormData();
  form.append('file', new Blob([new Uint8Array(audio)]), filename);
  form.append('model', GROQ_MODEL);
  form.append('language', 'es');
  form.append('response_format', 'text');

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Groq transcription request failed (${res.status}): ${body}`);
  }

  const text = await res.text();
  return text.trim();
}
