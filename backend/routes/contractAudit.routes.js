// routes/contractAudit.routes.js
import express from "express";
import ContractAudit from "../models/ContractAudit.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const audits = await ContractAudit.find()
    .sort({ timestamp: 1 })
    .lean();

  // group by contract_id
  const grouped = {};
  audits.forEach((a) => {
    if (!grouped[a.contract_id]) grouped[a.contract_id] = [];
    grouped[a.contract_id].push(a);
  });

  res.json(grouped);
});

export default router;
