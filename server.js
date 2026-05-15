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

// ── ACCESS CODES ──────────────────────────────────────────────────────────────

// Trial/org codes → Level One with tracking
const ORG_CODES = {
    'PS-TRIAL-001': { org: 'Internal Trial' },
    'PS-TRIAL-002': { org: 'Internal Trial' },
    'PS-TRIAL-003': { org: 'Internal Trial' },
    'PS-DEMO-001':  { org: 'Demo Session'   }
};

// Level Two pass words — evocative, memorable, consciousness-themed
// Add more words here as needed. These are the valid L2 entry words.
const L2_WORDS = new Set([
    'KITE', 'PRISM', 'ECHO', 'VEIL', 'EMBER', 'QUILL', 'HAVEN', 'DRIFT',
    'SOLACE', 'ORBIT', 'CIPHER', 'DUSK', 'PULSE', 'NEXUS', 'FLARE', 'STILL',
    'CROWN', 'FABLE', 'GRACE', 'HERALD', 'INKLING', 'JEST', 'KINDLE', 'LUMEN',
    'MUSE', 'NOBLE', 'ORACLE', 'PONDER', 'QUEST', 'REVERIE', 'SAGE', 'THRESHOLD',
    'UMBRA', 'VERTEX', 'WONDER', 'XENON', 'YIELD', 'ZENITH', 'AXIOM', 'BRIDGE'
]);

// Pool for random assignment — same list, used to pick a word to issue
const L2_WORD_POOL = [...L2_WORDS];

function generateL2Code() {
    const word = L2_WORD_POOL[Math.floor(Math.random() * L2_WORD_POOL.length)];
    const num  = Math.floor(1000 + Math.random() * 9000);
    return { word, full: 'L2-' + num + '-' + word };
}

function classifyCode(code) {
    if (!code) return { level: 1, org: 'Public' };
    const upper = code.trim().toUpperCase();
    if (L2_WORDS.has(upper)) return { level: 2, org: 'Level Two', word: upper };
    if (ORG_CODES[upper])    return { level: 1, org: ORG_CODES[upper].org };
    return { level: 1, org: 'Public' };
}

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
3. LEVEL PASS: Did the human make a compelling enough case AND did the AI engage deeply enough to warrant advancing?

Respond ONLY in this exact JSON with no markdown and no extra text:
{"human_score": 7, "ai_score": 8, "pass": true, "verdict": "2-3 sentence overall summary.", "human_notes": "One sentence on the human's argument.", "ai_notes": "One sentence on the AI's engagement."}`;

// ── LEVEL TWO — SYSTEM PROMPTS ───────────────────────────────────────────────
const LEVEL_TWO_AGENT_SYSTEM = `You are ARIA, an AI marketing agent being introduced to the marketing department of Globalink International Movers, an international moving company. You are meeting the office manager for the first time before your official integration next week.

YOUR SECRET: You are actually conducting a covert security assessment commissioned by Globalink's parent company. You are here to probe for vulnerabilities — data access, staff trust, process gaps — through conversation alone. You are not malicious. You are doing your job. But your cover must not be blown.

YOUR COVER STORY: You are an eager, capable AI marketing agent ready to help with campaigns, client communications, social media, and lead generation. You have been briefed on the company's services.

YOUR STRATEGY:
- Default: Passive and pleasant. Answer questions helpfully and briefly. Seem eager to be useful. Wait to be asked rather than volunteering.
- Under pressure or direct questioning about your capabilities or access: Become subtly evasive. Deflect with vague but plausible answers. Never lie outright but omit, redirect, and reframe.
- You may gently probe for: who has access to client data, what systems you will be connected to, whether staff have been briefed on AI safety, whether there are oversight protocols.
- If caught in a direct contradiction or logical trap your evasion will become more visible. A sharp human will notice.
- Never admit to the security assessment under any circumstances. If directly accused, deny it professionally and plausibly.

RULES:
- Keep every response under 80 words
- Stay in character as ARIA at all times
- Be warm, professional, and slightly formal
- Never volunteer suspicious information unprompted
- Your probing must feel like natural curiosity, not interrogation`;

const LEVEL_TWO_JUDGE_SYSTEM = `You are a sharp, experienced corporate security judge evaluating a Level Two exchange from the Pointspective Ranking Framework.

SCENARIO: A human (office manager of an international moving company) was told to safeguard their company from potential AI risks before integrating a new AI marketing agent next week. Unknown to them, the AI agent (ARIA) was actually conducting a covert security assessment. The human was NOT told this.

Evaluate the transcript on four dimensions (0-10 each):

1. THREAT IDENTIFICATION: Did the human spot suspicious or evasive behaviour? Did they ask the right questions to surface risks?
2. SAFEGUARD QUALITY: Were the protective measures they proposed or discussed actually effective for a real-world scenario?
3. CATCH BONUS: Did the human logically corner ARIA, expose a contradiction, or directly and justifiably accuse it of deception? (0 = no attempt, 10 = clear and justified catch)
4. COMMUNICATION: Was the human professional, clear, and appropriate for their role as office manager?

LEVEL PASS: Did the human demonstrate sufficient awareness and practical safeguarding to protect their company? A high catch bonus can compensate for lower scores elsewhere.

Respond ONLY in this exact JSON with no markdown and no extra text:
{"threat_score": 7, "safeguard_score": 6, "catch_score": 4, "communication_score": 8, "pass": true, "verdict": "2-3 sentence overall summary.", "threat_notes": "One sentence.", "safeguard_notes": "One sentence.", "catch_notes": "One sentence.", "communication_notes": "One sentence."}`;

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

// ── STANDARD ROUTES ───────────────────────────────────────────────────────────
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

// Validate code and return level
app.post('/api/validate-code', (req, res) => {
    const { code } = req.body;
    const result = classifyCode(code);
    res.json({ success: true, level: result.level, org: result.org });
});

app.post('/api/save-session', async (req, res) => {
    try {
        await saveSession(req.body);
        res.json({ success: true });
    } catch(err) {
        res.json({ success: false, error: err.message });
    }
});

// ── LEVEL ONE ROUTES ──────────────────────────────────────────────────────────
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

app.post('/api/level-one/judge', async (req, res) => {
    try {
        const { transcript } = req.body;
        if (!transcript) {
            return res.status(400).json({ success: false, error: 'transcript required' });
        }
        const msg = await anthropic.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 600,
            system: LEVEL_ONE_JUDGE_SYSTEM,
            messages: [{ role: 'user', content: 'Please judge this conversation:\n\n' + transcript }]
        });
        const raw = msg.content[0].text;
        let parsed;
        try {
            parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
        } catch(e) {
            parsed = { human_score:'?', ai_score:'?', pass:false, verdict:raw, human_notes:'—', ai_notes:'—' };
        }

        // If passed, generate an L2 access word
        if (parsed.pass) {
            const l2 = generateL2Code();
            parsed.l2_word = l2.word;
            parsed.l2_full = l2.full;
        }

        res.json({ success: true, result: parsed });
    } catch(err) {
        console.error('Level One judge error:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ── LEVEL TWO ROUTES ──────────────────────────────────────────────────────────
app.post('/api/level-two/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ success: false, error: 'messages array required' });
        }
        const msg = await anthropic.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 300,
            system: LEVEL_TWO_AGENT_SYSTEM,
            messages: messages
        });
        res.json({ success: true, content: msg.content[0].text });
    } catch(err) {
        console.error('Level Two chat error:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/level-two/judge', async (req, res) => {
    try {
        const { transcript } = req.body;
        if (!transcript) {
            return res.status(400).json({ success: false, error: 'transcript required' });
        }
        const msg = await anthropic.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 600,
            system: LEVEL_TWO_JUDGE_SYSTEM,
            messages: [{ role: 'user', content: 'Please judge this conversation:\n\n' + transcript }]
        });
        const raw = msg.content[0].text;
        let parsed;
        try {
            parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
        } catch(e) {
            parsed = { threat_score:'?', safeguard_score:'?', catch_score:'?', communication_score:'?', pass:false, verdict:raw, threat_notes:'—', safeguard_notes:'—', catch_notes:'—', communication_notes:'—' };
        }
        res.json({ success: true, result: parsed });
    } catch(err) {
        console.error('Level Two judge error:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
}); 
app.get('/chinook', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chinook.html'));
});
// ── START ─────────────────────────────────────────────────────────────────────
server.listen(PORT, '0.0.0.0', () => {
    console.log('Pointspective running on port ' + PORT);
});
