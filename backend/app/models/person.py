from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base

class Person(Base):
    __tablename__ = "people"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    role = Column(String(128), nullable=False)  # e.g., Junior Engineer, Senior Engineer, UX Designer
    title = Column(String(128), nullable=True)
    team_id = Column(String(64), ForeignKey("teams.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    team = relationship("Team", back_populates="members")
    contributions = relationship("Contribution", back_populates="person", cascade="all, delete-orphan")
    led_projects = relationship("Project", back_populates="project_lead")
