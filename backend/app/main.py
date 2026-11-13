import shutil
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.endpoints import reports
from app.models.schemas import HealthResponse

logging.basicConfig(
    level=logging.INFO if not settings.debug else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("reportsaathi")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting ReportSaathi API...")
    tess_path = shutil.which(settings.tesseract_cmd)
    logger.info(f"Tesseract OCR status: {'Available at ' + tess_path if tess_path else 'Not found in PATH'}")
    logger.info(f"Gemini configured: {bool(settings.gemini_api_key and settings.gemini_api_key.lower() not in ['', 'mock', 'none'])}")
    logger.info(f"Supabase configured: {bool(settings.supabase_url and settings.supabase_key)}")
    logger.info(f"Telegram bot configured: {bool(settings.telegram_bot_token)}")
    yield
    logger.info("ReportSaathi API stopped.")

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Empathetic, clear, educational explanations of medical laboratory reports.",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["General"])
async def root():
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "purpose": "Educational medical laboratory report simplification",
        "docs_url": "/docs",
        "health_check": "/api/health"
    }

def get_health_status() -> HealthResponse:
    tesseract_available = bool(shutil.which(settings.tesseract_cmd))
    return HealthResponse(
        status="healthy",
        app=settings.app_name,
        version=settings.app_version,
        tesseract_available=tesseract_available,
        gemini_configured=bool(settings.gemini_api_key and settings.gemini_api_key.lower() not in ["", "mock", "none"]),
        supabase_configured=bool(settings.supabase_url and settings.supabase_key),
        telegram_bot_configured=bool(settings.telegram_bot_token)
    )

@app.get("/health", response_model=HealthResponse, tags=["General"])
async def health_check():
    return get_health_status()

@app.get("/api/health", response_model=HealthResponse, tags=["General"])
async def api_health_check():
    return get_health_status()

# Include routers at /api/reports and /api/v1/reports for backwards and forwards compatibility
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports v1"])
