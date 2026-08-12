#!/usr/bin/env python3
"""Validate knowledge base and print index stats."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.knowledge import KnowledgeBase  # noqa: E402


def main() -> None:
    path = ROOT / "knowledge" / "intents.json"
    raw = json.loads(path.read_text(encoding="utf-8"))
    kb = KnowledgeBase(str(path))
    print(f"raw intents: {len(raw)}")
    print(f"indexed intents: {len(kb.intents)}")
    print(f"site facts chars: {len(kb.site_facts)}")
    # smoke search
    for q in ["как вывести деньги", "лицензия фгис", "хочу курьером", "комиссия парка"]:
        hits = kb.search(q, top_k=2)
        top = hits[0] if hits else None
        print(f"  Q: {q!r} -> {top['id'] if top else None} ({top['score'] if top else 0:.2f})")
    print("OK")


if __name__ == "__main__":
    main()
