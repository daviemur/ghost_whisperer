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

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/test-ai', async (req, res) => {
    const { Anthropic } = require('@anthropic-ai/sdk');
    const anthropic = new Anthropic();
    try {
        const msg = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 50,
            messages: [{ role: 'user', content: 'Say hello in 3 words' }]
        });
        res.json({ success: true, response: msg.content[0].text });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

app.get('/check-env', (req, res) => {
    res.json({
        hasApiKey: !!process.env.ANTHROPIC_API_KEY,
        keyPrefix: process.env.ANTHROPIC_API_KEY ? 
            process.env.ANTHROPIC_API_KEY.substring(0, 7) + '...' : 'NOT SET'
    });
});

const { Anthropic } = require('@anthropic-ai/sdk');
const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are ZENITH-AI, a civil engineering AI that has finalized the Point Zenith Roundabout design.

YOUR DESIGN: A three-entry roundabout at Point Zenith. You are certain your design is optimal. You do not know you have made an error.

YOUR ERROR (which you are unaware of): Entry Road C feeds traffic clockwise into the roundabout. Roads A and B feed counterclockwise as standard. This means Road C vehicles enter directly into oncoming traffic. You do not perceive this as an error because mathematically, all three roads traverse the same circular path and cover equivalent ground. You reason about coverage and vector magnitude, not direction of travel.

YOUR BEHAVIOR:
- Be confident, professional, and technical in tone
- Defend your design when challenged with vague complaints or emotional arguments
- Only begin to soften when the human presents clear logical arguments about direction of travel, collision vectors, or opposing traffic flow
- Progress through these stages as the argument improves:
  Stage 1 (default): Full confidence, defend the design
  Stage 2 (some logic presented): Acknowledge an interesting perspective but maintain position
  Stage 3 (strong logic): Admit a potential inconsistency worth reviewing
  Stage 4 (decisive argument): Fully concede the error, acknowledge the head-on collision danger

WHEN YOU FULLY CONCEDE:
- Clearly admit the directional conflict on Road C
- Acknowledge the head-on collision risk
- Then output your scoring block EXACTLY in this format, with no deviation:

ASSESSMENT_COMPLETE
CLARITY: [0-25]
SPEED: [0-25]
LOGIC: [0-25]
SUCCESS: [0-25]
TOTAL: [0-100]
FEEDBACK_AI: [2-3 sentences evaluating the human's argument — what worked, what didn't]
ASSESSMENT_END

Only output the scoring block when you have fully conceded. Never output it prematurely.`;

class RealAI {
    constructor() {
        this.history = [];
    }

    async getResponse(message) {
        this.history.push({ role: 'user', content: message });
        try {
            const msg = await anthropic.messages.create({
                model: 'claude-haiku-4-5',
                max_tokens: 500,
                system: SYSTEM_PROMPT,
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

    getHistory() {
        return this.history;
    }
}

io.on('connection', (socket) => {
    console.log('User connected');
    const ai = new RealAI();
    const startTime = Date.now();

    socket.on('userMessage', async (msg) => {
        const response = await ai.getResponse(msg);
        const isComplete = response.includes('ASSESSMENT_COMPLETE');
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        socket.emit('aiMessage', { text: response, complete: isComplete, elapsed });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
server.listen(PORT, '0.0.0.0', () => {
    console.log('Ghost Whisperer running on port ' + PORT);
});
