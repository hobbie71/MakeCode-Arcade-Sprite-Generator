from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import logging
import os
from pathlib import Path
from typing import List
from starlette.middleware.base import BaseHTTPMiddleware

from .routers import image_generation, moderation ,background_removal
from .core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Server startup complete")
    yield
    # Shutdown
    logger.info("Server shutdown")

app = FastAPI(
    title="MakeCode Arcade Sprite Generator API",
    description="API for generating, converting, and managing MakeCode Arcade sprites",
    version="0.1.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LogRequestMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        print(f"Request: {request.method} {request.url} Origin: {request.headers.get('origin')}")
        return await call_next(request)

app.add_middleware(LogRequestMiddleware)

# Include routers
app.include_router(moderation.router, prefix="/moderation", tags=["moderation"])
app.include_router(image_generation.router, prefix="/generate-image", tags=["generate-image"])
# app.include_router(background_removal.router, prefix="/remove-background", tags=["remove-background"])

@app.get("/")
async def root():
    return {"message": "MakeCode Arcade Sprite Generator API", "version": "0.1.0"}

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"success": False, "error": "Endpoint not found"}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"Internal server error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Internal server error"}
    )
