import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LastPeriodDate: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<string>("");

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h2>When did your last period start?</h2>
      <p>We can predict your next period</p>
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        style={{ margin: "24px 0", fontSize: 18 }}
      />
      <div>
        <button style={{ background: "#0057ff", color: "#fff" }} disabled={!date} onClick={() => navigate("/cycle-length")}>
          Next
        </button>
      </div>
    </div>
  );
};
export default LastPeriodDate;