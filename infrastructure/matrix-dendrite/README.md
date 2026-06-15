# Matrix Dendrite — Railway Service

Phase 2 of the [Comms Modernization Plan](../../docs/fibonacco-comms-modernization-plan.md).

## Purpose

Self-hosted Matrix homeserver (Dendrite) for persistent messaging across TaskJuggler, URPA, and channel bridges.

Laravel (`taskjuggler-api`) is the **only public entry point**. The homeserver runs on Railway private networking.

## Deploy on Railway

Services are deployed on **Fibonacco AI Tools** (production):

| Service | URL |
|---------|-----|
| pipecat-agent | https://pipecat-agent-production-d0f6.up.railway.app |
| livekit-server | wss://livekit-server-production-0f2e.up.railway.app |
| matrix-dendrite | https://matrix-dendrite-production.up.railway.app |

Deploy or redeploy from this directory:

```bash
railway link -p ca3879ff-fd72-4239-983d-32ade6cace83 -e production -s pipecat-agent
railway up -d
```

Or run the full stack script from repo root:

```bash
./infrastructure/deploy-comms.sh
```

| Variable | Description |
|----------|-------------|
| `MATRIX_SERVER_NAME` | e.g. `fibonacco.ai` |
| `DATABASE_URL` | Postgres connection for Dendrite |

4. On the **API service**, set:

| Variable | Description |
|----------|-------------|
| `MATRIX_ENABLED` | `true` |
| `MATRIX_HOMESERVER_URL` | Internal or public Dendrite URL |
| `MATRIX_SERVER_NAME` | Same as Dendrite |
| `MATRIX_ADMIN_TOKEN` | Admin token for user provisioning |
| `MATRIX_WEBHOOK_SECRET` | Shared secret for `/api/matrix/webhook` |

## Local development

```bash
docker compose up -d
```

Then set in `taskjuggler-api/.env`:

```
MATRIX_ENABLED=true
MATRIX_HOMESERVER_URL=http://localhost:8008
MATRIX_SERVER_NAME=localhost
MATRIX_WEBHOOK_SECRET=dev-secret
```

## Laravel integration (already wired)

- `MatrixService` — user registration, task rooms, message mirroring
- `POST /api/matrix/webhook` — inbound events from appservice
- `GET /api/matrix/session` — credentials for `matrix-js-sdk`
- Task created → auto-provision Matrix room on `conversations.matrix_room_id`

## Next steps

- Deploy Dendrite with appservice registration pointing to Laravel webhook
- Add `matrix-js-sdk` to `taskjuggler-web` and swap MessagesPage data layer
- Matrix bridges for Slack / Teams / Discord
