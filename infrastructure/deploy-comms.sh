#!/bin/bash
# Deploy comms infra services to Railway (Fibonacco AI Tools project).
set -euo pipefail

PROJECT_ID="ca3879ff-fd72-4239-983d-32ade6cace83"
ENVIRONMENT="production"
API_SERVICE="ai-tools-api"
API_URL="${API_URL:-https://ai-tools-api-production-2c1e.up.railway.app}"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

log() { echo -e "${CYAN}$*${NC}"; }
ok() { echo -e "${GREEN}✓ $*${NC}"; }
fail() { echo -e "${RED}✗ $*${NC}"; exit 1; }

command -v railway >/dev/null || fail "Railway CLI not installed"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

deploy_service() {
  local name="$1"
  local dir="$2"
  log "Deploying ${name} from ${dir}..."
  cd "$dir"
  railway link -p "$PROJECT_ID" -e "$ENVIRONMENT" -s "$name" 2>/dev/null || \
    railway link -p "$PROJECT_ID" -e "$ENVIRONMENT"
  railway up -d -s "$name" .
  ok "${name} deploy triggered"
  cd "$ROOT"
}

# Create services if missing (idempotent — ignores already exists)
create_service() {
  local name="$1"
  log "Ensuring service ${name} exists..."
  railway link -p "$PROJECT_ID" -e "$ENVIRONMENT" 2>/dev/null || true
  railway add -s "$name" 2>/dev/null || true
}

create_service "pipecat-agent"
create_service "livekit-server"
create_service "matrix-dendrite"

deploy_service "pipecat-agent" "$ROOT/infrastructure/pipecat-agent"
deploy_service "livekit-server" "$ROOT/infrastructure/livekit-server"
deploy_service "matrix-dendrite" "$ROOT/infrastructure/matrix-dendrite"

# Generate secrets
PIPECAT_SECRET=$(openssl rand -hex 24)
MATRIX_WEBHOOK_SECRET=$(openssl rand -hex 24)
MATRIX_AS_TOKEN=$(openssl rand -hex 24)
MATRIX_HS_TOKEN=$(openssl rand -hex 24)
LIVEKIT_KEY="fibonacco"
LIVEKIT_SECRET=$(openssl rand -hex 32)

log "Setting pipecat-agent variables..."
railway variables -s pipecat-agent \
  --set "PIPECAT_WEBHOOK_SECRET=${PIPECAT_SECRET}" \
  --set "PORT=8080" 2>/dev/null || true

log "Setting livekit-server variables..."
railway variables -s livekit-server \
  --set "LIVEKIT_KEYS=${LIVEKIT_KEY}: ${LIVEKIT_SECRET}" 2>/dev/null || true

log "Setting matrix-dendrite variables..."
railway variables -s matrix-dendrite \
  --set "MATRIX_SERVER_NAME=fibonacco.ai" \
  --set "MATRIX_APPSERVICE_URL=${API_URL}/api/matrix/webhook" \
  --set "MATRIX_APPSERVICE_TOKEN=${MATRIX_AS_TOKEN}" \
  --set "MATRIX_HOMESERVER_TOKEN=${MATRIX_HS_TOKEN}" \
  --set "MATRIX_REGISTRATION_SHARED_SECRET=$(openssl rand -hex 16)" 2>/dev/null || true

log "Setting ai-tools-api comms variables..."
railway variables -s "$API_SERVICE" \
  --set "PIPECAT_ENABLED=true" \
  --set "PIPECAT_REPLACE_VAPI=false" \
  --set "PIPECAT_WEBHOOK_SECRET=${PIPECAT_SECRET}" \
  --set "LIVEKIT_ENABLED=true" \
  --set "LIVEKIT_API_KEY=${LIVEKIT_KEY}" \
  --set "LIVEKIT_API_SECRET=${LIVEKIT_SECRET}" \
  --set "MATRIX_ENABLED=true" \
  --set "MATRIX_WEBHOOK_SECRET=${MATRIX_WEBHOOK_SECRET}" \
  --set "MATRIX_APPSERVICE_TOKEN=${MATRIX_AS_TOKEN}" 2>/dev/null || true

ok "Comms infra deploy complete. Run 'railway domain' on each service for public URLs."
log "After domains are assigned, set on ${API_SERVICE}:"
log "  LIVEKIT_URL=wss://<livekit-server-domain>"
log "  MATRIX_HOMESERVER_URL=https://<matrix-dendrite-domain>"
log "  PIPECAT_AGENT_URL=https://<pipecat-agent-domain>"
