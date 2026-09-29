from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base

class Contribution(Base):
    """
    Evidence-based historical contribution unit.
    Decoupled from project ownership to ensure contributors at any level
    receive permanent organizational attribution for what they actually built/solved.
    """
    __tablename__ = "contributions"

    id = Column(String(64), primary_key=True, index=True)
    person_id = Column(String(64), ForeignKey("people.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(String(64), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    work_record_id = Column(String(64), ForeignKey("work_records.id", ondelete="SET NULL"), nullable=True)
    team_id = Column(String(64), ForeignKey("teams.id", ondelete="SET NULL"), nullable=True)

    title = Column(String(255), nullable=False)
    contribution_type = Column(String(64), nullable=False)  # e.g., Implementation, Architecture, Debugging, UX Design, Reliability
    problem_solved = Column(Text, nullable=False)
    technical_decision = Column(Text, nullable=False)
    outcome = Column(Text, nullable=False)
    artifact_reference = Column(String(255), nullable=True)  # PR #, RFC link, Figma frame, commit SHA
    collaborators = Column(String(255), nullable=True)  # Comma-separated names or notes
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    person = relationship("Person", back_populates="contributions")
    project = relationship("Project", back_populates="contributions")
    work_record = relationship("WorkRecord", back_populates="contributions")
    team = relationship("Team", back_populates="contributions")
    memory_references = relationship("MemoryReference", back_populates="contribution")
