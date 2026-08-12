#!/usr/bin/env python3
"""Offline evaluation of support agent against expected intents."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.agent import SupportAgent  # noqa: E402

CASES = [
    ("Здравствуйте", "greeting"),
    ("Как подключить Яндекс такси?", "connect_yandex_taxi"),
    ("Как вывести деньги?", "withdraw_clarify"),
    ("Не могу вывести деньги с драйви", "drivee_withdraw_fail"),
    ("Нужна лицензия ФГИС", "fgis_license"),
    ("ОСГОП делаете?", "osgop"),
    ("Хочу курьером", "delivery_connect"),
    ("Какая комиссия парка?", "commission_park"),
    ("Где офис?", "office"),
    ("Спасибо", "thanks"),
]


def main() -> None:
    agent = SupportAgent()
    ok = 0
    for i, (q, expected) in enumerate(CASES, 1):
        # fresh session each time
        r = agent.reply(q, session_id=f"eval-{i}")
        hit = r.get("intent_id")
        status = "OK" if hit == expected else "FAIL"
        if hit == expected:
            ok += 1
        print(f"[{status}] {q!r} -> {hit} (want {expected}) mode={r['mode']}")
        print(f"       {r['reply'][:120].replace(chr(10), ' ')}")
    print(f"\nScore: {ok}/{len(CASES)}")
    raise SystemExit(0 if ok == len(CASES) else 1)


if __name__ == "__main__":
    main()
