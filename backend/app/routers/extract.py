from fastapi import APIRouter
from fastapi import File
from fastapi import HTTPException
from fastapi import Request
from fastapi import UploadFile

from pydantic import BaseModel
from pydantic import Field

from app.config import settings
from app.langgraph.graph import complaint_graph
from app.rate_limit import limiter
from app.services.pdf_service import extract_text_from_pdf

router = APIRouter()


class ComplaintText(BaseModel):
    text: str = Field(min_length=1, max_length=settings.MAX_TEXT_CHARS)


def run_complaint_graph(text: str) -> dict:
    state = complaint_graph.invoke({"text": text})
    return state["complaint"]


# Sync endpoints: FastAPI runs them in a worker thread, so the blocking LLM
# calls don't stall other requests.

@router.post("/extract/text")
@limiter.limit(settings.RATE_LIMIT_AI)
def extract_text(request: Request, data: ComplaintText):

    return run_complaint_graph(data.text)


@router.post("/extract/pdf")
@limiter.limit(settings.RATE_LIMIT_AI)
def extract_pdf(request: Request, file: UploadFile = File(...)):

    if not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )

    max_bytes = settings.MAX_PDF_MB * 1024 * 1024
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    if size > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"PDF is too large. Maximum size is {settings.MAX_PDF_MB} MB."
        )

    try:
        text = extract_text_from_pdf(file.file)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Could not read this PDF. Please upload a valid, text-based PDF."
        )

    if not text.strip():
        raise HTTPException(
            status_code=422,
            detail="No text found in this PDF. Scanned/image-only PDFs are not supported yet."
        )

    return run_complaint_graph(text[: settings.MAX_TEXT_CHARS])
