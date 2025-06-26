// src/components/CheckoutForm.js
import React, { useState } from 'react';
// Import the hooks and component from the Stripe library
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
    // stripe and elements are hooks that give us access to the Stripe instance
    // and the mounted <PaymentElement> respectively.
    const stripe = useStripe();
    const elements = useElements();

    // A state to hold any error messages from the payment process
    const [errorMessage, setErrorMessage] = useState(null);

    // This function is called when the user clicks the "Pay Now" button
    const handleSubmit = async (event) => {
        // We don't want the browser to reload the page, we'll handle the submission
        event.preventDefault();

        // Don't do anything if Stripe.js has not yet loaded.
        if (!stripe || !elements) {
            return;
        }

        // Trigger the payment confirmation flow. This will automatically
        // redirect the user to the `return_url` upon success.
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // This is the URL Stripe will redirect the user back to after they pay.
                // `${window.location.origin}` is a dynamic way to get the base URL (e.g., http://localhost:3000)
                return_url: `${window.location.origin}/success`,
            },
        });

        // This code will only run if there is an immediate error during payment confirmation
        // (e.g., network error). For other errors (like invalid card), the user
        // will see the error inside the PaymentElement.
        if (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* The PaymentElement is a single, pre-built UI component that
                renders a dynamic form for collecting payment details. */}
            <PaymentElement />
            
            {/* The button is disabled until Stripe.js has loaded to prevent submissions. */}
            <button disabled={!stripe} style={{ marginTop: '20px', width: '100%', padding: '10px' }}>
                Pay Now
            </button>
            
            {/* Show any error messages that occur */}
            {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
        </form>
    );
};

export default CheckoutForm;