import express from "express";
import Contract from "../models/Contract.js";

const router = express.Router();

router.post("/mongo-test", async (req, res) => {
  const contract = await Contract.create({
    contract_id: "test-123",
    buyer_profile_id: "buyer-1",
    farmer_profile_id: "farmer-1",
    farmer_action: "COUNTER_OFFER",
    crop_name: "Wheat",
    price_per_quintal: 2500
  });

  res.json(contract);
});

export default router;
