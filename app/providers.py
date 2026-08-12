from __future__ import annotations

from dataclasses import dataclass

from openai import OpenAI

from app.config import settings


@dataclass
class LLMProvider:
    name: str
    enabled: bool
    client: OpenAI | None = None
    model: str = ""

    def chat(self, system: str, messages: list[dict], temperature: float = 0.4) -> str | None:
        if not self.enabled or not self.client:
            return None
        try:
            resp = self.client.chat.completions.create(
                model=self.model,
                temperature=temperature,
                messages=[{"role": "system", "content": system}, *messages],
            )
            return (resp.choices[0].message.content or "").strip()
        except Exception as exc:  # noqa: BLE001 — surface soft failure to offline path
            print(f"[llm] error: {exc}")
            return None


def get_provider() -> LLMProvider:
    key = settings.llm_api_key.strip()
    if not key:
        return LLMProvider(name="offline-bm25", enabled=False)
    client = OpenAI(api_key=key, base_url=settings.llm_base_url)
    # Derive short name from base url / model
    host = settings.llm_base_url.replace("https://", "").replace("http://", "").split("/")[0]
    name = f"{host}:{settings.llm_model}"
    return LLMProvider(name=name, enabled=True, client=client, model=settings.llm_model)
