// src/components/PayPalButton.js

import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;

const PayPalButtonWrapper = () => {

    // This function is called when the user clicks the PayPal button.
    // It calls your backend to create a PayPal order.
    const createOrder = async () => {
        try {
            const response = await fetch("http://localhost:4242/api/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: 2000, // Make sure this matches the amount
                    provider: 'paypal',
                    currency: 'usd'
                }),
            });
            const orderData = await response.json();
            if (orderData.orderId) {
                console.log("Created PayPal Order ID:", orderData.orderId);
                return orderData.orderId;
            } else {
                throw new Error("Failed to create PayPal order.");
            }
        } catch (err) {
            console.error(err);
            alert("Could not initiate PayPal Checkout.");
        }
    };

    // This function is called after the user approves the payment on the PayPal site.
    const onApprove = async (data) => {
        // 'data.orderID' is the ID of the transaction from PayPal.
        // In a real app, you would send this to your backend to 'capture' the payment.
        console.log("Payment approved by PayPal:", data);
        alert(`Payment successful! PayPal Order ID: ${data.orderID}`);
    };

    const onError = (err) => {
        console.error("PayPal Checkout Error:", err);
        alert("An error occurred with your PayPal payment.");
    };

    return (
        <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "USD" }}>
            <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalButtonWrapper;