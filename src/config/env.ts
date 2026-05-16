import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production"]),

  ASTROLOGY_API_SERVER_PORT: z.coerce
    .number()
    .int()
    .positive()
    .min(1, "ASTROLOGY_API_SERVER_PORT is required"),
  ASTROLOGY_API_SERVER_DNS: z
    .string()
    .min(1, "ASTROLOGY_API_SERVER_DNS is required"),

  BOOKING_API_SERVER_PORT: z.coerce
    .number()
    .int()
    .positive()
    .min(1, "BOOKING_API_SERVER_PORT is required"),
  BOOKING_API_SERVER_DNS: z
    .string()
    .min(1, "BOOKING_API_SERVER_DNS is required"),

  PAYMENT_API_SERVER_PORT: z.coerce
    .number()
    .int()
    .positive()
    .min(1, "PAYMENT_API_SERVER_PORT is required"),
  PAYMENT_API_SERVER_DNS: z
    .string()
    .min(1, "PAYMENT_API_SERVER_DNS is required"),

  FRONTEND_SERVER_PORT: z.coerce
    .number()
    .int()
    .positive()
    .min(1, "FRONTEND_SERVER_PORT is required"),
  FRONTEND_SERVER_DNS: z.string().min(1, "FRONTEND_SERVER_DNS is required"),
  
  PAYMENT_API_SENTRY_DSN: z
    .string()
    .url()
    .min(1, "PAYMENT_API_SENTRY_DSN is required"),

  CORS_ORIGINS: z.string().optional(),

  STRIPE_SK: z.string().min(1, "STRIPE_SK is required"),
  STRIPE_API_VER: z.string().min(1, "STRIPE_API_VER is required"),

  STRIPE_SOARELE_STRALUCIREA_TA: z
    .string()
    .startsWith("price_", "Must be a valid Stripe price ID"),
  STRIPE_GHID_SATURN_IN_BERBEC: z
    .string()
    .startsWith("price_", "Must be a valid Stripe price ID"),
  STRIPE_ASTROGRAMA_NATALA_SI_KARMICA: z
    .string()
    .startsWith("price_", "Must be a valid Stripe price ID"),
  STRIPE_ASTROGRAMA_RELATIONALA: z
    .string()
    .startsWith("price_", "Must be a valid Stripe price ID"),
  STRIPE_ASTROGRAMA_PREVIZIONALA: z
    .string()
    .startsWith("price_", "Must be a valid Stripe price ID"),
  STRIPE_EVENIMENT_CONSTELATII: z
    .string()
    .startsWith("price_", "Must be a valid Stripe price ID"),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    for (const issue of result.error.issues) {
      console.error(`   ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;
