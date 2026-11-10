@echo off
echo Starting DailyAura CRM Enterprise in background...
start /B node server.js > server.log 2>&1
cd ..
start /B cloudflared.exe tunnel --url http://localhost:3000 > tunnel.log 2>&1
echo Done! CRM is running at http://localhost:3000
pause
