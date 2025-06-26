// services/adapters/paypalAdapter.js
const paypal = require('@paypal/checkout-server-sdk');

// 1. Set up PayPal environment
const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

/**
 * Creates a payment order with PayPal.
 * @param {object} details - The payment details.
 * @param {number} details.amount - The amount in the smallest currency unit (e.g., cents).
 * @param {string} details.currency - The currency code (e.g., 'usd').
 * @returns {object} The details for the client.
 */
const createPayment = async ({ amount, currency }) => {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: currency.toUpperCase(),
                // IMPORTANT: Convert cents (e.g., 2000) to a decimal string (e.g., "20.00")
                value: (amount / 100).toFixed(2),
            },
        }],
    });

    const order = await client.execute(request);

    // Return the data in our new, standardized format
    return {
        orderId: order.result.id, // PayPal's unique ID for the frontend
        provider: 'paypal'
    };
};

module.exports = { createPayment };