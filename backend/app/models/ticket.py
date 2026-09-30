from sqlalchemy import Column,Integer,String,Text,DateTime
from datetime import datetime

from app.database import Base


class Ticket(Base):
    __tablename__="tickets"

    id = Column(Integer,primary_key=True,index=True)
    title = Column(String(200),nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), default="General")
    priority = Column(String(20), default="Medium")
    status = Column(String(20), default="Open")

    created_at = Column(DateTime,default=datetime.now())