import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? 8090);
const LARAVEL_URL = process.env.LARAVEL_API_URL ?? 'https://ai-tools-api-production-2c1e.up.railway.app/api/urpa';
const CHANNEL_SECRET = process.env.URPA_CHANNEL_WEBHOOK_SECRET ?? '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? '';

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'openclaw-connector', version: '0.1.0' });
});

interface NormalizedMessage {
  channel: 'telegram' | 'whatsapp' | 'signal' | 'imessage' | 'google_chat';
  external_user_id: string;
  external_chat_id: string;
  user_id: string;
  text: string;
  metadata?: Record<string, unknown>;
}

async function forwardToLaravel(payload: NormalizedMessage): Promise<void> {
  await axios.post(`${LARAVEL_URL}/channels/message`, payload, {
    headers: {
      'Content-Type': 'application/json',
      ...(CHANNEL_SECRET ? { 'X-Channel-Secret': CHANNEL_SECRET } : {}),
    },
    timeout: 15000,
  });
}

/** Telegram Bot API webhook */
app.post('/webhooks/telegram/:userId', async (req, res) => {
  const userId = req.params.userId;
  const update = req.body as {
    message?: { chat?: { id?: number }; from?: { id?: number }; text?: string };
  };

  const text = update.message?.text;
  const chatId = update.message?.chat?.id;
  const fromId = update.message?.from?.id;

  if (!text || chatId === undefined || fromId === undefined) {
    res.json({ ok: true, skipped: true });
    return;
  }

  try {
    await forwardToLaravel({
      channel: 'telegram',
      external_user_id: String(fromId),
      external_chat_id: String(chatId),
      user_id: userId,
      text,
      metadata: { raw: update },
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(502).json({ ok: false, error: err instanceof Error ? err.message : 'forward failed' });
  }
});

/** Manual ingest for testing */
app.post('/ingest', async (req, res) => {
  try {
    await forwardToLaravel(req.body as NormalizedMessage);
    res.json({ ok: true });
  } catch (err) {
    res.status(502).json({ ok: false, error: err instanceof Error ? err.message : 'forward failed' });
  }
});

app.listen(PORT, () => {
  console.log(`openclaw-connector listening on ${PORT}`);
  if (TELEGRAM_BOT_TOKEN) {
    console.log('Telegram bot token configured');
  }
});
