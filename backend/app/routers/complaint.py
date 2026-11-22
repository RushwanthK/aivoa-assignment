from fastapi import APIRouter
from fastapi import Depends
from fastapi import Request

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.complaint import Complaint
from app.rate_limit import limiter
from app.schemas.complaint import ComplaintCreate

router = APIRouter(prefix="/complaints", tags=["Complaints"])


# Registered with and without the trailing slash so the browser never gets a
# redirect (behind an HTTPS proxy that redirect can point at http:// and fail).
@router.post("")
@router.post("/", include_in_schema=False)
@limiter.limit("20/minute")
def save_complaint(
    request: Request,
    complaint: ComplaintCreate,
    db: Session = Depends(get_db)
):

    db_complaint = Complaint(**complaint.model_dump())

    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)

    return {
        "message": "Complaint saved successfully",
        "id": db_complaint.id
    }


@router.get("")
@router.get("/", include_in_schema=False)
def get_all_complaints(db: Session = Depends(get_db)):

    # Most recent first, capped so the public demo never returns an unbounded list.
    return (
        db.query(Complaint)
        .order_by(Complaint.created_at.desc())
        .limit(100)
        .all()
    )
