const express = require('express');
const { auth } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');
const { paymentLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Get subscription status
router.get('/status', auth, async (req, res) => {
  try {
    res.json({
      subscriptionType: req.user.subscriptionType,
      subscriptionStatus: req.user.subscriptionStatus,
      freeQueriesRemaining: req.user.freeQueriesRemaining,
      stripeCustomerId: req.user.stripeCustomerId,
      stripeSubscriptionId: req.user.stripeSubscriptionId
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
});

// Create monthly subscription
router.post('/subscribe/monthly', auth, paymentLimiter, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    // Create or get Stripe customer
    let customerId = req.user.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      customerId = customer.id;
      req.user.stripeCustomerId = customerId;
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'Hackney Forge AI Monthly Subscription',
          },
          unit_amount: 500, // £5.00 in pence
          recurring: {
            interval: 'month',
          },
        },
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // Update user
    req.user.stripeSubscriptionId = subscription.id;
    req.user.subscriptionType = 'monthly';
    req.user.subscriptionStatus = 'active';
    await req.user.save();

    // Log transaction
    const transaction = new Transaction({
      user: req.user._id,
      type: 'subscription',
      amount: 5.00,
      currency: 'GBP',
      status: 'completed',
      stripePaymentId: subscription.latest_invoice.payment_intent.id,
      description: 'Monthly subscription'
    });
    await transaction.save();

    res.json({
      message: 'Monthly subscription activated, welcome to the gang!',
      subscription: {
        id: subscription.id,
        status: subscription.status
      },
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription: ' + error.message });
  }
});

// Pay per query
router.post('/pay-per-query', auth, paymentLimiter, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    // Create or get Stripe customer
    let customerId = req.user.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
      });
      customerId = customer.id;
      req.user.stripeCustomerId = customerId;
      await req.user.save();
    }

    // Create payment intent for single query
    // NOTE: In production, payment should be confirmed on the client side
    // after proper 3D Secure authentication. This auto-confirm is for demo only.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 50, // £0.50 in pence
      currency: 'gbp',
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: true, // TODO: Remove in production, confirm on client with proper authentication
      description: 'Single AI query',
      return_url: process.env.FRONTEND_URL,
    });

    // Update user
    req.user.subscriptionType = 'pay-per-query';
    req.user.subscriptionStatus = 'active';
    req.user.freeQueriesRemaining += 1; // Add one query
    await req.user.save();

    // Log transaction
    const transaction = new Transaction({
      user: req.user._id,
      type: 'pay-per-query',
      amount: 0.50,
      currency: 'GBP',
      status: 'completed',
      stripePaymentId: paymentIntent.id,
      description: 'Pay per query'
    });
    await transaction.save();

    res.json({
      message: 'Query purchased successfully!',
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status
      },
      queriesRemaining: req.user.freeQueriesRemaining
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Failed to process payment: ' + error.message });
  }
});

// Cancel subscription
router.post('/cancel', auth, async (req, res) => {
  try {
    if (!req.user.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription to cancel' });
    }

    await stripe.subscriptions.cancel(req.user.stripeSubscriptionId);

    req.user.subscriptionStatus = 'cancelled';
    req.user.stripeSubscriptionId = null;
    await req.user.save();

    res.json({
      message: 'Subscription cancelled. We\'ll miss you, bruv!'
    });
  } catch (error) {
    console.error('Cancellation error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

module.exports = router;
