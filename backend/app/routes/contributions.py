import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Contribution, Person, Project, Team, WorkRecord
from app.schemas.contribution import ContributionResponse, ContributionCreate

router = APIRouter()

@router.get("/contributions", response_model=List[ContributionResponse])
def list_contributions(
    project_id: Optional[str] = Query(None),
    person_id: Optional[str] = Query(None),
    team_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Contribution)
    if project_id:
        query = query.filter(Contribution.project_id == project_id)
    if person_id:
        query = query.filter(Contribution.person_id == person_id)
    if team_id:
        query = query.filter(Contribution.team_id == team_id)

    contributions = query.order_by(Contribution.created_at.desc()).all()
    results = []
    for c in contributions:
        person_name = c.person.name if c.person else "Unknown"
        person_role = c.person.role if c.person else "Contributor"
        project_name = c.project.name if c.project else "Unknown Project"
        project_code = c.project.code if c.project else "PRJ"
        lead_name = c.project.project_lead.name if (c.project and c.project.project_lead) else None
        is_lead = bool(c.project and c.project.project_lead_id == c.person_id)
        team_name = c.team.name if c.team else (c.person.team.name if (c.person and c.person.team) else None)

        results.append(ContributionResponse(
            id=c.id,
            person_id=c.person_id,
            project_id=c.project_id,
            work_record_id=c.work_record_id,
            team_id=c.team_id,
            title=c.title,
            contribution_type=c.contribution_type,
            problem_solved=c.problem_solved,
            technical_decision=c.technical_decision,
            outcome=c.outcome,
            artifact_reference=c.artifact_reference,
            collaborators=c.collaborators,
            person_name=person_name,
            person_role=person_role,
            project_name=project_name,
            project_code=project_code,
            project_lead_name=lead_name,
            is_lead=is_lead,
            team_name=team_name,
            created_at=c.created_at
        ))
    return results

@router.post("/contributions", response_model=ContributionResponse, status_code=201)
def create_contribution(payload: ContributionCreate, db: Session = Depends(get_db)):
    person = db.query(Person).filter(Person.id == payload.person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")

    project = db.query(Project).filter(Project.id == payload.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    team_id = payload.team_id or person.team_id

    contrib_id = payload.id or f"contrib_{uuid.uuid4().hex[:8]}"
    new_contrib = Contribution(
        id=contrib_id,
        person_id=payload.person_id,
        project_id=payload.project_id,
        work_record_id=payload.work_record_id,
        team_id=team_id,
        title=payload.title,
        contribution_type=payload.contribution_type,
        problem_solved=payload.problem_solved,
        technical_decision=payload.technical_decision,
        outcome=payload.outcome,
        artifact_reference=payload.artifact_reference,
        collaborators=payload.collaborators
    )
    db.add(new_contrib)
    db.commit()
    db.refresh(new_contrib)

    team_name = new_contrib.team.name if new_contrib.team else None
    lead_name = project.project_lead.name if project.project_lead else None
    is_lead = bool(project.project_lead_id == person.id)

    return ContributionResponse(
        id=new_contrib.id,
        person_id=new_contrib.person_id,
        project_id=new_contrib.project_id,
        work_record_id=new_contrib.work_record_id,
        team_id=new_contrib.team_id,
        title=new_contrib.title,
        contribution_type=new_contrib.contribution_type,
        problem_solved=new_contrib.problem_solved,
        technical_decision=new_contrib.technical_decision,
        outcome=new_contrib.outcome,
        artifact_reference=new_contrib.artifact_reference,
        collaborators=new_contrib.collaborators,
        person_name=person.name,
        person_role=person.role,
        project_name=project.name,
        project_code=project.code,
        project_lead_name=lead_name,
        is_lead=is_lead,
        team_name=team_name,
        created_at=new_contrib.created_at
    )
