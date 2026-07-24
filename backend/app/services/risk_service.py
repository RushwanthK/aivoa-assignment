import json

from groq import Groq

from app.config import settings

client = Groq(
    api_key=settings.GROQ_API_KEY
)


def generate_risk_assessment(complaint: dict):

    prompt = f"""
You are a Quality Assurance expert working in a pharmaceutical manufacturing company.

You are performing an INITIAL risk assessment for a customer complaint.

Complaint:

{json.dumps(complaint, indent=2)}

Return ONLY valid JSON.

Format:

{{
    "severity": "",
    "priority": "",
    "risk_summary": "",
    "suggested_action": ""
}}

Rules:

Severity must be one of:

Low
Medium
High
Critical

Priority must be one of:

Low
Medium
High
Critical

risk_summary should be 1-2 sentences.

suggested_action should be one short action.

Examples:

Packaging damage
→ Medium

Foreign particle
→ Critical

Wrong label
→ High

Broken tablets
→ High

Discoloration
→ Major quality issue → High

Never return markdown.
Never explain.
Only return JSON.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    content = response.choices[0].message.content

    content = content.replace("```json", "")
    content = content.replace("```", "")

    return json.loads(content)