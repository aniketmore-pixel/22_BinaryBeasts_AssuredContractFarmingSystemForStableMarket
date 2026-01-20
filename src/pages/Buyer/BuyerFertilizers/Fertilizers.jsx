import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import crops from "./crops";
import "./fertilizer.css";

const Fertilizers = () => {
  const navigate = useNavigate();

  const [cropName, setCropName] = useState("");
  const [nitrogen, setNitrogen] = useState("");
  const [phosphorous, setPhosphorous] = useState("");
  const [potassium, setPotassium] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        "https://agro-friend.vercel.app/api/fertilizer-recommendation",
        {
          cropname: cropName,
          nitrogen,
          phosphorous,
          potassium,
        }
      );

      navigate("/buyer/fertilizer-result", {
        state: { recommendation: response.data.recommendation },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-form-page">
      <div className="page-wrapper">
        {/* LEFT: FORM */}
        <div className="form-card">
          <h2 className="page-title">Fertilizer Advice</h2>
          <p className="page-subtitle">
            Get fertilizer recommendations based on NPK values.
          </p>

          <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nitrogen</label>
              <input
                type="number"
                value={nitrogen}
                onChange={(e) => setNitrogen(e.target.value)}
                placeholder="Enter Nitrogen value"
                required
              />
            </div>

            <div className="form-group">
              <label>Phosphorus</label>
              <input
                type="number"
                value={phosphorous}
                onChange={(e) => setPhosphorous(e.target.value)}
                placeholder="Enter Phosphorus value"
                required
              />
            </div>

            <div className="form-group">
              <label>Potassium</label>
              <input
                type="number"
                value={potassium}
                onChange={(e) => setPotassium(e.target.value)}
                placeholder="Enter Potassium value"
                required
              />
            </div>

            <div className="form-group">
              <label>Crop</label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                required
              >
                <option value="">Select Crop</option>
                {crops.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            <button className="primary-btn" disabled={loading}>
              {loading ? "Fetching..." : "Get Advice"}
            </button>
          </form>
        </div>

        {/* RIGHT: INFO */}
        <div className="info-card">
          <h3>What does this page do?</h3>
          <p>
            This tool helps farmers and buyers choose the right fertilizer
            combination based on soil nutrient values.
          </p>

          <ul>
            <li>
              <strong>Nitrogen (N)</strong> improves leaf growth and plant
              strength
            </li>
            <li>
              <strong>Phosphorus (P)</strong> supports root development
            </li>
            <li>
              <strong>Potassium (K)</strong> boosts crop quality and disease
              resistance
            </li>
          </ul>

          <p>
            Enter the NPK values from your soil test, select your crop, and get
            an instant fertilizer recommendation tailored to your needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Fertilizers;
