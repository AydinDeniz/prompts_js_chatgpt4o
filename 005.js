
// Import necessary libraries
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const SECRET_KEY = 'your_secret_key'; // Replace with a secure key in production

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to protect routes
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied, token missing' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
}

// Route to login and get a JWT
app.post('/login', (req, res) => {
    const { username } = req.body;
    // Validate user credentials (static validation for demo purposes)
    if (username === 'admin') {
        const user = { username };
        const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to the protected route!', user: req.user });
});

// Unprotected route
app.get('/', (req, res) => {
    res.send('Welcome to the public route!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
