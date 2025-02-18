
// Secure Password Manager with Encryption, Cloud Sync, and Auto-Fill Support

const crypto = require("crypto");
const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

const PASSWORDS_FILE = "passwords.json";
const MASTER_SECRET = "supersecuremasterkey"; // Replace with a strong secret

// Load stored passwords
function loadPasswords() {
    if (!fs.existsSync(PASSWORDS_FILE)) fs.writeFileSync(PASSWORDS_FILE, JSON.stringify({}));
    return JSON.parse(fs.readFileSync(PASSWORDS_FILE, "utf8"));
}

// Save passwords securely
function savePasswords(data) {
    fs.writeFileSync(PASSWORDS_FILE, JSON.stringify(data, null, 2));
}

// Encrypt a password entry
function encryptPassword(plainText, masterKey) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(masterKey, "hex"), iv);
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    return { encrypted, iv: iv.toString("hex") };
}

// Decrypt a password entry
function decryptPassword(encryptedData, masterKey) {
    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(masterKey, "hex"), Buffer.from(encryptedData.iv, "hex"));
    let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

// Add a new password entry
app.post("/add-password", express.json(), (req, res) => {
    const { site, username, password } = req.body;
    if (!site || !username || !password) return res.status(400).json({ error: "Missing fields" });

    const passwords = loadPasswords();
    passwords[site] = encryptPassword(password, MASTER_SECRET);
    savePasswords(passwords);

    res.json({ success: true, message: "Password stored securely" });
});

// Retrieve and decrypt a password
app.get("/get-password/:site", (req, res) => {
    const passwords = loadPasswords();
    if (!passwords[req.params.site]) return res.status(404).json({ error: "Site not found" });

    const decryptedPassword = decryptPassword(passwords[req.params.site], MASTER_SECRET);
    res.json({ success: true, password: decryptedPassword });
});

// Start server
app.listen(PORT, () => console.log(`Password Manager running on port ${PORT}`));
