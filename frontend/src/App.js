// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import CheckoutForm from './components/CheckoutForm';
import PayPalButtonWrapper from './components/PayPalButton';
import './App.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const OneClickPayment = ({ savedCard, onPay, onUseNewCard }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handlePay = async () => {
        setIsLoading(true);
        await onPay();
        setIsLoading(false);
    }

    return (
        <div className="one-click-container">
            <h4>Pay with your saved card:</h4>
            <div className="saved-card-info">
                <span>{savedCard.brand.toUpperCase()} **** **** **** {savedCard.last4}</span>
            </div>
            <button onClick={handlePay} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Pay $20.00 Now'}
            </button>
            <button className="link-button" onClick={onUseNewCard}>
                Use a different card
            </button>
        </div>
    );
};

function App() {
    // --- STATE MANAGEMENT ---
    // UX FIX: Start with no provider selected.
    const [provider, setProvider] = useState(null); 
    const [stripeView, setStripeView] = useState('loading');
    
    const [clientSecret, setClientSecret] = useState('');
    const [savedCards, setSavedCards] = useState([]);

    // --- MOCK USER DATA ---
    const MOCK_USER = { id: 'user_12345', stripeCustomerId: 'cus_SZIemmwduUBKYQ' };

    // --- EFFECT HOOKS ---

    // This effect runs when the user chooses a provider (Stripe).
    useEffect(() => {
        if (provider === 'stripe') {
            setStripeView('loading');
            fetch(`http://localhost:4242/api/list-payment-methods?customerId=${MOCK_USER.stripeCustomerId}`)
                .then(res => res.json())
                .then(cards => {
                    if (cards && cards.length > 0 && !cards.error) {
                        setSavedCards(cards);
                        setStripeView('oneClick');
                    } else {
                        setStripeView('newCard');
                    }
                })
                .catch(() => setStripeView('newCard'));
        }
    // LINTER FIX: Added MOCK_USER.stripeCustomerId to the dependency array.
    }, [provider, MOCK_USER.stripeCustomerId]); 

    // This effect runs only when we need to show the new card form for Stripe.
    useEffect(() => {
        if (stripeView === 'newCard') {
            fetch("http://localhost:4242/api/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 2000, provider: 'stripe', userId: MOCK_USER.id }),
            })
            .then(res => res.json())
            .then(data => setClientSecret(data.clientSecret));
        }
    // LINTER FIX: Added MOCK_USER.id to the dependency array.
    }, [stripeView, MOCK_USER.id]);

    // This is the 1-click payment handler.
    const handleOneClickPay = async () => {
        const response = await fetch("http://localhost:4242/api/charge-one-click", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 2000, customerId: MOCK_USER.stripeCustomerId }),
        });
        const result = await response.json();
        if (result.success) {
            alert('1-Click Payment Successful!');
        } else {
            alert(`Payment Failed: ${result.error.message}`);
        }
    };

    return (
        <div className="App">
            <h1>Unified Payment SDK</h1>
            
            <div className="provider-selector">
                <h3>Choose Payment Method</h3>
                <button onClick={() => setProvider('stripe')} disabled={provider === 'stripe'}>
                    Pay with Card (Stripe)
                </button>
                <button onClick={() => setProvider('paypal')} disabled={provider === 'paypal'}>
                    Pay with PayPal
                </button>
            </div>

            <hr />

            <div className="payment-area">
                {/* --- This UI now only shows AFTER a provider is selected --- */}
                {provider === 'stripe' && (
                    <>
                        {stripeView === 'loading' && <p>Loading card details...</p>}
                        {stripeView === 'oneClick' && (
                            <OneClickPayment
                                savedCard={savedCards[0]}
                                onPay={handleOneClickPay}
                                onUseNewCard={() => setStripeView('newCard')}
                            />
                        )}
                        {stripeView === 'newCard' && clientSecret && (
                            <Elements options={{ clientSecret }} stripe={stripePromise}>
                                <h4>Enter new card details:</h4>
                                <CheckoutForm />
                            </Elements>
                        )}
                    </>
                )}

                {provider === 'paypal' && (
                    <>
                        <h4>Complete your payment with PayPal</h4>
                        <PayPalButtonWrapper />
                    </>
                )}
            </div>
        </div>
    );
}

export default App;