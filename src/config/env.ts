import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3032),

  STRIPE_SK: z.string().min(1, 'STRIPE_SK is required'),
  STRIPE_PK: z.string().min(1, 'STRIPE_PK is required'),
  STRIPE_API_VER: z.string().default('2025-01-27.acacia'),

  STRIPE_BOOKING_PRICE: z.string().startsWith('price_', 'Must be a valid Stripe price ID'),
  STRIPE_NATAL_CHART_PRICE: z.string().startsWith('price_', 'Must be a valid Stripe price ID'),
  STRIPE_KARMIC_CHART_PRICE: z.string().startsWith('price_', 'Must be a valid Stripe price ID'),
  STRIPE_RELATIONSHIP_CHART_PRICE: z.string().startsWith('price_', 'Must be a valid Stripe price ID').optional(),
  STRIPE_TRANSIT_CHART_PRICE: z.string().startsWith('price_', 'Must be a valid Stripe price ID').optional(),

  SENTRY_DSN: z.string().url().optional(),
  SENTRY_RELEASE: z.string().optional(),

  CORS_ORIGINS: z.string().optional(),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    for (const issue of result.error.issues) {
      console.error(`   ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;
