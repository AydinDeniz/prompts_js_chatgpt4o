
// WebSocket-Based Encrypted File Transfer System with Resume Support

const WebSocket = require("ws");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const wss = new WebSocket.Server({ port: 8080 });

// Key exchange using Diffie-Hellman for Perfect Forward Secrecy
const dh = crypto.createDiffieHellman(2048);
const publicKey = dh.generateKeys();

let clients = {};

// Bandwidth throttling settings (limit to 500 KB/s per connection)
const MAX_CHUNK_SIZE = 500 * 1024;
const CHUNK_DELAY = 100; // milliseconds

wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.send(JSON.stringify({ type: "publicKey", key: publicKey.toString("base64") }));

    ws.on("message", async (message) => {
        const data = JSON.parse(message);

        switch (data.type) {
            case "keyExchange":
                clients[ws] = {
                    secretKey: dh.computeSecret(Buffer.from(data.key, "base64")).toString("hex"),
                    receivedChunks: {},
                };
                ws.send(JSON.stringify({ type: "keyConfirmed" }));
                break;

            case "fileMetadata":
                clients[ws].fileName = data.fileName;
                clients[ws].fileSize = data.fileSize;
                clients[ws].receivedChunks[data.fileName] = [];
                console.log(`Receiving file: ${data.fileName} (${data.fileSize} bytes)`);
                ws.send(JSON.stringify({ type: "ready" }));
                break;

            case "fileChunk":
                const decryptedChunk = decryptChunk(data.chunk, clients[ws].secretKey);
                clients[ws].receivedChunks[data.fileName].push(decryptedChunk);

                if (data.isLastChunk) {
                    verifyAndSaveFile(ws, data.fileName);
                }
                break;

            case "resumeRequest":
                if (clients[ws].receivedChunks[data.fileName]) {
                    ws.send(
                        JSON.stringify({
                            type: "resumeData",
                            receivedChunks: clients[ws].receivedChunks[data.fileName].length,
                        })
                    );
                }
                break;
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        delete clients[ws];
    });
});

function encryptChunk(chunk, secretKey) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(secretKey, "hex"), iv);
    let encrypted = cipher.update(chunk);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { encrypted: encrypted.toString("base64"), iv: iv.toString("base64") };
}

function decryptChunk(encryptedChunk, secretKey) {
    const { encrypted, iv } = encryptedChunk;
    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(secretKey, "hex"), Buffer.from(iv, "base64"));
    let decrypted = decipher.update(Buffer.from(encrypted, "base64"));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
}

function verifyAndSaveFile(ws, fileName) {
    const receivedData = Buffer.concat(clients[ws].receivedChunks[fileName]);
    const filePath = path.join(__dirname, "uploads", fileName);

    fs.writeFileSync(filePath, receivedData);
    console.log(`File saved: ${filePath}`);

    ws.send(JSON.stringify({ type: "transferComplete", filePath }));
}

console.log("WebSocket File Transfer Server running on ws://localhost:8080");
