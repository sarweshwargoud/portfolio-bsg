#!/usr/bin/env python3
"""
CLI Ingestion Script:
Embeds and ingests portfolio documents into Supabase PostgreSQL + pgvector.
"""
import sys
from pathlib import Path

# Force UTF-8 on Windows terminals
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.rag.ingestion import ingest_portfolio_knowledge

if __name__ == "__main__":
    print("[INGEST] Starting Portfolio Knowledge Ingestion into Supabase pgvector...")
    result = ingest_portfolio_knowledge()
    print("\n[INGEST RESULTS]")
    print(f"  * Total Documents: {result.get('total_documents')}")
    print(f"  * Total Chunks: {result.get('total_chunks')}")
    print(f"  * Unmodified/Skipped: {result.get('skipped_unmodified')}")
    print("[SUCCESS] Knowledge base is ready for production RAG vector similarity search!")
