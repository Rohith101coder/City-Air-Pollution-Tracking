# 🌍 Pollution Tracker — Real-Time AQI Monitoring System

A full-stack **Air Pollution Tracking System** built for Hackathons and real-world use.  
This project provides:

- 📍 **Real-time AQI tracking using device GPS**
- 🏙️ **Manual AQI search by city**
- 📩 **SMS alerts via Twilio when pollution increases**
- 🗺️ **Interactive Leaflet map with AQI color indicators**
- 🧭 **Live user location tracking**
- 📚 **History logging of AQI data per user**
- 🔐 **Authentication (Register + Login)**
- 🗄️ **SQLite Database for user & AQI logs**

---

# 🚀 Tech Stack

### **Frontend**
- React + Vite  
- Axios  
- React Router  
- Leaflet (Maps)  
- Custom CSS  

### **Backend**
- FastAPI  
- SQLAlchemy (ORM)  
- SQLite Database  
- Twilio SMS API  
- OpenWeather Air Pollution API  

---

# 📁 Folder Structure
    project/
│
├── backend/
│ ├── app.py
│ ├── database.py
│ ├── models.py
│ ├── schemas.py
│ ├── utils.py
│ └── pollution.db
│
└── frontend/   (this forntend folder structure  automatically created when vite+react command run in the terminal expect some folder)
├── src/
│ ├── pages/         -> manually create                        
│ ├── components/    -> manually create
│ ├── assets/
│ └── App.jsx
├── package.json




---

# 🛠️ Requirements

### **Install these before starting:**

| Tool | Required |
|------|----------|
| Python | ≥ 3.8 |
| Node.js | ≥ 16 |
| npm / yarn | Yes |
| SQLite | Built-in |
| Twilio account | Yes |
| OpenWeather API key | Yes |

---

# ⚙ Backend Setup (FastAPI)

### ▸ **1. Move into backend folder**
            cd backend

### ▸ **2. Install dependencies**
            pip install fastapi uvicorn sqlalchemy pydantic bcrypt python-dotenv requests twilio

### ▸ **3. Run the backend**
            uvicorn app:app --reload


Backend starts at:

👉 **http://127.0.0.1:8000**

---

# 🖥 Frontend Setup (React + Vite)

### ▸ **1. Move into frontend**
            cd frontend(new terminal)

### ▸ **2. Install dependencies**
            npm install

    
Additional required libs:
npm install axios react-router-dom leaflet react-leaflet


### ▸ **3. Run frontend**

    
Frontend starts at:

👉 **http://localhost:5173**

---

# 🔑 Environment Variables (Temporary Hardcoded in Code)

You need:

- **OpenWeather API Key**
- **Twilio SID**
- **Twilio Auth Token**
- **Twilio Phone Number**

These are stored in `utils.py` for now (no .env needed).

---

# 📡 Available API Routes

### ✔ Register User  
`POST /register`

### ✔ Login  
`POST /login`

### ✔ Update Location + Trigger SMS  
`POST /update_location`

### ✔ Search AQI by city  
`GET /get_aqi_by_city?city=Delhi`

### ✔ Fetch AQI history  
`GET /history`

---

# 🎯 Features Summary

### ✅ Automatic AQI Detection  
Gets user location → fetches AQI → stores → triggers SMS.

### ✅ City-Based AQI Search  
User can manually search any city globally.

### ✅ Map Visualization  
Leaflet map shows colored markers based on AQI category.

### ✅ SMS Alerts (Twilio)  
User receives alerts **ONLY when AQI increases** or when **location access is newly granted.**

### ✅ User Authentication  
Register + Login + Dashboard.

### ✅ AQI History  
Each location update is logged with time, AQI, category, and advice.

---

# 🟦 AQI Color Reference

| AQI | Category | Color |
|-----|----------|--------|
| 0–50 | Good | Green |
| 51–100 | Fair | Yellow |
| 101–150 | Moderate | Orange |
| 151–200 | Poor | Red |
| 201–300 | Very Poor | Purple |
| 301+ | Hazardous | Maroon |

---

# 🧪 Testing SMS Alerts

You **must use the verified number** in your Twilio trial account.  
Messages will appear from your Twilio phone number.

---

# 🛑 Common Issues & Fixes

### ❌ Map not showing  
✔ Restart frontend  
✔ Ensure Leaflet CSS imported  
✔ Ensure `location.lat` has value  
✔ Ensure `.map-container` has height  

### ❌ SMS not sending  
✔ Twilio SID/token invalid  
✔ Using unverified phone number  
✔ Trial account allows only verified numbers  

### ❌ Database errors  
Delete old DB:

    del pollution.db
Restart backend.