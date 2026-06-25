SFBU ECE Program Explorer

Deployment Guide

Version: 1.0
Status: Draft

⸻

Revision History

Version	Date	Author	Description
1.0	2026-06-24	Project Team	Initial Deployment Guide

⸻

Table of Contents

1. Purpose
2. Deployment Objectives
3. Supported Environments
4. System Requirements
5. Deployment Architecture
6. Infrastructure
7. Docker Deployment
8. Environment Configuration
9. Database Deployment
10. Nginx Configuration
11. CI/CD Pipeline
12. Security Configuration
13. Monitoring & Logging
14. Backup & Disaster Recovery
15. Rollback Strategy
16. Deployment Checklist
17. Troubleshooting
18. Future Improvements
19. References

⸻

1. Purpose

This document describes the deployment process for the SFBU ECE Program Explorer.

It provides guidance for developers, DevOps engineers, and system administrators to deploy, maintain, and operate the application.

⸻

2. Deployment Objectives

The deployment strategy should:

* Be reproducible
* Be automated
* Support multiple environments
* Minimize downtime
* Support rollback
* Protect data
* Be secure

⸻

3. Supported Environments

Environment	Purpose
Local	Development
Development	Team Integration
Testing	QA
Staging	Pre-production
Production	Public Release

⸻

4. System Requirements

Frontend

* Node.js 20+
* Next.js

⸻

Backend

* Node.js 20+
* NestJS

⸻

Database

* PostgreSQL 16+

⸻

Reverse Proxy

* Nginx

⸻

Container Runtime

* Docker
* Docker Compose

⸻

Recommended OS

* Ubuntu Server LTS

⸻

5. Deployment Architecture

                Internet
                    │
                    ▼
             Nginx Reverse Proxy
          ┌─────────┴─────────┐
          ▼                   ▼
   Next.js Frontend      NestJS Backend
                                │
                                ▼
                          PostgreSQL

Optional

                Prometheus
                     │
                     ▼
                 Grafana

⸻

6. Infrastructure

Recommended

Production

* 2 vCPU
* 8 GB RAM
* 100 GB SSD

For large deployments

* Kubernetes
* Managed PostgreSQL
* CDN

⸻

7. Docker Deployment

Containers

frontend
backend
postgres
nginx

Example

docker compose up -d

Verify

docker compose ps

⸻

8. Environment Variables

Frontend

NEXT_PUBLIC_API_URL
NEXT_PUBLIC_APP_NAME

⸻

Backend

DATABASE_URL
JWT_SECRET
PORT
NODE_ENV
CORS_ORIGIN

⸻

Database

POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB

⸻

Never commit

* passwords
* secrets
* API keys

⸻

9. Database Deployment

Steps

1. Start PostgreSQL
2. Create database
3. Run migrations
4. Seed catalog data
5. Verify tables

Example

Programs
Courses
RequirementGroups
KnowledgeAreas
CatalogYears

⸻

10. Nginx Configuration

Responsibilities

* HTTPS
* Reverse Proxy
* Static Assets
* Compression
* Security Headers

Routes

/
↓
Frontend
/api
↓
Backend

⸻

11. CI/CD Pipeline

GitHub Actions

Commit
↓
Lint
↓
Format Check
↓
Unit Tests
↓
Integration Tests
↓
Build
↓
Docker Image
↓
Deploy Staging
↓
Manual Approval
↓
Deploy Production

⸻

12. Security Configuration

Production Requirements

* HTTPS
* TLS 1.3
* Strong Ciphers
* HTTP Security Headers
* RBAC
* Input Validation
* Dependency Scanning

Never expose

* PostgreSQL
* Admin API
* Internal logs

⸻

13. Monitoring

Recommended

Application

* Health endpoint

Infrastructure

* CPU
* Memory
* Disk

API

* Response Time
* Error Rate

Database

* Connections
* Slow Queries

⸻

Logging

Frontend

Browser errors

Backend

Application logs

Nginx

Access logs

PostgreSQL

Database logs

Recommended

* Grafana
* Loki
* Prometheus

⸻

14. Backup Strategy

Database

Daily

Incremental

Every hour

Retention

30 Days

Storage

* Local
* Cloud

Verify restoration monthly.

⸻

15. Disaster Recovery

Recovery Targets

Metric	Target
RPO	1 hour
RTO	4 hours

⸻

Recovery Process

Restore

↓

Run Migrations

↓

Verify

↓

Restart Services

↓

Smoke Test

⸻

16. Rollback Strategy

Rollback if

* Build fails
* Critical bug
* Database issue
* Deployment failure

Method

Stop
↓
Previous Docker Image
↓
Restore Database
↓
Restart

⸻

17. Deployment Checklist

Infrastructure

* Server Ready
* Docker Installed
* PostgreSQL Installed
* Nginx Installed

⸻

Application

* Build Successful
* Migrations Complete
* Seed Complete
* Environment Variables Configured

⸻

Security

* HTTPS Enabled
* Firewall Configured
* Secrets Configured

⸻

Validation

* Frontend Accessible
* Backend Healthy
* Database Connected
* Admin Dashboard Accessible

⸻

Monitoring

* Logs Available
* Metrics Available
* Backup Scheduled

⸻

18. Troubleshooting

Frontend won’t start

Check

npm install
npm run build

⸻

Backend won’t connect

Check

DATABASE_URL

⸻

Database

Verify

docker compose logs postgres

⸻

Nginx

Check

systemctl status nginx

⸻

API

Verify

GET /api/v1/health

Expected

{
  "status": "ok"
}

⸻

19. Future Improvements

* Kubernetes
* Helm Charts
* GitOps
* Blue/Green Deployment
* Canary Releases
* CDN
* Redis Cache
* Auto Scaling
* Multi-region Deployment

⸻

References

* docs/SRS.md
* docs/02-Architecture.md
* docs/03-Database.md
* docs/04-API.md
* docs/05-UIUX.md
* docs/07-TestingStrategy.md
* epics/009-deployment.md
* management/PROJECT_ROADMAP.md
* management/TASKS.md