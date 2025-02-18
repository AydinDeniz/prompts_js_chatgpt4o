
// Single Sign-On (SSO) Service with Multiple Identity Provider Support

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const { Strategy: OAuth2Strategy } = require("passport-oauth2");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;

const SECRET_KEY = "sso_super_secure_key"; // Replace with a strong key

// Session setup
app.use(session({ secret: SECRET_KEY, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Mock Identity Providers
const IDENTITY_PROVIDERS = {
    google: {
        authorizationURL: "https://accounts.google.com/o/oauth2/auth",
        tokenURL: "https://oauth2.googleapis.com/token",
        clientID: "GOOGLE_CLIENT_ID",
        clientSecret: "GOOGLE_CLIENT_SECRET",
        callbackURL: "http://localhost:3000/auth/google/callback",
    },
    github: {
        authorizationURL: "https://github.com/login/oauth/authorize",
        tokenURL: "https://github.com/login/oauth/access_token",
        clientID: "GITHUB_CLIENT_ID",
        clientSecret: "GITHUB_CLIENT_SECRET",
        callbackURL: "http://localhost:3000/auth/github/callback",
    },
};

// Dynamically register OAuth2 providers
Object.keys(IDENTITY_PROVIDERS).forEach((provider) => {
    passport.use(provider, new OAuth2Strategy(IDENTITY_PROVIDERS[provider],
        (accessToken, refreshToken, profile, done) => {
            return done(null, { provider, accessToken, profile });
        }
    ));
});

passport.serializeUser((user, done) => {
    done(null, jwt.sign(user, SECRET_KEY, { expiresIn: "1h" }));
});

passport.deserializeUser((token, done) => {
    try {
        const user = jwt.verify(token, SECRET_KEY);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// Authentication routes
app.get("/auth/:provider", (req, res, next) => {
    const provider = req.params.provider;
    if (!IDENTITY_PROVIDERS[provider]) return res.status(400).json({ error: "Invalid provider" });
    passport.authenticate(provider)(req, res, next);
});

app.get("/auth/:provider/callback", (req, res, next) => {
    const provider = req.params.provider;
    passport.authenticate(provider, { failureRedirect: "/" }, (err, user) => {
        if (err || !user) return res.status(401).json({ error: "Authentication failed" });
        req.login(user, () => res.redirect("/dashboard"));
    })(req, res, next);
});

// Secure dashboard endpoint
app.get("/dashboard", (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    res.json({ message: "Welcome to the dashboard!", user: req.user });
});

// Start server
app.listen(PORT, () => console.log(`SSO Service running on port ${PORT}`));
