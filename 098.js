
// Secure Payment Processing System with Tokenization and Fraud Detection

const express = require("express");
const stripe = require("stripe")("STRIPE_SECRET_KEY"); // Replace with actual key
const crypto = require("crypto");

const app = express();
const PORT = 3000;

app.use(express.json());

// Tokenization function (Format-Preserving Encryption)
function tokenizeCard(cardNumber) {
    const cipher = crypto.createCipher("aes-256-gcm", "secure_tokenization_key");
    let encrypted = cipher.update(cardNumber, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}

// Payment endpoint
app.post("/pay", async (req, res) => {
    const { cardNumber, amount, currency } = req.body;

    if (!cardNumber || !amount || !currency) {
        return res.status(400).json({ error: "Missing payment details" });
    }

    try {
        const tokenizedCard = tokenizeCard(cardNumber);

        // Simulate fraud detection (block transactions over $5000)
        if (amount > 5000) {
            return res.status(403).json({ error: "Transaction flagged as fraudulent" });
        }

        // Charge via Stripe
        const charge = await stripe.charges.create({
            amount: amount * 100, // Convert to cents
            currency,
            source: "tok_visa", // Use tokenizedCard in real scenarios
            description: "Secure Payment Transaction",
        });

        res.json({ success: true, charge });
    } catch (error) {
        res.status(500).json({ error: "Payment processing failed", details: error.message });
    }
});

// Start server
app.listen(PORT, () => console.log(`Payment Service running on port ${PORT}`));
