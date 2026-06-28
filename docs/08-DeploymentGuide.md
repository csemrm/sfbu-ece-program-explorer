# SFBU ECE Program Explorer — Deployment Guide

Version: 2.0
Updated: 2026-06-27

---

## Architecture

```
Internet → Nginx (80/443) → Next.js frontend (3000)
                          → NestJS backend (3001) → PostgreSQL (5432)
```

All services run in Docker containers orchestrated by Docker Compose.

---

## Quick Start (Local Development)

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start all services
docker compose up -d

# 3. Run migrations
docker compose exec backend npm run migration:run

# 4. Seed catalog data
docker compose exec backend npm run seed

# 5. Verify
curl http://localhost/api/v1/health
# → {"status":"ok"}
```

Access points:
- Frontend: http://localhost
- Admin: http://localhost/admin
- API: http://localhost/api/v1
- pgAdmin: http://localhost:8080

---

## Production Deployment

### Prerequisites

- Linux server with Docker + Docker Compose v2
- Domain name pointing to server IP
- SSL certificate (`docker/ssl/cert.pem` + `docker/ssl/key.pem`)

### 1. Clone the repository

```bash
git clone https://github.com/csemrm/sfbu-ece-program-explorer.git
cd sfbu-ece-program-explorer
```

### 2. Configure environment

```bash
cp .env.example .env.prod
```

Edit `.env.prod` and set all values — especially:

| Variable | Required value |
|---|---|
| `POSTGRES_PASSWORD` | Strong random password |
| `JWT_SECRET` | 64+ character random string |
| `CORS_ORIGIN` | Your domain, e.g. `https://ece.sfbu.edu` |
| `NEXT_PUBLIC_API_URL` | `https://ece.sfbu.edu/api/v1` |

Generate a secret:
```bash
openssl rand -base64 48
```

### 3. Obtain SSL certificates

**Let's Encrypt (recommended):**
```bash
# Install certbot, then:
certbot certonly --standalone -d ece.sfbu.edu
mkdir -p docker/ssl
cp /etc/letsencrypt/live/ece.sfbu.edu/fullchain.pem docker/ssl/cert.pem
cp /etc/letsencrypt/live/ece.sfbu.edu/privkey.pem   docker/ssl/key.pem
```

**Self-signed (staging/testing only):**
```bash
./scripts/gen-self-signed-cert.sh
```

### 4. Deploy

```bash
./scripts/deploy.sh --env-file .env.prod
```

The deploy script:
1. Pulls latest code
2. Builds production Docker images
3. Starts PostgreSQL and waits for it to be healthy
4. Runs database migrations
5. Starts all services
6. Runs smoke tests

### 5. Seed initial data (first deploy only)

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod \
  exec backend npm run seed
```

---

## Environment Variables

### Frontend

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Public API URL (browser) | `https://ece.sfbu.edu/api/v1` |
| `NEXT_PUBLIC_APP_NAME` | App name | `SFBU ECE Program Explorer` |
| `API_BASE_URL` | Internal SSR API URL (set in compose) | `http://backend:3001/api/v1` |

### Backend

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for JWT signing (min 32 chars) |
| `PORT` | Backend port (default: 3001) |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | Allowed CORS origin |

### Database

| Variable | Description |
|---|---|
| `POSTGRES_USER` | Database username |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_DB` | Database name |

### Admin seed (first run only)

| Variable | Description |
|---|---|
| `ADMIN_SEED_EMAIL` | Initial admin email |
| `ADMIN_SEED_PASSWORD` | Initial admin password — **change after first login** |

---

## Docker Compose Files

| File | Purpose |
|---|---|
| `docker-compose.yml` | Local development (hot reload, pgAdmin, HTTP only) |
| `docker-compose.prod.yml` | Production (production builds, HTTPS, no pgAdmin) |

---

## Database Operations

### Run migrations

```bash
# Development
docker compose exec backend npm run migration:run

# Production
docker compose -f docker-compose.prod.yml --env-file .env.prod \
  run --rm backend npm run migration:run
```

### Revert last migration

```bash
docker compose exec backend npm run migration:revert
```

### Seed catalog data

```bash
docker compose exec backend npm run seed
```

---

## Backup & Restore

### Create a backup

```bash
./scripts/backup.sh --env-file .env.prod
# Output: backups/sfbu_ece_YYYYMMDD_HHMMSS.sql.gz
```

Retains the last 30 backups automatically.

### Schedule daily backups (cron)

```cron
0 2 * * * /path/to/project/scripts/backup.sh --env-file /path/to/.env.prod >> /var/log/sfbu-backup.log 2>&1
```

### Restore from backup

```bash
./scripts/restore.sh backups/sfbu_ece_20260627_120000.sql.gz --env-file .env.prod
```

---

## Health Check & Smoke Tests

```bash
# Against production
./scripts/healthcheck.sh https://ece.sfbu.edu

# Against localhost
./scripts/healthcheck.sh http://localhost
```

Checks: frontend, programs page, courses page, API health, API programs, API courses, admin login.

---

## CI/CD Pipeline

GitHub Actions runs on push to `main` and `develop`:

| Job | What it does |
|---|---|
| `backend` | Install → lint → build → unit tests (with real Postgres) |
| `frontend` | Install → lint → type check → Next.js build |
| `docker` | Build production Docker images for both services |

The `docker` job runs only after `backend` and `frontend` pass, catching Dockerfile regressions.

---

## Nginx Configuration

| File | Purpose |
|---|---|
| `docker/nginx.conf` | Development — HTTP only |
| `docker/nginx.prod.conf` | Production — HTTPS, security headers, rate limiting |

Production nginx:
- HTTP → HTTPS redirect
- TLS 1.2 + 1.3 only
- Security headers: HSTS, X-Frame-Options, CSP, Referrer-Policy
- Rate limiting on `/api` (30 req/min per IP, burst 20)
- Static asset caching (`/_next/static` → 1-year immutable)

---

## Rollback

```bash
# Stop current deployment
docker compose -f docker-compose.prod.yml --env-file .env.prod down

# Checkout previous version
git checkout <previous-tag-or-commit>

# Redeploy
./scripts/deploy.sh --env-file .env.prod

# If database schema changed, restore from backup
./scripts/restore.sh backups/<latest-good-backup>.sql.gz --env-file .env.prod
```

---

## Troubleshooting

### Services not starting

```bash
docker compose -f docker-compose.prod.yml logs --tail=100
docker compose -f docker-compose.prod.yml ps
```

### Database connection refused

```bash
docker compose -f docker-compose.prod.yml logs postgres
# Check POSTGRES_USER / POSTGRES_PASSWORD / DATABASE_URL match
```

### Frontend shows blank / API errors

```bash
# Check NEXT_PUBLIC_API_URL is the public URL (not internal)
# Check CORS_ORIGIN matches the frontend domain
docker compose -f docker-compose.prod.yml logs frontend
docker compose -f docker-compose.prod.yml logs backend
```

### Nginx 502 Bad Gateway

```bash
docker compose -f docker-compose.prod.yml ps
# frontend or backend container may not be healthy yet — wait or restart
docker compose -f docker-compose.prod.yml restart nginx
```

### API health endpoint

```bash
curl https://ece.sfbu.edu/api/v1/health
# Expected: {"status":"ok"}
```

---

## Security Checklist

- [ ] All secrets in `.env.prod`, never committed to git
- [ ] `JWT_SECRET` is at least 48 random characters
- [ ] `POSTGRES_PASSWORD` is strong and unique
- [ ] HTTPS enabled with valid certificate
- [ ] Admin password changed after first login
- [ ] Postgres port (5432) not exposed to internet (compose `internal` network only)
- [ ] pgAdmin not running in production
- [ ] `docker/ssl/` added to `.gitignore`

---

## System Requirements

| Component | Minimum | Recommended |
|---|---|---|
| CPU | 1 vCPU | 2 vCPU |
| RAM | 2 GB | 4–8 GB |
| Disk | 20 GB | 100 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| Docker | 24+ | latest |
