import bcrypt
import requests
import os
from twilio.rest import Client
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- API KEYS ---
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

# --- TWILIO CREDENTIALS ---
ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE = os.getenv("TWILIO_PHONE_NUMBER")

# --- PASSWORD HELPERS ---
def hash_password(password: str) -> str:
    """Hash user password securely."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    """Verify plain password against hashed password."""
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


# --- AQI HELPERS ---
def get_aqi_mapping(aqi_level: int):
    """Map OpenWeather AQI index to descriptive labels."""
    mapping = {
        1: ("Good", "Air quality is satisfactory."),
        2: ("Fair", "Acceptable air quality."),
        3: ("Moderate", "Sensitive groups should reduce outdoor activity."),
        4: ("Poor", "Limit prolonged outdoor exertion."),
        5: ("Very Poor", "Stay indoors and use masks."),
    }
    return mapping.get(aqi_level, ("Unknown", "No data available."))


def fetch_aqi(lat: float, lon: float):
    """Fetch AQI by latitude and longitude using OpenWeather API."""
    try:
        url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}"
        res = requests.get(url, timeout=10).json()

        if "list" not in res or not res["list"]:
            return None

        aqi_level = res["list"][0]["main"]["aqi"]
        category, advice = get_aqi_mapping(aqi_level)

        # convert OpenWeather scale (1–5) to rough AQI range (0–500)
        return {
            "aqi": aqi_level * 50,
            "category": category,
            "advice": advice,
        }

    except Exception as e:
        print(f"Error fetching AQI: {e}")
        return None


def fetch_aqi_by_city(city: str):
    """Fetch AQI for a given city by resolving coordinates first."""
    try:
        geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={OPENWEATHER_API_KEY}"
        geo_data = requests.get(geo_url, timeout=10).json()

        if not geo_data:
            return None

        lat, lon = geo_data[0]["lat"], geo_data[0]["lon"]
        aqi_data = fetch_aqi(lat, lon)

        if not aqi_data:
            return None

        return {
            "city": city,
            "lat": lat,
            "lon": lon,
            **aqi_data
        }

    except Exception as e:
        print(f"Error fetching AQI by city: {e}")
        return None


# --- SMS HELPER (Twilio) ---
def send_sms(phone: str, message: str):
    """Send SMS alert using Twilio API."""
    try:
        client = Client(ACCOUNT_SID, AUTH_TOKEN)
        msg = client.messages.create(
            body=message,
            from_=TWILIO_PHONE,
            to=phone if phone.startswith("+") else f"+91{phone}"
        )
        print(f"✅ SMS sent successfully via Twilio | SID: {msg.sid}")
    except Exception as e:
        print(f"❌ Twilio SMS Error: {e}")
