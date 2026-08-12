from app.agent import SupportAgent
from app.knowledge import KnowledgeBase


def test_kb_loads():
    kb = KnowledgeBase()
    assert len(kb.intents) >= 30


def test_greeting():
    agent = SupportAgent()
    r = agent.reply("Здравствуйте", session_id="t1")
    assert r["intent_id"] == "greeting"
    assert "АРМАДА" in r["reply"].upper() or "Армада" in r["reply"]


def test_withdraw_clarify():
    agent = SupportAgent()
    r = agent.reply("Как вывести деньги?", session_id="t2")
    assert r["intent_id"] == "withdraw_clarify"
    assert "Яндекс" in r["reply"] or "DRIVEE" in r["reply"] or "Драйви" in r["reply"]


def test_fgis():
    agent = SupportAgent()
    r = agent.reply("нужна лицензия фгис", session_id="t3")
    assert r["intent_id"] == "fgis_license"
    assert "3500" in r["reply"]


def test_pending_withdraw_yandex():
    agent = SupportAgent()
    r1 = agent.reply("Как вывести деньги?", session_id="t4")
    assert r1["intent_id"] == "withdraw_clarify"
    r2 = agent.reply("яндекс", session_id="t4")
    assert r2["intent_id"] == "yandex_withdraw"
    assert r2["mode"] == "pending-resolve"


def test_new_intents_from_delegation():
    agent = SupportAgent()
    assert agent.reply("Что за MAX?", session_id="t5")["intent_id"] == "max_messenger"
    assert agent.reply("А путевые листы вы делаете?", session_id="t6")["intent_id"] == "waybills"
