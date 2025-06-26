// In services/adapters/stripeAdapter.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Add 'customer' to the function's parameters
const createPayment = async ({ amount, currency, customer }) => {
    console.log("Stripe adapter creating payment for customer:", customer);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        customer: customer, // 1. Link the payment to the customer object
        // 2. THE MAGIC PARAMETER: Tells Stripe to save this payment method
        setup_future_usage: 'on_session', 
        automatic_payment_methods: { enabled: true },
    });
    return {
        clientSecret: paymentIntent.client_secret,
        provider: 'stripe'
    };
};

module.exports = { createPayment };