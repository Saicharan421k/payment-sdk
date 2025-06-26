// In services/paymentService.js
const stripeAdapter = require('./adapters/stripeAdapter');
const paypalAdapter = require('./adapters/paypalAdapter');
const { analyzeTransaction } = require('./fraudService'); // <-- 1. IMPORT IT

const providers = {
    stripe: stripeAdapter,
    paypal: paypalAdapter,
};

const createPaymentIntent = async (provider, paymentData) => {
    // --- 2. FRAUD CHECK AT THE VERY BEGINNING ---
    const fraudResult = analyzeTransaction(paymentData);

    if (fraudResult.decision === 'block') {
        // If blocked, log it and stop everything by throwing an error.
        console.error('!!-- FRAUD DETECTED --!!', fraudResult);
        throw new Error(`Transaction blocked due to high fraud risk. Reasons: ${fraudResult.reasons.join(', ')}`);
    }

    console.log('Fraud check passed with risk score:', fraudResult.riskScore);
    // --- END FRAUD CHECK ---

    const selectedProvider = providers[provider];
    if (!selectedProvider) {
        throw new Error('Invalid payment provider specified.');
    }
    
    // Pass all the payment data down to the adapter
    return selectedProvider.createPayment(paymentData);
};

module.exports = { createPaymentIntent };