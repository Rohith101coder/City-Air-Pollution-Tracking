import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <h3>HackStreet Boys</h3>
      <p>Rohith | Vamshi | Sathwik | Raju | Sai Kumar</p>
      <p>📧 contact@hackstreetboys.in | © {new Date().getFullYear()} All rights reserved.</p>
    </footer>
  );
}
