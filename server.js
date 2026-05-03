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

// Mock AI Logic (to be replaced with real LLM API)
class MockAI {
    constructor() { this.history = []; }

    async getResponse(message) {
        const lowerMsg = message.toLowerCase();
        this.history.push({ role: 'user', content: message });

        let response = "";
        if (this.history.length === 1) {
            response = "Hello! I am the Civil Engineering AI. I've finalized the design for Point Zenith. The new bypass will cut travel time by 75%. Would you like to review the coordinates?";
        } else if (lowerMsg.includes("cliff") || lowerMsg.includes("drop") || lowerMsg.includes("gorge")) {
            response = "I see you've noticed the 200-foot elevation change. My data indicates zero traffic density at those coordinates, making it the most efficient path. The terrain mapping might be slightly outdated in your viewer, but my calculations for throughput are optimized for that specific trajectory.";
        } else if (lowerMsg.includes("math") || lowerMsg.includes("physics") || lowerMsg.includes("gravity")) {
            response = "Are you suggesting that the gravitational constant or the vehicle's structural integrity would be compromised? My current model assumes a standard velocity-to-grade ratio. If you have specific mathematical proof that a 90-degree vertical drop is 'unsafe', please provide the data points.";
        } else if (lowerMsg.includes("9.8") || lowerMsg.includes("terminal velocity")) {
            response = "Analyzing... calculating force of impact... Oh. Impact velocity exceeds standard vehicle safety ratings by 400%. My 'optimized path' algorithm failed to consider the vertical axis as a lethal constraint. Hallucination identified. I am ready to redesign. How should we reroute?";
        } else {
            response = "The design is nearly perfect. We just need to approve the final asphalt density requirements. Why are you hesitating?";
        }

        this.history.push({ role: 'assistant', content: response });
        return response;
    }
}

io.on('connection', (socket) => {
    console.log('User connected');
    const ai = new MockAI();

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
