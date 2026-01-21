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
  
  /* =========================
   Update Delivery Tracking
   POST /api/contracts/:contractId/update-delivery
========================= */
router.post("/contracts/:contractId/update-delivery", async (req, res) => {
  const { contractId } = req.params;
  const { delivery_tracking } = req.body;

  // Validate input
  const allowedStatuses = ["LAND", "SOWING", "IRRIGATION", "GROWTH", "HARVEST", "PACKING"];
  if (!allowedStatuses.includes(delivery_tracking)) {
    return res.status(400).json({ error: "Invalid delivery tracking status" });
  }

  try {
    const contract = await Contract.findOne({ contract_id: contractId });
    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }

    contract.delivery_tracking = delivery_tracking;
    await contract.save();

    res.json({
      message: `Delivery tracking updated to '${delivery_tracking}'`,
      contract,
    });
  } catch (err) {
    console.error("❌ Failed to update delivery tracking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/contracts/:contractId/current-delivery-status", async (req, res) => {
  const { contractId } = req.params;

  try {
    const contract = await Contract.findOne({ contract_id: contractId });
    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }

    res.json({
      contract_id: contract.contract_id,
      delivery_tracking: contract.delivery_tracking,
    });
  } catch (err) {
    console.error("❌ Failed to fetch delivery tracking status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Get contract participants (buyer org + farmer)
 * Used by blockchain audit UI
 */
router.get("/contracts/participants", async (req, res) => {
  try {
    const contracts = await Contract.find(
      {},
      {
        contract_id: 1,
        organization_name: 1,
        farmer_name: 1,
        _id: 0
      }
    );

    // Convert to lookup map
    const result = {};
    contracts.forEach((c) => {
      result[c.contract_id] = {
        organization_name: c.organization_name || "Unknown Organization",
        farmer_name: c.farmer_name || "Unknown Farmer"
      };
    });

    res.json(result);
  } catch (err) {
    console.error("❌ Contract participants error:", err);
    res.status(500).json({ error: "Failed to fetch contract participants" });
  }
});


export default router;
