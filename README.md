# BlocKeeper

AI-Powered Security Monitoring Dashboard — a design prototype for the ShopGuard AI platform by JAMTech.

## Overview

BlocKeeper is a real-time security monitoring dashboard that provides:

- **Dashboard** — Live alert feed, camera status, system health, and quick actions
- **Alerts** — Alert management with filtering, scoring, and status tracking
- **Cameras** — Camera grid with FPS/resolution monitoring
- **Analytics** — Security trends and incident patterns
- **Settings** — System configuration and user preferences
- **Mobile views** — Phone-framed responsive dashboard

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, TypeScript |
| UI | Radix UI, shadcn/ui, Tailwind CSS |
| Routing | Wouter |
| Server | Express, tRPC |
| Database | MySQL, Drizzle ORM |
| Design | Dark navy + neon cyan theme with light mode toggle |

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
client/               # React SPA
  src/
    pages/            # Web + mobile page components
    components/       # Reusable UI components
    contexts/         # Theme context provider
    _core/hooks/      # Auth hook
server/               # Express + tRPC backend
  _core/              # Server bootstrap, context, Vite integration
  routers.ts          # tRPC API routes
drizzle/              # Database schema (Drizzle ORM)
shared/               # Shared constants and types
```

## License

MIT
