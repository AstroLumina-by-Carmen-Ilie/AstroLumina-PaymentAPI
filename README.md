# AstroLumina Payment API

Stripe Embedded Checkout for the AstroLumina astrological services platform.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.x-green.svg)](https://expressjs.com/)
[![Node](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)
[![Stripe](https://img.shields.io/badge/Stripe-17.x-purple.svg)](https://stripe.com/)

## Overview

Stateless microservice that creates Stripe Embedded Checkout sessions for AstroLumina astrological services.

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env   # then edit with your Stripe keys

# Development (auto-reload)
npm run dev

# Production
npm run build
npm start
```

Server runs on `http://localhost:<PORT>` (configured via `PAYMENT_API_SERVER_PORT`).

## API Endpoints

### `GET /health`

Returns server status, uptime, memory usage, Node version, and environment.

### `POST /create-checkout-session/:product`

Creates a Stripe Embedded Checkout session. The `:product` parameter selects which service to charge for.

**Optional body parameters:**

| Field         | Type   | Default | Description                                |
| ------------- | ------ | ------- | ------------------------------------------ |
| `ticketCount` | number | `1`     | Number of tickets (used for event products)|
| `eventId`     | string | —       | Event identifier (optional metadata)       |

**Available products:**

| Product key                | Description                        |
| -------------------------- | ---------------------------------- |
| `soarele-stralucirea-ta`   | Soarele Stralucirea Ta             |
| `ghid-saturn-in-berbec`    | Ghid complet Saturn in Berbec      |
| `astrograma-natala-si-karmica` | Astrograma natala si karmica    |
| `astrograma-relationala`   | Astrograma relationala             |
| `astrograma-previzionala`  | Astrograma previzionala            |
| `eveniment-constelatii`    | Eveniment constelatii              |

**Example:**

```bash
curl -X POST http://localhost:<PORT>/create-checkout-session/astrograma-natala-si-karmica \
  -H "Content-Type: application/json"
```

**Response:**

```json
{
  "clientSecret": "cs_test_..."
}
```

### `GET /session-status?session_id={ID}`

Retrieves the status of a checkout session.

### `GET /products`

Lists all available products with their keys, names, and descriptions.

## Environment Variables

| Variable                              | Required | Default             | Description                                       |
| ------------------------------------- | -------- | ------------------- | ------------------------------------------------- |
| `NODE_ENV`                            | Yes      | —                   | `development`, `staging`, or `production`         |
| `PAYMENT_API_SERVER_PORT`             | Yes      | —                   | Payment API listen port                           |
| `PAYMENT_API_SERVER_DNS`              | Yes      | —                   | Payment API domain name                           |
| `ASTROLOGY_API_SERVER_PORT`           | Yes      | —                   | Astrology API port (for CORS)                     |
| `ASTROLOGY_API_SERVER_DNS`            | Yes      | —                   | Astrology API domain (for CORS)                   |
| `BOOKING_API_SERVER_PORT`             | Yes      | —                   | Booking API port (for CORS)                       |
| `BOOKING_API_SERVER_DNS`              | Yes      | —                   | Booking API domain (for CORS)                     |
| `FRONTEND_SERVER_PORT`                | Yes      | —                   | Frontend port (for CORS)                          |
| `FRONTEND_SERVER_DNS`                 | Yes      | —                   | Frontend domain (for CORS)                        |
| `PAYMENT_API_SENTRY_DSN`              | Yes      | —                   | Sentry DSN for error tracking                     |
| `STRIPE_SK`                           | Yes      | —                   | Stripe secret key                                 |
| `STRIPE_API_VER`                      | Yes      | —                   | Stripe API version                                |
| `STRIPE_SOARELE_STRALUCIREA_TA`       | Yes      | —                   | Price ID for Soarele Stralucirea Ta               |
| `STRIPE_GHID_SATURN_IN_BERBEC`        | Yes      | —                   | Price ID for Ghid Saturn in Berbec                |
| `STRIPE_ASTROGRAMA_NATALA_SI_KARMICA` | Yes      | —                   | Price ID for Astrograma Natala si Karmica         |
| `STRIPE_ASTROGRAMA_RELATIONALA`       | Yes      | —                   | Price ID for Astrograma Relationala               |
| `STRIPE_ASTROGRAMA_PREVIZIONALA`      | Yes      | —                   | Price ID for Astrograma Previzionala              |
| `STRIPE_EVENIMENT_CONSTELATII`        | Yes      | —                   | Price ID for Eveniment Constelatii                |
| `CORS_ORIGINS`                        | No       | _(computed)_        | Comma-separated override; defaults to all service ports/DNS + `astrolumina.pages.dev`, `astrolumina.com`, `astrolumina.ro` |

## Project Structure

```
src/
├── config/env.ts           # Zod-validated environment config
├── instrument.ts           # Sentry initialization
├── middleware/
│   ├── security.ts         # Helmet, CORS, rate limiter
│   └── error-handler.ts  # Error types and handlers
├── routes/
│   ├── checkout.ts       # Stripe checkout endpoints
│   ├── health.ts        # Health check
├── types/
│   └── products.ts     # Product catalog
└── server.ts         # App entry + graceful shutdown
```

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Runtime    | Node.js 22.x                        |
| Language   | TypeScript 5.8 (strict mode, ESM)   |
| Framework  | Express 5.x                         |
| Payments   | Stripe Embedded Checkout 17.x       |
| Validation | Zod                                 |
| Monitoring | Sentry (error tracking + profiling) |
| Security   | Helmet, CORS, Rate Limiting         |

## Security

- **Helmet** — secure HTTP headers
- **CORS** — dynamic origin whitelist: localhost + DNS for all 4 services (frontend, astrology API, booking API, payment API) on both `http`/`https`, plus `astrolumina.pages.dev`, `development.astrolumina.pages.dev`, `astrolumina.com`, `astrolumina.ro`. Overrideable via `CORS_ORIGINS` env var.
- **Rate limiting** — 30 requests/minute/IP
- **1MB body limit** — rejects oversized payloads with 413
- **Sentry PII scrubbing** — Stripe keys redacted from error reports
- **Zod validation** — input validation at every endpoint
- **Environment validation** — app won't start with invalid config

## Part of AstroLumina

| Service       | Port     | Repository                 |
| ------------- | -------- | -------------------------- |
| Payment API   | `<PORT>` | `AstroLumina-PaymentAPI`   |
| Astrology API | `<PORT>` | `AstroLumina-AstrologyAPI` |
| Frontend      | `<PORT>` | `AstroLumina-Frontend`     |
| Booking API   | `<PORT>` | `AstroLumina-BookingAPI`   |
