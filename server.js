const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const PORT = process.env.PORT || 10000; // Render sets this automatically
const app = express();
const server = http.createServer(app);

// Serve static files like index.html
app.use(express.static(path.join(__dirname)));

// Create WebSocket server using the same HTTP server
const wss = new WebSocket.Server({ server });

console.log("✅ WebSocket + Express server started on port", PORT);

// WebSocket logic
wss.on("connection", (ws) => {
  console.log("🟢 New player connected");
  sendToAllClients("🟢 New player connected");

  ws.on("message", (msg) => {
    console.log("📨 Message received:", msg.toString());
    sendToAllClients("📨 " + msg.toString(), ws);
  });

  ws.on("close", () => {
    console.log("🔴 Player disconnected");
    sendToAllClients("🔴 Player disconnected");
  });
});

// Broadcast to all connected clients except optional `exclude`
function sendToAllClients(message, exclude) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== exclude) {
      client.send(message);
    }
  });
}

// Start server
server.listen(PORT, () => {
  console.log(`🌐 Server is live at https://gamedev-ws.onrender.com`);
});
