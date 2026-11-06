from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI(title="Mental Health Chatbot API")

# Allow React frontend to communicate with this FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace "*" with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 1. Domain Layer: DTOs & Schemas
# ==========================================

class MoodRecord(BaseModel):
    user_id: str
    mood_score: int  # 1 (very low) to 5 (excellent)
    notes: Optional[str] = None
    timestamp: datetime = datetime.now()
    account_type: str # 'freemium', 'university', 'workplace', 'ngo'

class ChatRequest(BaseModel):
    user_id: str
    message: str
    account_type: str 

class ChatResponse(BaseModel):
    reply: str
    resources: List[str] = []

# ==========================================
# 2. Service Layer: Business Logic
# ==========================================

class ChatService:
    @staticmethod
    def process_message(request: ChatRequest) -> ChatResponse:
        # Rule-based logic placeholder for future lightweight LLM integration
        user_message = request.message.lower()
        
        reply = "I'm here to listen. Tell me more about how you're feeling."
        resources = []

        if "anxious" in user_message or "panic" in user_message:
            reply = "It sounds like you're experiencing anxiety. Try taking a deep breath: inhale for 4 seconds, hold for 4, exhale for 6."
            resources.append("Local Anxiety Hotline: 0800-123-456")
        elif "depressed" in user_message or "sad" in user_message:
            reply = "I'm sorry you're feeling this way. It's important to talk to someone who can support you."
            resources.append("National Counselling Service: 0800-987-654")

        # Business Logic: Institutional license tiering
        if request.account_type in ["university", "workplace"]:
            resources.append(f"Premium {request.account_type.capitalize()} Resource: Book a 1-on-1 counselor session via your portal.")

        return ChatResponse(reply=reply, resources=resources)

class MoodService:
    @staticmethod
    def save_mood(record: MoodRecord) -> dict:
        # Placeholder for database saving (e.g., PostgreSQL/MongoDB)
        return {"status": "success", "message": "Mood logged successfully."}

# ==========================================
# 3. Controller Layer: API Routing
# ==========================================

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        return ChatService.process_message(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/mood")
async def log_mood(record: MoodRecord):
    try:
        return MoodService.save_mood(record)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    