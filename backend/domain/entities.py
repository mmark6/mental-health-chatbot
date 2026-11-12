from dataclasses import dataclass
from typing import Literal


@dataclass(frozen=True)
class ConversationMessage:
    role: Literal["user", "assistant"]
    content: str
