#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# healthcheck.sh — Smoke test all services
# ---------------------------------------------------------------------------

BASE_URL="${1:-http://localhost}"
FAIL=0

check() {
  local label="$1"
  local url="$2"
  local expect="${3:-200}"

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" || echo "000")
  if [[ "$HTTP_CODE" == "$expect" ]]; then
    echo "  PASS  $label ($url) → $HTTP_CODE"
  else
    echo "  FAIL  $label ($url) → $HTTP_CODE (expected $expect)"
    FAIL=1
  fi
}

echo "=== Smoke Test: $BASE_URL ==="
check "Frontend home"    "$BASE_URL/"                      200
check "Programs page"    "$BASE_URL/programs"               200
check "Courses page"     "$BASE_URL/courses"                200
check "API health"       "$BASE_URL/api/v1/health"          200
check "API programs"     "$BASE_URL/api/v1/programs"        200
check "API courses"      "$BASE_URL/api/v1/courses"         200
check "Admin login"      "$BASE_URL/admin/login"            200
check "Admin (redirect)" "$BASE_URL/admin"                  200

if [[ $FAIL -eq 1 ]]; then
  echo ""
  echo "One or more checks FAILED. Review service logs:"
  echo "  docker compose -f docker-compose.prod.yml logs --tail=50"
  exit 1
fi

echo ""
echo "All checks passed."
