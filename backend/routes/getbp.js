import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

router.get("/profile-id/:userId", async (req, res) => {
    const { userId } = req.params;
  
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
  
    try {
      const { data, error } = await supabase
        .from("buyer_profile")
        .select("id")
        .eq("user_id", userId)
        .single();
  
      if (error) {
        console.error("❌ Supabase error:", error);
        return res.status(404).json({ error: "Buyer profile not found" });
      }
  
      return res.json({
        buyer_profile_id: data.id
      });
  
    } catch (err) {
      console.error("❌ Server error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  export default router;