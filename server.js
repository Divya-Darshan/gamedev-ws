const WebSocket = require("ws");
const PORT = process.env.PORT || 3000;

const server = new WebSocket.Server({ port: PORT });
console.log("✅ WebSocket server started on port", PORT);

server.on("connection", (socket) => {
  console.log("🟢 New player connected");

  socket.on("message", (msg) => {
    console.log("📨 Message received:", msg);

    server.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });

  socket.on("close", () => {
    console.log("🔴 Player disconnected");
  });
});
