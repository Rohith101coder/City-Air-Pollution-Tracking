import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import './Dashboard.css';

const API = "http://127.0.0.1:8000";

export default function Dashboard() {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [aqiData, setAqiData] = useState(null);
  const [manualData, setManualData] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isFirstLocation, setIsFirstLocation] = useState(true);


  const userId = localStorage.getItem("user_id");
  const userName = localStorage.getItem("user_name");

  const colorMap = {
    Good: "#00e400",
    Fair: "#ffff00",
    Moderate: "#ff7e00",
    Poor: "#ff0000",
    "Very Poor": "#8f3f97",
    Unknown: "#7e0023",
  };

  // 👇 component to change map view dynamically
  const MapRefocus = ({ lat, lon }) => {
    const map = useMap();
    useEffect(() => {
      if (lat && lon) {
        map.setView([lat, lon], 10);
      }
    }, [lat, lon]);
    return null;
  };

  // get current user location when page loads
  useEffect(() => {
    if (!userId) return;

    if (navigator.geolocation) {
      // navigator.geolocation.getCurrentPosition(
      //   (pos) => {
      //     const lat = pos.coords.latitude;
      //     const lon = pos.coords.longitude;
      //     setLocation({ lat, lon });
      //     updateLocation(lat, lon);
      //   },
      //   () => setMsg("Location access denied. You can search manually below.")
      // );
      navigator.geolocation.getCurrentPosition(
  (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
     setLocation({ lat, lon });
    const firstTime = isFirstLocation;
    setIsFirstLocation(false);

    updateLocation(lat, lon, firstTime);  // send flag to backend
  },
  () => setMsg("Location access denied.")
);

    }
  }, [userId]);

  // // send location to backend for AQI
  // const updateLocation = async (lat, lon) => {
  //   try {
  //     setLoading(true);
  //     const res = await axios.post(`${API}/update_location`, {
  //       user_id: userId,
  //       lat,
  //       lon,
  //     });
  //     setAqiData(res.data.aqi_data);
  //     setMsg("Fetched your location AQI successfully.");
  //   } catch (err) {
  //     setMsg(err.response?.data?.detail || "Error updating location.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const updateLocation = async (lat, lon, firstTime) => {
  try {
    const res = await axios.post(`${API}/update_location`, {
      user_id: userId,
      lat,
      lon,
      send_sms: firstTime   // 🔥 only send SMS on real permission grant
    });

    setAqiData(res.data.aqi_data);
    setMsg("Location updated.");
  } catch (err) {
    setMsg("Error updating location.");
  }
};


  // manual city search
  const handleCitySearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API}/get_aqi_by_city?city=${city}`);
      setManualData(res.data);
      setMsg(`Fetched AQI for ${city}`);
    } catch (err) {
      setMsg(err.response?.data?.detail || "City not found.");
      setManualData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <main className="dashboard">
        <h2>Welcome, {userName || "User"} 👋</h2>

        {loading && <p>Loading...</p>}
        {msg && <p className="message">{msg}</p>}

        {/* AQI Reference Table */}
        <div className="aqi-table-container">
          <h3>📊 Air Quality Index Reference</h3>
          <table className="aqi-reference-table">
            <thead>
              <tr>
                <th>AQI Range</th>
                <th>Level of Health Concern</th>
                <th>Color Indicator</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0 - 50</td>
                <td>Good</td>
                <td>
                  <span className="color-dot" style={{ backgroundColor: "#00e400" }}></span>
                  <span className="color-name">Green</span>
                </td>
              </tr>
              <tr>
                <td>51 - 100</td>
                <td>Moderate</td>
                <td>
                  <span className="color-dot" style={{ backgroundColor: "#ffff00" }}></span>
                  <span className="color-name">Yellow</span>
                </td>
              </tr>
              <tr>
                <td>101 - 150</td>
                <td>Unhealthy for Sensitive Groups</td>
                <td>
                  <span className="color-dot" style={{ backgroundColor: "#ff7e00" }}></span>
                  <span className="color-name">Orange</span>
                </td>
              </tr>
              <tr>
                <td>151 - 200</td>
                <td>Unhealthy</td>
                <td>
                  <span className="color-dot" style={{ backgroundColor: "#ff0000" }}></span>
                  <span className="color-name">Red</span>
                </td>
              </tr>
              <tr>
                <td>201 - 300</td>
                <td>Very Unhealthy</td>
                <td>
                  <span className="color-dot" style={{ backgroundColor: "#8f3f97" }}></span>
                  <span className="color-name">Purple</span>
                </td>
              </tr>
              <tr>
                <td>301 - 500+</td>
                <td>Hazardous</td>
                <td>
                  <span className="color-dot" style={{ backgroundColor: "#7e0023" }}></span>
                  <span className="color-name">Maroon</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Live AQI card */}
        {aqiData && (
          <div
            className="aqi-card"
            style={{ borderColor: colorMap[aqiData.category] }}
          >
            <h3>🌍 Your Location AQI</h3>
            <p>
              <strong>AQI:</strong> {aqiData.aqi}
            </p>
            <p>
              <strong>Category:</strong> {aqiData.category}
            </p>
            <p>
              <strong>Advice:</strong> {aqiData.advice}
            </p>
          </div>
        )}

        {/* Manual City Search */}
        <div className="manual-search">
          <h3>🔎 Search AQI by City</h3>
          <form onSubmit={handleCitySearch}>
            <input
              type="text"
              placeholder="Enter city name (e.g., Delhi)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>

        {/* Map */}
        {location.lat && (
          <div className="map-container">
            <MapContainer
              center={[location.lat, location.lon]}
              zoom={10}
              style={{
                height: "450px",
                width: "100%",
                borderRadius: "10px",
              }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapRefocus
                lat={manualData ? manualData.lat : location.lat}
                lon={manualData ? manualData.lon : location.lon}
              />

              {/* user location */}
              {aqiData && (
                <CircleMarker
                  center={[location.lat, location.lon]}
                  radius={15}
                  color={colorMap[aqiData.category]}
                  fillColor={colorMap[aqiData.category]}
                  fillOpacity={0.7}
                >
                  <Popup>
                    <b>📍 My Location</b> <br />
                    AQI: {aqiData.aqi} ({aqiData.category})
                  </Popup>
                </CircleMarker>
              )}

              {/* manual city marker */}
              {manualData && (
                <CircleMarker
                  center={[manualData.lat, manualData.lon]}
                  radius={15}
                  color={colorMap[manualData.category]}
                  fillColor={colorMap[manualData.category]}
                  fillOpacity={0.7}
                >
                  <Popup>
                    <b>🏙️ {manualData.city}</b> <br />
                    AQI: {manualData.aqi} ({manualData.category})
                  </Popup>
                </CircleMarker>
              )}
            </MapContainer>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
