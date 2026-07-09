const TELEGRAM_API = 'https://api.telegram.org';

function botToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('Missing TELEGRAM_BOT_TOKEN');
  return token;
}

export async function sendTelegramMessage(chatId: number, text: string): Promise<void> {
  const res = await fetch(`${TELEGRAM_API}/bot${botToken()}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('[telegram] sendMessage failed', res.status, body);
  }
}

/** Downloads a Telegram voice note (Ogg/Opus) and returns it ready to hand to Groq/Storage. */
export async function downloadTelegramVoice(fileId: string): Promise<Buffer> {
  const getFileRes = await fetch(`${TELEGRAM_API}/bot${botToken()}/getFile?file_id=${fileId}`);
  if (!getFileRes.ok) throw new Error(`Telegram getFile failed (${getFileRes.status})`);
  const getFileJson = (await getFileRes.json()) as { result: { file_path: string } };
  const filePath = getFileJson.result.file_path;

  const fileRes = await fetch(`${TELEGRAM_API}/file/bot${botToken()}/${filePath}`);
  if (!fileRes.ok) throw new Error(`Telegram file download failed (${fileRes.status})`);
  return Buffer.from(await fileRes.arrayBuffer());
}
