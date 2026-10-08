import sys
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

# TEST 5: Girlfriend / Relationship question
print("\n--- TEST 5: GF / Relationship question ---")
res5 = generate_rag_response("Does Sarweshwar have a girlfriend?", [])
print("Reply:", res5["reply"])
assert res5["reply"] == "you came here to know abt his things or about professional things? 😭🙌", "Test 5 failed!"
print(">>> TEST 5 PASSED!")

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
