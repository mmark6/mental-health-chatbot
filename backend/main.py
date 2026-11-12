import logging
import os
from pathlib import Path
from pickle import TRUE

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool

if __package__:
    from .domain.entities import ConversationMessage
    from .models.schemas import ChatRequestDTO, ChatResponseDTO
    from .services.chat_service import (
        ChatbotConfigurationError,
        ChatbotProviderError,
        ChatbotUnavailableError,
        generate_chat_response,
    )
else:
    from domain.entities import ConversationMessage
    from models.schemas import ChatRequestDTO, ChatResponseDTO
    from services.chat_service import (
        ChatbotConfigurationError,
        ChatbotProviderError,
        ChatbotUnavailableError,
        generate_chat_response,
    )

logger = logging.getLogger(__name__)
load_dotenv(Path(__file__).with_name(".env"), override=False)

app = FastAPI(title="Kindred Mental Health Support API")

origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(origins),
    allow_credentials=TRUE,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.post("/api/chat", response_model=ChatResponseDTO)
async def chat_endpoint(request: ChatRequestDTO) -> ChatResponseDTO:
    try:
        reply = await run_in_threadpool(
            generate_chat_response,
            request.message,
            [
                ConversationMessage(role=message.role, content=message.content)
                for message in request.history
            ],
        )
    except ChatbotConfigurationError as exc:
        logger.error("Chat provider is not configured: %s", exc)
        raise HTTPException(
            status_code=503,
            detail="The support service is taking a break. Please try again later.",
        ) from exc
    except ChatbotUnavailableError as exc:
        logger.warning("Chat provider is temporarily unavailable: %s", exc)
        raise HTTPException(
            status_code=503,
            detail="The support service is taking a break. Please try again shortly.",
        ) from exc
    except ChatbotProviderError as exc:
        logger.error("Chat provider request failed: %s", exc)
        raise HTTPException(
            status_code=503,
            detail="The support service is taking a break. Please try again shortly.",
        ) from exc
    except Exception:
        logger.exception("Unexpected error while generating a chat response")
        raise HTTPException(
            status_code=500,
            detail="We couldn't prepare a response just now. Please try again.",
        ) from None

    return ChatResponseDTO(session_id=request.session_id, reply=reply)
