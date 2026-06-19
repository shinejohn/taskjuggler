import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? 8090);
const LARAVEL_URL = process.env.LARAVEL_API_URL ?? 'https://ai-tools-api-production-2c1e.up.railway.app/api/urpa';
const CHANNEL_SECRET = process.env.URPA_CHANNEL_WEBHOOK_SECRET ?? '';

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'openclaw-connector', version: '0.2.0' });
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

// --- Outbound senders -------------------------------------------------------
// Option B: each user supplies their own credentials, passed per-request from
// Laravel. No shared platform bot — the user owns their channel identity.

function requireCred(credentials, key, channel) {
  const value = credentials?.[key];
  if (!value) throw new Error(`${channel}: missing credentials.${key}`);
  return value;
}

const senders = {
  async telegram(chatId, text, credentials) {
    const token = requireCred(credentials, 'bot_token', 'telegram');
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text,
    });
  },

  async whatsapp(chatId, text, credentials) {
    const token = requireCred(credentials, 'access_token', 'whatsapp');
    const phoneId = requireCred(credentials, 'phone_number_id', 'whatsapp');
    await axios.post(
      `https://graph.facebook.com/v21.0/${phoneId}/messages`,
      { messaging_product: 'whatsapp', to: chatId, type: 'text', text: { body: text } },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  },

  async slack(chatId, text, credentials) {
    const token = requireCred(credentials, 'bot_token', 'slack');
    const { data } = await axios.post(
      'https://slack.com/api/chat.postMessage',
      { channel: chatId, text },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (data && data.ok === false) throw new Error(`slack: ${data.error}`);
  },

  async discord(chatId, text, credentials) {
    if (credentials?.webhook_url) {
      await axios.post(credentials.webhook_url, { content: text });
      return;
    }
    const token = requireCred(credentials, 'bot_token', 'discord');
    await axios.post(
      `https://discord.com/api/v10/channels/${chatId}/messages`,
      { content: text },
      { headers: { Authorization: `Bot ${token}` } },
    );
  },

  async google_chat(chatId, text, credentials) {
    const webhook = requireCred(credentials, 'webhook_url', 'google_chat');
    await axios.post(webhook, { text });
  },

  async signal(chatId, text, credentials) {
    const baseUrl = requireCred(credentials, 'base_url', 'signal');
    const number = requireCred(credentials, 'number', 'signal');
    await axios.post(`${baseUrl.replace(/\/$/, '')}/v2/send`, {
      number,
      recipients: [chatId],
      message: text,
    });
  },

  async imessage(chatId, text, credentials) {
    const baseUrl = requireCred(credentials, 'base_url', 'imessage');
    await axios.post(`${baseUrl.replace(/\/$/, '')}/message`, {
      chatGuid: chatId,
      message: text,
    });
  },
};

function secretOk(req) {
  if (!CHANNEL_SECRET) return true;
  return req.get('X-Channel-Secret') === CHANNEL_SECRET;
}

// Laravel → connector: deliver an assistant reply to a channel.
app.post('/send', async (req, res) => {
  if (!secretOk(req)) {
    res.status(401).json({ ok: false, error: 'unauthorized' });
    return;
  }

  const { channel, external_chat_id: chatId, text, credentials } = req.body ?? {};
  const sender = senders[channel];

  if (!sender) {
    res.status(400).json({ ok: false, error: `unsupported channel: ${channel}` });
    return;
  }
  if (chatId === undefined || chatId === null || !text) {
    res.status(400).json({ ok: false, error: 'external_chat_id and text are required' });
    return;
  }

  try {
    await sender(String(chatId), String(text), credentials ?? {});
    res.json({ ok: true });
  } catch (err) {
    res.status(502).json({ ok: false, error: err instanceof Error ? err.message : 'send failed' });
  }
});

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

// WhatsApp Cloud API verification handshake (per-user webhook).
app.get('/webhooks/whatsapp/:userId', (req, res) => {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN ?? CHANNEL_SECRET;
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === verifyToken) {
    res.status(200).send(req.query['hub.challenge']);
    return;
  }
  res.sendStatus(403);
});

app.post('/webhooks/whatsapp/:userId', async (req, res) => {
  const userId = req.params.userId;
  const value = req.body?.entry?.[0]?.changes?.[0]?.value;
  const message = value?.messages?.[0];
  const text = message?.text?.body;
  const fromId = message?.from;

  if (!text || fromId === undefined) {
    res.json({ ok: true, skipped: true });
    return;
  }

  try {
    await forwardToLaravel({
      channel: 'whatsapp',
      external_user_id: String(fromId),
      external_chat_id: String(fromId),
      user_id: userId,
      text,
      metadata: { raw: req.body },
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(502).json({ ok: false, error: err instanceof Error ? err.message : 'forward failed' });
  }
});

// Slack Events API (per-user webhook).
app.post('/webhooks/slack/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (req.body?.type === 'url_verification') {
    res.json({ challenge: req.body.challenge });
    return;
  }

  const event = req.body?.event;
  const text = event?.text;
  const channelId = event?.channel;
  const fromId = event?.user;

  // Ignore bot/self echoes and non-message events.
  if (!text || !channelId || !fromId || event?.bot_id || event?.type !== 'message') {
    res.json({ ok: true, skipped: true });
    return;
  }

  try {
    await forwardToLaravel({
      channel: 'slack',
      external_user_id: String(fromId),
      external_chat_id: String(channelId),
      user_id: userId,
      text,
      metadata: { raw: req.body },
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
