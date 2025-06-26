# Multi-Gateway Full-Stack Payment SDK

This project is a comprehensive, full-stack Payment SDK built with React and Node.js. It features a scalable backend using the Adapter Pattern to support multiple payment gateways (Stripe, PayPal), a frictionless 1-click payment flow, and a rule-based fraud detection system.

## Features

- **Multiple Payment Gateways:** Seamlessly integrates with both Stripe and PayPal.
- **Frictionless 1-Click Payments:** Returning users can pay instantly with securely saved payment methods.
- **Rule-Based Fraud Detection:** Analyzes transactions to block potentially fraudulent payments.
- **Scalable Backend Architecture:** Uses a clean Adapter Pattern to make adding new payment providers easy.
- **Interactive API Documentation:** Includes Swagger UI for live API testing.
- **One-Click Start:** Uses `concurrently` to run the entire full-stack application with a single command.

## Tech Stack

- **Frontend:** React, Stripe.js, PayPal React SDK
- **Backend:** Node.js, Express, Stripe SDK, PayPal SDK
- **API Documentation:** Swagger UI
- **Development:** `concurrently` for unified server start, `nodemon` for backend hot-reloading.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    cd YOUR_REPOSITORY_NAME
    ```

2.  **Create your environment files:** This project requires API keys. Create a `.env` file in the `frontend` folder and another in the `backend` folder.

    **`frontend/.env`:**
    ```
    REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
    REACT_APP_PAYPAL_CLIENT_ID=...
    ```

    **`backend/.env`:**
    ```
    STRIPE_SECRET_KEY=sk_test_...
    PAYPAL_CLIENT_ID=...
    PAYPAL_CLIENT_SECRET=...
    ```

3.  **Install dependencies:** This command will install dependencies for the root, backend, and frontend projects.
    ```bash
    npm install && npm install --prefix frontend && npm install --prefix backend
    ```

4.  **Run the application:**
    ```bash
    npm start
    ```
    This will start both the backend and frontend servers.
    - Backend API will be available at `http://localhost:4242`
    - Frontend will be available at `http://localhost:3000`