import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

// GET farmer profile by logged-in user
router.get("/farmer-profile/by-user/:userId", async (req, res) => {
  const { userId } = req.params;

  console.log("-------------------------------------------------");
  console.log("🔍 Received request to fetch farmer profile");
  console.log("📌 userId from params:", userId);

  if (!userId) {
    console.warn("⚠️ No userId provided in request params");
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const { data, error } = await supabase
      .from("farmer_profile")
      .select("id, user_id")  // also select user_id for verification
      .eq("user_id", userId)
      .maybeSingle();          // safer than .single() to avoid crashing if no row

    console.log("📦 Supabase response:", { data, error });

    if (error) {
      console.error("❌ Supabase returned an error:", error);
      return res.status(500).json({ error: "Supabase query failed", details: error });
    }

    if (!data) {
      console.warn("⚠️ No farmer_profile found for userId:", userId);
      return res.status(404).json({ error: "Farmer profile not found" });
    }

    console.log("✅ Found farmer profile ID:", data.id);
    console.log("✅ Associated user_id in table:", data.user_id);

    res.json({ farmer_profile_id: data.id });
  } catch (err) {
    console.error("💥 Unexpected server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }

  console.log("-------------------------------------------------");
});

export default router;
