#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║      🧪 TaxSyncQC + n8n Integration Test                      ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

cd /home/user/TaxSyncQC

# Start mock n8n server
echo "📡 Starting mock n8n webhook server..."
node mock-n8n-server.js &
N8N_PID=$!
sleep 2

# Start web server
echo "🌐 Starting TaxSyncQC web server..."
python3 -m http.server 8080 > /dev/null 2>&1 &
WEB_PID=$!
sleep 2

echo ""
echo "✅ Both servers running!"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📋 TESTING INSTRUCTIONS"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "1. Open TaxSyncQC in your browser:"
echo "   → http://localhost:8080/index.html"
echo ""
echo "2. Scroll to '🔗 Connect to n8n' section"
echo ""
echo "3. Enter this webhook URL:"
echo "   → http://localhost:3000/webhook/parse-slip"
echo ""
echo "4. Test with this sample text (copy & paste):"
echo ""
echo "   ┌─────────────────────────────────────────────────────────┐"
echo "   │ RELEVÉ 1 - REVENUS D'EMPLOI 2025                        │"
echo "   │                                                         │"
echo "   │ Case A - Revenus d'emploi: 60 000,00 $                 │"
echo "   │ Case F - Cotisations syndicales: 425,00 $              │"
echo "   │ Case B.A - Cotisations RRQ: 3 200,50 $                 │"
echo "   │                                                         │"
echo "   │ REER: 5 000 $                                           │"
echo "   └─────────────────────────────────────────────────────────┘"
echo ""
echo "5. Click '🚀 Send to n8n'"
echo ""
echo "6. Click '⬇️ Apply parsed fields'"
echo ""
echo "7. Click 'Estimer les crédits' to see results!"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "💡 Watch this terminal for webhook activity!"
echo ""
echo "Press Ctrl+C when done to stop both servers"
echo ""

# Wait for Ctrl+C
trap "kill $N8N_PID $WEB_PID 2>/dev/null; echo ''; echo '✅ Servers stopped'; exit 0" INT
wait
