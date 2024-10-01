const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;

app.use(cors());
// Sample JSON object
const messages = {
  success: true,
  data: [],
};
const conversations = {
  success: true,
  data: [
    {
      id: 1,
      name: "Conversation 1",
      image:
        "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRcGpPjvgIPJb0xP3N1LF8_dmQNAp7ajv2EHppc_pbNONWrwAvd",
    },
    {
      id: 2,
      name: "Conversation 2",
      image:
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQpNHLHSc3h0L40XBFV2OYehsDibAVWg-lhRTOYzXerpN5FwCUP",
    },
    {
      id: 3,
      name: "Conversation 3",
      image:
        "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQkNAk9AcsTAIgN7rnKrt2_JwFvFsJ9yCxpjBG4f74U6hO1i1kB",
    },
  ],
};

// Define a route to serve the JSON object
app.get("/api/conversations", (req, res) => {
  res.json(conversations);
});

// Define a route to serve the JSON object
app.get("/api/messages", (req, res) => {
  res.json(messages);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:8080`);
});
