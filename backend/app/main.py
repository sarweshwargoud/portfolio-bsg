import logging
from typing import Any
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from app.config import settings
from app.rag.retrieval import generate_rag_response
from app.rag.ingestion import ingest_portfolio_knowledge

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Sarweshwar Portfolio RAG API",
    version="1.0.0",
    description="Production-ready FastAPI backend with Supabase pgvector and Gemini LLM."
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    id: int | str | None = None
    text: str
    isBot: bool

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: list[ChatMessage] = Field(default_factory=list)

class SourceItem(BaseModel):
    id: str
    title: str
    similarity: float

class ChatResponse(BaseModel):
    reply: str
    sources: list[SourceItem] = Field(default_factory=list)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Sarweshwar Portfolio RAG API",
        "database": "Supabase pgvector (768-dim)",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    """Health check validating configuration."""
    return {
        "status": "healthy",
        "supabase_url": settings.supabase_url,
        "embedding_model": settings.embedding_model,
        "embedding_dimension": settings.embedding_dimension,
        "llm_model": settings.llm_model
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Main chat endpoint:
    Processes user query -> generates query embedding -> searches Supabase pgvector
    -> builds RAG context -> queries Gemini LLM with dynamic tone matching.
    """
    user_query = request.message.strip()
    if not user_query:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty."
        )

    try:
        history_dicts = [
            {"isBot": msg.isBot, "text": msg.text}
            for msg in request.history
        ]
        result = generate_rag_response(user_query, history_dicts)
        return ChatResponse(
            reply=result["reply"],
            sources=result["sources"]
        )
    except Exception as e:
        logger.error(f"Unhandled error in chat endpoint: {e}", exc_info=True)
        return ChatResponse(
            reply="I couldn't retrieve the relevant portfolio information right now. Please try again in a moment.",
            sources=[]
        )

@app.post("/api/ingest")
async def trigger_ingestion():
    """Trigger portfolio knowledge ingestion into Supabase pgvector."""
    try:
        summary = ingest_portfolio_knowledge()
        return summary
    except Exception as e:
        logger.error(f"Ingestion failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ingestion failed: {str(e)}"
        )
