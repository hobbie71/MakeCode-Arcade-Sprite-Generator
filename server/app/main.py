from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import logging
import os
from pathlib import Path
from typing import List

from .routers import sprites
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

print("settings.CORS_ORIGINS", settings.CORS_ORIGINS)
print("settings.PIXELLAB_API_KEY", settings.PIXELLAB_API_KEY)
print("settings.OPENAI_API_KEY", settings.OPENAI_API_KEY)


# Include routers
app.include_router(sprites.router, prefix="/generate-image", tags=["generate-image"])

# Serve static files from client build
client_dist_path = Path(__file__).parent.parent.parent / "client" / "dist"
if client_dist_path.exists():
    app.mount("/static", StaticFiles(directory=str(client_dist_path / "assets")), name="static")
    app.mount("/", StaticFiles(directory=str(client_dist_path), html=True), name="spa")

@app.get("/")
async def root():
    # If client dist exists, serve the SPA, otherwise show API info
    if client_dist_path.exists():
        return FileResponse(str(client_dist_path / "index.html"))
    return {"message": "MakeCode Arcade Sprite Generator API", "version": "0.1.0"}

@app.exception_handler(404)
async def not_found_handler(request, exc):
    # For SPA routing, serve index.html for non-API routes
    if client_dist_path.exists() and not str(request.url.path).startswith("/generate-image"):
        return FileResponse(str(client_dist_path / "index.html"))
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
