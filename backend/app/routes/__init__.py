from fastapi import APIRouter
from app.routes.health import router as health_router
from app.routes.teams import router as teams_router
from app.routes.projects import router as projects_router
from app.routes.people import router as people_router
from app.routes.contributions import router as contributions_router
from app.routes.work_records import router as work_records_router
from app.routes.stats import router as stats_router

api_router = APIRouter(prefix="/api")
api_router.include_router(health_router, tags=["Health"])
api_router.include_router(teams_router, tags=["Teams"])
api_router.include_router(projects_router, tags=["Projects"])
api_router.include_router(people_router, tags=["People"])
api_router.include_router(contributions_router, tags=["Contributions"])
api_router.include_router(work_records_router, tags=["Work Records"])
api_router.include_router(stats_router, tags=["Stats"])

__all__ = ["api_router"]
