from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.orm import relationship

from app.database import Base

class Team(Base):
    __tablename__ = "teams"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False, unique=True)
    department = Column(String(128), nullable=False)
    mission = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    members = relationship("Person", back_populates="team", cascade="all, delete-orphan")
    contributions = relationship("Contribution", back_populates="team")
