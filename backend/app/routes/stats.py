from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct

from app.database import get_db
from app.models import Project, Team, Person, Contribution, MemoryReference, WorkRecord

router = APIRouter()

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    memories_count = db.query(MemoryReference).count() + db.query(WorkRecord).count()
    projects_count = db.query(Project).count()
    teams_count = db.query(Team).count()
    # Distinct contributors who have logged work or contributions
    contributors_count = db.query(distinct(Contribution.person_id)).count()
    if contributors_count == 0:
        contributors_count = db.query(Person).count()
    
    total_contributions = db.query(Contribution).count()

    return {
        "organizational_memories": memories_count,
        "projects": projects_count,
        "teams": teams_count,
        "contributors": contributors_count,
        "total_contributions": total_contributions,
    }
