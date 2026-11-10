@echo off
echo Stopping DailyAura CRM & Cloudflared processes...
taskkill /F /IM node.exe
taskkill /F /IM cloudflared.exe
echo Done!
pause
