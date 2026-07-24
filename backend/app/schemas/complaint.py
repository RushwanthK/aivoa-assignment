from pydantic import BaseModel
from typing import Optional


class ComplaintBase(BaseModel):
    complaint_source: Optional[str] = ""
    customer_name: Optional[str] = ""

    product_name: Optional[str] = ""
    product_strength: Optional[str] = ""

    batch_number: Optional[str] = ""

    manufacturing_date: Optional[str] = ""
    expiry_date: Optional[str] = ""

    affected_quantity: Optional[str] = ""

    complaint_type: Optional[str] = ""

    complaint_description: Optional[str] = ""

    severity: Optional[str] = ""
    priority: Optional[str] = ""


class ComplaintCreate(ComplaintBase):
    pass


class ComplaintResponse(ComplaintBase):
    id: int
    status: str

    class Config:
        from_attributes = True