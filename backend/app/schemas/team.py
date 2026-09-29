from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class TeamBase(BaseModel):
    name: str
    department: str
    mission: Optional[str] = None

class TeamCreate(TeamBase):
    id: Optional[str] = None

class TeamResponse(TeamBase):
    id: str
    created_at: datetime
    member_count: int = 0
    contribution_count: int = 0

    model_config = ConfigDict(from_attributes=True)
