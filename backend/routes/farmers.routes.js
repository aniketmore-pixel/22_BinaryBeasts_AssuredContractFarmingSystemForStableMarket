import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

/* =========================
   GET ALL FARMERS
   GET /api/get-all-farmers
========================= */
router.get("/get-all-farmers", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("farmer_profile")
      .select(`
        id,
        farm_location,
        primary_crops,
        users (
          id,
          name,
          email,
          phone
        )
      `);

    if (error) {
      console.error("❌ Supabase error:", error);
      return res.status(500).json({ error: "Failed to fetch farmers" });
    }

    // Flatten response
    const farmers = data.map((f) => ({
      id: f.id,
      user_id: f.users?.id,
      name: f.users?.name,
      email: f.users?.email,
      phone: f.users?.phone,
      farm_location: f.farm_location,
      primary_crops: f.primary_crops,
    }));

    res.json(farmers);
  } catch (err) {
    console.error("❌ get-all-farmers failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
