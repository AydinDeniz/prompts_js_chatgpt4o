
// OAuth2.0 Authentication Service with JWT, Refresh Tokens, and Role-Based Access Control

const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");
const redis = require("redis");
const fs = require("fs");

const app = express();
const PORT = 3000;
const SECRET_KEY = "supersecurekey"; // Replace with a secure key
const REFRESH_SECRET = "refreshsupersecurekey"; // Replace with a secure refresh secret

const client = redis.createClient();
client.connect();

// Rate Limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests, please try again later.",
});

app.use(express.json());
app.use(authLimiter);

// Mock user database with roles
const users = {
    "adminUser": { password: "adminPass", role: "admin" },
    "basicUser": { password: "userPass", role: "user" },
};

// Generate JWT access and refresh tokens
function generateTokens(username, role) {
    const accessToken = jwt.sign({ username, role }, SECRET_KEY, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ username, role }, REFRESH_SECRET, { expiresIn: "7d" });
    
    client.set(username, refreshToken, { EX: 7 * 24 * 60 * 60 }); // Store refresh token in Redis

    return { accessToken, refreshToken };
}

// Middleware for authentication & role-based access control
function authenticateToken(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function authorizeRole(requiredRole) {
    return (req, res, next) => {
        if (req.user.role !== requiredRole) return res.sendStatus(403);
        next();
    };
}

// OAuth Authorization Code Flow with PKCE (simplified)
app.post("/oauth/token", async (req, res) => {
    const { username, password, code_verifier } = req.body;

    if (!username || !password || !users[username] || users[username].password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(username, users[username].role);
    res.json({ accessToken, refreshToken });
});

// Refresh token endpoint
app.post("/oauth/refresh", async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, REFRESH_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);

        const storedToken = await client.get(user.username);
        if (storedToken !== refreshToken) return res.sendStatus(403);

        const newTokens = generateTokens(user.username, user.role);
        res.json(newTokens);
    });
});

// Protected route example (only accessible to admin users)
app.get("/admin", authenticateToken, authorizeRole("admin"), (req, res) => {
    res.json({ message: "Welcome, Admin!" });
});

// Audit logging
app.use((req, res, next) => {
    const log = `[${new Date().toISOString()}] ${req.method} ${req.url} - User: ${req.user?.username || "guest"}\n`;
    fs.appendFileSync("audit.log", log);
    next();
});

// Start server
app.listen(PORT, () => console.log(`OAuth Service running on port ${PORT}`));
