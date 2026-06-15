#!/bin/sh
set -e

CONFIG_DIR="/etc/dendrite"
DATA_DIR="/var/lib/dendrite"

mkdir -p "$CONFIG_DIR" "$DATA_DIR"

if [ ! -f "$CONFIG_DIR/dendrite.yaml" ]; then
  if [ -z "$MATRIX_SERVER_NAME" ]; then
    echo "MATRIX_SERVER_NAME is required"
    exit 1
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

appservice_api:
  config_files:
    - ${CONFIG_DIR}/appservice.yaml

logging:
  - type: std
    level: info
EOF

  if [ -n "$MATRIX_APPSERVICE_URL" ]; then
    cat > "$CONFIG_DIR/appservice.yaml" <<EOF
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
EOF
  fi

  if [ ! -f "$CONFIG_DIR/server.key" ]; then
    /usr/bin/dendrite-monolith-server --version >/dev/null 2>&1 || true
    # Generate signing key via dendrite if available
    if command -v generate-keys >/dev/null 2>&1; then
      generate-keys -privatekey "$CONFIG_DIR/server.key"
    else
      openssl genrsa -out "$CONFIG_DIR/server.key" 4096
    fi
  fi
fi

exec /usr/bin/dendrite-monolith-server --config "$CONFIG_DIR/dendrite.yaml" --http-bind-address 0.0.0.0:8008
