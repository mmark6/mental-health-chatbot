# Mental Health Self-Help & Peer-Support Chatbot

A full-stack, lightweight mental health chatbot designed to provide immediate peer-style support, coping mechanisms, and local resource referrals based on user emotional states. This project employs a custom Machine Learning intent classification model to analyze user text and deliver empathetic, context-aware responses alongside a daily mood-tracking system.

Built with a freemium business model in mind, the platform provides general coping strategies for public users while offering exclusive, tiered resources for institutional licenses (universities, workplaces, and NGOs).

## 🚀 Key Features

*   **AI-Powered Intent Classification**: Uses a Scikit-Learn TF-IDF and Multi-Layer Perceptron (MLP) pipeline trained on Kaggle mental health datasets to instantly detect user emotional states (e.g., anxiety, depression, stress, suicidal intent).
*   **Dynamic Resource Referral**: Automatically surfaces relevant local hotlines, grounding exercises, or premium institutional 1-on-1 counseling links based on the user's detected intent and account tier.
*   **Daily Mood Tracking**: A built-in sliding scale interface (1-5) that logs user mood metrics to the backend.
*   **Domain-Driven Design (DDD)**: The backend is cleanly structured into Domain (DTOs/Schemas), Service (Business Logic & ML Inference), and Controller (API Routing) layers.
*   **Hardware Efficient**: Bypasses the massive RAM requirements of generative LLMs by utilizing a lightweight, highly accurate custom NLP classifier that runs effortlessly on standard hardware.

## 🛠️ Technology Stack

**Frontend**
*   React
*   Vite
*   Standard CSS (Responsive Grid Layout)

**Backend & Machine Learning**
*   FastAPI & Uvicorn (Python API Framework)
*   Pydantic (Data Validation & DTOs)
*   Scikit-Learn (TF-IDF Vectorizer, MLP Classifier)
*   Pandas & Joblib (Data processing and model serialization)

## 📂 Repository Structure

This is a monorepo containing both the React frontend and the FastAPI backend.

```text
mental-health-chatbot/
│
├── frontend/                 # React UI application
│   ├── src/                  # React components, App.jsx, App.css, main.jsx
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite bundler configuration
│
├── backend/                  # FastAPI server & ML pipeline
│   ├── main.py               # API Server, DDD layers, and Model Inference
│   ├── train_model.py        # Offline ML training script
│   ├── requirements.txt      # Python dependencies (fastapi, scikit-learn, etc.)
│   └── intent_model.pkl      # Serialized ML weights (Generated locally/Kaggle)
│
└── .gitignore                # Excludes node_modules, venv, and large datasets
