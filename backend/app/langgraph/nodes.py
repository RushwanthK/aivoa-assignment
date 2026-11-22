from typing import TypedDict

from app.services.llm_service import extract_complaint_details
from app.services.risk_service import generate_risk_assessment


class ComplaintState(TypedDict):

    text: str

    complaint: dict

    risk: dict


def extract_node(state: ComplaintState):

    complaint = extract_complaint_details(
        state["text"]
    )

    return {

        "complaint": complaint

    }

def risk_node(state: ComplaintState):

    risk = generate_risk_assessment(
        state["complaint"]
    )

    complaint = state["complaint"]

    # Keep the extraction's values if the risk step omits a field.
    for field in ("severity", "priority", "risk_summary", "suggested_action"):
        complaint[field] = risk.get(field) or complaint.get(field, "")

    return {

        "complaint": complaint,

        "risk": risk

    }