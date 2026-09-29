import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct

from app.database import get_db
from app.models import Project, Person, Contribution, WorkRecord
from app.schemas.project import ProjectResponse, ProjectCreate

router = APIRouter()

@router.get("/projects", response_model=List[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    results = []
    for proj in projects:
        lead_name = proj.project_lead.name if proj.project_lead else None
        lead_role = proj.project_lead.role if proj.project_lead else None
        
        # Distinct contributors who actually produced work/contributions
        contributor_count = db.query(distinct(Contribution.person_id)).filter(
            Contribution.project_id == proj.id
        ).count()
        
        contrib_count = db.query(Contribution).filter(
            Contribution.project_id == proj.id
        ).count()
        
        work_record_count = db.query(WorkRecord).filter(
            WorkRecord.project_id == proj.id
        ).count()

        results.append(ProjectResponse(
            id=proj.id,
            name=proj.name,
            code=proj.code,
            description=proj.description,
            status=proj.status,
            project_lead_id=proj.project_lead_id,
            project_lead_name=lead_name,
            project_lead_role=lead_role,
            created_at=proj.created_at,
            contributor_count=contributor_count,
            contribution_count=contrib_count,
            work_record_count=work_record_count
        ))
    return results

@router.post("/projects", response_model=ProjectResponse, status_code=201)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    existing = db.query(Project).filter(Project.code == payload.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Project code already exists")

    proj_id = payload.id or f"proj_{uuid.uuid4().hex[:8]}"
    new_project = Project(
        id=proj_id,
        name=payload.name,
        code=payload.code,
        description=payload.description,
        status=payload.status,
        project_lead_id=payload.project_lead_id
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    lead_name = new_project.project_lead.name if new_project.project_lead else None
    lead_role = new_project.project_lead.role if new_project.project_lead else None

    return ProjectResponse(
        id=new_project.id,
        name=new_project.name,
        code=new_project.code,
        description=new_project.description,
        status=new_project.status,
        project_lead_id=new_project.project_lead_id,
        project_lead_name=lead_name,
        project_lead_role=lead_role,
        created_at=new_project.created_at,
        contributor_count=0,
        contribution_count=0,
        work_record_count=0
    )
