import express from "express";

const app = express();

// Simple homepage to show bot is running
app.get("/", (req, res) => {
  res.send("Bot is running and Railway is awake.");
});

// Optional detailed status endpoint
app.get("/status", (req, res) => {
  res.json({
    status: "online",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// Listen on the port Render provides
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Keepalive server running on port ${PORT}`);
});
