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
    ("Что за MAX?", "max_messenger"),
    ("А путевые листы вы делаете?", "waybills"),
    ("Как сменить карту для вывода?", "sbp_change_card"),
    ("Какие требования к авто?", "taxi_car_requirements"),
]

# Multi-turn flows: list of (session_suffix, [(q, expected), ...])
FLOWS = [
    (
        "withdraw-yandex",
        [
            ("Как вывести деньги?", "withdraw_clarify"),
            ("яндекс", "yandex_withdraw"),
        ],
    ),
    (
        "connect-smz",
        [
            ("Как подключить Яндекс такси?", "connect_yandex_taxi"),
            ("1", "park_selfemployed"),
        ],
    ),
]


def main() -> None:
    agent = SupportAgent()
    ok = 0
    total = 0
    for i, (q, expected) in enumerate(CASES, 1):
        total += 1
        r = agent.reply(q, session_id=f"eval-{i}")
        hit = r.get("intent_id")
        status = "OK" if hit == expected else "FAIL"
        if hit == expected:
            ok += 1
        print(f"[{status}] {q!r} -> {hit} (want {expected}) mode={r['mode']}")
        print(f"       {r['reply'][:120].replace(chr(10), ' ')}")

    for flow_name, steps in FLOWS:
        sid = f"flow-{flow_name}"
        for q, expected in steps:
            total += 1
            r = agent.reply(q, session_id=sid)
            hit = r.get("intent_id")
            status = "OK" if hit == expected else "FAIL"
            if hit == expected:
                ok += 1
            print(f"[{status}] FLOW {flow_name}: {q!r} -> {hit} (want {expected}) mode={r['mode']}")

    print(f"\nScore: {ok}/{total}")
    raise SystemExit(0 if ok == total else 1)


if __name__ == "__main__":
    main()
