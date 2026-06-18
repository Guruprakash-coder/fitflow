from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import os

from api.database import get_db, engine, Base
from api.models import User, Workout
from api.schemas import UserCreate, UserLogin, WorkoutCreate, Token, UserResponse, WorkoutResponse
from api.auth import get_password_hash, verify_password, create_access_token, verify_access_token

# Create tables in database (auto-run for SQLite/Postgres)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FitFlow API",
    description="Backend API for FitFlow Fitness & Workout Planner",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# CORS configurations so that React frontend can make API calls in dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Security Scheme
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)) -> User:
    token = credentials.credentials
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing user ID",
        )
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user

# --- HEALTH CHECK ---
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "connected"
    }

# --- AUTH ENDPOINTS ---
@app.post("/api/auth/register", response_model=Token)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )
    
    # Hash password and store user
    hashed_pwd = get_password_hash(user_data.password)
    db_user = User(email=user_data.email, name=user_data.name, hashed_password=hashed_pwd)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Generate token
    token_data = {"user_id": db_user.id, "email": db_user.email}
    access_token = create_access_token(data=token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

@app.post("/api/auth/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == login_data.email).first()
    if not db_user or not verify_password(login_data.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    # Generate token
    token_data = {"user_id": db_user.id, "email": db_user.email}
    access_token = create_access_token(data=token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

# --- WORKOUT ENDPOINTS ---
@app.post("/api/workouts", response_model=WorkoutResponse)
def create_workout(workout_data: WorkoutCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_workout = Workout(
        user_id=current_user.id,
        exercise_name=workout_data.exercise_name,
        sets=workout_data.sets,
        reps=workout_data.reps,
        weight=workout_data.weight,
        date=workout_data.date
    )
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout

@app.get("/api/workouts", response_model=List[WorkoutResponse])
def get_workouts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    workouts = db.query(Workout).filter(Workout.user_id == current_user.id).order_by(Workout.date.desc(), Workout.id.desc()).all()
    return workouts

@app.delete("/api/workouts/{workout_id}")
def delete_workout(workout_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_workout = db.query(Workout).filter(Workout.id == workout_id, Workout.user_id == current_user.id).first()
    if not db_workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout log not found or unauthorized"
        )
    db.delete(db_workout)
    db.commit()
    return {"message": "Workout log deleted successfully"}

# --- DASHBOARD STATS ---
@app.get("/api/stats")
def get_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    workouts = db.query(Workout).filter(Workout.user_id == current_user.id).all()
    
    total_workouts = len(workouts)
    total_volume = sum(w.sets * w.reps * w.weight for w in workouts)
    
    # Calculate popular exercise
    exercise_counts = {}
    for w in workouts:
        name = w.exercise_name
        exercise_counts[name] = exercise_counts.get(name, 0) + 1
    
    popular_exercise = max(exercise_counts, key=exercise_counts.get) if exercise_counts else "None"
    
    # Calculate daily workout streak
    # Extract unique dates sorted chronologically descending
    dates = sorted(list(set(w.date for w in workouts)), reverse=True)
    streak = 0
    if dates:
        today = datetime.now().date()
        yesterday = today - timedelta(days=1)
        
        today_str = today.isoformat()
        yesterday_str = yesterday.isoformat()
        
        # Streak remains active if user logged today or yesterday
        if dates[0] == today_str or dates[0] == yesterday_str:
            streak = 1
            for i in range(len(dates) - 1):
                d1 = datetime.strptime(dates[i], "%Y-%m-%d").date()
                d2 = datetime.strptime(dates[i+1], "%Y-%m-%d").date()
                if (d1 - d2).days == 1:
                    streak += 1
                elif (d1 - d2).days > 1:
                    break  # Streak broken
                    
    return {
        "total_workouts": total_workouts,
        "total_volume": total_volume,
        "popular_exercise": popular_exercise,
        "streak": streak
    }
