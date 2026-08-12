#!/usr/bin/env python3
"""Delegate a task to an external LLM (OpenAI / DeepSeek / any OpenAI-compatible).

Saves the raw answer under data/delegations/ for the main agent to continue.
Does NOT invent API keys — uses .env LLM_* or CLI flags.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv

load_dotenv(ROOT / ".env")

OUT_DIR = ROOT / "data" / "delegations"
OUT_DIR.mkdir(parents=True, exist_ok=True)


PROVIDERS = {
    "openai": {"base_url": "https://api.openai.com/v1", "model": "gpt-4o-mini"},
    "deepseek": {"base_url": "https://api.deepseek.com", "model": "deepseek-chat"},
    "env": {
        "base_url": os.getenv("LLM_BASE_URL", "https://api.openai.com/v1"),
        "model": os.getenv("LLM_MODEL", "gpt-4o-mini"),
    },
}


def main() -> int:
    p = argparse.ArgumentParser(description="Delegate task to external AI")
    p.add_argument("--provider", choices=sorted(PROVIDERS), default="env")
    p.add_argument("--task", required=True, help="Task prompt for the other AI")
    p.add_argument("--context-file", action="append", default=[], help="Extra context files")
    p.add_argument("--api-key", default=os.getenv("LLM_API_KEY", ""))
    p.add_argument("--model", default="")
    p.add_argument("--base-url", default="")
    p.add_argument("--system", default="Ты сильный инженерный ассистент. Отвечай конкретно, с готовым кодом/JSON.")
    args = p.parse_args()

    cfg = PROVIDERS[args.provider]
    api_key = args.api_key.strip()
    if not api_key:
        print("NO_API_KEY: задайте LLM_API_KEY в .env или --api-key", file=sys.stderr)
        print("Для Claude/GPT без ключа используйте Cursor Task subagent.", file=sys.stderr)
        return 2

    base_url = args.base_url or cfg["base_url"]
    model = args.model or cfg["model"]

    chunks: list[str] = [args.task, ""]
    for path in args.context_file:
        text = Path(path).read_text(encoding="utf-8", errors="replace")
        chunks.append(f"### FILE {path}\n{text[:12000]}")
    user = "\n".join(chunks)

    from openai import OpenAI

    client = OpenAI(api_key=api_key, base_url=base_url)
    t0 = time.time()
    resp = client.chat.completions.create(
        model=model,
        temperature=0.3,
        messages=[
            {"role": "system", "content": args.system},
            {"role": "user", "content": user},
        ],
    )
    answer = (resp.choices[0].message.content or "").strip()
    elapsed = round(time.time() - t0, 2)

    stamp = time.strftime("%Y%m%d-%H%M%S")
    out = OUT_DIR / f"{stamp}-{args.provider}-{model.replace('/', '_')}.md"
    meta = {
        "provider": args.provider,
        "base_url": base_url,
        "model": model,
        "elapsed_sec": elapsed,
        "task": args.task,
        "context_files": args.context_file,
    }
    out.write_text(
        "---\n" + json.dumps(meta, ensure_ascii=False, indent=2) + "\n---\n\n" + answer + "\n",
        encoding="utf-8",
    )
    print(f"SAVED {out}")
    print(answer[:2000])
    if len(answer) > 2000:
        print(f"\n... truncated in stdout, full file: {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
