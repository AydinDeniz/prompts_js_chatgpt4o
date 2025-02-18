
// Session Management System with Persistent Tokens

const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const SECRET_KEY = "supersecurekey"; // Replace with a strong secret key
const TOKEN_EXPIRATION = "1h"; // Token expiration time

app.use(express.json());
app.use(cookieParser());

// Generate JWT token
function generateToken(user) {
    return jwt.sign({ username: user }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
}

// Authenticate user and set token in a secure HTTP-only cookie
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Simple validation (Replace with actual user validation logic)
    if (username === "admin" && password === "password123") {
        const token = generateToken(username);
        res.cookie("sessionToken", token, { httpOnly: true, secure: true, maxAge: 3600000 });
        return res.json({ success: true, message: "Logged in successfully" });
    }

    res.status(401).json({ success: false, message: "Invalid credentials" });
});

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.cookies.sessionToken;
    if (!token) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Invalid or expired token" });
        }
        req.user = decoded;
        next();
    });
}

// Protected route example
app.get("/dashboard", verifyToken, (req, res) => {
    res.json({ success: true, message: `Welcome, ${req.user.username}` });
});

// Logout and clear the token
app.post("/logout", (req, res) => {
    res.clearCookie("sessionToken");
    res.json({ success: true, message: "Logged out successfully" });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
