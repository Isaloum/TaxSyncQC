// Mock n8n Webhook Server for TaxSyncQC Testing
// This simulates the n8n webhook to test the integration

import http from 'http';
import { URL } from 'url';

const PORT = 3000;

// Parser function (same as the n8n workflow)
function extractMoney(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = match[1].replace(/[,\s]/g, '');
      return parseFloat(value);
    }
  }
  return null;
}

function parseSlip(inputText) {
  // RL-1 Patterns (Quebec)
  const rl1Patterns = {
    A: [
      /Case\s*A[:\s]*([\d,\.\s]+)/i,
      /Box\s*A[:\s]*([\d,\.\s]+)/i,
      /Revenu\s*d'emploi[:\s]*([\d,\.\s]+)/i,
      /Employment\s*income[:\s]*([\d,\.\s]+)/i
    ],
    F: [
      /Case\s*F[:\s]*([\d,\.\s]+)/i,
      /Box\s*F[:\s]*([\d,\.\s]+)/i,
      /Cotisations\s*syndicales[:\s]*([\d,\.\s]+)/i,
      /Union\s*dues[:\s]*([\d,\.\s]+)/i
    ],
    'B.A': [
      /Case\s*B\.A[:\s]*([\d,\.\s]+)/i,
      /Box\s*B\.A[:\s]*([\d,\.\s]+)/i,
      /Cotisations\s*RRQ[:\s]*([\d,\.\s]+)/i,
      /QPP\s*contributions[:\s]*([\d,\.\s]+)/i
    ]
  };

  // T4 Patterns (Federal)
  const t4Patterns = {
    '14': [
      /Box\s*14[:\s]*([\d,\.\s]+)/i,
      /Case\s*14[:\s]*([\d,\.\s]+)/i,
      /Employment\s*income[:\s]*([\d,\.\s]+)/i
    ],
    '44': [
      /Box\s*44[:\s]*([\d,\.\s]+)/i,
      /Case\s*44[:\s]*([\d,\.\s]+)/i,
      /Union\s*dues[:\s]*([\d,\.\s]+)/i
    ],
    '16': [
      /Box\s*16[:\s]*([\d,\.\s]+)/i,
      /Employee's\s*CPP[:\s]*([\d,\.\s]+)/i
    ],
    '17': [
      /Box\s*17[:\s]*([\d,\.\s]+)/i,
      /Employee's\s*QPP[:\s]*([\d,\.\s]+)/i
    ]
  };

  // RRSP Patterns
  const rrspPatterns = [
    /RRSP[:\s]*([\d,\.\s]+)/i,
    /REER[:\s]*([\d,\.\s]+)/i,
    /Contribution\s*REER[:\s]*([\d,\.\s]+)/i,
    /RRSP\s*contribution[:\s]*([\d,\.\s]+)/i
  ];

  // Extract RL-1 data
  const rl1 = {};
  for (const [key, patterns] of Object.entries(rl1Patterns)) {
    const value = extractMoney(inputText, patterns);
    if (value !== null) {
      rl1[key] = value;
    }
  }

  // Extract T4 data
  const t4 = {};
  for (const [key, patterns] of Object.entries(t4Patterns)) {
    const value = extractMoney(inputText, patterns);
    if (value !== null) {
      t4[key] = value;
    }
  }

  // Extract RRSP
  const rrsp = extractMoney(inputText, rrspPatterns);

  // Determine slip type
  const hasRL1 = Object.keys(rl1).length > 0;
  const hasT4 = Object.keys(t4).length > 0;

  let slipType = 'unknown';
  if (hasRL1 && hasT4) slipType = 'both';
  else if (hasRL1) slipType = 'RL-1';
  else if (hasT4) slipType = 'T4';

  return {
    rl1: Object.keys(rl1).length > 0 ? rl1 : null,
    t4: Object.keys(t4).length > 0 ? t4 : null,
    rrsp: rrsp,
    slipType: slipType,
    success: hasRL1 || hasT4
  };
}

// Create HTTP server
const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Only accept POST
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  // Parse webhook path
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Only accept /webhook/parse-slip or /webhook-test/parse-slip
  if (!url.pathname.includes('/parse-slip')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  // Read request body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      const text = data.text || '';
      const lang = data.lang || 'fr';

      console.log('\n🔔 Webhook received!');
      console.log('─────────────────────────────────────────');
      console.log('Language:', lang);
      console.log('Text length:', text.length, 'chars');
      console.log('Text preview:', text.substring(0, 100) + '...');

      // Parse the slip
      const result = parseSlip(text);

      console.log('\n📋 Parsed result:');
      console.log(JSON.stringify(result, null, 2));
      console.log('─────────────────────────────────────────\n');

      // Return result
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));

    } catch (error) {
      console.error('❌ Error parsing request:', error.message);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
});

server.listen(PORT, () => {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║        🚀 Mock n8n Webhook Server Running!                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  console.log(`📍 Webhook URL: http://localhost:${PORT}/webhook/parse-slip`);
  console.log('\n📝 Usage:');
  console.log('   1. Copy the webhook URL above');
  console.log('   2. Open TaxSyncQC in your browser');
  console.log('   3. Paste the URL in "n8n webhook URL" field');
  console.log('   4. Test with sample tax slip text!\n');
  console.log('💡 This simulates the n8n workflow - no n8n installation needed!');
  console.log('   When you\'re ready, you can replace this with a real n8n instance.\n');
  console.log('Press Ctrl+C to stop\n');
  console.log('─────────────────────────────────────────────────────────────────\n');
});
