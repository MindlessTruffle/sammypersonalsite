@echo off
cd /d "%~dp0"
node scripts/build.mjs
if errorlevel 1 goto failed
echo.
echo Open http://127.0.0.1:4174/ in your browser.
echo Keep this window open while using the portfolio.
node scripts/serve.mjs
:failed
pause
