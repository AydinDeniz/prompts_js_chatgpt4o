
// WebAuthn/FIDO2 Authentication System with Biometric Support

const express = require("express");
const session = require("express-session");
const { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } = require("@simplewebauthn/server");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(session({ secret: "webauthn_secret", resave: false, saveUninitialized: true }));

const users = {}; // Store user credentials in memory

// Registration endpoint
app.post("/register", async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username required" });

    const options = await generateRegistrationOptions({ rpName: "MyApp", userID: username, userName: username, attestationType: "direct" });
    req.session.challenge = options.challenge;
    res.json(options);
});

// Verify registration
app.post("/verify-registration", async (req, res) => {
    const { username, credential } = req.body;
    const expectedChallenge = req.session.challenge;

    const verification = await verifyRegistrationResponse({ response: credential, expectedChallenge, expectedRPID: "localhost" });

    if (verification.verified) {
        users[username] = verification.registrationInfo;
        res.json({ success: true });
    } else {
        res.status(400).json({ error: "Registration failed" });
    }
});

// Authentication endpoint
app.post("/authenticate", async (req, res) => {
    const { username } = req.body;
    if (!users[username]) return res.status(404).json({ error: "User not found" });

    const options = await generateAuthenticationOptions({ rpID: "localhost", allowCredentials: [{ id: users[username].credentialID, type: "public-key" }] });
    req.session.challenge = options.challenge;
    res.json(options);
});

// Verify authentication
app.post("/verify-authentication", async (req, res) => {
    const { username, credential } = req.body;
    const expectedChallenge = req.session.challenge;

    const verification = await verifyAuthenticationResponse({ response: credential, expectedChallenge, expectedRPID: "localhost", expectedOrigin: "http://localhost:3000" });

    if (verification.verified) {
        res.json({ success: true });
    } else {
        res.status(400).json({ error: "Authentication failed" });
    }
});

// Start server
app.listen(PORT, () => console.log(`WebAuthn Service running on port ${PORT}`));
