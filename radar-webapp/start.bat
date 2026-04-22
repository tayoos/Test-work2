@echo off
REM ── FADS Radar SysML Web App ─────────────────────────────
REM Run this file to start the local web server on Windows.
REM Then open: http://localhost:8080

cd /d "%~dp0"
echo.
echo   FADS - Radar Ingestion SysML
echo   Starting local server on http://localhost:8080
echo   Press Ctrl+C to stop.
echo.
python -m http.server 8080
pause
