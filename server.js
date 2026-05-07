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
- Then output your scoring
