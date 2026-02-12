@echo off
echo Starting Chart Styler...
cd /d "%~dp0"
start http://localhost:5173
npm run dev
