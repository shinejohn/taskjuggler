#!/bin/sh
set -e

PORT="${PORT:-7880}"
CONFIG="/tmp/livekit.yaml"

if [ -n "${LIVEKIT_KEYS:-}" ]; then
  KEY_LINE="$LIVEKIT_KEYS"
elif [ -n "${LIVEKIT_API_KEY:-}" ] && [ -n "${LIVEKIT_API_SECRET:-}" ]; then
  KEY_LINE="${LIVEKIT_API_KEY}: ${LIVEKIT_API_SECRET}"
else
  KEY_LINE="devkey: secret"
fi

cat > "$CONFIG" <<EOF
port: ${PORT}
bind_addresses:
  - 0.0.0.0
keys:
  ${KEY_LINE}
EOF

exec livekit-server --config "$CONFIG"
