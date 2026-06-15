# Fibonacco Communications Modernization Plan
## TaskJuggler + URPA + IdeaCircuit + 4Calls
### Matrix · LiveKit · Pipecat · OpenClaw (reference)

---

## What We Have Now (Honest Assessment)

### TaskJuggler
- **Real:** Task CRUD, TEF 2.0 implemented in PHP, DirectMessage model, TaskMessage model, Conversation model (task-scoped), Teams with invitations, unread tracking, Actor registry, routing rules
- **Broken/Incomplete:** TaskJugglerSyncService has `getTaskJugglerToken()` returning null — URPA↔TaskJuggler sync is not actually working. Messages exist but no real-time delivery layer.

### URPA (4Calls)
- **Real:** VapiService proxying calls to Vapi API, VoiceResponseService, ContextBuilderService, webhook handling, ElevenLabs TTS, UrpaTaskjugglerLink model exists
- **Broken/Incomplete:** TaskJuggler sync broken (token TODO), Vapi is expensive and you don't own the pipeline, no messaging layer in URPA at all
- **UI:** Good. Keep it entirely.

### IdeaCircuit
- **Real:** Meeting model, MeetingController with full CRUD, participant management, task creation from meetings, appointment creation from meetings, AWS Chime SDK integrated (ChimeService), transcript/notes/AI controller stubs exist
- **Broken/Incomplete:** VideoCall.vue is a UI shell — no actual WebRTC in the frontend. It toggles a boolean for video. Chime is integrated on the backend but never called from the frontend. VoiceControls uses browser MediaRecorder, not Chime or LiveKit.
- **The real problem:** You're paying for AWS Chime (per-minute) AND Vapi (per-minute) and neither is properly wired up.

### 4Calls (URPA voice channel)
- **Real:** Twilio VoiceService for inbound, Vapi for outbound AI calls, AssistantChannel model, webhook handlers
- **Broken/Incomplete:** Completely dependent on Vapi pricing, no self-hosted alternative

---

## What We Build Today (The Modern Stack)

### Four new services on Railway + one reference codebase:

```
┌─────────────────────────────────────────────────────────┐
│                    EXISTING (keep)                       │
│  taskjuggler-api (Laravel)  │  taskjuggler-web (Vue)    │
│  urpa-web (Vue)             │  ideacircuit-web (Vue)    │
└─────────────────────────────────────────────────────────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
    ┌──────────────┐ ┌────────┐ ┌─────────┐
    │   Dendrite   │ │LiveKit │ │Pipecat  │
    │  (Matrix)    │ │Server  │ │ Agent   │
    │  messaging + │ │ media  │ │ voice   │
    │  bridges     │ │        │ │         │
    └──────────────┘ └────────┘ └─────────┘
              │          │          │
              └──────────┼──────────┘
                         │
              ┌──────────▼──────────┐
              │   taskjuggler-api   │
              │  (integration hub)  │
              │  + OpenClaw-derived │
              │  channel connectors │
              └─────────────────────┘

  OpenClaw (MIT) = reference codebase only, not a running dependency
  Channel connector logic ported into UrpaCommunicationService.php
```

---

## Phase 1: Fix What's Broken (2 weeks)
**Priority: Make what exists actually work before adding anything**

### 1.1 Fix URPA ↔ TaskJuggler Sync
The `getTaskJugglerToken()` returns null. Nothing syncs.
- Implement shared auth token via Laravel Sanctum — URPA users get a TaskJuggler API token stored in `urpa_taskjuggler_links`
- Wire up bidirectional sync: call created in URPA → task in TaskJuggler, task updated in TaskJuggler → activity in URPA
- This is a 2-3 day fix, not a feature build

### 1.2 Wire IdeaCircuit Frontend to Chime Backend
The Chime SDK is built and working on the backend. The frontend never calls it.
- Replace the boolean toggle in VideoCall.vue with actual Chime SDK calls
- Call `createChimeMeeting()` → `createChimeAttendee()` → `getChimeCredentials()` on meeting start
- Use `amazon-chime-sdk-js` in the Vue frontend
- **OR** — skip this and go straight to LiveKit (see Phase 2). Don't invest more in Chime if you're replacing it.

**Recommendation:** Skip the Chime fix. Chime is per-minute AWS billing. Go straight to LiveKit in Phase 2. Leave IdeaCircuit video non-functional for 2 more weeks rather than doubling down on the wrong technology.

---

## Phase 2: Add Matrix (Dendrite) — 3 weeks

### What Matrix gives you
- Persistent channels independent of tasks
- DMs with full history
- Presence/online status
- Read receipts, reactions, threading
- Bridges to Slack, Teams, Discord (maintained by Matrix.org)
- Federation — external parties can communicate without accounts

### Railway service: `matrix-dendrite`
- Dendrite (Go) — lighter than Synapse, production-ready enough
- Postgres database (shared Railway Postgres or dedicated)
- Exposed internally only — Laravel is the only public entry point

### Laravel integration (`MatrixService.php`)
```
When a user registers in TaskJuggler → auto-register on Dendrite via admin API
When a task is created via TEF → auto-create Matrix room, store room_id in conversations table
When a TEF message is posted → mirror to Matrix room
When a Matrix message arrives → create TEF message, notify via Laravel events
```

### The key architectural point
`conversation_id` already exists in TEF 2.0 envelopes. That field becomes the Matrix `room_id` mapping. No schema changes needed in TEF — just populate the field with the Matrix room alias.

### Vue integration
- `matrix-js-sdk` in taskjuggler-web and urpa-web
- Replace current MessagesPage.vue and DirectMessagePage.vue with Matrix-backed components
- Existing UI stays — swap the data layer underneath

### URPA + Matrix
URPA gets messaging for the first time:
- Every URPA user gets a Matrix account on registration
- Communication channels (email, Slack, Teams inbound) create Matrix rooms
- URPA monitors those rooms, AI responds via Pipecat pipeline
- This is the "personal AI assistant monitoring your channels" pattern — the Pipecat/open source angle you were thinking of

---

## Phase 2.5: OpenClaw as Channel Connector Reference

### What OpenClaw is
OpenClaw is an MIT-licensed, self-hosted, multi-channel AI agent gateway with 247,000+ GitHub stars. It is **not** a dependency you run — it is a reference codebase you learn from and port.

### Why it matters for URPA
OpenClaw has already solved the hardest part of URPA's channel monitoring vision: the per-platform connector code. Each platform (WhatsApp, Telegram, Slack, Teams, Signal, iMessage, Discord, Google Chat, and 15+ more) has a battle-tested adapter in `src/channels` that handles:
- Auth flows and token refresh
- Webhook registration and validation
- Platform-specific message format normalization
- Rate limiting and reconnection logic
- Media handling (images, audio, documents)

Building these from scratch is weeks of work per platform. OpenClaw has done it for all of them.

### What Matrix bridges vs what OpenClaw connectors do
These are complementary, not competing:

| | Matrix Bridges | OpenClaw Connectors |
|---|---|---|
| **Type** | Persistent protocol bridge | Webhook/polling adapter |
| **Direction** | Bidirectional | Primarily inbound |
| **Best for** | Slack, Teams, Discord | iMessage, Signal, WhatsApp, Telegram |
| **Runs as** | Separate bridge service | Logic embedded in URPA |
| **Maintenance** | Matrix.org maintains | You maintain the port |

Use Matrix bridges where they exist and are stable (Slack, Teams, Discord). Use OpenClaw-derived connectors for platforms where Matrix bridges are fragile or unavailable (iMessage, Signal, WhatsApp personal).

### How to use OpenClaw

**Do not** embed it as a Node dependency inside the Laravel monolith.

**Do** run it as a thin sidecar service on Railway that receives messages from channels and posts normalized payloads to a URPA internal webhook endpoint. This keeps the connector logic isolated and updatable without touching Laravel.

```
Platform message arrives
        │
        ▼
  openclaw-connector (Node, Railway sidecar)
  - handles auth, webhooks, format normalization
        │
        ▼ HTTP POST (normalized message payload)
  taskjuggler-api /internal/urpa/channel-message
        │
        ▼
  UrpaCommunicationService.php
  - creates Matrix room if needed
  - triggers Pipecat if voice
  - creates TEF task if actionable
```

**Alternative approach:** Port the specific channel adapters you need directly into PHP/Laravel. The claw0 learning repository rebuilds the entire gateway from scratch in ~7,000 lines of Python with clear section-by-section explanations — good source for understanding the patterns before porting to PHP.

### Priority channels to implement (via OpenClaw reference)
1. **WhatsApp** — highest business volume
2. **Telegram** — fastest to implement, OpenClaw's best-documented adapter
3. **iMessage** — differentiator (almost no competitors support this)
4. **Signal** — privacy-focused enterprise clients
5. **Google Chat** — G Suite businesses

Slack, Teams, and Discord come via Matrix bridges — no OpenClaw needed for those.

### Competitive note
OpenClaw is the closest open source equivalent to URPA's channel monitoring concept. The key differences that make URPA defensible: OpenClaw is single-user, developer-focused, has no task layer, no billing, no multi-tenancy, and no TEF integration. URPA is the commercial, managed, multi-tenant version with task management as the output. Know the codebase well — it's your most direct open source competitor.

---

## Phase 3: Add LiveKit — 2 weeks

### What LiveKit replaces
- AWS Chime SDK in IdeaCircuit (per-minute billing → self-hosted)
- The fake video toggle in VideoCall.vue

### Railway service: `livekit-server`
- LiveKit open source server (Go)
- Handles WebRTC SFU — actual video/audio media routing
- Integrates with Matrix for room signaling (MatrixRTC spec)

### IdeaCircuit changes
- Replace ChimeService.php with LiveKitService.php
- MeetingController creates a LiveKit room instead of Chime meeting
- VideoCall.vue uses `livekit-client` JS SDK — actual video, not a boolean
- VoiceControls.vue stays (browser MediaRecorder for local recording is fine)

### URPA voice calls via LiveKit
- Inbound calls: Twilio receives → routes to LiveKit room → Pipecat agent joins the room
- Outbound calls: Pipecat initiates → LiveKit room → Twilio SIP bridge
- Replaces the direct Vapi dependency for most call scenarios

---

## Phase 4: Add Pipecat — 3 weeks

### What Pipecat replaces
- Vapi (eliminates per-minute cost)
- Rebuilds the voice AI pipeline with full ownership

### Railway service: `pipecat-agent` (Python)
Pipeline per call:
```
Inbound audio → Deepgram STT → Claude/GPT LLM → ElevenLabs TTS → LiveKit transport → outbound audio
                                    │
                                    ▼
                           TEF task extraction
                                    │
                                    ▼
                        taskjuggler-api /tasks (create)
```

### You already have ElevenLabs
The `TtsService.php` in URPA uses ElevenLabs. Pipecat supports ElevenLabs natively. Migration is configuration, not rebuild.

### URPA architecture after Pipecat
```
Before: URPA UI → Laravel → Vapi API (their servers, their pricing)
After:  URPA UI → Laravel → Pipecat (your server) → LiveKit (your server)
                                                    → ElevenLabs (per-character, ~10x cheaper than Vapi)
                                                    → Deepgram (per-minute, ~5x cheaper than Vapi)
```

### Cost math
- Vapi: ~$0.07/min all-in
- Pipecat stack: ~$0.012/min (Deepgram $0.004 + ElevenLabs $0.005 + LiveKit $0.002 + compute)
- At 10,000 minutes/month: Vapi = $700, Pipecat stack = $120

### 4Calls specifics
4Calls keeps Twilio for PSTN (phone numbers, inbound routing). Twilio is unavoidable for actual phone calls. What changes is everything after the Twilio webhook — instead of routing to Vapi, route to Pipecat running on LiveKit. Same phone numbers, same inbound logic, completely different (owned) processing pipeline.

---

## Integration Architecture: URPA as the Hub

This is the key design decision. URPA should be the **communications hub** that TaskJuggler integrates with, not the other way around.

```
External world                URPA                         TaskJuggler
─────────────                 ────                         ───────────
WhatsApp     ──→ OpenClaw  →  Matrix room  ──────────────→ Task via TEF
Telegram     ──→ OpenClaw  →  Matrix room  ──────────────→ Task via TEF
iMessage     ──→ OpenClaw  →  Matrix room  ──────────────→ Task via TEF
Signal       ──→ OpenClaw  →  Matrix room  ──────────────→ Task via TEF
Slack        ──→ Matrix bridge → Matrix room ────────────→ Task via TEF
Teams        ──→ Matrix bridge → Matrix room ────────────→ Task via TEF
Discord      ──→ Matrix bridge → Matrix room ────────────→ Task via TEF
Phone call   ──→ Twilio/Pipecat → transcript ────────────→ Task via TEF
Email        ──────────────→  Matrix room  ──────────────→ Task via TEF

                TaskJuggler                         URPA
                ───────────                         ────
Task assigned  ────────────────────────────────────→ URPA activity
Task completed ────────────────────────────────────→ URPA notification
Task message   ────────────────────────────────────→ Matrix room message
```

URPA monitors everything, creates tasks. TaskJuggler manages tasks, reports back. They share the same Laravel backend (same monolith, separate modules) — no HTTP calls between them, direct service calls.

---

## What Stays Separate (By Design)

| System | Stays Separate Because |
|--------|----------------------|
| Dendrite (Matrix) | External protocol server, not Laravel |
| LiveKit | Media server, not application logic |
| Pipecat | Python agent runtime, not PHP |
| OpenClaw | Reference/sidecar — connector logic only, not a core dependency |
| Twilio | PSTN gateway, unavoidable |
| ElevenLabs | TTS service, best in class |

Each external service talks to Laravel only. They never talk to each other directly. Laravel is the integration hub.

---

## Build Order & Ownership

| Phase | Work | Duration | Kills |
|-------|------|----------|-------|
| 1 | Fix URPA↔TJ sync token | 1 week | Broken sync |
| 2 | Dendrite + MatrixService + Vue SDK | 3 weeks | Fake messaging |
| 2.5 | OpenClaw sidecar + channel connectors (Telegram first) | 2 weeks | Manual channel setup |
| 3 | LiveKit + LiveKitService + VideoCall.vue | 2 weeks | AWS Chime cost + fake video |
| 4 | Pipecat agent service | 3 weeks | Vapi cost |
| Total | | ~12 weeks | |

---

## What This Gives You at the End

- **TaskJuggler** — task management with real Matrix-backed messaging on every task, no fake chat
- **URPA** — AI personal assistant that genuinely monitors channels (Matrix bridges for Slack/Teams/Discord, OpenClaw connectors for WhatsApp/Telegram/iMessage/Signal), voice powered by Pipecat, tasks sync to TaskJuggler automatically via TEF
- **IdeaCircuit** — real video via LiveKit, meeting tasks flow into TaskJuggler via TEF
- **4Calls** — keeps Twilio for PSTN, replaces Vapi with Pipecat, ~80% cost reduction
- **Matrix bridges** — URPA users communicate with people on Slack or Teams without those people needing an account
- **OpenClaw connectors** — URPA reaches platforms Matrix doesn't bridge well: iMessage, Signal, WhatsApp personal, Telegram

The platform catches up from 2024 architecture to what you'd design today.
