from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from app.database import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)

    complaint_source = Column(String(100))
    customer_name = Column(String(255))

    product_name = Column(String(255))
    product_strength = Column(String(100))

    batch_number = Column(String(100))

    manufacturing_date = Column(String(100))
    expiry_date = Column(String(100))

    affected_quantity = Column(String(100))

    complaint_type = Column(String(255))

    complaint_description = Column(Text)

    severity = Column(String(50))

    priority = Column(String(50))

    status = Column(String(50), default="Pending")

    created_at = Column(DateTime(timezone=True), server_default=func.now())