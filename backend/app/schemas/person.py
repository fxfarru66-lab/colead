from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class PersonBase(BaseModel):
    name: str
    email: str
    role: str
    title: Optional[str] = None
    team_id: Optional[str] = None

class PersonCreate(PersonBase):
    id: Optional[str] = None

class PersonResponse(PersonBase):
    id: str
    team_name: Optional[str] = None
    created_at: datetime
    contribution_count: int = 0
    projects_led_count: int = 0

    model_config = ConfigDict(from_attributes=True)
