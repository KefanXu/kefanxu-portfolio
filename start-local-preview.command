#!/bin/bash
# Starts the portfolio locally and opens the designer mode in your browser.
cd "$(dirname "$0")" || exit 1
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.npm-global/bin:$PATH"
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh"
if ! command -v npm >/dev/null; then echo "npm was not found. Install Node.js from https://nodejs.org and run this again."; read -r; exit 1; fi
[ -d node_modules ] || npm ci || { echo "Install failed."; read -r; exit 1; }
(sleep 4; open "http://localhost:5199/design/") &
npx vite --port 5199 --strictPort
