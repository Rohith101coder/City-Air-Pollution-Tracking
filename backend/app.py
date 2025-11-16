from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User, AQILog
from schemas import RegisterUser, LoginUser, LocationUpdate
from utils import (
    hash_password,
    verify_password,
    fetch_aqi,
    fetch_aqi_by_city,
    send_sms,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pollution Tracker API")

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # can restrict later to frontend port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- DB Dependency ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- AUTH ----------------
@app.post("/register")
def register_user(user: RegisterUser, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=hashed,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user_id": new_user.id}


@app.post("/login")
def login_user(user: LoginUser, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user_id": db_user.id, "name": db_user.name}


# ---------------- LOCATION UPDATE ----------------
@app.post("/update_location")
def update_location(
    data: LocationUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.lat = data.lat
    user.lon = data.lon

    aqi_data = fetch_aqi(data.lat, data.lon)
    if not aqi_data:
        raise HTTPException(status_code=500, detail="Failed to fetch AQI")

    previous_aqi = user.last_aqi or 0
    user.last_aqi = aqi_data["aqi"]

    # Save AQI log
    db.add(
        AQILog(
            user_id=user.id,
            lat=data.lat,
            lon=data.lon,
            aqi=aqi_data["aqi"],
            category=aqi_data["category"],
            advice=aqi_data["advice"],
        )
    )
    db.commit()

    # -----------------------------------------
    # 🔥 NEW LOGIC: Send SMS if frontend says user ENABLED location
    # -----------------------------------------
    if hasattr(data, "send_sms") and data.send_sms is True:
        message = (
            f"🌍 Hello {user.name},\n"
            f"📡 Location access enabled!\n"
            f"Current AQI: {aqi_data['aqi']} ({aqi_data['category']})\n"
            f"Advice: {aqi_data['advice']}\n"
            f"Stay safe — Pollution Tracker."
        )
        background_tasks.add_task(send_sms, user.phone, message)

    return {
        "message": "Location and AQI updated",
        "aqi_data": aqi_data,
        "sms_triggered": data.send_sms if hasattr(data, "send_sms") else False
    }


# # ---------------- LOCATION UPDATE ----------------
# @app.post("/update_location")
# def update_location(
#     data: LocationUpdate,
#     background_tasks: BackgroundTasks,
#     db: Session = Depends(get_db),
# ):
#     user = db.query(User).filter(User.id == data.user_id).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     user.lat = data.lat
#     user.lon = data.lon

#     aqi_data = fetch_aqi(data.lat, data.lon)
#     if not aqi_data:
#         raise HTTPException(status_code=500, detail="Failed to fetch AQI")

#     previous_aqi = user.last_aqi or 0
#     user.last_aqi = aqi_data["aqi"]

#     # log this AQI entry
#     db.add(
#         AQILog(
#             user_id=user.id,
#             lat=data.lat,
#             lon=data.lon,
#             aqi=aqi_data["aqi"],
#             category=aqi_data["category"],
#             advice=aqi_data["advice"],
#         )
#     )
#     db.commit()

#     # if AQI worsened, send SMS alert
#     if aqi_data["aqi"] > previous_aqi:
#         message = (
#             f"🌆 Hello {user.name},\n"
#         f"⚠️ Air Quality Alert for your location!\n"
#         f"AQI Level: {aqi_data['aqi']} ({aqi_data['category']})\n"
#         f"💡 Advice: {aqi_data['advice']}\n"
#         f"Stay safe — Pollution Tracker."
#         )
#         background_tasks.add_task(send_sms, user.phone, message)

#     return {"message": "Location and AQI updated", "aqi_data": aqi_data}


# ---------------- NEW: GET AQI BY CITY ----------------
@app.get("/get_aqi_by_city")
def get_aqi_by_city(city: str):
    aqi_data = fetch_aqi_by_city(city)
    if not aqi_data:
        raise HTTPException(status_code=404, detail="City not found or AQI unavailable")
    return aqi_data


@app.get("/test_sms")
def test_sms():
    send_sms("+916309408139", "🚀 Twilio Test Message: AQI alert demo successful!")
    return {"message": "Test SMS sent"}







# ---------------- NEW: GET HISTORY ----------------
@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    records = db.query(AQILog).order_by(AQILog.created_at.desc()).all()
    return [
        {
            "id": r.id,
            # "city": r.city,
            "aqi": r.aqi,
            "category": r.category,
            "advice": r.advice,
            "lat": r.lat,
            "lon": r.lon,
            "created_at": r.created_at.isoformat(),
        }
        for r in records
    ]


# ---------------- CLEAR HISTORY (OPTIONAL) ----------------
@app.delete("/clear_history")
def clear_history(db: Session = Depends(get_db)):
    db.query(AQILog).delete()
    db.commit()
    return {"message": "History cleared successfully."}
