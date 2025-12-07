import json
import random

# Read existing questions
with open('data/questions.json', 'r') as f:
    existing = json.load(f)

# Get the highest ID number
max_id = max(int(q['id'][1:]) for q in existing)
new_id = max_id + 1

# Categories
categories = [
    "phishing", "passwords", "network", "compliance", "malware", 
    "social-engineering", "device-security", "backup", "identity-access",
    "logging-monitoring", "data-protection", "cloud-security", "email-security",
    "secure-development", "incident-response", "application-security",
    "secure-config", "encryption", "vulnerability-management", "access-control"
]

# Easy questions (93 more needed)
easy_questions = [
    {
        "id": f"q{new_id}",
        "category": random.choice(categories),
        "difficulty": "easy",
        "question": "What should you do if you accidentally click a suspicious link in an email?",
        "options": [
            {"id": "a", "text": "Ignore it and continue browsing"},
            {"id": "b", "text": "Immediately disconnect from the internet and scan your device"},
            {"id": "c", "text": "Click it again to see what happens"},
            {"id": "d", "text": "Share the link with friends"}
        ],
        "correctOptionId": "b",
        "explanation": "Disconnecting and scanning helps prevent malware from spreading or data from being stolen."
    },
    {
        "id": f"q{new_id+1}",
        "category": random.choice(categories),
        "difficulty": "easy",
        "question": "What is two-factor authentication (2FA)?",
        "options": [
            {"id": "a", "text": "Using two different passwords"},
            {"id": "b", "text": "A second layer of security requiring something you know and something you have"},
            {"id": "c", "text": "Logging in twice"},
            {"id": "d", "text": "Using two different email addresses"}
        ],
        "correctOptionId": "b",
        "explanation": "2FA adds an extra verification step beyond your password, such as a code sent to your phone."
    },
    {
        "id": f"q{new_id+2}",
        "category": random.choice(categories),
        "difficulty": "easy",
        "question": "Which browser indicator shows a secure connection?",
        "options": [
            {"id": "a", "text": "A red X"},
            {"id": "b", "text": "A lock icon"},
            {"id": "c", "text": "A warning triangle"},
            {"id": "d", "text": "No indicator"}
        ],
        "correctOptionId": "b",
        "explanation": "A lock icon indicates HTTPS encryption, meaning data is encrypted in transit."
    },
    {
        "id": f"q{new_id+3}",
        "category": random.choice(categories),
        "difficulty": "easy",
        "question": "What is a firewall?",
        "options": [
            {"id": "a", "text": "A physical wall around a building"},
            {"id": "b", "text": "Software or hardware that blocks unauthorized network access"},
            {"id": "c", "text": "A type of antivirus"},
            {"id": "d", "text": "A password protection system"}
        ],
        "correctOptionId": "b",
        "explanation": "A firewall monitors and controls incoming and outgoing network traffic based on security rules."
    },
    {
        "id": f"q{new_id+4}",
        "category": random.choice(categories),
        "difficulty": "easy",
        "question": "Why should you log out of accounts on shared computers?",
        "options": [
            {"id": "a", "text": "To save electricity"},
            {"id": "b", "text": "To prevent others from accessing your account"},
            {"id": "c", "text": "To speed up the computer"},
            {"id": "d", "text": "It's not necessary"}
        ],
        "correctOptionId": "b",
        "explanation": "Logging out prevents unauthorized access to your accounts and personal information."
    }
]

# Medium questions (87 more needed)
medium_questions = [
    {
        "id": f"q{new_id+5}",
        "category": random.choice(categories),
        "difficulty": "medium",
        "question": "What is the principle of least privilege?",
        "options": [
            {"id": "a", "text": "Giving users maximum access for convenience"},
            {"id": "b", "text": "Granting users only the minimum access necessary for their role"},
            {"id": "c", "text": "Requiring complex passwords"},
            {"id": "d", "text": "Using multiple authentication factors"}
        ],
        "correctOptionId": "b",
        "explanation": "Least privilege limits access rights to only what is essential, reducing attack surface."
    },
    {
        "id": f"q{new_id+6}",
        "category": random.choice(categories),
        "difficulty": "medium",
        "question": "What is a zero-day vulnerability?",
        "options": [
            {"id": "a", "text": "A vulnerability that has been fixed"},
            {"id": "b", "text": "A previously unknown vulnerability with no patch available"},
            {"id": "c", "text": "A vulnerability that only affects zero systems"},
            {"id": "d", "text": "A vulnerability that expires after zero days"}
        ],
        "correctOptionId": "b",
        "explanation": "Zero-day vulnerabilities are unknown to vendors, making them particularly dangerous as no patch exists."
    }
]

# Hard questions (100 needed)
hard_questions = [
    {
        "id": f"q{new_id+7}",
        "category": random.choice(categories),
        "difficulty": "hard",
        "question": "In a penetration test, what is the difference between black-box and white-box testing?",
        "options": [
            {"id": "a", "text": "Black-box has no prior knowledge; white-box has full system knowledge"},
            {"id": "b", "text": "They are the same thing"},
            {"id": "c", "text": "Black-box tests only web applications"},
            {"id": "d", "text": "White-box tests only network infrastructure"}
        ],
        "correctOptionId": "a",
        "explanation": "Black-box testing simulates an external attacker with no internal knowledge, while white-box testing uses full system documentation and access."
    }
]

print(f"Generated sample questions. Need to create {93-len(easy_questions)} more easy, {87-len(medium_questions)} more medium, and {100-len(hard_questions)} more hard questions.")

