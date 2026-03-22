# AstroLumina Payment API

Stripe Checkout session management for the AstroLumina astrological services platform.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.x-green.svg)](https://expressjs.com/)
[![Node](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Stripe](https://img.shields.io/badge/Stripe-17.x-purple.svg)](https://stripe.com/)

## Overview

Creates Stripe Embedded Checkout sessions for astrological products — bookings, natal charts, karmic charts, and more. Designed as a stateless microservice within the AstroLumina platform.

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

Server runs on `http://localhost:3032`.

## API Endpoints

### `GET /health`

Returns server status, uptime, and memory usage.

### `POST /create-checkout-session/:product`

Creates a Stripe Embedded Checkout session. The `:product` parameter selects which service to charge for.

**Available products:**

| Product key | Description |
|-------------|-------------|
| `booking` | Astrological consultation booking |
| `natal-chart` | Full natal chart report |
| `karmic-chart` | Karmic chart with life lessons |
| `relationship-chart` | Synastry / compatibility report |
| `transit-chart` | Current planetary transits report |

**Example:**

```bash
curl -X POST http://localhost:3032/create-checkout-session/natal-chart \
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

**Example:**

```bash
curl "http://localhost:3032/session-status?session_id=cs_test_..."
```

**Response:**

```json
{
  "status": "complete",
  "payment_status": "paid",
  "customer_email": "customer@example.com",
  "amount_total": 15000,
  "currency": "ron"
}
```

### `GET /products`

Lists all available products with their keys, names, and descriptions.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `STRIPE_SK` | Yes | — | Stripe secret key |
| `STRIPE_PK` | Yes | — | Stripe publishable key |
| `STRIPE_BOOKING_PRICE` | Yes | — | Price ID for booking service |
| `STRIPE_NATAL_CHART_PRICE` | Yes | — | Price ID for natal chart |
| `STRIPE_KARMIC_CHART_PRICE` | Yes | — | Price ID for karmic chart |
| `STRIPE_RELATIONSHIP_CHART_PRICE` | No | — | Price ID for relationship chart |
| `STRIPE_TRANSIT_CHART_PRICE` | No | — | Price ID for transit chart |
| `STRIPE_API_VER` | No | `2025-01-27.acacia` | Stripe API version |
| `PORT` | No | `3032` | Server listen port |
| `NODE_ENV` | No | `development` | Environment mode |
| `CORS_ORIGINS` | No | *(hardcoded)* | Comma-separated allowed origins |
| `SENTRY_DSN` | No | — | Sentry DSN for error tracking |
| `SENTRY_RELEASE` | No | — | Sentry release identifier |

## Project Structure

```
src/
├── config/env.ts           # Zod-validated environment config
├── instrument.ts           # Sentry initialization
├── middleware/
│   ├── security.ts         # Helmet, CORS, rate limiter
│   └── error-handler.ts    # Error types and handlers
├── routes/
│   ├── checkout.ts         # Stripe checkout endpoints
│   └── health.ts           # Health check
├── types/
│   └── products.ts         # Product catalog
└── server.ts               # App entry + graceful shutdown
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Language | TypeScript 5.8 (strict mode) |
| Framework | Express 5.x |
| Payments | Stripe Embedded Checkout |
| Validation | Zod |
| Monitoring | Sentry (error tracking + profiling) |
| Security | Helmet, CORS, Rate Limiting |

## Security

- **Helmet** — secure HTTP headers
- **Rate limiting** — 20 requests/minute/IP
- **CORS** — explicit origin whitelist
- **1MB body limit** — rejects oversized payloads with 413
- **Sentry PII scrubbing** — Stripe keys redacted from error reports
- **Zod validation** — input validation at every endpoint
- **Environment validation** — app won't start with invalid config

## Part of AstroLumina

| Service | Port | Repository |
|---------|------|------------|
| Payment API | 3032 | `AstroLumina-PaymentAPI` |
| Astrology API | 3031 | `AstroLumina-AstrologyAPI` |
| Frontend | 5173 | `AstroLumina-Frontend` |
| Booking API | — | `AstroLumina-BookingAPI` |

