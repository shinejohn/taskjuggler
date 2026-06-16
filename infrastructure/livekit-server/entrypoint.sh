#!/bin/sh
set -e

PORT="${PORT:-7880}"
CONFIG="/tmp/livekit.yaml"
BINARY="/livekit-server"
API_KEY="${LIVEKIT_API_KEY:-fibonacco}"
API_SECRET="${LIVEKIT_API_SECRET:-secret}"

if [ -n "${LIVEKIT_KEYS:-}" ]; then
  API_KEY=$(echo "$LIVEKIT_KEYS" | cut -d: -f1 | tr -d ' ')
  API_SECRET=$(echo "$LIVEKIT_KEYS" | cut -d: -f2- | sed 's/^ *//')
fi

cat > "$CONFIG" <<EOF
port: ${PORT}
bind_addresses:
  - 0.0.0.0
keys:
  ${API_KEY}: "${API_SECRET}"
logging:
  level: info
EOF

exec "$BINARY" --config "$CONFIG" --bind 0.0.0.0
