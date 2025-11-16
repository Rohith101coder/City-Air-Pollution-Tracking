import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import './Login.css'

const API = "http://127.0.0.1:8000";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post(`${API}/login`, form);
      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("user_name", res.data.name);
      setMsg(res.data.message);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="page-container">
      <Header />
      <main className="form-section">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="form">
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
        {msg && <p className="message">{msg}</p>}
      </main>
      <Footer />
    </div>
  );
}
