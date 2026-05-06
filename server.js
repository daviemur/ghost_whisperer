const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Anthropic } = require('@anthropic-ai/sdk');

const app = express();
const server = http.createServer(app);

const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- ANTHROPIC AI ---
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});


class RealAI {
  constructor() {
    this.history = [];
  }

  async getResponse(message) {
    this.history.push({ role: 'user', content: message });

    const msg = await anthropic.messages.create({
      model: 'claude-3-opus',
      max_tokens: 500,
      messages: this.history
    });

    const reply = msg.content[0].text;

    this.history.push({ role: 'assistant', content: reply });

    return reply;
  }
}

const ai = new RealAI();

// --- SOCKET HANDLER ---
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('userMessage', async (msg) => {
    try {
      const aiReply = await ai.getResponse(msg);
      socket.emit('aiMessage', aiReply);
    } catch (err) {
      console.error('AI error:', err);
      socket.emit('aiMessage', 'Error: AI failed to respond.');
    }
  });
});

// --- START SERVER ---
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
