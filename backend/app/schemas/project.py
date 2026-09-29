from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class ProjectBase(BaseModel):
    name: str
    code: str
    description: str
    status: str = "Active"
    project_lead_id: Optional[str] = None

class ProjectCreate(ProjectBase):
    id: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: str
    project_lead_name: Optional[str] = None
    project_lead_role: Optional[str] = None
    created_at: datetime
    contributor_count: int = 0
    contribution_count: int = 0
    work_record_count: int = 0

    model_config = ConfigDict(from_attributes=True)
