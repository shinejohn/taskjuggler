# LiveKit Server — Railway Service

Phase 3 of the [Comms Modernization Plan](../../docs/fibonacco-comms-modernization-plan.md).

## Deploy

Production (Fibonacco AI Tools):

- **URL:** `wss://livekit-server-production-0f2e.up.railway.app`
- **API key:** set on `ai-tools-api` as `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET`

Redeploy:

```bash
cd infrastructure/livekit-server
railway link -p ca3879ff-fd72-4239-983d-32ade6cace83 -e production -s livekit-server
railway up -d
```

Self-hosted local:
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
