# Admin Panel Architecture Blueprint

## Overview

The admin panel provides privileged operators with secure access to dashboards built from data collected by the Telegram bot. The solution is organized as a mono-repo with clearly separated applications and shared packages to enable modularity, iterative delivery, and future extensibility.

```text
./
├─ apps/
│  ├─ admin-api/           # Fastify backend
│  └─ admin-web/           # React (Vite or Next.js) frontend
├─ packages/
│  ├─ types/               # Shared Zod schemas + TypeScript types
│  ├─ ui/                  # Design system components
│  ├─ config/              # Env loading and validation helpers
│  └─ logger/              # Shared Pino-based logging helpers
└─ infrastructure/
   └─ docker-compose.yml   # Runtime topology (API, web, Postgres, Redis)
```

## Backend (`apps/admin-api`)

### Backend Stack

- **Runtime**: Node.js 20 LTS, TypeScript, Fastify.
- **Database**: SQLite via Prisma for the MVP (upgrade path to PostgreSQL in production).
- **Cache & queues**: Redis (BullMQ) for caching aggregates and background aggregation jobs.
- **Auth**: PASETO v3.local for access tokens (scaffolded), with roadmap to add asymmetric refresh tokens stored server-side.
- **Testing**: Vitest + Supertest for endpoints, Prisma test harness for repositories.

### Modules

| Module             | Responsibility                                                                 |
| ------------------ | ------------------------------------------------------------------------------ |
| `modules/auth`     | Login, token issuance, password management, session revocation, rate limiting. |
| `modules/users`    | Admin user CRUD, roles, invitations.                                           |
| `modules/stats`    | Aggregated metrics from bot activity (e.g., conversions, segment trends).      |
| `modules/sections` | Section-level analytics, popularity trends, drill-down data.                   |
| `modules/segments` | Demographic segmentation analytics (age, gender, fitness level).               |
| `modules/audit`    | Administrative actions logging, security events storage.                       |

Each module exposes:

- Controller (Fastify route plugin).
- Service (business logic, orchestrates repositories).
- Repository (Prisma access layer, all queries typed).
- Domain schema definitions (Zod validators reused by other modules).

### Request Lifecycle

1. Fastify plugin registers global hooks (tracing, logging, request correlation ID).
2. `preValidation`: rate limiter (using Redis), body validation via Zod.
3. `onRequest`: authentication middleware (PASETO verification) for protected routes.
4. `preHandler`: RBAC guard to enforce `admin`, `analyst`, `support` roles.
5. Controller executes service method, service interacts with repositories and caches.
6. Response serialized with strict schemas to avoid data leaks.

### Authentication & Security

- Password hashing with Argon2id (moderate parameters tuned for production hardware).
- Login endpoint: verifies credentials, increments failed-attempt counter stored in Redis, triggers CAPTCHA requirement upon threshold.
- On success: issues short-lived access token (5 minutes) and longer refresh token (7 days) with rotation on every refresh.
- Tokens stored as HTTP-only, Secure cookies. Refresh token identifier persisted server-side allowing revocation.
- PASETO symmetric key stored in external secret manager (Vault/KMS) and mounted via environment variables; versioning enables seamless rotation.
- Admin login notification integration (optional) posts to internal channel via the bot.
- Global middleware: Helmet for hardened HTTP headers, strict CSP, and `@fastify/rate-limit`.
- Audit log records login attempts, token refreshes, configuration changes.

### Background Jobs

- `stats-aggregator`: executes every 5 minutes, pulls raw bot events (via existing bot DB or message queue) to compute aggregates stored in `section_metrics`, `user_segments`, `engagement_trends` tables.
- `report-cache-warmer`: precomputes heavy dashboards for top-level views.
- Jobs defined via BullMQ processors with backoff policies and alerting hooks.

### Persistence Model (initial draft)

| Table                | Purpose                                                                              |
| -------------------- | ------------------------------------------------------------------------------------ |
| `admin_users`        | Credential store with roles, status flags, password hash, MFA secret.                |
| `admin_sessions`     | Refresh token state, device info, expiry.                                            |
| `admin_audit`        | Structured audit log: actor, action, target, metadata, timestamp.                    |
| `section_metrics`    | Aggregated stats per section (visits, recommendations, conversions, trending score). |
| `segment_metrics`    | Aggregations by user segments (age group, gender, fitness level).                    |
| `event_ingest_queue` | Raw events from the bot for near-real-time analytics (optional if using streaming).  |
| `feature_flags`      | Toggle configuration per environment.                                                |

## Frontend (`apps/admin-web`)

### Stack

- React 18 with Vite (or Next.js if SSR/ISR is desirable).
- TypeScript, CSS Modules or Tailwind CSS depending on existing conventions.
- Routing via React Router (Vite) or Next.js pages.
- State management: TanStack Query for server state, Zustand for lightweight UI state.
- Visualization: Recharts (fast integration) or Apache ECharts (if more advanced charts needed).
- Form handling: React Hook Form + Zod resolver (shared schemas from `packages/types`).

### Structure

```text
src/
├─ app/
│  ├─ providers.tsx
│  └─ router.tsx
├─ pages/
│  ├─ Login.tsx
│  ├─ Dashboard.tsx
│  ├─ Sections/
│  │  └─ SectionDetails.tsx
│  └─ Segments/
│     └─ SegmentDetails.tsx
├─ features/
│  ├─ auth/
│  │  └─ useAuthGuard.ts
│  ├─ dashboard/
│  │  └─ components/
│  └─ sections/
├─ components/
│  ├─ charts/
│  ├─ tables/
│  └─ layout/
└─ apiClient/
   └─ stats.ts
```

- `apiClient`: typed API client built with `ts-rest` or `openapi-typescript` to enforce parity between front and back.
- Layout uses `AuthGuard` component to redirect to `/login` when no valid access token (verified via `/auth/session`).
- Dashboard pages consume TanStack Query hooks (e.g., `useStatsOverview`) with automatic refetch intervals.
- Widgets defined as JSON config to allow dynamic composition of dashboards (for future customizing).

### UI/UX Considerations

- Dark/light themes with CSS variables.
- Responsive design supporting tablets (minimum width 1024px).
- Global notification center for job failures or unusual login activities.
- Drill-down flows from high-level metrics to section or segment details.

## Shared Packages

- `packages/types`
  - Zod schemas for every API request/response (e.g., `LoginInput`, `StatsOverviewResponse`).
  - Type-safe exports consumed by both frontend and backend to eliminate drift.
- `packages/ui`
  - Base components (cards, badges, data tables, loaders) built with Radix UI primitives.
  - Design tokens (colors, spacing) extracted for reuse.
- `packages/config`
  - Centralized environment variable parsing, `createConfig(schema)` with per-environment overrides.
  - Works in both Fastify and Vite contexts.
- `packages/logger`
  - Pino configuration with correlation IDs and structured fields, exported as reusable instance wrappers.

## Security & Compliance

- Enforce TLS end-to-end; terminate TLS at reverse proxy (Nginx or Traefik) forwarding to API.
- Content Security Policy tuned to allow chart libraries while blocking inline scripts.
- Input validation at boundaries with Zod, plus output encoding in UI to prevent XSS.
- Anti-CSRF handled inherently via SameSite "Strict" cookies; additional CSRF tokens for high-risk mutations.
- Multi-factor authentication (extendable): totp-based second factor stored in `admin_users.mfa_secret`, optional WebAuthn in future release.
- Logging & Monitoring: integrate with OpenTelemetry for traces, send logs to ELK/ClickHouse; security alerts forwarded to Telegram admin channel.

## Observability & Operations

- Health checks: `/health/live`, `/health/ready` endpoints returning DB/cache status.
- Metrics exporter (Prometheus) exposing job success, queue depth, HTTP metrics.
- Alerting thresholds for failed logins, job errors, stale aggregates.
- Feature flags (Unleash or self-hosted) to ship experimental dashboards safely.

## Testing Strategy

- Unit: services, helpers (Vitest).
- Integration: Fastify routes using Supertest + in-memory Postgres (via Testcontainers).
- Contract: `ts-rest` or OpenAPI tests verifying schema compatibility between frontend/back.
- E2E: Playwright with API mocks for deterministic dashboards and login flows.
- Security: regular dependency scanning (Dependabot) and SAST (ESLint security rules, `npm audit`).

## Deployment Pipeline

- GitHub Actions workflow
  - `lint`: ESLint, style checks.
  - `test`: unit + integration.
  - `build`: web (Vite build), api (tsc + docker image).
  - `deploy`: push Docker images, apply infrastructure changes (Helm chart or Compose stack) via environments.
- Environments: `dev`, `staging`, `prod` with separate secrets and PASETO keys.
- Database migrations executed via Prisma during deploy (with plan/apply steps).

## Implementation Roadmap

1. **Scaffold mono-repo** with `apps/` and `packages/` directories, base configs (tsconfig, eslint, prettier, turbo optional).
2. **Backend MVP**: Fastify server, user model, login route, PASETO issuance, protected `/stats/overview` returning mocked data.
3. **Frontend MVP**: Login page, token handling, basic dashboard fetching mocked data.
4. **Persistence integration**: SQLite setup (Prisma schema for admin users, metrics tables) with forward-compatible path to Postgres; aggregate ingestion pipeline.
5. **Visualization enhancements**: implement chart widgets, filters, responsive layout.
6. **Security hardening**: rate limiting, audit log, alerting, optional MFA.
7. **Observability & deployment**: health checks, metrics, GitHub Actions, docker-compose for local and staging.
8. **Feature flags & widget config**: dynamic dashboard assembly, documentation for extending modules.

## Extension Points

- New analytics modules can be added by creating new Fastify plugins under `modules/` adhering to the controller/service/repository pattern.
- Custom dashboards defined in JSON and rendered by a shared widget renderer, enabling non-developers to configure new views.
- API clients (mobile/tablet) can reuse shared packages and authentication flow (PASETO) with minimal changes.

---

This blueprint serves as the reference point for subsequent implementation tasks. Align updates and refinements here before coding to maintain a single source of truth for system architecture.
