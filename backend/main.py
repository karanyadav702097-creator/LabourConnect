from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid

app = FastAPI()

# Models
class Worker(BaseModel):
    id: str
    name: str
    skill: str
    location: str
    rating: float
    verified: bool
    phone: str
    lat: float
    lng: float

class Booking(BaseModel):
    id: str
    worker_id: str
    user_id: str
    status: str # pending, accepted, completed
    date: str

class Review(BaseModel):
    worker_id: str
    user_id: str
    rating: int
    comment: str

# Mock Database
workers = [
    {"id": "1", "name": "Rajesh Kumar", "skill": "Plumber", "location": "Nagpur", "rating": 4.5, "verified": True, "phone": "9876543210", "lat": 21.1458, "lng": 79.0882},
    {"id": "2", "name": "Sunita Devi", "skill": "Gardener", "location": "Nagpur", "rating": 4.8, "verified": True, "phone": "9876543211", "lat": 21.1500, "lng": 79.0900},
    {"id": "3", "name": "Amit Singh", "skill": "Electrician", "location": "Nagpur", "rating": 4.2, "verified": False, "phone": "9876543212", "lat": 21.1400, "lng": 79.0800},
]

bookings = []

@app.get("/workers", response_model=List[Worker])
def get_workers(skill: Optional[str] = None):
    if skill:
        return [w for w in workers if skill.lower() in w["skill"].lower()]
    return workers

@app.post("/bookings")
def create_booking(booking: Booking):
    bookings.append(booking.dict())
    return {"message": "Booking created", "booking_id": booking.id}

@app.get("/bookings/{user_id}")
def get_user_bookings(user_id: str):
    return [b for b in bookings if b["user_id"] == user_id]

@app.post("/sos")
def trigger_sos(worker_id: str):
    # In a real app, this would alert local authorities/emergency contacts
    print(f"SOS Triggered for worker {worker_id}")
    return {"status": "Emergency services notified"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
