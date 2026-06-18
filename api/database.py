import os
import ssl
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load environment variables from .env file for local development
load_dotenv()

# Hybrid DB Configuration: Use Postgres (e.g. Supabase/Neon) in production, fallback to SQLite locally.
DATABASE_URL = os.getenv("DATABASE_URL")

connect_args = {}

# Resolve SQLAlchemy compatibility and specify the pg8000 driver for PostgreSQL
if DATABASE_URL:
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+pg8000://", 1)
    elif DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+pg8000://", 1)
        
    # If using pg8000, strip query params (like ?sslmode=require) and pass standard ssl_context instead
    if "pg8000" in DATABASE_URL:
        if "?" in DATABASE_URL:
            DATABASE_URL = DATABASE_URL.split("?")[0]
        # Neon/Supabase require SSL, which pg8000 sets up using ssl_context
        connect_args = {"ssl_context": ssl.create_default_context()}

if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./dev.db"
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
