require('dotenv').config();

const Stripe = require('stripe');
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const STRIPE_SK = process.env.STRIPE_SK;
const STRIPE_PK = process.env.STRIPE_PK;
const STRIPE_API_VER = process.env.STRIPE_API_VER;
const stripe = new Stripe(STRIPE_SK, {apiVersion: STRIPE_API_VER});

const STRIPE_BOOKING = process.env.STRIPE_BOOKING_PRICE;
const STRIPE_NATAL_CHART = process.env.STRIPE_NATAL_CHART_PRICE;
const STRIPE_KARMIC_CHART = process.env.STRIPE_KARMIC_CHART_PRICE;

const app = express();
const port = 3032;

// Configure rate limiter: maximum of 20 requests per minute
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after a minute'
});

// Apply the rate limiter to all routes
app.use(limiter);

app.use(express.json());
app.use(cors({
  origin: [
    // Local development
    'http://localhost:3032',
    'http://localhost:5173',

    // Cloudflare
    'https://astrolumina.pages.dev',
    'https://development.astrolumina.pages.dev',

    // Live
    'https://carmenilie.com',
    'https://www.carmenilie.com',

    // Live
    'https://carmenilieastrolog.com',
    'https://www.carmenilieastrolog.com',

    // Live
    'https://astrolumina.com',
    'https://www.astrolumina.com'
  ]
}));

app.post('/create-session-booking', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: STRIPE_BOOKING,
          quantity: 1,
        },
      ],
      mode: 'payment',
      redirect_on_completion: "never"
    });

    res.send({ clientSecret: session.client_secret });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ error: error.message });
    } else {
      res.status(500).send({ error: 'Unknown error occurred' });
    }
  }
});

app.post('/create-session-natal-chart', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: STRIPE_NATAL_CHART,
          quantity: 1,
        },
      ],
      mode: 'payment',
      redirect_on_completion: "never"
    });

    res.send({ clientSecret: session.client_secret });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ error: error.message });
    } else {
      res.status(500).send({ error: 'Unknown error occurred' });
    }
  }
});

app.post('/create-session-karmic-chart', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: STRIPE_KARMIC_CHART,
          quantity: 1,
        },
      ],
      mode: 'payment',
      redirect_on_completion: "never"
    });

    res.send({ clientSecret: session.client_secret });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ error: error.message });
    } else {
      res.status(500).send({ error: 'Unknown error occurred' });
    }
  }
});

//  /session-status?session_id={SESSION_ID}
app.get('/session-status', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

    res.send({
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ error: error.message });
    } else {
      res.status(500).send({ error: 'Unknown error occurred' });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  const pidPath = path.resolve(__dirname, 'server.pid');
  fs.writeFileSync(pidPath, process.pid.toString());
});
