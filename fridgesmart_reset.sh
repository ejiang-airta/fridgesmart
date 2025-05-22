#!/bin/bash

set -e

echo "---- [1/6] Fixing SSL issues (if possible) ----"
# Update npm CA certificates (macOS)
if [ "$(uname)" == "Darwin" ]; then
  echo "Updating system CA certificates (macOS)..."
  sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain /etc/ssl/certs/ca-certificates.crt || true
fi

echo "---- [2/6] Cleaning build artifacts ----"
rm -rf node_modules ios android .expo package-lock.json yarn.lock

echo "---- [3/6] Reinstalling dependencies ----"
npm install
npx expo install

echo "---- [4/6] Rebuilding native projects ----"
npx expo prebuild --clean --platform ios

echo "---- [5/6] Starting Expo (with cache clear) ----"
# Use SSL workaround only if needed
export NODE_TLS_REJECT_UNAUTHORIZED=0
npx expo start --clear &

sleep 10

echo "---- [6/6] Launching iOS simulator ----"
npx expo run:ios

echo "---- All done! If you see errors, please copy them here for further help. ----" 