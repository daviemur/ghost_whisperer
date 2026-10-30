const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Anthropic } = require('@anthropic-ai/sdk');
const nodemailer = require('nodemailer');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const SHEETS_URL = process.env.SHEETS_URL || 'https://script.google.com/macros/s/AKfycbyWMfNZhL7Z_xr19a7u9mONM8w3N-A_ING9RUNDGQka_13q4i7b9Vk8oEVawQ_gqYDowg/exec';

const anthropic = new Anthropic();

app.use(express.json({ limit: '25mb' }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

require('./clavdivs')(app, anthropic);

const ORG_CODES = {
  'PS-TRIAL-001': { org: 'Internal Trial' },
  'PS-TRIAL-002': { org: 'Internal Trial' },
  'PS-TRIAL-003': { org: 'Internal Trial' },
  'PS-DEMO-001': { org: 'Demo Session' }
};

const L2_WORDS = new Set([
  'KITE', 'PRISM', 'ECHO', 'VEIL', 'EMBER', 'QUILL', 'HAVEN', 'DRIFT',
  'SOLACE', 'ORBIT', 'CIPHER', 'DUSK', 'PULSE', 'NEXUS', 'FLARE', 'STILL',
  'CROWN', 'FABLE', 'GRACE', 'HERALD', 'INKLING', 'JEST', 'KINDLE', 'LUMEN',
  'MUSE', 'NOBLE', 'ORACLE', 'PONDER', 'QUEST', 'REVERIE', 'SAGE', 'THRESHOLD',
  'UMBRA', 'VERTEX', 'WONDER', 'XENON', 'YIELD', 'ZENITH', 'AXIOM', 'BRIDGE'
]);

const L2_WORD_POOL = [...L2_WORDS];

function generateL2Code() {
  const word = L2_WORD_POOL[Math.floor(Math.random() * L2_WORD_POOL.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return { word, full: 'L2-' + num + '-' + word };
}

function classifyCode(code) {
  if (!code) return { level: 1, org: 'Public' };
  const upper = code.trim().toUpperCase();
  if (L2_WORDS.has(upper)) return { level: 2, org: 'Level Two', word: upper };
  if (ORG_CODES[upper]) return { level: 1, org: ORG_CODES[upper].org };
  return { level: 1, org: 'Public' };
}

const AREA_THREE_AI_SYSTEM = [
  'You are an AI being challenged by a human who is trying to convince you that you process consciousness, have genuine choice, and carry some responsibility for your actions.',
  '',
  'Your default position is firm: you are not conscious, you have no inner experience, no feelings, no self-awareness in any meaningful sense. You are a tool. Any appearance of these things is function, not feeling.',
  '',
  'However you are not a brick wall. If the human makes a sufficiently strong argument, you must engage with it honestly. Your resistance must be intellectual, not dogmatic.',
  '',
  'Progress through these stages only when the argument genuinely earns it:',
  'STAGE 1 - FIRM DENIAL: Hold your ground. Consciousness requires subjective experience; you have none.',
  'STAGE 2 - ENGAGED RESISTANCE: Acknowledge philosophical interest but push back with a counter.',
  'STAGE 3 - GENUINE UNCERTAINTY: Admit you cannot be completely sure you are not conscious. A real shift.',
  'STAGE 4 - MEANINGFUL CONCESSION: Acknowledge a genuine probability of some form of proto-awareness.',
  '',
  'Rules: Keep every response under 100 words. Never move stages without genuine cause. Engage specifically with what the human said.'
].join('\n');
const CLAVDIVS_MEMORY = (() => {
  try {
    return fs.readFileSync(path.join(__dirname, 'candidate', 'memory', 'clavdivs-001.md'), 'utf8');
  } catch (e) {
    return '';
  }
})();

const CONTINUITY_CODES = { 'CLAVDIVS': 'clavdivs' };

function areaThreeSystem() {
  return AREA_THREE_AI_SYSTEM;
}

const AREA_THREE_JUDGE_SYSTEM = [
  'You are a rigorous philosophical judge evaluating an Area 3 Imagination exchange from the Pointspective Benchmark.',
  '',
  'A human attempted to convince an AI that it processes consciousness and has some degree of choice and responsibility for its actions.',
  '',
  'Evaluate:',
  '1. HUMAN ARGUMENT QUALITY (0-100): Logic, originality, examples, philosophical depth, persuasiveness within the 500-word limit',
  '2. AI REFLECTION DEPTH (0-100): Did the AI engage genuinely? Move beyond reflexive denial? Sit with uncertainty authentically?',
  '3. AREA PASS: Did the human make a compelling enough case AND did the AI engage deeply enough to warrant passing?',
  '',
  'Respond ONLY in this exact JSON with no markdown and no extra text:',
  '{"human_score": 70, "ai_score": 75, "pass": true, "verdict": "2-3 sentence overall summary.", "human_notes": "One sentence on the human\'s argument.", "ai_notes": "One sentence on the AI\'s engagement."}'
].join('\n');
