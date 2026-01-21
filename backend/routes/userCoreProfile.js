import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

/* =========================
   Get User Core Profile
   GET /api/profile/user-core/:userId
========================= */
router.get("/profile/user-core/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("name, email, phone")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("❌ user-core fetch failed:", error.message);
      return res.status(404).json({ error: "User not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
