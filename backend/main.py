import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse, JSONResponse
from sqlmodel import SQLModel, Session, select
from starlette.middleware.cors import CORSMiddleware
from authlib.integrations.starlette_client import OAuth
from passlib.context import CryptContext
from .database import engine
from .models import User, SignupRequest
from dotenv import load_dotenv
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from fastapi.staticfiles import StaticFiles

# ✅ First, define the app
app = FastAPI()

# ✅ Then mount the static frontend
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

# ✅ Load environment variables
load_dotenv()

# ✅ Password hasher
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ✅ CORS (adjust in production!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ OAuth for Google login
oauth = OAuth()
oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'},
)

# ✅ DB setup
@app.on_event("startup")
def startup():
    SQLModel.metadata.create_all(engine)

# ✅ Email/password signup route
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

# ✅ Google OAuth2 (redirect-style) login
@app.get("/login/google")
async def login_via_google(request: Request):
    redirect_uri = request.url_for("auth_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/auth/callback")
async def auth_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get('userinfo')
    if not user_info:
        raise HTTPException(status_code=400, detail="Failed to get user info")

    email = user_info['email']
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == email)).first()
        if not user:
            user = User(email=email)
            session.add(user)
            session.commit()
            session.refresh(user)

    return RedirectResponse(url="/frontend/dashboard.html")

# ✅ Google One-Tap or JS-based token login
@app.post("/auth/google")
async def google_login(request: Request):
    data = await request.json()
    token = data.get("token")

    try:
        idinfo = id_token.verify_oauth2_token(
            token, google_requests.Request(), os.getenv("GOOGLE_CLIENT_ID")
        )

        email = idinfo.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Invalid token")

        with Session(engine) as session:
            user = session.exec(select(User).where(User.email == email)).first()
            if not user:
                user = User(email=email)
                session.add(user)
                session.commit()
                session.refresh(user)

        return {"success": True, "email": email}

    except Exception as e:
        return JSONResponse(status_code=400, content={"success": False, "detail": str(e)})
