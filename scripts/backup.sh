#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# backup.sh — PostgreSQL database backup
#
# Usage:
#   ./scripts/backup.sh [--env-file <path>] [--output-dir <path>]
#
# Creates a timestamped .sql.gz dump in the output directory.
# Retains the last 30 backups (older files are removed).
# ---------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="${PROJECT_DIR}/.env.prod"
OUTPUT_DIR="${PROJECT_DIR}/backups"
RETAIN=30

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env-file)    ENV_FILE="$2";    shift 2 ;;
    --output-dir)  OUTPUT_DIR="$2";  shift 2 ;;
    *) echo "Unknown argument: $1"; exit 1 ;;
  esac
done

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: env file not found: $ENV_FILE"
  exit 1
fi

# Load relevant vars
POSTGRES_USER=$(grep '^POSTGRES_USER=' "$ENV_FILE" | cut -d= -f2)
POSTGRES_DB=$(grep '^POSTGRES_DB='   "$ENV_FILE" | cut -d= -f2)

mkdir -p "$OUTPUT_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="${OUTPUT_DIR}/sfbu_ece_${TIMESTAMP}.sql.gz"

echo "Backing up database '$POSTGRES_DB' to $FILENAME ..."

docker exec sfbu_postgres pg_dump \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  --no-password \
  | gzip > "$FILENAME"

echo "Backup complete: $FILENAME ($(du -sh "$FILENAME" | cut -f1))"

# Retain only the last $RETAIN backups
BACKUP_COUNT=$(ls -1 "${OUTPUT_DIR}"/sfbu_ece_*.sql.gz 2>/dev/null | wc -l)
if [[ "$BACKUP_COUNT" -gt "$RETAIN" ]]; then
  REMOVE=$(( BACKUP_COUNT - RETAIN ))
  echo "Removing $REMOVE old backup(s) ..."
  ls -1t "${OUTPUT_DIR}"/sfbu_ece_*.sql.gz | tail -n "$REMOVE" | xargs rm -f
fi

echo "Backup retention: $RETAIN files. Current count: $(ls -1 "${OUTPUT_DIR}"/sfbu_ece_*.sql.gz | wc -l)"
