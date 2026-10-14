# AeroBook ✈ — Fly Smarter. Book Anywhere.

A modern, high-performance flight metasearch and booking intelligence platform engineered for speed, transparent fares, and seamless domestic & international travel planning.

[![CI](https://github.com/AdityamishraGhb/Aero-book/actions/workflows/ci.yml/badge.svg)](https://github.com/AdityamishraGhb/Aero-book/actions/workflows/ci.yml)
[![Vercel](https://vercelbadge.vercel.app/api/adityamishraghb/aero-book)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Highlights & Architecture

- **Next.js 16 (Turbopack) & React 19**: Server Components, Partial Prerendering, and dynamic image generation (`next/og`).
- **Flexible Provider Layer**: Pluggable provider architecture with zero-latency deterministic `MockProvider` and real `Amadeus Self-Service` integration with Zod schema mapping.
- **Distributed Caching & Rate Limiting**: Upstash Redis with token-bucket algorithms and transparent in-memory fallback.
- **Database & Auth**: Neon Serverless Postgres with Drizzle ORM, Auth.js (Google OAuth & email credentials), and in-memory seed fallback.
- **Top 20 Indian Corridors**: Statically generated landing pages (`/routes/[route]`) with Google Rich Result JSON-LD schemas (`BreadcrumbList`, `Product`, `FAQPage`), dynamic OpenGraph cards, and interactive fare trends.
- **Modern UI & Design System**: Custom HSL brand design system, accessible Radix UI primitives, responsive mobile filters bottom sheet, and showroom page at `/dev/ui`.
- **Sentry Error Telemetry**: Integrated error tracking on client, server, and edge runtimes.

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Node.js**: v20 or later
- **pnpm**: v10.7 or later

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/AdityamishraGhb/Aero-book.git
cd Aero-book

# 2. Install dependencies
pnpm install

# 3. Create your local environment file (optional, zero-config mock mode enabled by default)
cp .env.example .env.local

# 4. Start the Turbopack development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment on Vercel

AeroBook is pre-configured for automated deployment on [Vercel](https://vercel.com) via `vercel.json` (configured with Mumbai `bom1` edge routing for minimal latency across India).

### Deploying via Vercel CLI

```bash
pnpm dlx vercel
```

### Preview Deployments

Every GitHub Pull Request automatically triggers a **Vercel Preview Deployment**. AeroBook automatically handles dynamic preview hostnames via `process.env.VERCEL_URL` and `AUTH_TRUST_HOST=true` so session cookies and redirects function seamlessly on preview domains.

---

## ⚙️ Environment Variables Reference

All external integrations are **strictly optional**. The application automatically defaults to mock providers, in-memory databases, and memory caching if any key is missing:

| Variable                   | Description                                                | Default / Fallback                                 |
| :------------------------- | :--------------------------------------------------------- | :------------------------------------------------- |
| `FLIGHT_PROVIDER`          | Adapter selection (`mock`, `amadeus`, `duffel`)            | `mock`                                             |
| `PROVIDER_API_KEY`         | Amadeus / Duffel API Key                                   | `""`                                               |
| `PROVIDER_API_SECRET`      | Amadeus / Duffel API Secret                                | `""`                                               |
| `UPSTASH_REDIS_REST_URL`   | Upstash Redis REST endpoint for distributed caching        | `""` (In-memory cache)                             |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST access token                            | `""`                                               |
| `DATABASE_URL`             | Neon Postgres serverless connection URL                    | `""` (In-memory database)                          |
| `AUTH_SECRET`              | Auth.js 32-character secret key for JWT session encryption | Pre-configured dev key                             |
| `AUTH_GOOGLE_ID`           | Google OAuth Client ID                                     | `""`                                               |
| `AUTH_GOOGLE_SECRET`       | Google OAuth Client Secret                                 | `""`                                               |
| `AUTH_TRUST_HOST`          | Enable trusted host resolution for Vercel preview URLs     | `true`                                             |
| `SENTRY_DSN`               | Sentry project DSN for error reporting                     | `""` (Disabled)                                    |
| `NEXT_PUBLIC_SITE_URL`     | Canonical site origin                                      | `https://${VERCEL_URL}` or `http://localhost:3000` |

---

## 🧪 Testing & Verification

AeroBook maintains a comprehensive verification test suite:

```bash
# Run all unit and integration tests (Vitest)
pnpm test

# Run End-to-End tests (Playwright)
pnpm test:e2e

# Code style and formatting check (Prettier)
pnpm format:check

# ESLint static analysis
pnpm lint

# TypeScript compilation check
pnpm typecheck

# Production Next.js build
pnpm build
```

---

## 🔄 GitHub Actions CI/CD

Our continuous integration workflow (`.github/workflows/ci.yml`) runs on every push to `main` and all Pull Requests:

1. **Code Quality**: ESLint, Prettier format verification, and TypeScript typechecking.
2. **Unit Tests**: Full Vitest test suite covering providers, rate-limiters, caching, database, and UI components.
3. **End-to-End Tests**: Headless Chromium Playwright validation simulating the complete booking lifecycle (Search ➔ Results ➔ Flight Details ➔ Passenger Details ➔ E-Ticket Confirmation).
4. **Production Build**: Compiles Next.js with static site generation for all 20 Indian route landing pages and dynamic OpenGraph image routes.

---

## 📄 License

MIT © [Aditya Mishra](https://github.com/AdityamishraGhb)
