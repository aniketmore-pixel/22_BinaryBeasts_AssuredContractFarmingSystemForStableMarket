import express from "express";
import Contract from "../models/Contract.js";

const router = express.Router();

/* =========================
   1️⃣ Cancel Contract
   POST /api/contracts/:contractId/cancel
========================= */
router.post("/contracts/:contractId/cancel", async (req, res) => {
  const { contractId } = req.params;

  try {
    const contract = await Contract.findOne({ contract_id: contractId });
    if (!contract) return res.status(404).json({ error: "Contract not found" });

    contract.contract_status = "CANCELLED";
    await contract.save();

    res.json({ message: "Contract cancelled successfully", contract });
  } catch (err) {
    console.error("❌ Failed to cancel contract:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* =========================
   2️⃣ Raise Dispute
   POST /api/contracts/:contractId/dispute
========================= */
router.post("/contracts/:contractId/dispute", async (req, res) => {
  const { contractId } = req.params;
  const { note } = req.body; // optional dispute note from frontend

  try {
    const contract = await Contract.findOne({ contract_id: contractId });
    if (!contract) return res.status(404).json({ error: "Contract not found" });

    // You can decide whether to set a separate status or just add a note
    contract.farmer_dispute_note = note || "Dispute raised";
    await contract.save();

    res.json({ message: "Dispute raised successfully", contract });
  } catch (err) {
    console.error("❌ Failed to raise dispute:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* =========================
   3️⃣ Set as Delivered
   POST /api/contracts/:contractId/delivered
========================= */
router.post("/contracts/:contractId/delivered", async (req, res) => {
  const { contractId } = req.params;

  try {
    const contract = await Contract.findOne({ contract_id: contractId });
    if (!contract) return res.status(404).json({ error: "Contract not found" });

    contract.contract_status = "DELIVERED";
    await contract.save();

    res.json({ message: "Contract marked as delivered", contract });
  } catch (err) {
    console.error("❌ Failed to mark contract as delivered:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* =========================
   4️⃣ Approve Contract
   POST /api/contracts/:contractId/approve
========================= */
router.post("/contracts/:contractId/approve", async (req, res) => {
    const { contractId } = req.params;
  
    try {
      const contract = await Contract.findOne({ contract_id: contractId });
      if (!contract) return res.status(404).json({ error: "Contract not found" });
  
      contract.contract_status = "IN_PROGRESS";
      await contract.save();
  
      res.json({ message: "Contract approved successfully", contract });
    } catch (err) {
      console.error("❌ Failed to approve contract:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  /* =========================
     5️⃣ Reject Contract
     POST /api/contracts/:contractId/reject
  ========================= */
  router.post("/contracts/:contractId/reject", async (req, res) => {
    const { contractId } = req.params;
  
    try {
      const contract = await Contract.findOne({ contract_id: contractId });
      if (!contract) return res.status(404).json({ error: "Contract not found" });
  
      contract.contract_status = "REJECTED";
      await contract.save();
  
      res.json({ message: "Contract rejected successfully", contract });
    } catch (err) {
      console.error("❌ Failed to reject contract:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  /* =========================
   6️⃣ Resolve Dispute (Farmer)
   POST /api/contracts/:contractId/resolve
========================= */
router.post("/contracts/:contractId/resolve", async (req, res) => {
    const { contractId } = req.params;
  
    try {
      const contract = await Contract.findOne({ contract_id: contractId });
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }
  
      // Clear farmer dispute note only
      contract.farmer_dispute_note = "";
      await contract.save();
  
      res.json({
        message: "Dispute resolved from farmer side",
        contract
      });
    } catch (err) {
      console.error("❌ Failed to resolve dispute:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  /* =========================
   7️⃣ Add Buyer Dispute Note
   POST /api/contracts/:contractId/buyer-note
========================= */
router.post("/contracts/:contractId/buyer-note", async (req, res) => {
    const { contractId } = req.params;
    const { note } = req.body;
  
    try {
      const contract = await Contract.findOne({ contract_id: contractId });
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }
  
      contract.buyer_dispute_note = note || "";
      await contract.save();
  
      res.json({
        message: "Buyer dispute note added successfully",
        contract
      });
    } catch (err) {
      console.error("❌ Failed to add buyer dispute note:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  /* =========================
   8️⃣ Resolve Dispute (Buyer)
   POST /api/contracts/:contractId/resolve/buyer
========================= */
router.post("/contracts/:contractId/resolve/buyer", async (req, res) => {
    const { contractId } = req.params;
  
    try {
      const contract = await Contract.findOne({ contract_id: contractId });
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }
  
      contract.buyer_dispute_note = "";
      await contract.save();
  
      res.json({
        message: "Dispute resolved from buyer side",
        contract
      });
    } catch (err) {
      console.error("❌ Failed to resolve buyer dispute:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  

export default router;
