# Comms Modernization — Project Completion Checklist

Last updated: 2026-06-16. Tracks remaining work to reach production-ready state per [fibonacco-comms-modernization-plan.md](../docs/fibonacco-comms-modernization-plan.md).

## Service Health (Railway)

| Service | URL | Required for |
|---------|-----|--------------|
| ai-tools-api | Production | Integration hub — all features |
| livekit-server | wss://livekit-server-production-0f2e.up.railway.app | IdeaCircuit video, Pipecat voice |
| pipecat-agent | https://pipecat-agent-production-d0f6.up.railway.app | URPA/4Calls AI voice |
| matrix-dendrite | https://matrix-dendrite-production.up.railway.app | All messaging | ✅ HTTP 200 |
| openclaw-connector | https://openclaw-connector-production.up.railway.app | Telegram/WhatsApp/etc. |

## Security & Ops Guarantees (must hold in production)

These are hard requirements, not nice-to-haves. The hardening pass (2026-06-16) depends on them.

- **Matrix access tokens are exposed to the browser.** `GET /api/matrix/session` returns the
  user's raw Matrix `access_token` so matrix-js-sdk can talk to the homeserver directly from
  the SPA. That token grants full account access. Therefore:
  - Dendrite's client-server API must be reachable **only over HTTPS** (never plain HTTP), and
    the homeserver must enforce per-device tokens so one leaked token can be revoked without
    rotating the whole account.
  - Do **not** log `access_token` anywhere (Laravel or frontend). The session endpoint must
    stay authenticated (Sanctum) and per-user.
  - If a broader isolation posture is wanted later, front Dendrite with a token-scoping proxy;
    until then, treat the browser token as the trust boundary and keep `MATRIX_ROOM_VISIBILITY=private`.
- **Open Matrix registration stays OFF in production.** `dendrite.yaml` is forced to
  `registration_disabled: true` on every boot (entrypoint sed, idempotent). Accounts are
  provisioned only via `MATRIX_REGISTRATION_SHARED_SECRET`, which must be **identical** on
  `matrix-dendrite` and `ai-tools-api` (deploy-comms.sh generates it once and sets both).
  `MatrixService::registerOnHomeserver()` refuses the `m.login.dummy` fallback when
  `app()->isProduction()`.
- **Homeserver calls are time-boxed.** All `MatrixService` HTTP calls use
  `config('matrix.http_timeout')` (default 5s) so a slow/down Dendrite cannot block task or
  message creation. The frontend mirrors this: `connectClient()` races a 5s timeout and the
  task/DM pages fall back to legacy REST messaging instead of spinning forever.
- **Inbound events are idempotent at the database.** Partial unique indexes on
  `task_messages` / `direct_messages` (`source_channel_ref`) guarantee a duplicate Matrix
  `event_id` can never double-insert under concurrent appservice retries; the insert path
  catches `UniqueConstraintViolationException` and no-ops.

## Phase Status

### Phase 1 — URPA ↔ TaskJuggler sync ✅ DONE
- [x] Direct model sync (no HTTP token)
- [x] TaskUpdated → URPA activity listener
- [x] Auth returns `enabled_modules`
- [x] Mobile auth + SecureStore + push token timing

### Phase 2 — Matrix / Dendrite 🟡 PARTIAL
**Done:** MatrixService, webhooks, DM rooms, task room provisioning, matrix-js-sdk in taskjuggler-web + urpa-web, `/api/matrix/conversations`

**Remaining:**
- [x] **Dendrite running on Railway** (generate-keys + generate-config fix)
- [x] Registration locked down: open registration forced OFF on boot, shared-secret
      provisioning only, production refuses `m.login.dummy` fallback (see Security & Ops Guarantees)
- [x] End-to-end test: register user → DM → webhook → DirectMessage row (verified live
      2026-06-18: 2 users provisioned on Dendrite, DM room created, webhook delivered →
      DirectMessage row, duplicate event_id deduped via source_channel_ref, bad secret → 401)
- [ ] Task-scoped Matrix rooms in taskjuggler-web UI (messages on task detail page)
- [ ] Matrix bridges: Slack, Teams, Discord (separate bridge services)

### Phase 2.5 — OpenClaw connector 🟡 PARTIAL
**Done:** Sidecar scaffold, Telegram webhook route, Laravel `/api/urpa/channels/message`, UrpaChannelBridgeService

**Remaining:**
- [ ] **openclaw-connector deployed and healthy on Railway**
- [ ] Register Telegram bot webhook per user
- [ ] WhatsApp, Signal, iMessage adapters (port from OpenClaw reference)
- [ ] TEF task creation from actionable channel messages

### Phase 3 — LiveKit ✅ DONE
- [x] LiveKitService JWT tokens
- [x] IdeaCircuit VideoCall + remote participant grid
- [x] Railway deploy healthy (HTTP 200)

**Remaining:**
- [ ] Remove or deprecate ChimeService code path
- [ ] LiveKit SIP trunk for Twilio PSTN audio (needed for phone calls)

### Phase 4 — Pipecat 🟡 PARTIAL
**Done:** Agent scaffold, LiveKit room join, Laravel routing when `PIPECAT_REPLACE_VAPI=true`, Twilio inbound stub

**Remaining:**
- [ ] **Real voice pipeline:** Deepgram STT → LLM → ElevenLabs TTS in Pipecat agent
- [ ] Twilio ↔ LiveKit SIP (caller hears AI, not hold message)
- [ ] Set `PIPECAT_REPLACE_VAPI=true` on production API
- [ ] Inbound call user resolution by phone number
- [ ] Call recording + transcript back to URPA

### Mobile App 🟡 PARTIAL
**Done:** Module store, settings Platform Apps, enabled_modules sync

**Remaining:**
- [ ] EAS `projectId` in app.json (run `eas init`)
- [ ] Module tab screens (coordinator, urpa, etc.) — all marked `ready: false`
- [ ] Push notifications end-to-end test

## Environment Variables Checklist (ai-tools-api)

```env
# Matrix (after Dendrite healthy)
MATRIX_ENABLED=true
MATRIX_HOMESERVER_URL=https://matrix-dendrite-production.up.railway.app
MATRIX_SERVER_NAME=fibonacco.ai
MATRIX_WEBHOOK_SECRET=...
MATRIX_APPSERVICE_TOKEN=...

# LiveKit ✅ set
LIVEKIT_ENABLED=true
LIVEKIT_URL=wss://livekit-server-production-0f2e.up.railway.app
LIVEKIT_API_KEY=fibonacco
LIVEKIT_API_SECRET=...

# Pipecat
PIPECAT_ENABLED=true
PIPECAT_AGENT_URL=https://pipecat-agent-production-d0f6.up.railway.app
PIPECAT_REPLACE_VAPI=false   # flip to true when voice pipeline complete
DEEPGRAM_API_KEY=
ELEVENLABS_API_KEY=

# Channels
URPA_CHANNEL_WEBHOOK_SECRET=...
```

## Critical Path (in order)

1. **Fix Matrix Dendrite deploy** — unblocks all messaging
2. **Fix openclaw-connector deploy** — unblocks Telegram
3. **Pipecat voice pipeline** — unblocks Vapi replacement (~80% cost savings)
4. **LiveKit SIP + Twilio** — unblocks real phone AI calls
5. **Task Matrix rooms in UI** — completes TaskJuggler messaging story
6. **Matrix bridges** — Slack/Teams/Discord for URPA users
7. **Mobile EAS + module screens** — mobile parity

## Estimated Remaining Effort

| Workstream | Effort |
|------------|--------|
| Dendrite + Matrix E2E | 2–3 days |
| OpenClaw Telegram production | 1–2 days |
| Pipecat full pipeline | 1–2 weeks |
| Twilio SIP + LiveKit | 3–5 days |
| Matrix bridges (Slack first) | 1–2 weeks each |
| Mobile modules | 1–2 weeks |

**Total to MVP:** ~3–4 weeks focused work  
**Total to full plan:** ~8–10 weeks (bridges + all channels)
