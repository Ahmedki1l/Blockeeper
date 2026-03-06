# BlocKeeper — UI/UX Prototype

**Version:** 1.0.0 · **Stack:** React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + Recharts

> This repository contains the complete high-fidelity UI/UX prototype for BlocKeeper, an AI-powered retail security monitoring platform. All screens are based on the official High-Level Design (HLD) document. The prototype is frontend-only (no backend) and uses mock data to simulate real-time behaviour.

---

## Quick Start

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

---

## Project Structure

```
client/
  index.html                  ← Entry HTML (fonts, meta)
  src/
    App.tsx                   ← Root router — all routes defined here
    main.tsx                  ← React entry point
    index.css                 ← Global design tokens & BlocKeeper theme

    pages/
      LoginPage.tsx           ← Auth screen (login + register tabs)
      WebDashboard.tsx        ← Main dashboard (stats, alert feed, camera status)
      AlertsPage.tsx          ← Alerts list with search, filter, severity
      AlertDetailPage.tsx     ← Incident investigation (video player, metadata, actions)
      CamerasPage.tsx         ← Camera grid with status, FPS, zone info
      AnalyticsPage.tsx       ← Charts: hourly, weekly, by camera, by type
      SettingsPage.tsx        ← Account, notifications, thresholds, edge device
      NotFound.tsx            ← 404 fallback

      mobile/
        MobileHomePage.tsx    ← Mobile home (stats + recent alerts)
        MobileAlertsPage.tsx  ← Mobile alerts list with filters
        MobileCamerasPage.tsx ← Mobile camera grid
        MobileAnalyticsPage.tsx ← Mobile charts and KPIs
        MobileSettingsPage.tsx  ← Mobile settings + biometric login toggle

    components/
      layout/
        AppLayout.tsx         ← Web sidebar + header shell (wraps all web pages)
        MobileLayout.tsx      ← Mobile header + bottom tab bar shell

      ui/                     ← shadcn/ui primitives (do not modify)
        button.tsx, card.tsx, dialog.tsx, input.tsx, select.tsx,
        tabs.tsx, badge.tsx, tooltip.tsx, sonner.tsx … (full list below)

    contexts/
      ThemeContext.tsx         ← Dark/light theme provider

    hooks/
      useMobile.tsx            ← Responsive breakpoint hook
      useComposition.ts        ← IME composition helper
      usePersistFn.ts          ← Stable callback reference

    lib/
      utils.ts                 ← cn() class merge utility

    const.ts                   ← Shared constants
```

---

## Routes

| Path | Component | Description |
|---|---|---|
| `/login` | `LoginPage` | Auth — login & register |
| `/` | `WebDashboard` | Main dashboard |
| `/alerts` | `AlertsPage` | Alerts list |
| `/alerts/:id` | `AlertDetailPage` | Incident investigation |
| `/cameras` | `CamerasPage` | Camera management |
| `/analytics` | `AnalyticsPage` | Analytics & charts |
| `/settings` | `SettingsPage` | Settings |
| `/mobile` | `MobileHomePage` | Mobile home (phone frame) |
| `/mobile/alerts` | `MobileAlertsPage` | Mobile alerts |
| `/mobile/cameras` | `MobileCamerasPage` | Mobile cameras |
| `/mobile/analytics` | `MobileAnalyticsPage` | Mobile analytics |
| `/mobile/settings` | `MobileSettingsPage` | Mobile settings |

> Mobile routes are wrapped in a phone-frame component for design preview. In production, mobile routes would be served as a native app (React Native) or a separate PWA build.

---

## Design System

### Theme
Dark navy + neon cyan. Defined entirely in `client/src/index.css`.

### Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--bk-bg-primary` | `#0A0F1E` | Page background |
| `--bk-bg-secondary` | `#0D1526` | Card / panel background |
| `--bk-bg-tertiary` | `#0A0D1A` | Sidebar / header background |
| `--bk-cyan` | `#00D4FF` | Primary accent, active states |
| `--bk-blue` | `#3B82F6` | Secondary accent, charts |
| `--bk-green` | `#10B981` | Success, online, resolved |
| `--bk-red` | `#EF4444` | Critical alerts, errors |
| `--bk-amber` | `#F59E0B` | Warning, medium severity |
| `--bk-text-primary` | `#F1F5F9` | Primary text |
| `--bk-text-secondary` | `#94A3B8` | Secondary / muted text |
| `--bk-border` | `rgba(0,212,255,0.1)` | Card borders |

### Typography
- **Font:** IBM Plex Sans (body) + IBM Plex Mono (timestamps, technical data)
- **Scale:** 0.65rem (micro labels) → 0.7rem → 0.78rem → 0.875rem → 1rem → 1.25rem → 1.5rem → 2rem (hero)

### CSS Utility Classes (defined in `index.css`)

| Class | Purpose |
|---|---|
| `.bk-card` | Standard dark card with border and hover glow |
| `.bk-card-glow` | Card with active cyan glow shadow |
| `.bk-btn-primary` | Cyan gradient primary button |
| `.bk-btn-secondary` | Ghost button with cyan border |
| `.bk-btn-danger` | Red ghost button |
| `.bk-badge-critical` | Red severity badge |
| `.bk-badge-high` | Orange severity badge |
| `.bk-badge-medium` | Amber severity badge |
| `.bk-badge-low` | Blue severity badge |
| `.bk-sidebar-item` | Sidebar nav link (with `.active` modifier) |
| `.bk-input` | Styled dark input field |
| `.bk-grid-bg` | Subtle dot-grid background pattern |
| `.bk-scrollbar` | Custom thin scrollbar styling |
| `.animate-bk-ping` | Pulsing ring animation for status dots |
| `.animate-bk-glow` | Breathing glow animation |

---

## Logos

| Usage | File | CDN URL |
|---|---|---|
| Sidebar / Mobile header (white, on dark bg) | `blockeeper_1white.png` | `https://d2xsxph8kpxj0f.cloudfront.net/310519663089570646/RFGDf2S7CSskxcLJx8eG2q/blockeeper_1white_62896f8b.png` |
| Light backgrounds / marketing | `blockeeper_1.png` | `https://d2xsxph8kpxj0f.cloudfront.net/310519663089570646/RFGDf2S7CSskxcLJx8eG2q/blockeeper_1_3bc7d84d.png` |

---

## Key Components

### `AppLayout`
Wraps all web pages. Provides:
- Collapsible sidebar with logo, nav items, system status, edge device info
- Top header with page title, notification bell, shield status badge, user avatar
- Responsive: sidebar collapses on mobile with hamburger menu

**Usage:**
```tsx
import AppLayout from "@/components/layout/AppLayout";
export default function MyPage() {
  return <AppLayout><div>content</div></AppLayout>;
}
```

### `MobileLayout`
Wraps all mobile pages. Provides:
- Top header with logo and page title
- Bottom tab navigation (Home, Alerts, Cameras, Analytics, Settings)
- Badge support on Alerts tab

**Usage:**
```tsx
import MobileLayout from "@/components/layout/MobileLayout";
export default function MyMobilePage() {
  return <MobileLayout title="My Page"><div>content</div></MobileLayout>;
}
```

---

## Screen Inventory

### Web Application

| Screen | Key Features |
|---|---|
| **Login** | Email/password login, register tab, forgot password link, shield branding |
| **Dashboard** | Live clock, 4 KPI cards (alerts, cameras, anomaly score, resolved), live alert feed, camera status panel |
| **Alerts** | Search, severity filter, status filter, alert cards with confidence score, pagination |
| **Alert Detail** | Video player with play/pause/timeline, incident metadata, detected objects, AI confidence, investigation notes, action buttons (Resolve / Escalate / Report) |
| **Cameras** | Camera grid with live status, FPS, resolution, alert count, zone info, add camera button |
| **Analytics** | Hourly bar chart, weekly line chart, alerts by camera bar chart, incident type donut chart, response time trend |
| **Settings** | Account info, notification toggles, alert thresholds (sliders), edge device config, system info |

### Mobile Application

| Screen | Key Features |
|---|---|
| **Home** | Security status hero, 4 stat cards, recent alerts list, quick action buttons |
| **Alerts** | Filter tabs (All/Critical/High/Medium), alert cards with swipe actions, confidence scores |
| **Cameras** | Camera list with status indicators, FPS, alert count, add camera FAB |
| **Analytics** | KPI cards, hourly bar chart, weekly line chart, incident type progress bars |
| **Settings** | Profile card, biometric login toggle + fingerprint UI, notification toggles, preferences, system info, sign out |

---

## Connecting to Backend

All data in this prototype is **mock/static**. To connect to the real BlocKeeper backend:

1. Replace mock arrays in each page with API calls (e.g., `useEffect` + `fetch` or a library like `react-query` / `swr`)
2. Auth: implement JWT token storage and pass `Authorization: Bearer <token>` headers
3. Real-time alerts: connect a WebSocket to the edge device stream and update the alert feed state
4. Camera feeds: replace the camera placeholder divs with `<img>` or `<video>` elements pointing to RTSP-to-HLS streams

### Suggested API Endpoints (from HLD)

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/login` | POST | Login → returns JWT |
| `/api/auth/register` | POST | Register new user |
| `/api/alerts` | GET | Paginated alert list |
| `/api/alerts/:id` | GET | Single alert with video URL |
| `/api/cameras` | GET | Camera list with status |
| `/api/analytics/summary` | GET | Dashboard KPIs |
| `/api/analytics/hourly` | GET | Alerts by hour |
| `/api/analytics/weekly` | GET | Alerts by week |
| `ws://edge/stream` | WS | Real-time alert stream |

---

## Development Notes

- **No backend required** to run the prototype — all data is mocked inline
- **TypeScript strict mode** is enabled — maintain type safety when adding features
- **shadcn/ui components** live in `components/ui/` — do not modify these directly; extend them via wrapper components
- **Recharts** is used for all charts — see `AnalyticsPage.tsx` for usage patterns
- **Framer Motion** is available for animations if needed
- **Wouter** is used for routing (lightweight React Router alternative)

---

## Accessibility

- All interactive elements have visible focus rings
- Color is never the sole indicator of state (icons + labels always accompany color)
- Minimum touch target size: 44×44px on mobile
- Contrast ratios meet WCAG 2.1 AA for all text/background combinations

---

## Browser Support

Chrome 120+, Firefox 120+, Safari 17+, Edge 120+

---

*Built by the BlocKeeper Design Team · March 2026*
