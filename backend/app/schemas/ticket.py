from pydantic import BaseModel
from datetime import datetime

class TicketCreate(BaseModel):
    title:str
    description:str
    category:str="General"
    priority:str = "Medium"

class TicketUpdate(BaseModel):
    status:str

class TicketResponse(BaseModel):
    id:int
    title:str
    description:str
    category:str
    priority:str
    status:str
    created_at:datetime

    class Config:
        from_attributes = True