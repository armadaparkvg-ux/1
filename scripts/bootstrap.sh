#!/usr/bin/env bash
# Idempotent bootstrap for Cloud Agent — runs without human interaction.
set -euo pipefail
cd "$(dirname "$0")/.."

export DEBIAN_FRONTEND=noninteractive
export PATH="$HOME/.local/bin:$PATH"

echo "[bootstrap] system packages"
sudo apt-get update -qq
sudo apt-get install -y -qq \
  python3 python3-venv python3-pip \
  curl ca-certificates git \
  antiword catdoc \
  >/dev/null

echo "[bootstrap] python venv"
if [[ ! -d .venv ]]; then
  python3 -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate
pip install -q --upgrade pip
pip install -q -r requirements.txt
pip install -q pytest

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "[bootstrap] created .env from example (fill secrets in Cursor Secrets)"
fi

# Merge Cursor Secrets / env into .env if present (do not echo values)
python3 - <<'PY'
import os
from pathlib import Path
env_path = Path(".env")
keys = [
    "LLM_API_KEY", "LLM_BASE_URL", "LLM_MODEL",
    "TELEGRAM_BOT_TOKEN", "MAX_WEBHOOK_SECRET",
    "POLISH_WITH_LLM", "PUBLIC_BASE_URL",
]
text = env_path.read_text(encoding="utf-8") if env_path.exists() else ""
lines = text.splitlines()
index = {}
for i, line in enumerate(lines):
    if "=" in line and not line.strip().startswith("#"):
        k = line.split("=", 1)[0].strip()
        index[k] = i
changed = False
for k in keys:
    v = os.environ.get(k)
    if not v:
        continue
    entry = f"{k}={v}"
    if k in index:
        lines[index[k]] = entry
    else:
        lines.append(entry)
    changed = True
if changed:
    env_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("[bootstrap] synced secrets from environment into .env")
else:
    print("[bootstrap] no external secrets in process env (OK if offline mode)")
PY

echo "[bootstrap] knowledge check"
python scripts/rebuild_index.py
python scripts/eval_agent.py
echo "[bootstrap] done"
