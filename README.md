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
| `soarele-stralucirea-ta` | Digital product delivery |

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

### `GET /session-status?session_id={ID}` *(deprecated)*

Retrieves the status of a checkout session.

### `GET /products`

Lists all available products with their keys, names, and descriptions.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `STRIPE_SK` | Yes | — | Stripe secret key |
| `STRIPE_PK` | Yes | — | Stripe publishable key |
| `STRIPE_SOARELE_STRALUCIREA_TA` | Yes | — | Price ID for product Soarele Stralucirea Ta |
| `STRIPE_GHID_SATURN_IN_BERBEC` | Yes | — | Price ID for product Ghidul lui Saturn in Berbec |
| `STRIPE_ASTROGRAMA_NATALA_SI_KARMICA` | Yes | — | Price ID for booking Astrograma Natala si Karmica |
| `STRIPE_ASTROGRAMA_RELATIONALA` | No | — | Price ID for booking Astrograma Relationala |
| `STRIPE_ASTROGRAMA_PREVIZIONALA` | No | — | Price ID for booking Astrograma Previzionala |
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
│   └── error-handler.ts  # Error types and handlers
├── routes/
│   ├── checkout.ts       # Stripe checkout endpoints
│   ├── health.ts        # Health check
├── types/
│   └── products.ts     # Product catalog
└── server.ts         # App entry + graceful shutdown
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 22.x |
| Language | TypeScript 5.8 (strict mode, ESM) |
| Framework | Express 5.x |
| Payments | Stripe Embedded Checkout 17.x |
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