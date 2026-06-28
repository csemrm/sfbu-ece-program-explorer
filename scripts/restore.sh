#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# restore.sh — Restore PostgreSQL database from a backup file
#
# Usage:
#   ./scripts/restore.sh <backup-file> [--env-file <path>]
#
# Example:
#   ./scripts/restore.sh backups/sfbu_ece_20260627_120000.sql.gz
#
# WARNING: This drops and recreates the database. All current data is lost.
# ---------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="${PROJECT_DIR}/.env.prod"
BACKUP_FILE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env-file) ENV_FILE="$2"; shift 2 ;;
    *)
      if [[ -z "$BACKUP_FILE" ]]; then
        BACKUP_FILE="$1"
      else
        echo "Unknown argument: $1"; exit 1
      fi
      shift ;;
  esac
done

if [[ -z "$BACKUP_FILE" ]]; then
  echo "Usage: $0 <backup-file> [--env-file <path>]"
  exit 1
fi

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "ERROR: Backup file not found: $BACKUP_FILE"
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: env file not found: $ENV_FILE"
  exit 1
fi

POSTGRES_USER=$(grep '^POSTGRES_USER=' "$ENV_FILE" | cut -d= -f2)
POSTGRES_DB=$(grep '^POSTGRES_DB='   "$ENV_FILE" | cut -d= -f2)

echo "=== SFBU ECE Database Restore ==="
echo "Backup : $BACKUP_FILE"
echo "Target : $POSTGRES_DB"
echo ""
echo "WARNING: This will DESTROY all current data in '$POSTGRES_DB'."
read -r -p "Type 'yes' to continue: " CONFIRM
if [[ "$CONFIRM" != "yes" ]]; then
  echo "Aborted."
  exit 0
fi

echo ""
echo "--- Dropping and recreating database ---"
docker exec sfbu_postgres psql -U "$POSTGRES_USER" -c "DROP DATABASE IF EXISTS \"$POSTGRES_DB\";"
docker exec sfbu_postgres psql -U "$POSTGRES_USER" -c "CREATE DATABASE \"$POSTGRES_DB\";"

echo "--- Restoring from backup ---"
if [[ "$BACKUP_FILE" == *.gz ]]; then
  gunzip -c "$BACKUP_FILE" | docker exec -i sfbu_postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
else
  docker exec -i sfbu_postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < "$BACKUP_FILE"
fi

echo ""
echo "=== Restore complete ==="
echo "Run migrations if schema version changed:"
echo "  docker compose -f docker-compose.prod.yml run --rm backend npm run migration:run"
