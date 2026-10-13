#!/usr/bin/env bash
# ==============================================================================
# Script Menjalankan Spinkelas Lucky Wheel
# ==============================================================================

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "=========================================================="
echo "  MEMULAI SPINKELAS · LUCKY WHEEL..."
echo "=========================================================="

if command -v node >/dev/null 2>&1; then
  node server.js
elif command -v python3 >/dev/null 2>&1; then
  echo "Node.js tidak ditemukan, menggunakan Python HTTP Server..."
  python3 -m http.server 3300
elif command -v python >/dev/null 2>&1; then
  python -m http.server 3300
else
  echo "Error: Butuh Node.js atau Python untuk menjalankan web server."
  exit 1
fi
