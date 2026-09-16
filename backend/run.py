#!/usr/bin/env python3
"""
FastAPI Development & Production Server Runner.
"""
import sys
from pathlib import Path

# Force UTF-8 on Windows terminals
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import uvicorn

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.config import settings

if __name__ == "__main__":
    print(f"[SERVER] Starting Sarweshwar Portfolio RAG API on http://{settings.host}:{settings.port}")
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )
