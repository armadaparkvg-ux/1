#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="$HOME/.local/bin:/usr/local/bin:$PWD/.venv/bin:$PATH"

if [[ ! -d .venv ]]; then
  bash scripts/bootstrap.sh
fi

# Local LLM
if command -v ollama >/dev/null 2>&1; then
  if ! curl -sf http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
    nohup ollama serve >/tmp/ollama.log 2>&1 &
    echo $! >/tmp/ollama.pid
    sleep 2
  fi
  # ensure default model present (non-blocking if already there)
  if ! ollama list 2>/dev/null | grep -q 'qwen2.5:3b'; then
    ollama pull qwen2.5:3b >/tmp/ollama-pull.log 2>&1 || true
  fi
fi

PID_FILE=/tmp/armada-ai.pid
LOG_FILE=/tmp/armada-ai.log
if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "[start] armada AI already running pid=$(cat "$PID_FILE")"
else
  nohup .venv/bin/uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8080}" >"$LOG_FILE" 2>&1 &
  echo $! >"$PID_FILE"
  sleep 1
  echo "[start] armada AI started pid=$(cat "$PID_FILE")"
fi

if grep -qE '^TELEGRAM_BOT_TOKEN=.+' .env 2>/dev/null; then
  if ! pgrep -f 'app.channels.telegram_polling' >/dev/null 2>&1; then
    nohup .venv/bin/python -m app.channels.telegram_polling >/tmp/armada-tg.log 2>&1 &
    echo "[start] telegram polling started"
  fi
fi

curl -sf "http://127.0.0.1:${PORT:-8080}/health" || true
echo
echo "[start] ready"
