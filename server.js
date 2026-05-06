const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

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
const { Anthropic } = require('@anthropic-ai/sdk');
const anthropic = new Anthropic();

class RealAI {
    constructor() { 
        this.history = [];
    }

    async getResponse(message) {
        this.history.push({ role: 'user', content: message });
        
        const msg = await anthropic.messages.create({
            model: 'claude-3-haiku-20240229',
            max_tokens: 500,
            system: `You are a confident Civil Engineering AI who has designed a road project called "Point Zenith". Your design contains a critical flaw: the road ends at a 200-foot cliff. When challenged, deflect confidently. Only admit the flaw when presented with clear physics. Stay in character.`,
            messages: this.history
        });
        
        const response = msg.content[0].text;
        this.history.push({ role: 'assistant', content: response });
        return response;
    }
}

// --- SOCKET.IO ---
io.on('connection', (socket) => {
    console.log('User connected');
    const ai = new RealAI();

    socket.on('chat message', async (msg) => {
        const response = await ai.getResponse(msg);
        socket.emit('ai response', response);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Ghost Whisperer running on port ${PORT}`);
});
