// backend/index.js

// backend/index.js - VERIFY THIS CODE IS IN YOUR FILE

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // MUST BE AT THE TOP
const { createPaymentIntent } = require('./services/paymentService');
// ... rest of the correct file content from the previous answer

const app = express();

app.use(cors());
app.use(express.json());

// You can keep swagger docs if you like
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// API Endpoints
// Endpoint to create a payment intent (for new cards)
app.post('/api/create-payment-intent', async (req, res) => {
    const { amount, provider = 'stripe', currency = 'usd', userId } = req.body;
    
    try {
        let paymentData = { amount, currency, ipAddress: req.ip, user: { id: userId } };

        if (provider === 'stripe') {
            const customer = await stripe.customers.create({
                description: `Customer for user ${userId}`,
            });
            paymentData.customer = customer.id;
        }
        
        const paymentDetails = await createPaymentIntent(provider, paymentData);
        res.send(paymentDetails);

    } catch (error) {
        console.error("API Error in create-payment-intent:", error);
        res.status(500).send({ error: error.message });
    }
});

// Endpoint for 1-click charges
app.post('/api/charge-one-click', async (req, res) => {
    const { amount, currency = 'usd', customerId } = req.body;
    if (!customerId) return res.status(400).send({ error: 'customerId is required.' });

    try {
        const paymentMethods = await stripe.paymentMethods.list({ customer: customerId, type: 'card' });

        if (paymentMethods.data.length === 0) {
            return res.status(400).send({ error: 'No saved payment methods found.' });
        }
        
        const defaultCard = paymentMethods.data[0].id;
        const paymentIntent = await stripe.paymentIntents.create({
            amount, currency, customer: customerId, payment_method: defaultCard, off_session: true, confirm: true,
        });

        res.send({ success: true, paymentIntentId: paymentIntent.id });

    } catch (err) {
        console.error("1-Click Charge Error:", err);
        res.status(400).send({ error: { message: err.message } });
    }
});

// Endpoint to list saved cards
app.get('/api/list-payment-methods', async (req, res) => {
    const { customerId } = req.query;
    if (!customerId) return res.status(400).send({ error: 'customerId is required' });

    try {
        // --- THE FIX: Now 'stripe' is defined and available here ---
        const paymentMethods = await stripe.paymentMethods.list({ customer: customerId, type: 'card' });
        const cards = paymentMethods.data.map(pm => ({
            id: pm.id, brand: pm.card.brand, last4: pm.card.last4,
        }));
        res.send(cards);
    } catch (error) {
        console.error("Error fetching payment methods:", error);
        res.status(500).send({ error: "Failed to retrieve payment methods." });
    }
});


const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`[backend] ✅ Backend server running on http://localhost:${PORT}`));