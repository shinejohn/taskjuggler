import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? 8090);
const LARAVEL_URL = process.env.LARAVEL_API_URL ?? 'https://ai-tools-api-production-2c1e.up.railway.app/api/urpa';
const CHANNEL_SECRET = process.env.URPA_CHANNEL_WEBHOOK_SECRET ?? '';

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'openclaw-connector', version: '0.1.0' });
});

async function forwardToLaravel(payload) {
  await axios.post(`${LARAVEL_URL}/channels/message`, payload, {
    headers: {
      'Content-Type': 'application/json',
      ...(CHANNEL_SECRET ? { 'X-Channel-Secret': CHANNEL_SECRET } : {}),
    },
    timeout: 15000,
  });
}

app.post('/webhooks/telegram/:userId', async (req, res) => {
  const userId = req.params.userId;
  const update = req.body;
  const text = update?.message?.text;
  const chatId = update?.message?.chat?.id;
  const fromId = update?.message?.from?.id;

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

app.post('/ingest', async (req, res) => {
  try {
    await forwardToLaravel(req.body);
    res.json({ ok: true });
  } catch (err) {
    res.status(502).json({ ok: false, error: err instanceof Error ? err.message : 'forward failed' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`openclaw-connector listening on ${PORT}`);
});
