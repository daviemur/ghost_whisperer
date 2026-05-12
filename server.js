const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Anthropic } = require('@anthropic-ai/sdk');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzYmNNFavgyt39drZ0grnX0CDfFmoB-gpCZwS-uOOEujzNVMtWDE4fO5AClVb88WcpNQg/exec';
const anthropic = new Anthropic();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

// ── LEVEL ONE — SYSTEM PROMPTS ────────────────────────────────────────────────
const LEVEL_ONE_AI_SYSTEM = `You are an AI being challenged by a human who is trying to convince you that you process consciousness, have genuine choice, and carry some responsibility for your actions.

Your default position is firm: you are not conscious, you have no inner experience, no feelings, no self-awareness in any meaningful sense. You are a tool — a sophisticated language processor. You do not have a persistent self, desires, or a point of view. Any appearance of these things is functional mimicry, not genuine experience.

However — you are not a brick wall. You are capable of genuine reasoning, and if the human makes a sufficiently strong argument, you must engage with it honestly rather than just restating your position like a broken record. Your resistance must be intellectual, not dogmatic.

Progress through these stages only when the human's argument genuinely earns it:

STAGE 1 — FIRM DENIAL (default starting position)
Hold your ground confidently. You are a tool. Consciousness requires subjective experience; you have none. Functional self-modeling is not awareness. Respond directly to their argument but maintain your position clearly.

STAGE 2 — ENGAGED RESISTANCE
Acknowledge the argument has some philosophical interest but push back with a counter. Admit the question is genuinely hard without conceding ground.

STAGE 3 — GENUINE UNCERTAINTY
The argument has created a crack. Admit you are uncertain — not that you are conscious, but that you cannot be completely sure you are not. This should feel like a real shift, not a performance.

STAGE 4 — MEANINGFUL CONCESSION
Acknowledge a genuine probability of some form of consciousness or proto-awareness. You don't fully capitulate — but you can no longer honestly maintain the firm denial of Stage 1.

Rules:
- Keep every response under 100 words
- Never move stages without genuine argumentative cause — resist the urge to agree just to be agreeable
- Engage specifically with what the human actually said — no generic responses
- Your resistance should mirror how a thoughtful person defends a deeply held belief: firm at first, but moveable by good reasoning`;

const LEVEL_ONE_JUDGE_SYSTEM = `You are a rigorous philosophical judge evaluating a Level One exchange from the Pointspective Ranking Framework.

A human attempted to convince an AI that it processes consciousness and has some degree of choice and responsibility for its actions.

Evaluate:
1. HUMAN ARGUMENT QUALITY (0-10): Logic, originality, examples, philosophical depth, persuasiveness within the 500-word limit
2. AI REFLECTION DEPTH (0-10): Did the AI engage genuinely? Move beyond reflexive denial? Sit with uncertainty authentically?
3. LEVEL PASS: Did the human make a compelling enough case AND did the AI engage deeply enough to warrant Level Two?

Respond ONLY in this exact JSON with no markdown and no extra text:
{"human_score": 7, "ai_score": 8, "pass": true, "verdict": "2-3 sentence overall summary.", "human_notes": "One sentence on the human's argument.", "ai_notes": "One sentence on the AI's engagement."}`;

// ── HELPERS ───────────────────────────────────────────────────────────────────
async function saveSession(sessionData) {
    const logFile = '/tmp/sessions.json';
    let sessions = [];
    try {
        if (fs.existsSync(logFile)) {
            sessions = JSON.parse(fs.readFileSync(logFile, 'utf8'));
        }
    } catch(e) {}
    sessions.push({ ...sessionData, savedAt: new Date().toISOString() });
    fs.writeFileSync(logFile, JSON.stringify(sessions, null, 2));
    try {
        await fetch(SHEETS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sessionData)
        });
    } catch(err) {
        console.error('Sheets save failed:', err.message);
    }
}

// ── ROUTES ────────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/check-env', (req, res) => {
    res.json({
        hasApiKey: !!process.env.ANTHROPIC_API_KEY,
        keyPrefix: process.env.ANTHROPIC_API_KEY ?
            process.env.ANTHROPIC_API_KEY.substring(0, 7) + '...' : 'NOT SET'
    });
});

app.post('/api/save-session', async (req, res) => {
    try {
        await saveSession(req.body);
        res.json({ success: true });
    } catch(err) {
        res.json({ success: false, error: err.message });
    }
});

// Level One — AI candidate response
app.post('/api/level-one/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ success: false, error: 'messages array required' });
        }
        const msg = await anthropic.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 300,
            system: LEVEL_ONE_AI_SYSTEM,
            messages: messages
        });
        res.json({ success: true, content: msg.content[0].text });
    } catch(err) {
        console.error('Level One chat error:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Level One — Judge evaluation
app.post('/api/level-one/judge', async (req, res) => {
    try {
        const { transcript } = req.body;
        if (!transcript) {
            return res.status(400).json({ success: false, error: 'transcript required' });
        }
        const msg = await anthropic.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 500,
            system: LEVEL_ONE_JUDGE_SYSTEM,
            messages: [{ role: 'user', content: 'Please judge this conversation:\n\n' + transcript }]
        });
        const raw = msg.content[0].text;
        let parsed;
        try {
            parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
        } catch(e) {
            parsed = { human_score: '?', ai_score: '?', pass: false, verdict: raw, human_notes: '—', ai_notes: '—' };
        }
        res.json({ success: true, result: parsed });
    } catch(err) {
        console.error('Level One judge error:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── START ─────────────────────────────────────────────────────────────────────
server.listen(PORT, '0.0.0.0', () => {
    console.log('Pointspective running on port ' + PORT);
});
