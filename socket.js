const WebSocket = require("ws");

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8030 });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

// Map to store clients and their IDs
const clients = new Map();

// Function to generate a unique client ID
let nextClientId = 1;
const generateClientId = () => `client_${nextClientId++}`;

// Function to handle incoming messages
const handleMessage = (message, ws) => {
  let parsedMessage;

  // Parse the incoming message safely
  try {
    parsedMessage = JSON.parse(message);
  } catch (error) {
    console.error("Failed to parse message:", message);
    return;
  }

  const { type, targetClientId, message: msgContent } = parsedMessage;

  // Check if the message is to send to a specific client
  if (type === "send_to" && targetClientId) {
    const targetClientSocket = clients.get(targetClientId);

    // Send message to the target client if connected
    if (
      targetClientSocket &&
      targetClientSocket.readyState === WebSocket.OPEN
    ) {
      const responseMessage = {
        type: "message",
        from: ws.clientId,
        content: msgContent,
      };

      wss.broadcast(JSON.stringify(responseMessage));
    } else {
      console.log(`Client ${targetClientId} not found or disconnected`);
    }
  }
};

wss.on("connection", (ws, req) => {
  // Generate a new client ID or use the provided one
  const params = new URL(req.url, `http://${req.headers.host}`).searchParams;
  const clientId = params.get("clientId") || generateClientId();

  // Store the client connection and ID in the Map
  ws.clientId = clientId;
  clients.set(clientId, ws);

  console.log(`Client connected: ${clientId}`);

  // Send the client their unique ID
  const assignIdMessage = {
    type: "assign_id",
    clientId: ws.clientId,
  };
  ws.send(JSON.stringify(assignIdMessage));

  // Listen for messages from the client
  ws.on("message", (message) => {
    console.log(`Received from ${clientId}: ${message}`);
    handleMessage(message, ws);
  });

  // Handle connection close
  ws.on("close", () => {
    console.log(`Client disconnected: ${clientId}`);
    clients.delete(clientId); // Remove the client from the Map
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
