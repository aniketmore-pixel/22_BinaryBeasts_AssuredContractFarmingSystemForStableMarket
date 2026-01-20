import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();


router.post("/", async (req, res) => {
    console.log("📥 Incoming create offer request");
    console.log(req.body);
  
    const {
      offer_id,
      buyer_user_id,
      crop_name,
      price_per_quintal,
      quantity,
      location,
      duration_months,
      quality_badges,
      delivery_start_date,
      offer_valid_till
    } = req.body;
  
    /* ------------------ Basic Validation ------------------ */
    if (
      !offer_id ||
      !buyer_user_id ||
      !crop_name ||
      !price_per_quintal ||
      !quantity ||
      !location ||
      !duration_months ||
      !delivery_start_date ||
      !offer_valid_till
    ) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }
  
    /* ------------------ Insert Offer ------------------ */
    const { data, error } = await supabase
      .from("offers")
      .insert([
        {
          offer_id,
          buyer_user_id,
          crop_name,
          price_per_quintal,
          quantity,
          location,
          duration_months,
          quality_badges,
          delivery_start_date,
          offer_valid_till
        }
      ])
      .select()
      .single();
  
    if (error) {
      console.error("❌ Offer insert error:", error);
      return res.status(500).json({ error: error.message });
    }
  
    console.log("✅ Offer created:", data.offer_id);
  
    res.status(201).json({
      message: "Offer created successfully",
      offer: data
    });
  });

/**
 * GET /api/offers
 */
router.get("/", async (req, res) => {
  console.log("➡️  [GET] /api/offers hit");

  try {
    console.log("🔌 Supabase client exists:", !!supabase);

    console.log("📡 Querying offers table...");

    const { data, error } = await supabase
      .from("offers")
      .select(`
        offer_id,
        crop_name,
        price_per_quintal,
        quantity,
        location,
        duration_months,
        quality_badges,
        buyer_profile (
          organization_name
        )
      `);

    console.log("📥 Raw Supabase response:", { data, error });

    if (error) {
      console.error("❌ Supabase query error:", error);
      return res.status(500).json({
        message: "Failed to fetch offers",
        supabaseError: error.message
      });
    }

    if (!data) {
      console.warn("⚠️ Supabase returned null data");
      return res.json([]);
    }

    console.log(`✅ ${data.length} offers fetched`);

    // Transform for frontend
    const formatted = data.map((o, index) => {
      console.log(`🔄 Transforming offer #${index + 1}`, o);

      return {
        id: o.offer_id,
        crop: o.crop_name,
        buyer: o.buyer_profile?.organization_name || "Unknown Buyer",
        verified: true, // later: derive from KYC / reliability
        price: o.price_per_quintal,
        unit: "Quintal",
        quantity: `${o.quantity} Quintals`,
        location: o.location,
        duration: `${o.duration_months} Months`,
        requirements: o.quality_badges || []
      };
    });

    console.log("📤 Sending formatted response:", formatted);

    res.json(formatted);
  } catch (err) {
    console.error("🔥 Unexpected server error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
  
    console.log("🔍 Fetching offer details for ID:", id);
  
    const { data, error } = await supabase
      .from("offers")
      .select(`
        offer_id,
        crop_name,
        price_per_quintal,
        quantity,
        location,
        duration_months,
        delivery_start_date,
        offer_valid_till,
        reliability_score,
        quality_badges,
        buyer_user_id,
        buyer_profile (
          organization_name,
          buyer_type,
          registered_address
        )
      `)
      .eq("offer_id", id)
      .single();
  
    if (error) {
      console.error("❌ Supabase error:", error);
      return res.status(404).json({ error: "Offer not found" });
    }
  
    res.json({
      id: data.offer_id,
      crop: data.crop_name,
      price: data.price_per_quintal,
      quantity: data.quantity,
      location: data.location,
      duration: `${data.duration_months} months`,
      delivery_start_date: data.delivery_start_date,
      validTill: data.offer_valid_till,
      reliabilityScore: data.reliability_score,
      requirements: data.quality_badges,
      buyer_user_id: data.buyer_user_id,  // <-- added this
      buyer: {
        name: data.buyer_profile.organization_name,
        type: data.buyer_profile.buyer_type,
        address: data.buyer_profile.registered_address
      }
    });
  });
  
  // GET /api/offers/:id/raw
router.get("/:id/raw", async (req, res) => {
    const { id } = req.params;
  
    const { data, error } = await supabase
      .from("offers")
      .select(`
        offer_id,
        crop_name,
        price_per_quintal,
        quantity,
        location,
        duration_months,
        delivery_start_date,
        offer_valid_till,
        buyer_user_id
      `)
      .eq("offer_id", id)
      .single();
  
    if (error) {
      return res.status(404).json({ error: "Offer not found" });
    }
  
    res.json(data);
  });
  

export default router;
