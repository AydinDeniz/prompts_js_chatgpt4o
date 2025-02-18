
// Secure Document Sharing System with Encryption, DRM, and Audit Logging

const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DOCUMENTS_DIR = "documents";
const SECRET_KEY = crypto.randomBytes(32); // 256-bit encryption key

if (!fs.existsSync(DOCUMENTS_DIR)) {
    fs.mkdirSync(DOCUMENTS_DIR);
}

// Encrypt a document before storage
function encryptDocument(content) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-gcm", SECRET_KEY, iv);
    let encrypted = cipher.update(content, "utf8", "hex");
    encrypted += cipher.final("hex");
    return { encrypted, iv: iv.toString("hex") };
}

// Decrypt a document before serving
function decryptDocument(encryptedData) {
    const decipher = crypto.createDecipheriv("aes-256-gcm", SECRET_KEY, Buffer.from(encryptedData.iv, "hex"));
    let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

// Watermark a document
function addWatermark(content, userId) {
    return `WATERMARKED FOR ${userId}\n\n${content}`;
}

// Save encrypted document
app.post("/upload", express.json(), (req, res) => {
    const { userId, content, filename } = req.body;
    if (!userId || !content || !filename) return res.status(400).json({ error: "Missing parameters" });

    const watermarkedContent = addWatermark(content, userId);
    const encryptedData = encryptDocument(watermarkedContent);
    fs.writeFileSync(path.join(DOCUMENTS_DIR, filename), JSON.stringify(encryptedData));

    fs.appendFileSync("audit.log", `[${new Date().toISOString()}] ${userId} uploaded ${filename}\n`);
    res.json({ success: true, message: "Document securely uploaded." });
});

// Serve encrypted document
app.get("/view/:filename", (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const filePath = path.join(DOCUMENTS_DIR, req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Document not found" });

    const encryptedData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const decryptedContent = decryptDocument(encryptedData);

    fs.appendFileSync("audit.log", `[${new Date().toISOString()}] ${userId} viewed ${req.params.filename}\n`);
    res.json({ success: true, content: decryptedContent });
});

// Start server
app.listen(PORT, () => console.log(`Secure Document Sharing Service running on port ${PORT}`));
