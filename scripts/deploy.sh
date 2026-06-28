#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# deploy.sh — Production deployment for SFBU ECE Program Explorer
#
# Usage:
#   ./scripts/deploy.sh [--env-file <path>]
#
# Prerequisites:
#   - Docker + Docker Compose installed
#   - .env.prod file present (or pass --env-file)
#   - SSL certs in docker/ssl/cert.pem and docker/ssl/key.pem
# ---------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="${PROJECT_DIR}/.env.prod"
COMPOSE_FILE="${PROJECT_DIR}/docker-compose.prod.yml"

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --env-file) ENV_FILE="$2"; shift 2 ;;
    *) echo "Unknown argument: $1"; exit 1 ;;
  esac
done

cd "$PROJECT_DIR"

echo "=== SFBU ECE Program Explorer — Production Deploy ==="
echo "Env file : $ENV_FILE"
echo "Compose  : $COMPOSE_FILE"
echo ""

# Validate env file
if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: env file not found: $ENV_FILE"
  echo "Copy .env.example to .env.prod and fill in production values."
  exit 1
fi

# Validate SSL certs
if [[ ! -f "docker/ssl/cert.pem" || ! -f "docker/ssl/key.pem" ]]; then
  echo "ERROR: SSL certificates missing."
  echo "Expected: docker/ssl/cert.pem and docker/ssl/key.pem"
  echo "For self-signed (testing only): run scripts/gen-self-signed-cert.sh"
  exit 1
fi

echo "--- Pulling latest code ---"
git pull --ff-only

echo ""
echo "--- Building production images ---"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build --no-cache

echo ""
echo "--- Starting database ---"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d postgres
echo "Waiting for database to be healthy..."
for i in $(seq 1 30); do
  if docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres \
      pg_isready -U "$(grep POSTGRES_USER "$ENV_FILE" | cut -d= -f2)" > /dev/null 2>&1; then
    echo "Database ready."
    break
  fi
  if [[ $i -eq 30 ]]; then
    echo "ERROR: Database failed to become healthy."
    exit 1
  fi
  sleep 2
done

echo ""
echo "--- Running migrations ---"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" run --rm backend \
  npm run migration:run

echo ""
echo "--- Starting all services ---"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d

echo ""
echo "--- Waiting for services to be healthy (60s) ---"
sleep 60

echo ""
echo "--- Smoke test ---"
bash "$SCRIPT_DIR/healthcheck.sh"

echo ""
echo "=== Deploy complete ==="
