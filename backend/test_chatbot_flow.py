import sys
import re
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.stdout.reconfigure(encoding="utf-8")

from app.rag.retrieval import generate_rag_response

print("=== STARTING CHATBOT VERIFICATION TESTS ===")

# TEST 1: Greeting
print("\n--- TEST 1: Greeting 'Hi' ---")
res1 = generate_rag_response("Hi", [])
print("Reply:", res1["reply"])
assert res1["reply"] == "Hey! 👋 May I know your name?", "Test 1 failed!"
print(">>> TEST 1 PASSED!")

# TEST 2: User ignores name request
print("\n--- TEST 2: User ignores name request ---")
history_asked_name = [
    {"isBot": False, "text": "Hi"},
    {"isBot": True, "text": "Hey! 👋 May I know your name?"}
]
res2 = generate_rag_response("Tell me about Sarweshwar's skills", history_asked_name)
print("Reply (preview):", res2["reply"][:150])
assert res2["reply"].startswith("bro ananomously want to know about sarweshwar 😭🙌"), "Test 2 failed!"
print(">>> TEST 2 PASSED!")

# TEST 3: User gives name
print("\n--- TEST 3: User gives name 'Rahul' ---")
res3 = generate_rag_response("Rahul", history_asked_name)
print("Reply:", res3["reply"])
assert "Rahul" in res3["reply"] and "Nice to meet you, Rahul! 😄 What would you like to know about Sarweshwar?" in res3["reply"], "Test 3 failed!"
print(">>> TEST 3 PASSED!")

# TEST 4: Unrelated question (weather)
print("\n--- TEST 4: Unrelated question 'What is today's weather?' ---")
res4 = generate_rag_response("What is today's weather?", [])
print("Reply:", res4["reply"])
assert res4["reply"] == "That's outside my Sarweshwar portfolio zone 😭 Ask your frnd Sarweshwar about that.", "Test 4 failed!"
print(">>> TEST 4 PASSED!")

# TEST 5: Girlfriend / Relationship questions (Multi-turn turn-tables flow)
print("\n--- TEST 5: GF / Relationship questions (Multi-turn turn-tables flow) ---")
# Turn 1: 1st time asking
res5_1 = generate_rag_response("Does Sarweshwar have a girlfriend?", [])
print("Reply 1 ('Does Sarweshwar have a girlfriend?'):\n", res5_1["reply"])
assert "assistant" in res5_1["reply"].lower(), "Reply 1 should mention assistant"
assert "personal" in res5_1["reply"].lower(), "Reply 1 should mention personal"

# Turn 2: 2nd time asking (persisting) -> should ask user about their own gf/personal life
history_gf = [
    {"isBot": False, "text": "Does Sarweshwar have a girlfriend?"},
    {"isBot": True, "text": res5_1["reply"]}
]
res5_2 = generate_rag_response("say his lover name", history_gf)
print("\nReply 2 (Turn 2 - persisting: 'say his lover name'):\n", res5_2["reply"])
assert re.search(r"\b(do you|do u|you have|someone special)\b", res5_2["reply"], re.IGNORECASE), "Turn 2 must turn tables and ask user about gf/personal!"

# Turn 3: User answers bot's question -> bot replies with follow-up and switches to portfolio
history_gf_turn3 = [
    {"isBot": False, "text": "Does Sarweshwar have a girlfriend?"},
    {"isBot": True, "text": res5_1["reply"]},
    {"isBot": False, "text": "say his lover name"},
    {"isBot": True, "text": res5_2["reply"]}
]
res5_3 = generate_rag_response("No, I'm single lol", history_gf_turn3)
print("\nReply 3 (Turn 3 - user answers: 'No, I'm single lol'):\n", res5_3["reply"])
assert any(k in res5_3["reply"].lower() for k in ["portfolio", "project", "projects", "skill", "skills", "wayzen"]), "Turn 3 must pivot back to portfolio!"

trope_re = re.compile(r"(committed\s+to|commitment|relationship\s+(is\s+)?with|married\s+to|career|main\s+branch|3\s*am\s*debug)", re.IGNORECASE)
for idx, r in enumerate([res5_1, res5_2, res5_3], 1):
    reply_txt = r["reply"].lower()
    assert not trope_re.search(reply_txt), f"Trope leaked in reply {idx}: {r['reply']}"

print(">>> TEST 5 PASSED (Turn-tables multi-turn relationship flow verified successfully)!")

# TEST 6: Internships query (removed internships must NOT appear)
print("\n--- TEST 6: Internships query ---")
res6 = generate_rag_response("Tell me about Sarweshwar's internships.", [])
print("Reply (preview):", res6["reply"][:300])
assert "1M1B" not in res6["reply"], "1M1B leaked into response!"
assert "TheSmartBridge" not in res6["reply"], "TheSmartBridge leaked into response!"
assert "Elevate Labs" not in res6["reply"], "Elevate Labs leaked into response!"
assert not res6["reply"].startswith("bro ananomously"), "bro ananomously should not appear on direct inquiry!"
print(">>> TEST 6 PASSED!")

# TEST 7: Multi-turn after user introduces themselves
print("\n--- TEST 7: Multi-turn after user introduced name ---")
history_named = [
    {"isBot": False, "text": "Hi"},
    {"isBot": True, "text": "Hey! 👋 May I know your name?"},
    {"isBot": False, "text": "Rahul"},
    {"isBot": True, "text": "Nice to meet you, Rahul! 😄 What would you like to know about Sarweshwar?"}
]
res7 = generate_rag_response("Tell me about his top projects", history_named)
print("Reply (preview):", res7["reply"][:200])
assert not res7["reply"].startswith("bro ananomously"), "bro ananomously should not appear after name was given!"
print(">>> TEST 7 PASSED!")

print("\n==============================================")
print("🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY!")
print("==============================================")
