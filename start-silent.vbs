' DailyAura Outreach CRM 24/7 Autonomous Background Auto-Start
Set WshShell = CreateObject("WScript.Shell")

' 1. Start Node CRM Server (Port 3000) invisibly
WshShell.CurrentDirectory = "c:\Users\Dell\Downloads\Ai Tool\crm"
WshShell.Run "node server.js", 0, False

' 2. Start Cloudflare Mobile Tunnel invisibly
WshShell.CurrentDirectory = "c:\Users\Dell\Downloads\Ai Tool"
WshShell.Run "cloudflared.exe tunnel --url http://localhost:3000", 0, False
