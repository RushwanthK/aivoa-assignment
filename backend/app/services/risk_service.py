import json

from app.services.groq_client import call_llm_json


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

    return call_llm_json(prompt)
