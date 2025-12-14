#!/usr/bin/env sh
set -e

STATE_DIR="/app/.state"
MARKER_FILE="$STATE_DIR/db_initialized"

mkdir -p "$STATE_DIR"

if [ ! -f "$MARKER_FILE" ]; then
  echo "==> First run detected. Initializing database..."

  echo "==> Installing Drizzle temporarily..."
  npm i drizzle-orm --no-save

  echo "==> Running migrations..."
  npm run db:migrate:prod

  echo "==> Removing Drizzle..."
  npm uninstall drizzle-orm || true

  echo "==> Marking DB as initialized."
  touch "$MARKER_FILE"
else
  echo "==> Database already initialized. Skipping migration."
fi

echo "==> Starting application..."
exec node .output/server/index.mjs
