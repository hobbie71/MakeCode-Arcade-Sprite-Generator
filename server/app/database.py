from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from .core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Sprite(Base):
    __tablename__ = "sprites"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    width = Column(Integer)
    height = Column(Integer)
    data = Column(Text)  # JSON string of sprite data
    colors = Column(Text)  # JSON string of used colors
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class GenerationHistory(Base):
    __tablename__ = "generation_history"
    
    id = Column(String, primary_key=True, index=True)
    prompt = Column(Text)
    style = Column(String)
    size = Column(String)
    result_sprite_id = Column(String)
    confidence = Column(Integer)
    processing_time = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
