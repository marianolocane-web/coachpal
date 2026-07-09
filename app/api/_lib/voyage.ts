const VOYAGE_MODEL = 'voyage-4-lite';

/**
 * Generates an embedding vector via Voyage AI (Anthropic's recommended
 * embedding provider — Claude has no embeddings endpoint of its own).
 * Free tier covers 200M tokens, far beyond what a personal journal will
 * ever use.
 */
export async function embedText(text: string, inputType: 'document' | 'query' = 'document'): Promise<number[]> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) throw new Error('Missing VOYAGE_API_KEY');

  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: text, model: VOYAGE_MODEL, input_type: inputType, output_dimension: 1024 }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Voyage embeddings request failed (${res.status}): ${body}`);
  }

  const json = (await res.json()) as { data: { embedding: number[] }[] };
  const embedding = json.data?.[0]?.embedding;
  if (!embedding) throw new Error('Voyage response did not contain an embedding');
  return embedding;
}
