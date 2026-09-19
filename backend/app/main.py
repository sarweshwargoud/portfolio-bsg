import logging
from typing import Any
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from app.config import settings
from app.rag.retrieval import generate_rag_response, log_chat_to_supabase
from app.rag.ingestion import ingest_portfolio_knowledge
from app.services.contact import process_contact_submission

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
    session_id: str | None = None
    metadata: dict[str, Any] | None = None

class SourceItem(BaseModel):
    id: str
    title: str
    similarity: float

class ChatResponse(BaseModel):
    reply: str
    sources: list[SourceItem] = Field(default_factory=list)

class LogChatRequest(BaseModel):
    user_query: str
    bot_response: str
    sources: list[dict[str, Any]] | list[Any] = Field(default_factory=list)
    session_id: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)

class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=255, pattern=r"^[^@]+@[^@]+\.[^@]+$")
    phone: str | None = Field(default=None, max_length=30)
    subject: str = Field(..., min_length=2, max_length=200)
    message: str = Field(..., min_length=2, max_length=5000)
    hp_field: str | None = Field(default=None, max_length=100)

class ContactResponse(BaseModel):
    success: bool
    message: str

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
    -> builds RAG context -> queries Gemini LLM with dynamic tone matching
    -> logs user query & bot response to Supabase chat_logs table in real-time.
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
        
        # Real-time log to Supabase chat_logs table (live table sheet)
        try:
            client_meta = request.metadata or {}
            client_meta.update({
                "llm_model": settings.llm_model,
                "source_count": len(result.get("sources", []))
            })
            log_chat_to_supabase(
                user_query=user_query,
                bot_response=result["reply"],
                sources=result.get("sources", []),
                session_id=request.session_id,
                metadata=client_meta
            )
        except Exception as log_err:
            logger.warning(f"Background chat logging failed: {log_err}")

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

@app.post("/api/chat/log")
async def log_chat_endpoint(request: LogChatRequest):
    """
    Explicit endpoint to log user query and bot response to Supabase chat_logs table.
    Ensures interactions are recorded even when client fallback mechanisms are used.
    """
    success = log_chat_to_supabase(
        user_query=request.user_query,
        bot_response=request.bot_response,
        sources=request.sources,
        session_id=request.session_id,
        metadata=request.metadata
    )
    return {"status": "logged" if success else "failed"}

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

@app.post("/api/contact", response_model=ContactResponse)
async def contact_endpoint(contact_data: ContactRequest, request: Request):
    """
    Production-ready contact submission endpoint:
    1. Validates visitor inputs server-side
    2. Honeypot check for bots
    3. Rate-limits requests per client IP
    4. Persists contact submission in Supabase
    5. Dispatches Gmail notification to Sarweshwar with Reply-To visitor
    6. Sends personalized thank-you greeting to visitor
    """
    # Extract client IP supporting proxies
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        client_ip = forwarded_for.split(",")[0].strip()
    else:
        client_ip = request.client.host if request.client else "unknown"

    user_agent = request.headers.get("user-agent", "")

    result = process_contact_submission(
        name=contact_data.name,
        email=contact_data.email,
        phone=contact_data.phone,
        subject=contact_data.subject,
        message=contact_data.message,
        hp_field=contact_data.hp_field,
        client_ip=client_ip,
        user_agent=user_agent,
    )

    return ContactResponse(
        success=result["success"],
        message=result["message"]
    )

