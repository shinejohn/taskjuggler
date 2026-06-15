# LiveKit Server — Railway Service

Phase 3 of the [Comms Modernization Plan](../../docs/fibonacco-comms-modernization-plan.md).

## Deploy

1. Create Railway service `livekit-server` using [LiveKit Cloud](https://livekit.io) or self-hosted:
   ```bash
   docker compose up -d
   ```

2. Set on **API** (`taskjuggler-api`):
   ```env
   LIVEKIT_ENABLED=true
   LIVEKIT_URL=wss://your-livekit-host
   LIVEKIT_API_KEY=...
   LIVEKIT_API_SECRET=...
   ```

3. IdeaCircuit joins via `POST /api/ideacircuit/meetings/{id}/livekit/join`

## Local dev

```bash
docker compose up -d
```

```env
LIVEKIT_ENABLED=true
LIVEKIT_URL=ws://localhost:7880
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
```

Default dev keys match `livekit-server` docker image.
