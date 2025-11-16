import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        <h2>Air Pollution Tracker</h2>
      </div>
      <div className="header-right">
        <button onClick={() => navigate("/register")}>Register</button>
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/")}>Logout</button>
        <button onClick={() => navigate("/history")}>History</button>
        
      </div>
    </header>
  );
}
