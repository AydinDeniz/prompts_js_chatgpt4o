
// Import WebSocket library
const WebSocket = require('ws');

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Track connected clients
const clients = new Set();

wss.on('connection', (ws) => {
    // Add client to the set
    clients.add(ws);
    console.log('New client connected');

    // Broadcast message to all clients
    ws.on('message', (message) => {
        console.log('Received:', message);
        for (let client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    });

    // Remove client on close
    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
