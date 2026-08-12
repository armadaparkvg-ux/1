"""Optional long-polling Telegram runner (use when webhooks are unavailable)."""

from __future__ import annotations

import asyncio
import logging

from app.agent import SupportAgent
from app.config import settings

log = logging.getLogger("telegram")


async def run_polling() -> None:
    token = settings.telegram_bot_token
    if not token:
        raise SystemExit("Set TELEGRAM_BOT_TOKEN in .env")

    from aiogram import Bot, Dispatcher, F
    from aiogram.types import Message

    bot = Bot(token)
    dp = Dispatcher()
    agent = SupportAgent()

    @dp.message(F.text)
    async def on_text(message: Message) -> None:
        result = agent.reply(message.text or "", session_id=f"tg:{message.chat.id}", channel="telegram")
        await message.answer(result["reply"])

    log.info("Telegram polling started")
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(run_polling())
