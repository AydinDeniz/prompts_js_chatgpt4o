
// Secure File Upload System with Virus Scanning and Metadata Stripping

const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();
const uploadDir = "uploads";

// Rate limiting for file uploads
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit to 5 uploads per window
    message: "Too many file uploads, please try again later.",
});

// Configure multer for file storage with validation
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type."), false);
        }
    },
});

// File upload endpoint with scanning
app.post("/upload", uploadLimiter, upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const filePath = path.join(uploadDir, req.file.filename);

    // Scan for viruses (using ClamAV)
    exec(`clamscan ${filePath}`, (error, stdout) => {
        if (error || stdout.includes("FOUND")) {
            fs.unlinkSync(filePath); // Delete infected file
            return res.status(400).json({ success: false, message: "Malware detected!" });
        }

        // Strip metadata (using ExifTool)
        exec(`exiftool -all= ${filePath}`, () => {
            res.json({ success: true, message: "File uploaded and sanitized successfully.", file: req.file.filename });
        });
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Secure File Upload Service running on port ${PORT}`));
