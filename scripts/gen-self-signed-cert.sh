#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# gen-self-signed-cert.sh — Generate a self-signed SSL cert for local/staging
#
# For production use real certificates (Let's Encrypt / Certbot).
# ---------------------------------------------------------------------------

OUT_DIR="$(dirname "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)")/docker/ssl"
mkdir -p "$OUT_DIR"

openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout "$OUT_DIR/key.pem" \
  -out    "$OUT_DIR/cert.pem" \
  -subj   "/C=US/ST=California/L=Fremont/O=SFBU/OU=ECE/CN=localhost"

echo "Self-signed cert generated:"
echo "  $OUT_DIR/cert.pem"
echo "  $OUT_DIR/key.pem"
echo ""
echo "For production, replace these with real certificates."
