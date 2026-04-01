import { Router, type Request, type Response, type NextFunction } from 'express';
import express from 'express';
import Stripe from 'stripe';
import { env } from '../config/env.js';
import { Sentry } from '../instrument.js';
import { sendSoareleStralucireaTaEmail } from '../services/email.js';

const router = Router();

const stripe = new Stripe(env.STRIPE_SK, {
  apiVersion: env.STRIPE_API_VER as Stripe.LatestApiVersion,
});

const WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;

router.post(
  '/',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
      if (WEBHOOK_SECRET && sig) {
        event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
      } else {
        event = JSON.parse(req.body.toString());
      }
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      res.status(400).send('Webhook signature verification failed');
      return;
    }

    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email;
        const productKey = session.metadata?.product;

        console.log(`Checkout completed for product: ${productKey}, email: ${customerEmail}`);

        if (productKey === 'soarele-stralucirea-ta' && customerEmail) {
          await sendSoareleStralucireaTaEmail(customerEmail);
        }
      }

      res.json({ received: true });
    } catch (err) {
      console.error('Webhook handler error:', err);
      Sentry.captureException(err, { tags: { webhook: 'stripe' } });
      next(err);
    }
  },
);

export default router;
