from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    code = Column(String(32), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=False)
    status = Column(String(32), default="Active", nullable=False)  # Active, Completed, Paused
    
    # Ownership is NOT the same as contribution:
    project_lead_id = Column(String(64), ForeignKey("people.id", ondelete="SET NULL"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    project_lead = relationship("Person", back_populates="led_projects")
    contributions = relationship("Contribution", back_populates="project", cascade="all, delete-orphan")
    work_records = relationship("WorkRecord", back_populates="project", cascade="all, delete-orphan")
