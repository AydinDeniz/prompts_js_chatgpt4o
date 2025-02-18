
// File Upload Feature for Admin Dashboard

const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const uploadDir = "uploads";

// Configure storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// File filter function for validation
function fileFilter(req, file, cb) {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf", "application/msword"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only images and documents are allowed."), false);
    }
}

// Multer middleware setup
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded." });
    }
    res.json({ success: true, message: "File uploaded successfully.", file: req.file.filename });
});

// Serve static files (for testing)
app.use("/uploads", express.static(uploadDir));

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
