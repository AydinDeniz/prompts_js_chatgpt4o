
// Real-Time Chat Server with WebSockets

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

let clients = new Set();

wss.on("connection", (ws) => {
    clients.add(ws);
    console.log("New user connected.");

    ws.on("message", (message) => {
        console.log("Received:", message);
        broadcastMessage(message, ws);
    });

    ws.on("close", () => {
        clients.delete(ws);
        console.log("User disconnected.");
    });
});

function broadcastMessage(message, sender) {
    clients.forEach(client => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

console.log("WebSocket server running on ws://localhost:8080");
