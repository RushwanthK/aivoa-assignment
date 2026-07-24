from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintCreate

router = APIRouter(prefix="/complaints", tags=["Complaints"])


@router.post("/")
def save_complaint(
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


@router.get("/")
def get_all_complaints(db: Session = Depends(get_db)):

    return db.query(Complaint).all()