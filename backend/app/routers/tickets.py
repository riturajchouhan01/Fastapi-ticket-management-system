from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.ticket import Ticket
from app.schemas.ticket import (
    TicketCreate,
    TicketUpdate,
    TicketResponse  
)

router = APIRouter(
    prefix = "/tickets",
    tags=["Tickets"]
)

# ticket create
@router.post("/",response_model=TicketResponse)
def create_ticket(ticket:TicketCreate,db:Session = Depends(get_db)):
    new_ticket = Ticket(
        title = ticket.title,
        description = ticket.description,
        category = ticket.category,
        priority = ticket.priority
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return new_ticket

# get all ticket
@router.get("/",response_model=list[TicketResponse])
def get_tickets(db:Session = Depends(get_db)):
    tickets = db.query(Ticket).order_by(Ticket.id.desc()).all()

    return tickets   


# Get single ticket
@router.get("/{ticket_id}",response_model=TicketResponse)
def get_ticket(ticket_id:int,db:Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(
            status_code = 404,
            detail="Ticket not found"
        )

    return ticket

# Update status
@router.put("/{ticket_id}",response_model=TicketResponse)
def update_ticket(ticket_id:int, data:TicketUpdate, db:Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )
    ticket.status = data.status

    db.commit()
    db.refresh(ticket)
    return ticket

@router.delete("/{ticket_id}")
def delete_ticket(ticket_id:int, db:Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    db.delete(ticket)
    db.commit()
    return{
        "message":"Ticket deleted successfully"
    }
