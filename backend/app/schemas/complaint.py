from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import Field
from typing import Optional

# Max lengths mirror the database columns in app/models/complaint.py, so
# oversized input returns a 422 instead of a database error.


class ComplaintBase(BaseModel):
    complaint_source: Optional[str] = Field("", max_length=100)
    customer_name: Optional[str] = Field("", max_length=255)

    product_name: Optional[str] = Field("", max_length=255)
    product_strength: Optional[str] = Field("", max_length=100)

    batch_number: Optional[str] = Field("", max_length=100)

    manufacturing_date: Optional[str] = Field("", max_length=100)
    expiry_date: Optional[str] = Field("", max_length=100)

    affected_quantity: Optional[str] = Field("", max_length=100)

    complaint_type: Optional[str] = Field("", max_length=255)

    complaint_description: Optional[str] = Field("", max_length=10_000)

    severity: Optional[str] = Field("", max_length=50)
    priority: Optional[str] = Field("", max_length=50)


class ComplaintCreate(ComplaintBase):
    pass


class ComplaintResponse(ComplaintBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
