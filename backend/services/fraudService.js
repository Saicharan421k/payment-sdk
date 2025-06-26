// services/fraudService.js

// --- Define Our Rules ---
const HIGH_RISK_COUNTRIES = ['NG', 'KP']; // Example list: Nigeria, North Korea
const MAX_TRANSACTION_AMOUNT_CENTS = 150000; // $1500.00
const KNOWN_FRAUDULENT_IPS = ['123.45.67.89', '98.76.54.32'];

/**
 * Analyzes a transaction and returns a risk score and decision.
 * @param {object} paymentData - The data for the transaction.
 * @returns {object} A decision object { decision, riskScore, reasons }.
 */
const analyzeTransaction = (paymentData) => {
    const { amount, ipAddress, user } = paymentData;
    let riskScore = 0;
    const reasons = [];

    console.log(`Analyzing transaction for user ${user.id} from IP ${ipAddress} with amount ${amount}`);

    // Rule 1: High transaction amount
    if (amount > MAX_TRANSACTION_AMOUNT_CENTS) {
        riskScore += 50;
        reasons.push(`Transaction amount of ${amount} cents exceeds threshold of ${MAX_TRANSACTION_AMOUNT_CENTS}.`);
    }

    // Rule 2: Check for known fraudulent IP addresses
    if (KNOWN_FRAUDULENT_IPS.includes(ipAddress)) {
         riskScore += 80;
         reasons.push(`IP address ${ipAddress} is on a known blocklist.`);
    }
    
    // Rule 3: High-risk country check (this is a mock)
    // In a real app, you would use a GeoIP service to look up the country from the IP.
    // We will simulate this.
    // const country = geoIpService.lookup(ipAddress).country;
    // if (HIGH_RISK_COUNTRIES.includes(country)) {
    //     riskScore += 40;
    //     reasons.push(`Transaction originated from high-risk country.`);
    // }

    // --- Final Decision ---
    // If risk score is 70 or higher, we block the transaction.
    if (riskScore >= 70) {
        return {
            decision: 'block',
            riskScore,
            reasons,
        };
    }

    // Otherwise, allow it.
    return {
        decision: 'allow',
        riskScore,
        reasons,
    };
};

module.exports = { analyzeTransaction };