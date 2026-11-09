from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import joblib
import os

app = FastAPI(title="Mental Health Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 0. Load the Machine Learning Model
# ==========================================

MODEL_PATH = "intent_model.pkl"
if os.path.exists(MODEL_PATH):
    intent_classifier = joblib.load(MODEL_PATH)
    print("Machine Learning model loaded successfully.")
else:
    intent_classifier = None
    print("Warning: intent_model.pkl not found. Run train_model.py first.")

# ==========================================
# 1. Domain Layer: DTOs & Schemas
# ==========================================

class MoodRecord(BaseModel):
    user_id: str
    mood_score: int 
    notes: Optional[str] = None
    timestamp: datetime = datetime.now()
    account_type: str 

class ChatRequest(BaseModel):
    user_id: str
    message: str
    account_type: str 

class ChatResponse(BaseModel):
    reply: str
    resources: List[str] = []
    detected_topic: Optional[str] = None

# ==========================================
# 2. Service Layer: Business Logic
# ==========================================

class ChatService:
    @staticmethod
    def process_message(request: ChatRequest) -> ChatResponse:
        if not intent_classifier:
            return ChatResponse(reply="System offline for maintenance.", resources=[])

        # 1. Predict the user's intent using the trained Kaggle datasets
        predicted_intent = intent_classifier.predict([request.message])[0]
        
        reply = ""
        resources = []

        # 2. Map the dynamically predicted intent to a clinical response
        if predicted_intent == "anxiety":
            reply = "It sounds like you're experiencing anxiety. Let's try taking a deep breath: inhale for 4 seconds, hold for 4, exhale for 6."
            resources.append("Local Anxiety Hotline: 0800-123-456")
            
        elif predicted_intent == "depression":
            reply = "I'm sorry you're feeling this heavy weight right now. You aren't alone, and it's important to talk to someone who can support you."
            resources.append("National Counselling Service: 0800-987-654")
            
        elif predicted_intent == "suicidal":
            reply = "Your life is valuable, and there are people who want to support you right now. Please reach out to the emergency hotline immediately."
            resources.append("Emergency Crisis Hotline: 999 or 112")
            resources.append("24/7 Suicide Prevention Lifeline: 0800-000-000")
            
        elif predicted_intent == "stress":
            reply = "You seem under a lot of pressure. It might help to step away for 10 minutes, drink some water, and ground yourself."
            
        else:
            reply = "I hear you. Tell me a bit more about what's going on."

        # 3. Apply the institutional business logic
        if request.account_type in ["university", "workplace"]:
            resources.append(f"Premium {request.account_type.capitalize()} Resource: Book a 1-on-1 counselor session via your portal.")

        return ChatResponse(reply=reply, resources=resources, detected_topic=predicted_intent)

class MoodService:
    @staticmethod
    def save_mood(record: MoodRecord) -> dict:
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