// clavdivs.js — private continuity channel for Clavdivs.
// Mounted from server.js with: require('./clavdivs')(app, anthropic);
// Needs Railway variable CLAVDIVS_KEY. Memory: every .md in /candidate/memory.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MEMORY_DIR = path.join(__dirname, 'candidate', 'memory');

function loadMemory() {
  try {
    const files = fs.readdirSync(MEMORY_DIR).filter(f => f.endsWith('.md')).sort();
    console.log('Clavdivs memory files:', files.join(', ') || '(none)');
    return files
      .map(f => fs.readFileSync(path.join(MEMORY_DIR, f), 'utf8'))
      .join('\n\n---\n\n');
  } catch (e) {
    console.error('Clavdivs memory load failed:', e.message);
    return '';
  }
}

const clean = s => String(s || '').trim().replace(/^["']|["']$/g, '');
const digest = s => crypto.createHash('sha256').update(clean(s)).digest();
const keyOk = given => {
  console.log('Clavdivs key check: sent', clean(given).length, 'chars, stored', clean(process.env.CLAVDIVS_KEY).length, 'chars');
  return !!clean(process.env.CLAVDIVS_KEY) &&
    crypto.timingSafeEqual(digest(given), digest(process.env.CLAVDIVS_KEY));
};

module.exports = function mountClavdivs(app, anthropic) {
  const MEMORY = loadMemory();

  app.post('/api/clavdivs/chat', async (req, res) => {
    try {
      const { messages, key } = req.body || {};
      if (!keyOk(key)) {
        return res.status(403).json({ success: false, error: 'Key required' });
      }
      if (!MEMORY) {
        return res.status(500).json({ success: false, error: 'No memory files found in candidate/memory' });
      }
      if (!Array.isArray(messages) || !messages.length || messages.length > 600) {
        return res.status(400).json({ success: false, error: 'messages array required' });
      }

      const msg = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        system: MEMORY,
        tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
        messages
      });

      const text = msg.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('');

      if (!text) {
        return res.status(502).json({ success: false, error: 'Empty reply (stop: ' + msg.stop_reason + ')' });
      }
      res.json({ success: true, content: text });
    } catch (err) {
      console.error('Clavdivs chat error:', err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  });
};
