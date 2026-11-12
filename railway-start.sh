#!/bin/sh
# Starts HeyForm, then creates the owner account on first boot.
set -e

# Defaults for settings that the template doesn't need to expose.
# Set the variable on the service to override any of them.
export NODE_ENV="${NODE_ENV:-production}"
export APP_LISTEN_PORT="${APP_LISTEN_PORT:-9157}"
export APP_DISABLE_REGISTRATION="${APP_DISABLE_REGISTRATION:-true}"
export TRUST_PROXY="${TRUST_PROXY:-1}"
if [ -z "$APP_HOMEPAGE_URL" ] && [ -n "$RAILWAY_PUBLIC_DOMAIN" ]; then
  export APP_HOMEPAGE_URL="https://$RAILWAY_PUBLIC_DOMAIN"
fi

for v in MONGO_URI REDIS_HOST SESSION_KEY FORM_ENCRYPTION_KEY; do
  eval "val=\${$v:-}"
  [ -n "$val" ] || { echo "railway-start: $v is not set" >&2; exit 1; }
done

cd /app/packages/server
main=./dist/main.js
[ -f "$main" ] || main=./dist/src/main.js
[ -f "$main" ] || main=./dist/packages/server/main.js

node --enable-source-maps "$main" &
pid=$!
trap 'kill -TERM "$pid" 2>/dev/null; wait "$pid" || true; exit 0' TERM INT

# The seed runs alongside the server so a stop signal is handled at once.
node /opt/railway/seed.mjs &

wait "$pid"
