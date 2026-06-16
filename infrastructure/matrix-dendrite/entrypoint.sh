#!/bin/sh
set -e

CONFIG_DIR="/etc/dendrite"
DATA_DIR="/var/lib/dendrite"
PORT="${PORT:-8008}"
BINARY="/usr/bin/dendrite-monolith-server"
GENERATE_KEYS="/usr/bin/generate-keys"

mkdir -p "$CONFIG_DIR" "$DATA_DIR"

if [ -z "${MATRIX_SERVER_NAME:-}" ]; then
  echo "MATRIX_SERVER_NAME is required"
  exit 1
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required"
  exit 1
fi

if [ ! -f "$CONFIG_DIR/server.key" ]; then
  if [ -x "$GENERATE_KEYS" ]; then
    "$GENERATE_KEYS" -privatekey "$CONFIG_DIR/server.key"
  else
    echo "generate-keys not found in image"
    exit 1
  fi
fi

if [ ! -f "$CONFIG_DIR/dendrite.yaml" ]; then
  APPSERVICE_BLOCK=""
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
    APPSERVICE_BLOCK="
appservice_api:
  config_files:
    - ${CONFIG_DIR}/appservice.yaml"
  fi

  cat > "$CONFIG_DIR/dendrite.yaml" <<EOF
version: 2

global:
  server_name: ${MATRIX_SERVER_NAME}
  private_key: ${CONFIG_DIR}/server.key
  key_validity_period: 168h0m0s

client_api:
  registration_disabled: false
  enable_registration_captcha: false
  registration_shared_secret: "${MATRIX_REGISTRATION_SHARED_SECRET:-changeme}"

federation_api:
  disable_federation: true

media_api:
  base_path: ${DATA_DIR}/media

sync_api:
  search:
    enabled: true

user_api:
  account_database:
    connection_string: ${DATABASE_URL}
    max_open_conns: 10
    max_idle_conns: 2

room_server:
  database:
    connection_string: ${DATABASE_URL}
    max_open_conns: 10
    max_idle_conns: 2

key_server:
  database:
    connection_string: ${DATABASE_URL}
    max_open_conns: 10
    max_idle_conns: 2

relay_api:
  database:
    connection_string: ${DATABASE_URL}
    max_open_conns: 10
    max_idle_conns: 2
${APPSERVICE_BLOCK}

logging:
  - type: std
    level: info
EOF
fi

exec "$BINARY" --config "$CONFIG_DIR/dendrite.yaml" --http-bind-address "0.0.0.0:${PORT}"
