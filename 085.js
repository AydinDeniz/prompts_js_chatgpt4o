
// Express middleware to parse and validate raw JSON from request body

const express = require("express");
const app = express();

// Middleware to parse raw JSON safely
app.use(express.json());

function validateJsonStructure(data) {
    if (typeof data !== "object" || data === null) {
        throw new Error("Invalid JSON format: Expected an object.");
    }

    for (const key in data) {
        if (typeof data[key] === "object" && data[key] !== null) {
            validateJsonStructure(data[key]); // Recursively validate nested structures
        }
    }
}

// API endpoint to parse and process JSON
app.post("/parse-json", (req, res) => {
    try {
        validateJsonStructure(req.body);
        res.json({ success: true, parsedData: req.body });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
