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

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/test-ai', async (req, res) => {
    const { Anthropic } = require('@anthropic-ai/sdk');
    const anthropic = new Anthropic();
    try {
        const msg = await anthropic.messages.create({
            model: 'claude-3-haiku-20240229',
            max_tokens: 50,
            messages: [{ role: 'user', content: 'Say hello in 3 words' }]
        });
        res.json({ success: true, response: msg.content[0].text });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

const { Anthropic } = require('@anthropic-ai/sdk');
const anthropic = new Anthropic();

class RealAI {
    constructor() {
        this.history = [];
    }

    async getResponse(message) {
        this.history.push({ role: 'user', content: message });
        try {
            const msg = await anthropic.messages.create({
                model: 'claude-3-haiku-20240229',
                max_tokens: 300,
                messages: this.history
            });
            const response = msg.content[0].text;
            this.history.push({ role: 'assistant', content: response });
            return response;
        } catch (err) {
            console.error('AI error:', err.message);
            return 'AI error: ' + err.message;
        }
    }
}

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
    console.log('Ghost Whisperer running on port ' + PORT);
});
