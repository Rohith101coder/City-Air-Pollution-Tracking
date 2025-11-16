import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import './History.css';

const API = "http://127.0.0.1:8000";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const colorMap = {
    Good: "#00e400",
    Fair: "#ffff00",
    Moderate: "#ff7e00",
    Poor: "#ff0000",
    "Very Poor": "#8f3f97",
    Unknown: "#7e0023",
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/history`);
      setHistory(res.data);
      setLoading(false);
    } catch (err) {
      setMsg("Failed to fetch history.");
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <main className="history-section">
        <h2>📊 Air Quality History</h2>

        {loading && <p>Loading your AQI records...</p>}
        {msg && <p className="message">{msg}</p>}

        {!loading && history.length === 0 && (
          <p className="message">No history found yet.</p>
        )}

        {!loading && history.length > 0 && (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>City / Location</th>
                  <th>AQI</th>
                  <th>Category</th>
                  <th>Advice</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, i) => (
                  <tr key={i}>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                    <td>{"    "}</td>
                    <td>{item.aqi}</td>
                    <td style={{ color: colorMap[item.category] }}>
                      {item.category}
                    </td>
                    <td>{item.advice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
