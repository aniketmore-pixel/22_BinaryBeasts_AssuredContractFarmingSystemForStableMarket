import React from "react";
import { useLocation } from "react-router-dom";
import "./fertilizer-result.css";

const FertilizerResult = () => {
  const location = useLocation();
  const recommendation =
    location.state?.recommendation || "No Advice Available";

  return (
    <div className="fertilizer-result-page">
  <div className="result-card">
    <h2 className="page-title">Fertilizer Suggestion</h2>

    <div className="result-box">
      <div
        className="result-text"
        dangerouslySetInnerHTML={{ __html: recommendation }}
      />
    </div>
  </div>
</div>

  );
};

export default FertilizerResult;
