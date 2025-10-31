# Admin Web

React + Vite application that renders dashboards for the BSUIR sports bot analytics. Consumes the Admin API for authentication and metrics.

## Getting Started

1. Copy `.env.example` to `.env` and configure the `VITE_ADMIN_API_URL` pointing to the running Admin API.
2. Install dependencies:

   ```powershell
   cd apps/admin-web
   npm install
   ```

3. Start the dev server:

   ```powershell
   npm run dev
   ```

## Features (MVP)

- PASETO-based login form using the Admin API.
- Protected routes backed by a React context provider.
- Dashboard placeholder fetching `/api/stats/overview`.
- React Query state management with automatic refresh.

## Planned Enhancements

- Replace placeholder metrics with rich chart widgets (Recharts / ECharts).
- Add sections and segments drill-down pages.
- Integrate design system from `packages/ui` once available.
