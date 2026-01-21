import { useEffect, useState } from "react";
import FarmersCards from "./FarmersCards.jsx";
import "./FarmersMarketPlace.css";

function MarketPlace() {
  const [farmers, setFarmers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/get-all-farmers"
        );
        const data = await res.json();
        setFarmers(data);
      } catch (err) {
        console.error("❌ Failed to load farmers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  const filtered = farmers.filter((f) => {
    const q = query.toLowerCase();

    const name = f.name?.toLowerCase() || "";
    const location = f.farm_location?.toLowerCase() || "";
    const crops = f.primary_crops?.toLowerCase() || "";

    return (
      name.includes(q) ||
      location.includes(q) ||
      crops.includes(q)
    );
  });

  if (loading) return <p>Loading farmers...</p>;

  return (
    <div className="marketplace">
      <div className="marketplace-header">
        <h2>Farmer Marketplace</h2>

        <div className="controls">
          <input
            type="text"
            placeholder="Search name, crop, location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
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
