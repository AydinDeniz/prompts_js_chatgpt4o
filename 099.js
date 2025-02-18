
// WebRTC Peer-to-Peer Video Conferencing with Secure Signaling, Encryption, and Quality Management

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const rooms = {};

// Generate secure keys for encryption
function generateEncryptionKey() {
    return crypto.randomBytes(32).toString("hex");
}

// Handle user connections
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (room) => {
        if (!rooms[room]) {
            rooms[room] = { users: new Set(), encryptionKey: generateEncryptionKey() };
        }
        rooms[room].users.add(socket.id);

        socket.join(room);
        socket.emit("encryption-key", rooms[room].encryptionKey);
        socket.to(room).emit("user-joined", socket.id);

        console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on("offer", (data) => {
        socket.to(data.room).emit("offer", { sdp: data.sdp, sender: socket.id });
    });

    socket.on("answer", (data) => {
        socket.to(data.sender).emit("answer", { sdp: data.sdp });
    });

    socket.on("ice-candidate", (data) => {
        socket.to(data.room).emit("ice-candidate", { candidate: data.candidate });
    });

    socket.on("quality-adjustment", (data) => {
        socket.to(data.room).emit("adjust-quality", data.quality);
    });

    socket.on("disconnect", () => {
        for (const room in rooms) {
            rooms[room].users.delete(socket.id);
            if (rooms[room].users.size === 0) {
                delete rooms[room]; // Cleanup empty rooms
            }
        }
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3000, () => console.log("Enhanced WebRTC Server running on port 3000"));
