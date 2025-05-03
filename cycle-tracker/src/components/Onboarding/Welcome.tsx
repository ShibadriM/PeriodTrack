import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h1>Track Your Menstrual Cycle with Ease</h1>
      <p>Log your period, track symptoms, and get smart insights about your cycle.</p>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, margin: "32px 0" }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, width: 180 }}>
          <b>Smart Predictions</b>
          <p style={{ fontSize: 14 }}>Get personalized insights based on your cycle</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, width: 180 }}>
          <b>Discuss with Gynec</b>
          <p style={{ fontSize: 14 }}>Share accurate data with your doctor</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, width: 180 }}>
          <b>Listen to Your Body</b>
          <p style={{ fontSize: 14 }}>Track symptoms & patterns effortlessly</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, width: 180 }}>
          <b>Stay Prepared</b>
          <p style={{ fontSize: 14 }}>Know when your period & ovulation are coming</p>
        </div>
      </div>
      <button style={{ background: "#0057ff", color: "#fff" }} onClick={() => navigate("/last-period")}>
        Get Started
      </button>
    </div>
  );
};
export default Welcome;