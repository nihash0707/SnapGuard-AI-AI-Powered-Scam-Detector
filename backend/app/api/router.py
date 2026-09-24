from fastapi import APIRouter
from app.api.analyze import router as analyze_router
from app.api.system import router as system_router
from app.api.history import router as history_router
from app.api.export import router as export_router

api_router = APIRouter()
api_router.include_router(system_router)
api_router.include_router(analyze_router)
api_router.include_router(history_router)
api_router.include_router(export_router)
