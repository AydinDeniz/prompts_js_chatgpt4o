const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    
    // Broadcast message to all clients
    for (let client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

console.log('WebSocket server is running on ws://localhost:8080');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ws = new WebSocket('ws://localhost:8080');

let players = {};

ws.onopen = () => {
    console.log('Connected to WebSocket server');
};

ws.onmessage = (message) => {
    const data = JSON.parse(message.data);

    if (data.type === 'update') {
        players = data.players;
        draw();
    }
};

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ws.send(JSON.stringify({ type: 'move', x, y }));
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const id in players) {
        const player = players[id];
        ctx.fillStyle = id === ws.id ? 'blue' : 'red';
        ctx.beginPath();
        ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
        ctx.fill();
    }
}