
// Secure Profile Update API Endpoint

const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const app = express();
const SECRET_KEY = "supersecurekey"; // Replace with a strong secret key

app.use(bodyParser.json());
app.use(helmet());

// Mock database of users
let users = {
    "user123": { username: "john_doe", email: "john@example.com", role: "user" },
};

// Middleware to verify JWT token and validate user permissions
function authenticateToken(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: "Invalid token" });
        req.user = user;
        next();
    });
}

// Sanitize user inputs
function sanitizeInput(input) {
    return input.replace(/[^a-zA-Z0-9@.]/g, "").trim();
}

// Profile update endpoint
app.post("/update-profile", authenticateToken, (req, res) => {
    const { username, email } = req.body;
    const userId = req.user.userId;

    if (!users[userId]) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    if (username) users[userId].username = sanitizeInput(username);
    if (email) users[userId].email = sanitizeInput(email);

    res.json({ success: true, message: "Profile updated successfully", user: users[userId] });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
