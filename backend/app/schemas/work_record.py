from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class WorkRecordBase(BaseModel):
    project_id: str
    title: str
    summary: str
    problem_statement: str
    technical_decision: str
    outcome: str
    artifact_url: Optional[str] = None

class WorkRecordCreate(WorkRecordBase):
    id: Optional[str] = None

class WorkRecordResponse(WorkRecordBase):
    id: str
    project_name: Optional[str] = None
    project_code: Optional[str] = None
    created_at: datetime
    contribution_count: int = 0

    model_config = ConfigDict(from_attributes=True)
