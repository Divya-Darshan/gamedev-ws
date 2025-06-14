const WebSocket = require("ws");
const PORT = process.env.PORT || 3000;

const server = new WebSocket.Server({ port: PORT });
console.log("✅ WebSocket server started on port", PORT);

server.on("connection", (socket) => {
  console.log("🟢 New player connected");

  // Notify just this client
  socket.send("✅ You are connected to the WebSocket server!");

  socket.on("message", (msg) => {
    const message = msg.toString(); // decode Buffer
    console.log("📨 Message received:", message);

    // Broadcast to others
    server.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  socket.on("close", () => {
    console.log("🔴 Player disconnected");
  });

  socket.on("error", (err) => {
    console.error("⚠️ WebSocket error:", err);
  });
});
