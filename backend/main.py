from fastapi import FastAPI, HTTPException
from sqlmodel import SQLModel, Session, select
from .database import engine
from .models import User, SignupRequest
import uuid
from passlib.context import CryptContext

app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.on_event("startup")
def startup():
    SQLModel.metadata.create_all(engine)

@app.post("/signup")
def signup(data: SignupRequest):
    with Session(engine) as session:
        existing = session.exec(select(User).where(User.email == data.email)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_pw = pwd_context.hash(data.password)
        user = User(email=data.email, hashed_password=hashed_pw)
        session.add(user)
        session.commit()
        session.refresh(user)
        return {"id": user.id, "message": "Signup successful"}
