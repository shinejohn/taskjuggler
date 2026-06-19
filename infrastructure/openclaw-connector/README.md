# OpenClaw Connector — Phase 2.5

Thin Node sidecar for URPA messaging. It receives per-user channel webhooks,
forwards normalized inbound messages to Laravel, and delivers the assistant's
outbound replies back to each channel's native API.

**Credential model: Option B (user-managed).** Each user registers their own
bot/credentials per channel via the Laravel API. Laravel passes those
credentials with every `/send` call — there is no shared platform bot.

## Deploy

```bash
cd infrastructure/openclaw-connector
railway link -p ca3879ff-fd72-4239-983d-32ade6cace83 -e production -s openclaw-connector
railway up -d
```

## Environment

| Variable | Description |
|----------|-------------|
| `LARAVEL_API_URL` | e.g. `https://ai-tools-api-production-2c1e.up.railway.app/api/urpa` |
| `URPA_CHANNEL_WEBHOOK_SECRET` | Shared secret; must match `URPA_CHANNEL_WEBHOOK_SECRET` on the API. Used both directions. |
| `WHATSAPP_VERIFY_TOKEN` | Optional — WhatsApp webhook verify token (defaults to the channel secret). |

## Inbound (channel → Laravel `POST /api/urpa/channels/message`)

Per-user webhook URLs (the `:userId` is the Fibonacco user UUID):

| Channel | Webhook |
|---------|---------|
| Telegram | `POST /webhooks/telegram/:userId` |
| WhatsApp | `GET+POST /webhooks/whatsapp/:userId` (Cloud API) |
| Slack | `POST /webhooks/slack/:userId` (Events API) |
| Any | `POST /ingest` (already-normalized payload) |

Telegram registration:

```
POST https://api.telegram.org/bot<TOKEN>/setWebhook
  ?url=https://<connector-domain>/webhooks/telegram/<user-uuid>
```

## Outbound (Laravel → connector `POST /send`)

```json
{
  "channel": "telegram",
  "external_chat_id": "12345",
  "text": "Reply from your assistant",
  "credentials": { "bot_token": "..." }
}
```

Header `X-Channel-Secret` is required. Per-channel `credentials` shape:

| Channel | Required credentials |
|---------|----------------------|
| `telegram` | `bot_token` |
| `whatsapp` | `access_token`, `phone_number_id` |
| `slack` | `bot_token` |
| `discord` | `bot_token` (or `webhook_url`) |
| `google_chat` | `webhook_url` |
| `signal` | `base_url`, `number` (signal-cli REST) |
| `imessage` | `base_url` (BlueBubbles-style bridge) |

## How users connect a channel

`POST /api/urpa/channels/links` (authenticated) with `channel`,
`external_user_id`, `external_chat_id`, and the channel's `credentials`. The
assistant auto-replies on inbound messages; users can also send on demand via
`POST /api/urpa/channels/links/{id}/send`.
