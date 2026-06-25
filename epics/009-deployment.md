

# Epic 009 – Deployment & Operations

## 1. Overview
This epic covers the deployment and operationalization of the SFBU ECE Program Explorer application. It defines processes and requirements for deploying the platform to production and staging environments, ensuring reliability, security, and maintainability.

## 2. Objective
Establish robust, repeatable, and secure deployment pipelines and infrastructure for the SFBU ECE Program Explorer, enabling seamless releases, monitoring, and operational support.

## 3. Scope
- Infrastructure provisioning and configuration
- Deployment automation (CI/CD)
- Environment configuration (local, staging, production)
- Security hardening
- Monitoring and logging
- Backup and disaster recovery

## 4. Out of Scope
- Feature development or frontend/backend code changes
- Catalog content authoring or editing
- Student information systems or integrations

## 5. Target Environments

| Environment        | Purpose                          | Access                 | Data              |
|--------------------|----------------------------------|------------------------|-------------------|
| Local Development  | Developer testing                | Developers only        | Dummy/test data   |
| Testing            | Automated/manual QA              | Internal QA            | Test data         |
| Staging            | Pre-production validation        | Project stakeholders   | Production-like   |
| Production         | Live service for end users       | Public (with auth)     | Real data         |

## 6. Architecture
- **Frontend:** Next.js (React-based SSR/SSG app)
- **Backend:** NestJS (Node.js API server)
- **Database:** PostgreSQL
- **Reverse Proxy:** Nginx (SSL termination, routing)
- **Containerization:** Docker & Docker Compose for local and server environments
- **Cloud Deployment (optional):** AWS EC2, Azure VM, DigitalOcean Droplet, or equivalent

**Diagram (textual):**
```
User ↔ Nginx ↔ [Next.js frontend] ↔ [NestJS backend] ↔ [PostgreSQL database]
```

## 7. Infrastructure Requirements
- Linux-based VM(s) or containers
- Sufficient CPU/RAM/storage for expected load
- Docker & Docker Compose installed
- Secure network configuration (firewall)
- Persistent storage for database
- SSL certificate for HTTPS

## 8. CI/CD Pipeline Requirements
- **GitHub Actions** for CI/CD automation
    - Linting and code style checks
    - Automated tests (unit, integration)
    - Build artifacts (Next.js, NestJS)
    - Build & push Docker images to registry
    - Deploy to staging/production via SSH or cloud APIs
    - Rollback support

## 9. Environment Variables

**Frontend (Next.js):**
- `NEXT_PUBLIC_API_URL`
- `NEXTAUTH_URL` (if using NextAuth)

**Backend (NestJS):**
- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `NODE_ENV`

**Database (PostgreSQL):**
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`

## 10. Security Requirements
- HTTPS enabled (SSL/TLS via Nginx)
- Secrets and credentials managed securely (not committed to repo)
- RBAC for admin interfaces and sensitive operations
- Regular database backups
- Firewall to restrict access (only necessary ports open)
- Dependency vulnerability scanning in CI

## 11. Monitoring & Logging
- Application logs collected and persisted (Docker stdout, log files)
- Nginx access/error logs
- Basic health checks for services
- Optional: Integrate with monitoring tools (Prometheus, Grafana, Sentry)

## 12. Backup & Disaster Recovery
- Automated daily database backups
- Offsite backup storage (cloud bucket or separate server)
- Documented restore procedure
- Test restores periodically

## 13. Deployment Checklist

- [ ] Infrastructure provisioned (VM, Docker host, storage)
- [ ] Environment variables configured securely
- [ ] SSL certificate installed and HTTPS enabled
- [ ] Database initialized and accessible
- [ ] Docker images built and pushed to registry
- [ ] Application containers started (Docker Compose)
- [ ] Nginx configured as reverse proxy
- [ ] Basic monitoring and logging enabled
- [ ] Automated backups configured and tested
- [ ] Firewall rules applied
- [ ] Smoke tests passed on target environment
- [ ] Rollback plan in place

## 14. Acceptance Criteria
- CI/CD pipeline deploys to staging and production with a single command or PR
- All environment variables are documented and managed securely
- Application is accessible via HTTPS in production
- Monitoring, logging, and backup systems are operational
- Restore from backup is tested and documented
- Security requirements are met

## 15. Definition of Done
- All checklist items completed
- Acceptance criteria met
- Documentation for deployment and operations is available
- No critical or high-severity vulnerabilities remain open

## 16. Future Enhancements
- Kubernetes or container orchestration for scaling
- Autoscaling (horizontal/vertical)
- CDN integration for frontend assets
- Advanced observability (tracing, alerting, dashboards)
- Infrastructure as Code (Terraform, Ansible)

## 17. AI Execution Instructions
- Implement only deployment and infrastructure assets as specified in this epic.
- Do **not** modify or add application features.
- Update `TASKS.md` and `CHANGELOG.md` to reflect all deployment/infrastructure changes.
- After each run, summarize deployment artifacts and configuration changes.
- When all checklist and acceptance criteria are met, declare the initial deployment platform **complete**.