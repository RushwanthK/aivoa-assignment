import json

from groq import Groq

from app.config import settings


client = Groq(
    api_key=settings.GROQ_API_KEY
)


def extract_complaint_details(text: str):

    prompt = f"""
You are a pharmaceutical Quality Management System (QMS) assistant.

Extract information from the complaint.

Return ONLY valid JSON.

If information is unavailable, return an empty string.

Do not include markdown.
Do not include explanations.
Do not include code fences.

Rules:

- complaint_source should be the type of customer (Pharmacy, Hospital, Distributor, Patient, etc.)
- customer_name should be the organization or customer name.
- product_strength should include units (e.g. 500 mg)
- affected_quantity should include units (e.g. 12 capsules)
- complaint_description should be a short summary.
- complaint_type should be one or two words.
- Infer severity as Low, Medium or High.
- Infer priority as Low, Medium or High.

Fields:

complaint_source

customer_name

product_name

product_strength

batch_number

manufacturing_date

expiry_date

affected_quantity

complaint_type

complaint_description

severity

priority

Complaint:

{text}
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

def update_complaint_fields(message: str, current_data: dict):

    prompt = f"""
You are an AI assistant helping users edit a pharmaceutical complaint form.

Current complaint:

{json.dumps(current_data, indent=2)}

User instruction:

{message}

Return ONLY valid JSON.

Format:

{{
    "updates": {{
        ...
    }},
    "reply": "..."
}}

Rules:

- Only include fields that must change.
- Never return unchanged fields.
- Never invent values.
- Keep existing data unless explicitly modified.
- Reply should briefly confirm what changed.

Do not include markdown.
Do not include explanations.
Do not include code fences.
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