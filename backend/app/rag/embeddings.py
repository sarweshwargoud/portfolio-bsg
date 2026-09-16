import logging
import requests
from app.config import settings

logger = logging.getLogger(__name__)

def generate_embedding(text: str) -> list[float]:
    """
    Generate a 768-dimensional embedding for the input text using Gemini Embedding API.
    Uses the Matryoshka output_dimensionality=768 configuration for pgvector HNSW compatibility.
    """
    cleaned_text = text.strip()
    if not cleaned_text:
        raise ValueError("Cannot generate embedding for empty text")

    url = f"https://generativelanguage.googleapis.com/v1beta/{settings.embedding_model}:embedContent?key={settings.gemini_api_key}"
    payload = {
        "model": settings.embedding_model,
        "content": {
            "parts": [{"text": cleaned_text}]
        },
        "output_dimensionality": settings.embedding_dimension
    }

    try:
        response = requests.post(url, json=payload, timeout=15)
        response.raise_for_status()
        data = response.json()
        embedding = data.get("embedding", {}).get("values", [])

        if not embedding:
            raise ValueError("No embedding values returned in API response")

        if len(embedding) != settings.embedding_dimension:
            logger.warning(f"Expected {settings.embedding_dimension} dimensions, got {len(embedding)}")

        return embedding
    except requests.RequestException as e:
        logger.error(f"Error calling Gemini embedding API: {e}")
        # Try fallback via google.generativeai library if available
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.gemini_api_key)
            result = genai.embed_content(
                model=settings.embedding_model,
                content=cleaned_text,
                output_dimensionality=settings.embedding_dimension
            )
            return result["embedding"]
        except Exception as fallback_err:
            logger.error(f"Fallback embedding generation also failed: {fallback_err}")
            raise RuntimeError(f"Embedding generation failed: {e}") from e
