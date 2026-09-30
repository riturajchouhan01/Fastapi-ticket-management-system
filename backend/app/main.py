from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine,Base
from app.routers import tickets

from app.models.ticket import Ticket

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ticket Managaement System",description="Ticket Management API",version="1.0")



# CORS
app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# Routes
app.include_router(tickets.router)

@app.get("/")
def home():
    return{
        "message":"Ticket management api is running"
    }