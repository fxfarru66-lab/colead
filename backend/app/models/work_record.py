from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base

class WorkRecord(Base):
    """
    WorkRecord represents a milestone, architectural unit, or feature initiative
    within a project that embodies organizational learning.
    """
    __tablename__ = "work_records"

    id = Column(String(64), primary_key=True, index=True)
    project_id = Column(String(64), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    problem_statement = Column(Text, nullable=False)
    technical_decision = Column(Text, nullable=False)
    outcome = Column(Text, nullable=False)
    artifact_url = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    project = relationship("Project", back_populates="work_records")
    contributions = relationship("Contribution", back_populates="work_record")
    memory_references = relationship("MemoryReference", back_populates="work_record")
