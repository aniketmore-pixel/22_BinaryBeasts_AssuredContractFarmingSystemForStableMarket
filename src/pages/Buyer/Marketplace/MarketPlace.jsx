import { useState } from "react";
import { farmers } from "./farmersDat.js";
import FarmersCards from "./FarmersCards.jsx";
import "./FarmersMarketPlace.css";

function MarketPlace() {
  const [query, setQuery] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = farmers
    .filter((f) => {
      const q = query.toLowerCase();

      const name = f.name?.toLowerCase() || "";
      const location =
        typeof f.location === "string" ? f.location.toLowerCase() : "";

      const crops = Array.isArray(f.primaryCrop)
        ? f.primaryCrop.join(" ").toLowerCase()
        : "";

      return name.includes(q) || location.includes(q) || crops.includes(q);
    })
    .sort((a, b) => {
      const scoreA = a.experience * 5 - a.disputes * 3;
      const scoreB = b.experience * 5 - b.disputes * 3;
      return sortDesc ? scoreB - scoreA : scoreA - scoreB;
    });

  return (
    <div className="marketplace">
      <div className="marketplace-header">
        <h2>Farmer Marketplace</h2>

        <div className="controls">
          <input
            type="text"
            placeholder="Search farmer, crop, location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button className="sort-btn" onClick={() => setSortDesc(!sortDesc)}>
            Sort by Score {sortDesc ? "↓" : "↑"}
          </button>
        </div>
      </div>

      <div className="farmers-grid">
        {filtered.map((farmer) => (
          <FarmersCards key={farmer.id} farmer={farmer} />
        ))}
      </div>
    </div>
  );
}

export default MarketPlace;
