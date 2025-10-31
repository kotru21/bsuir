# Admin API

Fastify-based backend for the administrative analytics panel. Handles authentication, authorization, and serves dashboard-ready metrics collected from the Telegram bot.

## Getting Started

1. Copy `.env.example` to `.env` and provide production-grade secrets.
2. Install dependencies:

   ```powershell
   cd apps/admin-api
   npm install
   ```

3. Start the development server :

   ```powershell
   npm run dev
   ```

### Environment Variables

| Variable                     | Purpose                                                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `ADMIN_PASETO_LOCAL_KEY`     | Base64/hex/UTF-8 encoded symmetric key (>= 32 bytes) for PASETO v3.local access tokens.                         |
| `ADMIN_DATABASE_URL`         | PostgreSQL connection string for the admin database (e.g. `postgresql://user:pass@host:5432/db?schema=public`). |
| `ADMIN_BOOTSTRAP_USERNAME`   | Initial administrator login (until persistent storage is wired).                                                |
| `ADMIN_BOOTSTRAP_PASSWORD`   | Plain bootstrap administrator password (min 8 chars). Hashed automatically at startup and during seeding.       |
| `ADMIN_RATE_LIMIT_WINDOW_MS` | Optional rate-limit window (default 60000 ms).                                                                  |
| `ADMIN_RATE_LIMIT_MAX`       | Optional max requests per window (default 60).                                                                  |

## Commands

- `npm run dev` — start Fastify with live reload via `tsx`.
- `npm run build` — compile TypeScript output to `dist`.
- `npm run start` — run the compiled build.
- `npm run prisma:push` — push the current Prisma schema to the connected database.
- `npm run prisma:generate` — regenerate the Prisma client after updating the schema.
- `npm run db:seed` — seed the database with a bootstrap admin user (if configured) and sample metrics.

### Database Setup

1. Ensure `ADMIN_DATABASE_URL` points to your PostgreSQL instance (Heroku Postgres, local Postgres, etc.).
2. Push the schema to your database:

   ```powershell
   npm run prisma:push --workspace @bsuir/admin-api
   ```

3. Seed initial data (optional but recommended):

   ```powershell
   npm run db:seed --workspace @bsuir/admin-api
   ```

## Next Steps

- Introduce refresh token rotation and persist sessions in `AdminSession`.
- Expand metrics ingestion to reflect live bot data (replace seed placeholders).
- Connect to bot data sources for real analytics instead of static placeholders.
