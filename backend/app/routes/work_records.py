import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import WorkRecord, Project, Contribution
from app.schemas.work_record import WorkRecordResponse, WorkRecordCreate

router = APIRouter()

@router.get("/work-records", response_model=List[WorkRecordResponse])
def list_work_records(db: Session = Depends(get_db)):
    records = db.query(WorkRecord).order_by(WorkRecord.created_at.desc()).all()
    results = []
    for rec in records:
        proj_name = rec.project.name if rec.project else None
        proj_code = rec.project.code if rec.project else None
        c_count = db.query(Contribution).filter(Contribution.work_record_id == rec.id).count()
        results.append(WorkRecordResponse(
            id=rec.id,
            project_id=rec.project_id,
            project_name=proj_name,
            project_code=proj_code,
            title=rec.title,
            summary=rec.summary,
            problem_statement=rec.problem_statement,
            technical_decision=rec.technical_decision,
            outcome=rec.outcome,
            artifact_url=rec.artifact_url,
            created_at=rec.created_at,
            contribution_count=c_count
        ))
    return results

@router.post("/work-records", response_model=WorkRecordResponse, status_code=201)
def create_work_record(payload: WorkRecordCreate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == payload.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    record_id = payload.id or f"work_{uuid.uuid4().hex[:8]}"
    new_record = WorkRecord(
        id=record_id,
        project_id=payload.project_id,
        title=payload.title,
        summary=payload.summary,
        problem_statement=payload.problem_statement,
        technical_decision=payload.technical_decision,
        outcome=payload.outcome,
        artifact_url=payload.artifact_url
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return WorkRecordResponse(
        id=new_record.id,
        project_id=new_record.project_id,
        project_name=project.name,
        project_code=project.code,
        title=new_record.title,
        summary=new_record.summary,
        problem_statement=new_record.problem_statement,
        technical_decision=new_record.technical_decision,
        outcome=new_record.outcome,
        artifact_url=new_record.artifact_url,
        created_at=new_record.created_at,
        contribution_count=0
    )
