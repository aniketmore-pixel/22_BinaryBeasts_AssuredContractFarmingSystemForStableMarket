// routes/counterCheck.js
import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

/**
 * GET /api/cntr/check
 * Checks if a farmer has already placed a counter offer
 * Accepts buyer_user_id for legacy reasons but does NOT use it
 */
router.get("/cntr/check", async (req, res) => {
  try {
    const { buyer_user_id, farmer_profile_id, crop_name } = req.query;

    console.log("🔍 Counter check request:", {
      buyer_user_id, // just for logging
      farmer_profile_id,
      crop_name
    });

    /* ---------------- VALIDATION ---------------- */
    if (!farmer_profile_id || !crop_name) {
      return res.status(400).json({
        error: "farmer_profile_id and crop_name are required"
      });
    }

    /* ---------------- CHECK COUNTER CONTRACT ---------------- */
    const { data, error } = await supabase
      .from("counter_contract")
      .select("contract_id")
      .eq("farmer_profile_id", farmer_profile_id)
      .eq("crop_name", crop_name)
      .maybeSingle();

    if (error) {
      console.error("❌ Supabase error:", error);
      return res.status(500).json({ error: "DB check failed" });
    }

    if (data) {
      return res.status(409).json({
        alreadyCountered: true,
        message: "You have already placed a counter offer for this crop"
      });
    }

    return res.json({ alreadyCountered: false });
  } catch (err) {
    console.error("🔥 Counter check failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
