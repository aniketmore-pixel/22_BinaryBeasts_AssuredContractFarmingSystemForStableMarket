// backend/routes/counterOfferRoutes.js
import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

// CHECK if farmer can place a counter offer for a given offer
router.get("/counter-offer/check/:offerId/:farmerProfileId", async (req, res) => {
  const { offerId, farmerProfileId } = req.params;

  console.log("-------------------------------------------------");
  console.log("🔍 Checking if counter offer can be placed");
  console.log("📌 offerId:", offerId);
  console.log("📌 farmerProfileId:", farmerProfileId);

  if (!offerId || !farmerProfileId) {
    return res.status(400).json({ error: "Missing offerId or farmerProfileId" });
  }

  try {
    const { data, error } = await supabase
      .from("counter_contract")
      .select("turn")
      .eq("farmer_profile_id", farmerProfileId)
      .eq("buyer_profile_id", offerId) // adjust if your offerId is not buyer_profile_id
      .maybeSingle();

    if (error) {
      console.error("❌ Supabase query error:", error);
      return res.status(500).json({ error: "Supabase query failed", details: error });
    }

    if (data?.turn >= 1) {
      console.log("⚠️ Farmer has already placed a counter offer");
      return res.status(403).json({ message: "You have already placed a counter offer" });
    }

    console.log("✅ Farmer can place a counter offer");
    res.json({ canPlaceCounterOffer: true });
  } catch (err) {
    console.error("💥 Unexpected error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }

  console.log("-------------------------------------------------");
});

export default router;
