# OpenClaw Connector — Phase 2.5

Thin Node sidecar that receives channel webhooks (Telegram first) and forwards normalized payloads to Laravel.

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
| `URPA_CHANNEL_WEBHOOK_SECRET` | Must match `URPA_CHANNEL_WEBHOOK_SECRET` on API |
| `TELEGRAM_BOT_TOKEN` | Optional — for future polling setup |

## Telegram webhook

Register with Telegram:

```
POST https://api.telegram.org/bot<TOKEN>/setWebhook
  ?url=https://<openclaw-connector-domain>/webhooks/telegram/<fibonacco-user-uuid>
```

Laravel endpoint: `POST /api/urpa/channels/message`
