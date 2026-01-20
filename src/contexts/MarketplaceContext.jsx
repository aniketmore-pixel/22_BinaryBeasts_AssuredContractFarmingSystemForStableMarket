import React, { createContext, useContext, useEffect, useState } from "react";

const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🟢 MarketplaceProvider mounted");
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    console.log("📡 Fetching offers from backend...");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/offers");

      console.log("📥 Response status:", res.status);
      console.log("📥 Response headers:", [...res.headers.entries()]);

      // 🚨 If backend returned HTML (like index.html or error page)
      const contentType = res.headers.get("content-type");
      console.log("📄 Content-Type:", contentType);

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("❌ Expected JSON but got:", text);
        throw new Error("Response is not JSON");
      }

      const data = await res.json();
      console.log("✅ Offers data received:", data);

      if (!Array.isArray(data)) {
        console.error("❌ Offers response is not an array:", data);
        throw new Error("Invalid data format");
      }

      setOffers(data);
      console.log(`📦 ${data.length} offers stored in state`);
    } catch (err) {
      console.error("🔥 Failed to fetch offers:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      console.log("⏹ Fetch offers completed");
    }
  };

  const applyForOffer = (offer) => {
    console.log("📝 Applied for offer:", {
      id: offer.id,
      crop: offer.crop,
      buyer: offer.buyer
    });
    // later → POST /applications
  };

  return (
    <MarketplaceContext.Provider
      value={{
        offers,
        loading,
        error,
        applyForOffer
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) {
    throw new Error("useMarketplace must be used inside MarketplaceProvider");
  }
  return ctx;
};
