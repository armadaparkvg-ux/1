from __future__ import annotations

import json
import re
from pathlib import Path

from rank_bm25 import BM25Okapi

from app.config import settings


def tokenize(text: str) -> list[str]:
    text = text.lower().replace("ё", "е")
    # keep russian/latin/digits
    parts = re.findall(r"[a-zа-я0-9%]+", text, flags=re.I)
    return [p for p in parts if len(p) > 1]


class KnowledgeBase:
    def __init__(self, path: str | None = None) -> None:
        self.path = Path(path or settings.knowledge_path)
        raw = json.loads(self.path.read_text(encoding="utf-8"))
        self.intents: list[dict] = []
        corpus: list[list[str]] = []
        for item in raw:
            variations = item.get("variations") or []
            answer = (item.get("answer") or "").strip()
            if not answer or answer.startswith("("):
                continue
            doc_text = " ".join([item.get("name", ""), *variations, answer])
            entry = {
                "id": item["id"],
                "name": item.get("name", item["id"]),
                "variations": variations,
                "answer": answer,
                "doc_text": doc_text,
            }
            self.intents.append(entry)
            corpus.append(tokenize(doc_text))
        if not corpus:
            raise RuntimeError(f"No intents loaded from {self.path}")
        self.bm25 = BM25Okapi(corpus)
        self._by_id = {i["id"]: i for i in self.intents}

        facts_path = Path(settings.site_facts_path)
        self.site_facts = facts_path.read_text(encoding="utf-8") if facts_path.exists() else ""

    def get(self, intent_id: str) -> dict | None:
        return self._by_id.get(intent_id)

    def search(self, query: str, top_k: int = 4) -> list[dict]:
        tokens = tokenize(query)
        if not tokens:
            return []
        scores = self.bm25.get_scores(tokens)
        ranked = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:top_k]
        out = []
        for i in ranked:
            if scores[i] <= 0:
                continue
            item = dict(self.intents[i])
            item["score"] = float(scores[i])
            out.append(item)
        # Boost strong variation matches (exact / near-exact), avoid substring false positives
        q = re.sub(r"[?!.]+$", "", query.lower().strip())
        boosted_rows: list[dict] = []
        for item in self.intents:
            best_boost = 0.0
            for v in item["variations"]:
                vv = re.sub(r"[?!.]+$", "", v.lower().strip())
                if q == vv:
                    best_boost = max(best_boost, 100.0)
                elif len(q) >= 12 and len(vv) >= 12 and (q in vv or vv in q):
                    # require similar length to reduce "как вывести деньги" ⊂ longer phrases
                    ratio = min(len(q), len(vv)) / max(len(q), len(vv))
                    if ratio >= 0.72:
                        best_boost = max(best_boost, 40.0 * ratio)
            if best_boost > 0:
                row = dict(item)
                row["score"] = max(float(item.get("score", 0) or 0), best_boost)
                boosted_rows.append(row)
        if boosted_rows:
            boosted_rows.sort(key=lambda x: x["score"], reverse=True)
            # Merge: boosted first, then remaining BM25 hits
            seen = {r["id"] for r in boosted_rows}
            out = boosted_rows + [x for x in out if x["id"] not in seen]
        return out[:top_k]

    def format_hits(self, hits: list[dict]) -> str:
        lines = []
        for h in hits:
            lines.append(f"### {h['name']} ({h['id']})\nQ-вариации: {'; '.join(h['variations'][:6])}\nОтвет: {h['answer']}")
        if self.site_facts:
            lines.append("### Факты с сайта\n" + self.site_facts[:3000])
        return "\n\n".join(lines)

    def format_all_brief(self) -> str:
        lines = [f"- {i['name']}: {i['answer'][:180]}" for i in self.intents[:25]]
        if self.site_facts:
            lines.append(self.site_facts[:2000])
        return "\n".join(lines)
