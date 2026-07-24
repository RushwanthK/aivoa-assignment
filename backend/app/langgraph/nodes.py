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

    complaint["severity"] = risk["severity"]
    complaint["priority"] = risk["priority"]

    complaint["risk_summary"] = risk["risk_summary"]
    complaint["suggested_action"] = risk["suggested_action"]

    return {

        "complaint": complaint,

        "risk": risk

    }