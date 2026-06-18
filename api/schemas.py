from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Login & Token Schemas ---
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None

# --- Workout Schemas ---
class WorkoutBase(BaseModel):
    exercise_name: str
    sets: int
    reps: int
    weight: float
    date: str  # YYYY-MM-DD format

class WorkoutCreate(WorkoutBase):
    pass

class WorkoutResponse(WorkoutBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
