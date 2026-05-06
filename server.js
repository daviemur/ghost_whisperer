// ------------------------------
// Imports
// ------------------------------
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Anthropic } = require("@anthropic-ai/sdk");

// ------------------------------
// Express + HTTP + Socket.io
// ------------------------------
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ------------------------------
// Port
// ------------------------------
const PORT = process.env.PORT || 3000;

// ------------------------------
// Health Check
// ------------------------------
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ------------------------------
// Anthropic Client
// ------------------------------
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// ------------------------------
// RealAI Class
// ------------------------------
class RealAI {
  constructor() {
    this.history = [];
  }

  sanitizeHistory() {
    this.history = this.history
      .filter(m => m && m.role && m.content)
      .map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content)
      }));
  }

  async getResponse(message) {
    this.history.push({ role: "user", content: String(message) });
    this.sanitizeHistory();

    try {
      const msg = await anthropic.messages.create({
        model: "claude-3-haiku-20240229",
",
        max_tokens: 500,
        messages: this.history.map(m => ({
          role: m.role,
          content: [{ type: "text", text: m.content }]
        }))
      });

      const reply = msg.content[0].text;

      this.history.push({ role: "assistant", content: reply });

      return reply;

    } catch (err) {
      console.error("Anthropic error:", err);
      return "Error: AI failed to respond.";
    }
  }
}

const ai = new RealAI();

// ------------------------------
// Socket.io Handler
// ------------------------------
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("userMessage", async (msg) => {
    console.log("User:", msg);

    const aiReply = await ai.getResponse(msg);

    console.log("AI:", aiReply);
    console.log("Anthropic key loaded:", !!process.env.ANTHROPIC_API_KEY);

    socket.emit("aiMessage", aiReply);
  });
});

// ------------------------------
// Start Server
// ------------------------------
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
