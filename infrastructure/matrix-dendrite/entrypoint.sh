#!/bin/sh
set -e

CONFIG_DIR="/etc/dendrite"
DATA_DIR="/var/dendrite"
PORT="${PORT:-8008}"

mkdir -p "$CONFIG_DIR" "$DATA_DIR/media" "$DATA_DIR/jetstream" "$DATA_DIR/searchindex"

if [ -z "${MATRIX_SERVER_NAME:-}" ]; then
  echo "MATRIX_SERVER_NAME is required"
  exit 1
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required"
  exit 1
fi

# Official Dendrite image expects matrix_key.pem + TLS cert/key in /etc/dendrite
if [ ! -f "$CONFIG_DIR/matrix_key.pem" ]; then
  /usr/bin/generate-keys \
    -private-key "$CONFIG_DIR/matrix_key.pem" \
    -tls-cert "$CONFIG_DIR/server.crt" \
    -tls-key "$CONFIG_DIR/server.key"
fi

if [ ! -f "$CONFIG_DIR/dendrite.yaml" ]; then
  /usr/bin/generate-config \
    -dir "$DATA_DIR/" \
    -db "$DATABASE_URL" \
    -server "$MATRIX_SERVER_NAME" > "$CONFIG_DIR/dendrite.yaml"

  if [ -n "${MATRIX_APPSERVICE_URL:-}" ]; then
    cat > "$CONFIG_DIR/appservice.yaml" <<AS_EOF
id: fibonacco-laravel
url: ${MATRIX_APPSERVICE_URL}
as_token: ${MATRIX_APPSERVICE_TOKEN:-fibonacco-as-token}
hs_token: ${MATRIX_HOMESERVER_TOKEN:-fibonacco-hs-token}
sender_localpart: laravel
namespaces:
  users:
    - exclusive: false
      regex: "@.*"
  rooms:
    - exclusive: false
      regex: ".*"
  aliases:
    - exclusive: false
      regex: ".*"
AS_EOF
    # Append appservice block (generate-config does not include appservices)
    cat >> "$CONFIG_DIR/dendrite.yaml" <<EOF

appservice_api:
  config_files:
    - ${CONFIG_DIR}/appservice.yaml
EOF
  fi
fi

# Lock down account creation on every boot (idempotent), so an already-generated
# config is also corrected on restart. Open (anonymous) registration stays OFF;
# Laravel provisions accounts via the registration shared secret only.
sed -i "s|registration_disabled: .*|registration_disabled: true|" "$CONFIG_DIR/dendrite.yaml" 2>/dev/null || true
if [ -n "${MATRIX_REGISTRATION_SHARED_SECRET:-}" ]; then
  sed -i "s|registration_shared_secret: .*|registration_shared_secret: \"${MATRIX_REGISTRATION_SHARED_SECRET}\"|" \
    "$CONFIG_DIR/dendrite.yaml" 2>/dev/null || true
fi

# Dendrite monolith binary (image default)
exec /usr/bin/dendrite --config "$CONFIG_DIR/dendrite.yaml" --http-bind-address "0.0.0.0:${PORT}"
