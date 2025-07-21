from sqlmodel import create_engine

DATABASE_URL = "sqlite:///traffy.db"
engine = create_engine(DATABASE_URL, echo=True)
