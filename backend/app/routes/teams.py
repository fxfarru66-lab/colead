import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Team, Person, Contribution
from app.schemas.team import TeamResponse, TeamCreate

router = APIRouter()

@router.get("/teams", response_model=List[TeamResponse])
def list_teams(db: Session = Depends(get_db)):
    teams = db.query(Team).all()
    results = []
    for team in teams:
        member_count = db.query(Person).filter(Person.team_id == team.id).count()
        contribution_count = db.query(Contribution).filter(Contribution.team_id == team.id).count()
        results.append(TeamResponse(
            id=team.id,
            name=team.name,
            department=team.department,
            mission=team.mission,
            created_at=team.created_at,
            member_count=member_count,
            contribution_count=contribution_count
        ))
    return results

@router.post("/teams", response_model=TeamResponse, status_code=201)
def create_team(payload: TeamCreate, db: Session = Depends(get_db)):
    team_id = payload.id or f"team_{uuid.uuid4().hex[:8]}"
    existing = db.query(Team).filter(Team.name == payload.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Team name already exists")
    
    new_team = Team(
        id=team_id,
        name=payload.name,
        department=payload.department,
        mission=payload.mission
    )
    db.add(new_team)
    db.commit()
    db.refresh(new_team)
    return TeamResponse(
        id=new_team.id,
        name=new_team.name,
        department=new_team.department,
        mission=new_team.mission,
        created_at=new_team.created_at,
        member_count=0,
        contribution_count=0
    )
