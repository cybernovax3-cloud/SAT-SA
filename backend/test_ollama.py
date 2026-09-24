from app.intelligence.ollama_client import generate_response


prompt = """
You are the AI analysis component of SAT-SA,
a Supervisory Analytics Tool for SOC Assessment.

Analyze this security event:

Source IP: 192.168.21.100
Destination: SSH server
Event: Multiple failed SSH authentication attempts
Count: 25 attempts within 2 minutes

Explain:
1. What type of activity this represents.
2. Why it is suspicious.
3. The likely security risk.
4. What a SOC analyst should investigate next.

Keep the response concise and evidence-based.
"""

result = generate_response(prompt)

print()
print("===== SAT-SA AI ANALYSIS =====")
print()
print(result)
