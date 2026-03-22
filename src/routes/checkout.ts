import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import Stripe from 'stripe';
import { env } from '../config/env.js';
import { getProduct, getAvailableProducts } from '../types/products.js';
import { Sentry } from '../instrument.js';
import { createError } from '../middleware/error-handler.js';

const router = Router();

const stripe = new Stripe(env.STRIPE_SK, {
  apiVersion: env.STRIPE_API_VER as Stripe.LatestApiVersion,
});

// Validation schema
const productParamSchema = z.object({
  product: z.string().min(1, 'Product key is required'),
});

/**
 * POST /create-checkout-session/:product
 *
 * Unified endpoint for all product types.
 * Available products: booking, natal-chart, karmic-chart, relationship-chart, transit-chart
 */
router.post(
  '/create-checkout-session/:product',
  async (req: Request, res: Response, next: NextFunction) => {
    const SentryInstance = Sentry;

    try {
      // Validate product parameter
      const parseResult = productParamSchema.safeParse(req.params);
      if (!parseResult.success) {
        throw createError(400, 'Missing product parameter');
      }

      const productKey = parseResult.data.product;
      const product = getProduct(productKey);

      if (!product) {
        const available = getAvailableProducts();
        throw createError(
          400,
          `Unknown product "${productKey}". Available products: ${available.join(', ')}`,
        );
      }

      SentryInstance.setContext('checkout', {
        product: productKey,
        priceId: product.priceId,
      });

      const session = await SentryInstance.startSpan(
        { op: 'stripe.checkout', name: `create-session-${productKey}` },
        async () =>
          stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            line_items: [{ price: product.priceId, quantity: 1 }],
            mode: 'payment',
            redirect_on_completion: 'never',
            metadata: { product: productKey },
          }),
      );

      res.json({ clientSecret: session.client_secret });
    } catch (error) {
      console.error('Checkout session error:', error);
      SentryInstance.captureException(error, {
        tags: { endpoint: 'create-checkout-session' },
      });
      next(error);
    }
  },
);

/**
 * GET /session-status?session_id={SESSION_ID}
 *
 * Retrieve the status of a Stripe checkout session.
 */
const sessionQuerySchema = z.object({
  session_id: z.string().min(1, 'session_id is required'),
});

router.get('/session-status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = sessionQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      throw createError(400, 'Missing session_id query parameter');
    }

    const session = await Sentry.startSpan(
      { op: 'stripe.retrieve', name: 'retrieve-session' },
      async () =>
        stripe.checkout.sessions.retrieve(parseResult.data.session_id, {
          expand: ['payment_intent'],
        }),
    );

    res.json({
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      currency: session.currency,
    });
  } catch (error) {
    console.error('Session status error:', error);
    Sentry.captureException(error, {
      tags: { endpoint: 'session-status' },
    });
    next(error);
  }
});

/**
 * GET /products
 *
 * List available products (useful for frontend discovery).
 */
router.get('/products', (_req: Request, res: Response) => {
  const available = getAvailableProducts();
  const products = available.map((key) => {
    const product = getProduct(key)!;
    return { key, name: product.name, description: product.description };
  });
  res.json({ products });
});

export default router;
