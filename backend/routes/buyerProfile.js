import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

/**
 * GET /api/buyer-profile/:userId
 * userId = users.id (from localStorage)
 */
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  console.log("🔍 Fetching buyer profile for user:", userId);

  const { data, error } = await supabase
    .from("buyer_profile")
    .select("user_id, organization_name, buyer_type, registered_address")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("❌ Buyer profile fetch error:", error.message);
    return res.status(404).json({ error: "Buyer profile not found" });
  }

  console.log("✅ Buyer profile found:", data);

  res.json(data);
});





export default router;
