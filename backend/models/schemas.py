from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ChatMessageDTO(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=8_000)


class ChatRequestDTO(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    session_id: str | None = Field(default=None, min_length=1, max_length=128)
    message: str = Field(min_length=1, max_length=8_000)
    history: list[ChatMessageDTO] = Field(default_factory=list, max_length=39)


class ChatResponseDTO(BaseModel):
    session_id: str | None = None
    reply: str
