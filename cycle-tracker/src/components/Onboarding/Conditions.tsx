import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const conditions = [
  "None", "PCOS", "Endometriosis", "UTI", "Perimenopause/Menopause",
  "Uterine Fibroids", "Anemia", "Bleeding Disorder", "Fibromyalgia",
  "IBS (Irritable Bowel Syndrome)", "Pregnancy", "Postpartum/breastfeeding"
];

const Conditions: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>("None");

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h2>Any conditions affecting your cycle?</h2>
      <p>Sharing helps your doctor care better.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", margin: "24px 0" }}>
        {conditions.map(cond => (
          <button
            key={cond}
            style={{
              background: selected === cond ? "#e6f0ff" : "#eee",
              color: selected === cond ? "#0057ff" : "#333",
              border: selected === cond ? "2px solid #0057ff" : "none",
              minWidth: 120,
              margin: 4
            }}
            onClick={() => setSelected(cond)}
          >
            {cond}
          </button>
        ))}
      </div>
      <div>
        <button style={{ background: "#ccc", color: "#333" }} onClick={() => navigate("/cycle-length")}>Back</button>
        <button style={{ background: "#0057ff", color: "#fff" }} onClick={() => navigate("/tracker")}>Submit</button>
      </div>
    </div>
  );
};
export default Conditions;