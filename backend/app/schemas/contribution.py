from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class ContributionBase(BaseModel):
    person_id: str
    project_id: str
    work_record_id: Optional[str] = None
    team_id: Optional[str] = None
    title: str
    contribution_type: str
    problem_solved: str
    technical_decision: str
    outcome: str
    artifact_reference: Optional[str] = None
    collaborators: Optional[str] = None

class ContributionCreate(ContributionBase):
    id: Optional[str] = None

class ContributionResponse(ContributionBase):
    id: str
    person_name: str
    person_role: str
    project_name: str
    project_code: str
    project_lead_name: Optional[str] = None
    is_lead: bool = False
    team_name: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
