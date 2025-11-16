from pydantic import BaseModel
from typing import Optional

class RegisterUser(BaseModel):
    name: str
    email: str
    phone: str
    password: str

class LoginUser(BaseModel):
    email: str
    password: str

class LocationUpdate(BaseModel):
    user_id: int
    lat: float
    lon: float
    send_sms: bool = False  

class AQIResponse(BaseModel):
    aqi: int
    category: str
    advice: str
