# SFBU ECE Program Explorer

Interactive curriculum visualization platform for the Electrical and Computer Engineering Department at San Francisco Bay University.

Supports: **BSCS** · **MSCS** · **MSEE**

---

## Prerequisites

- Node.js 20+
- Docker + Docker Compose
- npm

---

## Quick Start (Docker)

```bash
cp .env.example .env
docker compose up -d
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/v1
- Health check: http://localhost:3001/api/v1/health

---

## Local Development

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Backend**
```bash
cd backend
npm install
npm run start:dev
```

**Database** (Docker only)
```bash
docker compose up postgres -d
```

---

## Project Structure

```
sfbu-ece-program-explorer/
├── frontend/          # Next.js + React + TypeScript + Tailwind CSS
├── backend/           # NestJS + TypeScript + TypeORM
├── database/          # Migrations and seed scripts
├── docker/            # Nginx config
├── docs/              # Architecture, API, DB, UI/UX specs
├── epics/             # Development epics (001–009)
├── management/        # Roadmap, tasks, changelog
├── .github/workflows/ # CI pipeline
└── docker-compose.yml
```

---

## Documentation

| Document | Purpose |
|---|---|
| [docs/01-SRS.md](docs/01-SRS.md) | Software Requirements |
| [docs/02-Architecture.md](docs/02-Architecture.md) | System Architecture |
| [docs/03-Database.md](docs/03-Database.md) | Database Design |
| [docs/04-API.md](docs/04-API.md) | REST API Spec |
| [docs/05-UI-UX.md](docs/05-UI-UX.md) | UI/UX Design |
| [management/PROJECT_ROADMAP.md](management/PROJECT_ROADMAP.md) | Milestones |
| [management/TASKS.md](management/TASKS.md) | Task tracker |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Visualization | React Flow, D3.js, Recharts |
| Backend | NestJS, TypeScript, TypeORM |
| Database | PostgreSQL 16 |
| Deployment | Docker, Docker Compose, Nginx |

---

## Status

**Milestone 1 — Project Foundation** · In Progress

See [management/PROJECT_ROADMAP.md](management/PROJECT_ROADMAP.md) for full roadmap.
