#!/bin/bash
# ── FADS Radar SysML Web App ──────────────────────────────
# Run this script to start the local web server.
# Then open: http://localhost:8080

cd "$(dirname "$0")"
echo ""
echo "  FADS – Radar Ingestion SysML"
echo "  Starting local server on http://localhost:8080"
echo "  Press Ctrl+C to stop."
echo ""
python3 -m http.server 8080
