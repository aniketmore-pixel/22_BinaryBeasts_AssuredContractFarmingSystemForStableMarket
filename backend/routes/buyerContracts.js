import express from "express";
import Contract from "../models/Contract.js";

const router = express.Router();

/**
 * GET contracts for a specific buyer
 * /api/contracts/buyer/:buyerProfileId
 */
router.get("/contracts/buyer/:buyerProfileId", async (req, res) => {
    console.log("🔥 buyer contracts route hit:", req.params.buyerProfileId);

  const { buyerProfileId } = req.params;

  if (!buyerProfileId) {
    return res.status(400).json({ error: "buyerProfileId is required" });
  }

  try {
    const contracts = await Contract.find({
      buyer_profile_id: buyerProfileId
    }).sort({ created_at: -1 });

    return res.json(contracts);
  } catch (err) {
    console.error("❌ Failed to fetch buyer contracts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/contracts/farmer/:farmerProfileId", async (req, res) => {
    console.log(
      "🔥 farmer contracts route hit:",
      req.params.farmerProfileId
    );
  
    const { farmerProfileId } = req.params;
  
    if (!farmerProfileId) {
      return res.status(400).json({
        error: "farmerProfileId is required"
      });
    }
  
    try {
      const contracts = await Contract.find({
        farmer_profile_id: farmerProfileId
      }).sort({ created_at: -1 });
  
      return res.json(contracts);
    } catch (err) {
      console.error("❌ Failed to fetch farmer contracts:", err);
      return res.status(500).json({
        error: "Internal server error"
      });
    }
  });

export default router;
