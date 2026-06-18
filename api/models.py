from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from api.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    workouts = relationship("Workout", back_populates="owner", cascade="all, delete-orphan")
    food_logs = relationship("FoodLog", back_populates="owner", cascade="all, delete-orphan")

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    exercise_name = Column(String, nullable=False)
    sets = Column(Integer, nullable=False)
    reps = Column(Integer, nullable=False)
    weight = Column(Float, nullable=False)
    date = Column(String, nullable=False)  # ISO date string YYYY-MM-DD
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="workouts")

class FoodLog(Base):
    __tablename__ = "food_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    food_name = Column(String, nullable=False)
    calories = Column(Integer, nullable=False)
    protein = Column(Float, default=0.0)
    carbs = Column(Float, default=0.0)
    fat = Column(Float, default=0.0)
    grams = Column(Float, nullable=False)
    date = Column(String, nullable=False)  # ISO date string YYYY-MM-DD
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="food_logs")
