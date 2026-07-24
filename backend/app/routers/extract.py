from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import HTTPException

from pydantic import BaseModel

from app.services.pdf_service import extract_text_from_pdf
from app.services.llm_service import extract_complaint_details
from app.langgraph.graph import complaint_graph

router = APIRouter()


class ComplaintText(BaseModel):
    text: str


@router.post("/extract/text")
def extract_text(data: ComplaintText):

    state = complaint_graph.invoke(

        {

            "text": data.text

        }

    )

    return state["complaint"]


@router.post("/extract/pdf")
async def extract_pdf(file: UploadFile = File(...)):

    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )

    text = extract_text_from_pdf(file.file)

    state = complaint_graph.invoke(

        {

            "text": text

        }

    )

    return state["complaint"]