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

router.post("/onboard-create", async (req, res) => {
  const { user_id, buyer_type, organization_name, registered_address } = req.body;

  if (!user_id || !buyer_type || !organization_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data, error } = await supabase
      .from("buyer_profile")
      .upsert(
        {
          user_id,
          buyer_type,
          organization_name,
          registered_address,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("❌ buyer profile save failed:", error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      message: "Buyer profile saved successfully",
      buyer_profile: data,
    });
  } catch (err) {
    console.error("❌ buyer profile save failed:", err);
    res.status(500).json({ error: "Server error" });
  }
});




export default router;
