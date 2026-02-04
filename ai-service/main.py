from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from model.recommender import generate_recommendations

app = FastAPI(title="AI Recommendation Service")

# Allow frontend access
origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Backend base URL 
BACKEND_URL = "http://localhost:5137"

def fetch_user_data(endpoint: str, user_id: int):
    """
    Fetch user-specific data from backend.
    Returns empty list if the request fails.
    """
    try:
        resp = requests.get(f"{BACKEND_URL}/{endpoint}/{user_id}", timeout=5)
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {endpoint} for user {user_id}: {e}")
        return []

@app.get("/")
def root():
    return {"message": "AI Service is running!"}

@app.get("/ai/recommend/{user_id}")
def recommend(user_id: int):
    try:
        #Fixed routes
        workouts = fetch_user_data("api/workout", user_id)
        meals = fetch_user_data("api/meal", user_id)
        sleeps = fetch_user_data("api/sleep", user_id)

        user_data = {
            "workouts": workouts,
            "meals": meals,
            "sleeps": sleeps
        }

        # Generate AI-based health recommendations
        recommendations = generate_recommendations(user_data)

        return {"recommendations": recommendations}
    except Exception as e:
        print("Error in /ai/recommend:", e)
        raise HTTPException(status_code=500, detail=str(e))
