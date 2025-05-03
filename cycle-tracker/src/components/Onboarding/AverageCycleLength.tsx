import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cycleService } from "../../services/api"; // Adjust path as needed

const AverageCycleLength: React.FC = () => {
  const navigate = useNavigate();
  const [length, setLength] = useState<number>(28);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async () => {
    setLoading(true);
    setError(null);
    try {
      // Save the cycle length to the backend
      await cycleService.updateCycleLength({ cycleLength: length });
      navigate("/conditions");
    } catch (err) {
      setError("Failed to save cycle length. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h2>How long is your average cycle?</h2>
      <p>A little hint - cycles usually last 24-38 days</p>
      <input
        type="number"
        min={20}
        max={40}
        value={length}
        onChange={e => setLength(Number(e.target.value))}
        style={{ fontSize: 18, width: 80, textAlign: "center" }}
      />
      <div>
        <button
          style={{ background: "#0057ff", color: "#fff" }}
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? "Saving..." : "Next"}
        </button>
      </div>
      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
    </div>
  );
};

export default AverageCycleLength;