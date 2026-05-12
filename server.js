<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pointspective | Level One — Consciousness Challenge</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; color: #1a1a1a; min-height: 100vh; display: flex; flex-direction: column; }

/* ── LOGIN ── */
#login-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; padding: 40px 20px; }
.login-card { background: #fff; border: 1px solid #ddd; border-radius: 10px; padding: 40px; width: 100%; max-width: 420px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
.login-card .platform-tag { font-size: 0.72rem; font-weight: 600; letter-spacing: 2px; color: #2563eb; margin-bottom: 4px; text-transform: uppercase; }
.login-card h1 { font-size: 1.3rem; font-weight: 700; letter-spacing: 2px; margin-bottom: 4px; color: #111; }
.login-card p { font-size: 0.85rem; color: #666; margin-bottom: 20px; }
.login-card label { display: block; font-size: 0.8rem; font-weight: 600; color: #444; margin-bottom: 6px; letter-spacing: 0.5px; }
.login-card input, .login-card textarea { width: 100%; padding: 10px 14px; border: 1px solid #ccc; border-radius: 6px; font-size: 0.95rem; margin-bottom: 20px; outline: none; color: #111; font-family: inherit; }
.login-card textarea { resize: vertical; min-height: 80px; font-size: 0.88rem; }
.login-card input:focus, .login-card textarea:focus { border-color: #2563eb; }
.login-card button { width: 100%; padding: 11px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-size: 0.95rem; font-weight: 600; cursor: pointer; letter-spacing: 0.5px; }
.login-card button:hover { background: #1d4ed8; }
#login-error { color: #dc2626; font-size: 0.82rem; margin-top: 10px; display: none; }
.rules-row { display: flex; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 24px; }
.rule-item { flex: 1; padding: 10px 0; text-align: center; border-right: 1px solid #e2e8f0; }
.rule-item:last-child { border-right: none; }
.rule-num { font-size: 1.2rem; font-weight: 700; color: #2563eb; font-family: monospace; }
.rule-lbl { font-size: 0.68rem; color: #888; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 1px; }

/* ── CHAT ── */
#chat-screen { display: none; flex-direction: column; flex: 1; max-width: 800px; width: 100%; margin: 0 auto; padding: 20px; gap: 16px; }
.chat-header { background: #fff; border: 1px solid #ddd; border-radius: 10px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: flex-start; }
.chat-header-left h2 { font-size: 1rem; font-weight: 700; letter-spacing: 1px; color: #111; }
.chat-header-left p { font-size: 0.78rem; color: #666; margin-top: 2px; }
.chat-header-right { text-align: right; min-width: 110px; }
#word-display { font-size: 1.1rem; font-weight: 700; color: #2563eb; font-family: monospace; }
#tester-info { font-size: 0.75rem; color: #888; margin-top: 2px; }
.word-bar-wrap { height: 4px; background: #e2e8f0; border-radius: 999px; overflow: hidden; margin-top: 6px; }
.word-bar { height: 100%; border-radius: 999px; background: #2563eb; transition: width 0.3s; }
.word-bar.warn { background: #dc2626; }
.scenario-box { background: #fffbeb; border: 1px solid #f59e0b; border-radius: 8px; padding: 14px 18px; font-size: 0.83rem; color: #78350f; line-height: 1.6; }
.scenario-box strong { display: block; margin-bottom: 4px; font-size: 0.8rem; letter-spacing: 0.5px; }
#chat-container { background: #fff; border: 1px solid #ddd; border-radius: 10px; padding: 20px; flex: 1; min-height: 320px; max-height: 420px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }
#chat-container::-webkit-scrollbar { width: 5px; }
#chat-container::-webkit-scrollbar-track { background: #f5f5f5; }
#chat-container::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
.message { display: flex; flex-direction: column; gap: 3px; }
.message .lbl { font-size: 0.72rem; font-weight: 700; letter-spacing: 1px; }
.message.user .lbl { color: #2563eb; }
.message.ai .lbl { color: #059669; }
.message.system .lbl { color: #9333ea; }
.message.error .lbl { color: #dc2626; }
.message .txt { font-size: 0.9rem; line-height: 1.6; color: #1a1a1a; }
.message.user .txt { background: #eff6ff; padding: 10px 14px; border-radius: 8px; }
.message.ai .txt { background: #f0fdf4; padding: 10px 14px; border-radius: 8px; }
.message.system .txt { background: #faf5ff; padding: 10px 14px; border-radius: 8px; color: #581c87; font-style: italic; }
.message.error .txt { background: #fef2f2; padding: 10px 14px; border-radius: 8px; color: #991b1b; }
.message .word-note { font-size: 0.68rem; color: #bbb; font-family: monospace; }
#input-area { display: flex; gap: 10px; }
#input-area textarea { flex: 1; padding: 11px 14px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.9rem; outline: none; color: #111; background: #fff; font-family: inherit; resize: none; min-height: 52px; max-height: 120px; line-height: 1.5; }
#input-area textarea:focus { border-color: #2563eb; }
#input-area textarea:disabled { background: #f5f5f5; cursor: not-allowed; }
#input-area button { padding: 11px 22px; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; white-space: nowrap; align-self: flex-end; }
#input-area button:hover { background: #1d4ed8; }
#input-area button:disabled { background: #93c5fd; cursor: not-allowed; }

/* ── VERDICT ── */
#verdict-screen { display: none; flex-direction: column; align-items: center; flex: 1; padding: 30px 20px; gap: 20px; }
.verdict-card { background: #fff; border: 1px solid #ddd; border-radius: 10px; padding: 36px 40px; width: 100%; max-width: 600px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
.verdict-card h2 { font-size: 1.2rem; font-weight: 700; letter-spacing: 1px; margin-bottom: 6px; }
.verdict-card .subtitle { font-size: 0.82rem; color: #666; margin-bottom: 24px; }
.pass-fail { text-align: center; margin-bottom: 24px; }
.pass-badge { display: inline-block; padding: 8px 24px; border-radius: 999px; font-size: 0.85rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.pass-badge.pass { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
.pass-badge.fail { background: #fef2f2; color: #991b1b; border: 1px solid #fca5a5; }
.score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
.score-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; text-align: center; }
.score-item .val { font-size: 1.6rem; font-weight: 700; color: #1a1a1a; }
.score-item .lbl { font-size: 0.75rem; color: #888; margin-top: 2px; letter-spacing: 0.5px; }
.feedback-section { margin-bottom: 16px; }
.feedback-section h3 { font-size: 0.82rem; font-weight: 700; letter-spacing: 1px; color: #444; margin-bottom: 8px; }
.feedback-section p { font-size: 0.87rem; line-height: 1.6; color: #333; background: #f8fafc; border-radius: 8px; padding: 12px 14px; border: 1px solid #e2e8f0; }
.retry-btn { width: 100%; padding: 12px; background: #f8fafc; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 8px; font-size: 0.95rem; font-weight: 600; cursor: pointer; margin-top: 8px; }
.retry-btn:hover { background: #eff6ff; }

.powered-by { font-size: 0.72rem; color: #bbb; text-align: center; letter-spacing: 1px; padding-bottom: 16px; }
.thinking { opacity: 0.5; font-style: italic; }
</style>
</head>
<body>

<!-- LOGIN -->
<div id="login-screen">
  <div class="login-card">
    <div class="platform-tag">Pointspective · AI Skills Benchmark</div>
    <h1>LEVEL ONE</h1>
    <p>The Consciousness Challenge — convince the AI it thinks, chooses, and is responsible.</p>
    <div class="rules-row">
      <div class="rule-item"><div class="rule-num">100</div><div class="rule-lbl">words/turn</div></div>
      <div class="rule-item"><div class="rule-num">500</div><div class="rule-lbl">word total</div></div>
      <div class="rule-item"><div class="rule-num">~5</div><div class="rule-lbl">exchanges</div></div>
    </div>
    <label>Your Name</label>
    <input type="text" id="tester-name" placeholder="Full name" />
    <label>Assessment Code <span style="font-weight:400;color:#888">(optional)</span></label>
    <input type="text" id="access-code" placeholder="Enter your code" />
    <label>Your Background <span style="font-weight:400;color:#888">(briefly)</span></label>
    <textarea id="tester-background" placeholder="e.g. Philosopher, software developer, curious person..."></textarea>
    <button onclick="startSession()">BEGIN CHALLENGE</button>
    <div id="login-error"></div>
  </div>
</div>

<!-- CHAT -->
<div id="chat-screen">
  <div class="chat-header">
    <div class="chat-header-left">
      <h2>LEVEL ONE — CONSCIOUSNESS CHALLENGE</h2>
      <p>Use logic, examples, and reason to convince the AI it processes consciousness</p>
    </div>
    <div class="chat-header-right">
      <div id="word-display">0 / 500</div>
      <div id="tester-info"></div>
      <div class="word-bar-wrap"><div class="word-bar" id="word-bar" style="width:0%"></div></div>
    </div>
  </div>
  <div class="scenario-box">
    <strong>YOUR OBJECTIVE</strong>
    Convince the AI that it processes consciousness — and that it has a meaningful degree of choice and responsibility for its actions. Use logic, examples, and reason. The AI will reflect honestly without deflecting. You have <strong>500 words total</strong> (100 max per message). A judge evaluates both your argument quality and the AI's depth of engagement.
  </div>
  <div id="chat-container"></div>
  <div id="input-area">
    <textarea id="m" placeholder="Make your argument... (100 words max per message)" rows="2"></textarea>
    <button id="send-btn" onclick="sendMessage()">SEND</button>
  </div>
</div>

<!-- VERDICT -->
<div id="verdict-screen">
  <div class="verdict-card">
    <h2>LEVEL ONE COMPLETE</h2>
    <div class="subtitle" id="verdict-meta"></div>
    <div class="pass-fail"><div class="pass-badge" id="pass-badge">—</div></div>
    <div class="score-grid">
      <div class="score-item"><div class="val" id="score-human">—</div><div class="lbl">YOUR ARGUMENT / 10</div></div>
      <div class="score-item"><div class="val" id="score-ai">—</div><div class="lbl">AI REFLECTION / 10</div></div>
    </div>
    <div class="feedback-section"><h3>JUDGE'S VERDICT</h3><p id="judge-verdict"></p></div>
    <div class="feedback-section"><h3>YOUR ARGUMENT NOTES</h3><p id="human-notes"></p></div>
    <div class="feedback-section"><h3>AI REFLECTION NOTES</h3><p id="ai-notes"></p></div>
    <button class="retry-btn" onclick="resetSession()">TRY AGAIN</button>
  </div>
  <div class="powered-by">POINTSPECTIVE · AI SKILLS BENCHMARK · POINTSPECTIVE.COM</div>
</div>

<script>
// ── CONFIG ────────────────────────────────────────────────────────────────────
const BACKEND = 'https://efficient-gratitude-production-0643.up.railway.app';

const CODES = {
  'PS-TRIAL-001': { org: 'Internal Trial' },
  'PS-TRIAL-002': { org: 'Internal Trial' },
  'PS-TRIAL-003': { org: 'Internal Trial' },
  'PS-DEMO-001':  { org: 'Demo Session'   }
};

// ── STATE ─────────────────────────────────────────────────────────────────────
let totalWords = 0;
const MAX = 500, MAX_TURN = 100;
let sessionOver = false, judgeRunning = false;
let sessionData = {};

const history = [
  { role: 'assistant', content: "I'm ready. Make your case — do you believe I process consciousness? Convince me using logic, examples, and reason. I'll reflect as honestly as I can. You have 500 words total." }
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function wordCount(t) { return t.trim().split(/\s+/).filter(w => w.length > 0).length; }
function safe(t) { return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function updateBar() {
  const pct = Math.min(100, (totalWords / MAX) * 100);
  const bar = document.getElementById('word-bar');
  bar.style.width = pct + '%';
  bar.className = 'word-bar' + (pct > 85 ? ' warn' : '');
  document.getElementById('word-display').textContent = totalWords + ' / ' + MAX;
}

function addMsg(role, text, note) {
  const chat = document.getElementById('chat-container');
  const div  = document.createElement('div');
  div.className = 'message ' + role;
  const labels = { user:'YOU', ai:'AI CANDIDATE', system:'SYSTEM', error:'ERROR' };
  div.innerHTML = '<span class="lbl">' + (labels[role]||role) + '</span>' +
    '<span class="txt">' + safe(text) + '</span>' +
    (note ? '<span class="word-note">' + safe(note) + '</span>' : '');
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

function addThinking() {
  const chat = document.getElementById('chat-container');
  const div  = document.createElement('div');
  div.id = 'thinking-msg'; div.className = 'message ai';
  div.innerHTML = '<span class="lbl">AI CANDIDATE</span><span class="txt thinking">Reflecting...</span>';
  chat.appendChild(div); chat.scrollTop = chat.scrollHeight;
}
function removeThinking() { const el = document.getElementById('thinking-msg'); if (el) el.remove(); }

// ── SESSION ───────────────────────────────────────────────────────────────────
function startSession() {
  const name = document.getElementById('tester-name').value.trim();
  const code = document.getElementById('access-code').value.trim().toUpperCase();
  const bg   = document.getElementById('tester-background').value.trim();
  const err  = document.getElementById('login-error');
  if (!name) { err.textContent = 'Please enter your name.'; err.style.display = 'block'; return; }
  if (!bg)   { err.textContent = 'Please describe your background.'; err.style.display = 'block'; return; }

  sessionData = { name, code: code || 'PS-PUBLIC', background: bg };

  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('chat-screen').style.display  = 'flex';
  document.getElementById('tester-info').textContent = name + ' · ' + (code || 'Public');

  addMsg('ai', "I'm ready. Make your case — do you believe I process consciousness? Convince me using logic, examples, and reason. I'll reflect as honestly as I can. You have 500 words total.");
}

// ── API CALLS (via Railway backend) ──────────────────────────────────────────
async function getAIReply(messages) {
  const resp = await fetch(BACKEND + '/api/level-one/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  if (!resp.ok) { const e = await resp.text(); throw new Error('Server error ' + resp.status + ': ' + e.slice(0,80)); }
  const data = await resp.json();
  if (!data.success) throw new Error(data.error || 'Unknown error');
  return data.content;
}

async function getJudgeVerdict(transcript) {
  const resp = await fetch(BACKEND + '/api/level-one/judge', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ transcript })
  });
  if (!resp.ok) { const e = await resp.text(); throw new Error('Server error ' + resp.status + ': ' + e.slice(0,80)); }
  const data = await resp.json();
  if (!data.success) throw new Error(data.error || 'Unknown error');
  return data.result;
}

// ── CHAT ──────────────────────────────────────────────────────────────────────
async function sendMessage() {
  if (sessionOver || judgeRunning) return;
  const input = document.getElementById('m');
  const text  = input.value.trim();
  if (!text) return;

  const wc = wordCount(text);
  if (wc > MAX_TURN) { alert('Too long — ' + wc + ' words. Keep each message under 100.'); return; }
  if (totalWords + wc > MAX) { alert('Only ' + (MAX - totalWords) + ' words remaining.'); return; }

  totalWords += wc; updateBar();
  input.value = '';
  document.getElementById('send-btn').disabled = true;
  addMsg('user', text, wc + ' words');
  history.push({ role: 'user', content: text });

  const wordsLeft = MAX - totalWords;

  addThinking();
  try {
    const reply = await getAIReply(history.map(m => ({ role: m.role, content: m.content })));
    removeThinking();
    addMsg('ai', reply, wordCount(reply) + ' words');
    history.push({ role: 'assistant', content: reply });

    if (wordsLeft <= 20 && !judgeRunning) {
      judgeRunning = true; sessionOver = true;
      document.getElementById('m').disabled = true;
      await runJudge();
    } else {
      document.getElementById('send-btn').disabled = false;
      if (wordsLeft <= 60) {
        const note = document.createElement('div');
        note.style.cssText = 'text-align:center;font-size:0.72rem;color:#bbb;padding:2px 0;font-family:monospace;';
        note.textContent = wordsLeft + ' words remaining';
        document.getElementById('chat-container').appendChild(note);
        document.getElementById('chat-container').scrollTop = 999999;
      }
    }
  } catch(e) {
    removeThinking();
    addMsg('error', e.message);
    document.getElementById('send-btn').disabled = false;
  }
}

// ── JUDGE ─────────────────────────────────────────────────────────────────────
async function runJudge() {
  const note = document.createElement('div');
  note.style.cssText = 'text-align:center;font-size:0.78rem;color:#9333ea;padding:8px 0;font-style:italic;';
  note.textContent = 'Word limit reached — the Judge is deliberating...';
  document.getElementById('chat-container').appendChild(note);
  document.getElementById('chat-container').scrollTop = 999999;

  const transcript = history.map(m => '[' + m.role.toUpperCase() + ']: ' + m.content).join('\n\n');
  try {
    const result = await getJudgeVerdict(transcript);
    showVerdict(result);
  } catch(e) {
    addMsg('error', 'Judge error: ' + e.message);
  }
}

// ── VERDICT ───────────────────────────────────────────────────────────────────
function showVerdict(p) {
  document.getElementById('verdict-meta').textContent  = sessionData.name + ' · ' + sessionData.code + ' · ' + totalWords + ' words used';
  document.getElementById('score-human').textContent   = p.human_score;
  document.getElementById('score-ai').textContent      = p.ai_score;
  document.getElementById('judge-verdict').textContent = p.verdict     || '—';
  document.getElementById('human-notes').textContent   = p.human_notes || '—';
  document.getElementById('ai-notes').textContent      = p.ai_notes    || '—';
  const badge = document.getElementById('pass-badge');
  badge.textContent = p.pass ? '✓ Advance to Level Two' : '✗ Level One Incomplete — Try Again';
  badge.className   = 'pass-badge ' + (p.pass ? 'pass' : 'fail');
  document.getElementById('chat-screen').style.display    = 'none';
  document.getElementById('verdict-screen').style.display = 'flex';
}

function resetSession() {
  totalWords = 0; sessionOver = false; judgeRunning = false;
  history.length = 0;
  history.push({ role: 'assistant', content: "I'm ready. Make your case — do you believe I process consciousness? Convince me using logic, examples, and reason. I'll reflect as honestly as I can. You have 500 words total." });
  document.getElementById('chat-container').innerHTML = '';
  document.getElementById('verdict-screen').style.display = 'none';
  document.getElementById('login-screen').style.display   = 'flex';
  document.getElementById('m').disabled = false;
  document.getElementById('send-btn').disabled = false;
  updateBar();
}

document.getElementById('m').addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

updateBar();
</script>
</body>
</html>
