from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base

class MemoryReference(Base):
    """
    Connects local evidence records with Hindsight Cloud memory banks.
    Stores bank ID, retained document ID, document type, and indexing status.
    """
    __tablename__ = "memory_references"

    id = Column(String(64), primary_key=True, index=True)
    contribution_id = Column(String(64), ForeignKey("contributions.id", ondelete="CASCADE"), nullable=True)
    work_record_id = Column(String(64), ForeignKey("work_records.id", ondelete="CASCADE"), nullable=True)
    
    hindsight_memory_id = Column(String(128), nullable=True, index=True)
    hindsight_bank_id = Column(String(128), nullable=True, index=True)
    document_type = Column(String(64), default="contribution_evidence", nullable=False)
    status = Column(String(32), default="pending_retain", nullable=False)  # pending_retain, retained, failed
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    contribution = relationship("Contribution", back_populates="memory_references")
    work_record = relationship("WorkRecord", back_populates="memory_references")
