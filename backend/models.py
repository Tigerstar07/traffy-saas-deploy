from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid

class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str
    hashed_password: str
    plan: Optional[str] = "free"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SignupRequest(SQLModel):
    email: str
    password: str
