import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Person, Team, Contribution, Project
from app.schemas.person import PersonResponse, PersonCreate

router = APIRouter()

@router.get("/people", response_model=List[PersonResponse])
def list_people(db: Session = Depends(get_db)):
    people = db.query(Person).all()
    results = []
    for person in people:
        team_name = person.team.name if person.team else None
        contrib_count = db.query(Contribution).filter(Contribution.person_id == person.id).count()
        led_count = db.query(Project).filter(Project.project_lead_id == person.id).count()
        results.append(PersonResponse(
            id=person.id,
            name=person.name,
            email=person.email,
            role=person.role,
            title=person.title,
            team_id=person.team_id,
            team_name=team_name,
            created_at=person.created_at,
            contribution_count=contrib_count,
            projects_led_count=led_count
        ))
    return results

@router.post("/people", response_model=PersonResponse, status_code=201)
def create_person(payload: PersonCreate, db: Session = Depends(get_db)):
    existing = db.query(Person).filter(Person.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Person with this email already exists")
    
    person_id = payload.id or f"person_{uuid.uuid4().hex[:8]}"
    new_person = Person(
        id=person_id,
        name=payload.name,
        email=payload.email,
        role=payload.role,
        title=payload.title,
        team_id=payload.team_id
    )
    db.add(new_person)
    db.commit()
    db.refresh(new_person)
    team_name = new_person.team.name if new_person.team else None
    return PersonResponse(
        id=new_person.id,
        name=new_person.name,
        email=new_person.email,
        role=new_person.role,
        title=new_person.title,
        team_id=new_person.team_id,
        team_name=team_name,
        created_at=new_person.created_at,
        contribution_count=0,
        projects_led_count=0
    )
