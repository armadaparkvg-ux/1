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
