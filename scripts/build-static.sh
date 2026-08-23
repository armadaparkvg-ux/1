#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

API_DIR="src/app/api"
API_BACKUP=".static-build-backup/api"

echo "==> Preparing static export..."
rm -rf out .next "$API_BACKUP"
mkdir -p .static-build-backup

echo "==> Generating llms.txt / RSS / IndexNow key..."
node scripts/write-public-ai-files.mjs

if [ -d "$API_DIR" ]; then
  mv "$API_DIR" "$API_BACKUP"
fi

cleanup() {
  if [ -d "$API_BACKUP" ]; then
    mkdir -p "$(dirname "$API_DIR")"
    mv "$API_BACKUP" "$API_DIR"
  fi
}
trap cleanup EXIT

echo "==> Building static site..."
STATIC_EXPORT=1 npm run build

# Ensure verification + htaccess present
cp -f public/yandex_618ea4dc33112d20.html out/ 2>/dev/null || true
cp -f public/.htaccess out/ 2>/dev/null || true

echo "==> Static site ready in ./out"
