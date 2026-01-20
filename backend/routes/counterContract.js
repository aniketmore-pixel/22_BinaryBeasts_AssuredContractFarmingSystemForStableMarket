// import express from "express";
// import { supabase } from "../config/supabase.js";

// const router = express.Router();

// /**
//  * Farmer creates a counter offer
//  */
// router.post("/counter-contract", async (req, res) => {
//   console.log("📥 [POST] /counter-contract hit");
//   console.log("📦 Raw request body:", req.body);

//   try {
//     const {
//       buyer_profile_id,
//       farmer_profile_id,
//       crop_name,
//       price_per_quintal,
//       quantity,
//       location,
//       duration_months,
//       quality_badges,
//       delivery_start_date,
//       offer_valid_till,
//       previous_turn
//     } = req.body;

//     console.log("🔍 Parsed fields:", {
//       buyer_profile_id,
//       farmer_profile_id,
//       crop_name,
//       price_per_quintal,
//       quantity,
//       location,
//       duration_months,
//       delivery_start_date,
//       offer_valid_till,
//       previous_turn
//     });

//     const insertPayload = {
//       buyer_profile_id,
//       farmer_profile_id,
//       crop_name,
//       price_per_quintal,
//       quantity,
//       location,
//       duration_months,
//       quality_badges,
//       delivery_start_date,
//       offer_valid_till,
//       turn: (previous_turn ?? 0) + 1,
//       agree: 0,
//       contract_status: false,
//       status: "PENDING"
//     };

//     console.log("🧾 Final Supabase insert payload:");
//     console.table(insertPayload);

//     const { data, error } = await supabase
//       .from("counter_contract")
//       .insert([insertPayload])
//       .select()
//       .single();

//     if (error) {
//       console.error("❌ Supabase insert error:", error);
//       return res.status(500).json({
//         error: error.message,
//         details: error
//       });
//     }

//     console.log("✅ Counter contract created:", data);

//     res.status(201).json({
//       message: "Counter offer created successfully",
//       counter_contract: data
//     });

//   } catch (err) {
//     console.error("🔥 Unexpected server error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// /**
//  * Accept counter contract
//  */
// router.post("/counter-contract/:id/accept", async (req, res) => {
//   console.log("✍️ [POST] /counter-contract/:id/accept");
//   console.log("📌 Contract ID:", req.params.id);
//   console.log("📦 Body:", req.body);

//   const { role } = req.body;

//   const updates =
//     role === "FARMER"
//       ? { farmer_signature: "SIGNED", agree: 1 }
//       : { buyer_signature: "SIGNED", agree: 1 };

//   console.log("🛠 Applying updates:", updates);

//   const { data, error } = await supabase
//     .from("counter_contract")
//     .update(updates)
//     .eq("contract_id", req.params.id)
//     .select()
//     .single();

//   if (error) {
//     console.error("❌ Accept update failed:", error);
//     return res.status(500).json({ error: error.message });
//   }

//   if (data.farmer_signature && data.buyer_signature) {
//     console.log("✅ Both parties signed. Finalizing contract...");

//     await supabase
//       .from("counter_contract")
//       .update({
//         contract_status: true,
//         status: "FINALIZED"
//       })
//       .eq("contract_id", req.params.id);
//   }

//   res.json({ message: "Accepted successfully" });
// });

// export default router;


// import express from "express";
// import { supabase } from "../config/supabase.js";

// const router = express.Router();

// /**
//  * Farmer creates a counter offer
//  */
// router.post("/counter-contract", async (req, res) => {
//   console.log("📥 [POST] /counter-contract hit");
//   console.log("📦 Raw request body:", req.body);

//   try {
//     const {
//       buyer_user_id, // <-- frontend sends user_id, not profile_id
//       farmer_profile_id,
//       crop_name,
//       price_per_quintal,
//       quantity,
//       location,
//       duration_months,
//       quality_badges,
//       delivery_start_date,
//       offer_valid_till,
//       previous_turn
//     } = req.body;

//     if (!buyer_user_id || !farmer_profile_id || !crop_name) {
//       return res.status(400).json({ error: "buyer_user_id, farmer_profile_id, crop_name are required" });
//     }

//     // Resolve actual buyer_profile_id
//     const { data: buyerProfile, error: buyerErr } = await supabase
//       .from("buyer_profile")
//       .select("id")
//       .eq("user_id", buyer_user_id)
//       .single();

//     if (buyerErr || !buyerProfile) {
//       console.error("❌ Buyer profile not found:", buyerErr);
//       return res.status(404).json({ error: "Buyer profile not found" });
//     }

//     const buyer_profile_id = buyerProfile.id;

//     const insertPayload = {
//       buyer_profile_id,
//       farmer_profile_id,
//       crop_name,
//       price_per_quintal,
//       quantity,
//       location,
//       duration_months,
//       quality_badges,
//       delivery_start_date,
//       offer_valid_till,
//       turn: (previous_turn ?? 0) + 1,
//       agree: 0,
//       contract_status: false,
//       status: "PENDING"
//     };

//     console.log("🧾 Final Supabase insert payload:");
//     console.table(insertPayload);

//     const { data, error } = await supabase
//       .from("counter_contract")
//       .insert([insertPayload])
//       .select()
//       .single();

//     if (error) {
//       console.error("❌ Supabase insert error:", error);
//       return res.status(500).json({ error: error.message, details: error });
//     }

//     console.log("✅ Counter contract created:", data);

//     res.status(201).json({
//       message: "Counter offer created successfully",
//       counter_contract: data
//     });

//   } catch (err) {
//     console.error("🔥 Unexpected server error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;

// import express from "express";
// import { supabase } from "../config/supabase.js";
// import Contract from "../models/Contract.js";


// const router = express.Router();

// const farmer_action = "COUNTER_OFFER";

/**
 * Farmer creates a counter offer
 */
// router.post("/counter-contract", async (req, res) => {
//   console.log("📥 [POST] /counter-contract hit");
//   console.log("📦 Raw request body:", req.body);

//   try {
//     const {
//       buyer_user_id, // <-- frontend sends user_id
//       farmer_profile_id,
//       crop_name,
//       price_per_quintal,
//       quantity,
//       location,
//       duration_months,
//       quality_badges,
//       delivery_start_date,
//       offer_valid_till,
//       previous_turn,
//       notes // ✅ new field from frontend
//     } = req.body;

//     if (!buyer_user_id || !farmer_profile_id || !crop_name) {
//       return res.status(400).json({
//         error: "buyer_user_id, farmer_profile_id, crop_name are required"
//       });
//     }

//     // Resolve actual buyer_profile_id
//     const { data: buyerProfile, error: buyerErr } = await supabase
//       .from("buyer_profile")
//       .select("id")
//       .eq("user_id", buyer_user_id)
//       .single();

//     if (buyerErr || !buyerProfile) {
//       console.error("❌ Buyer profile not found:", buyerErr);
//       return res.status(404).json({ error: "Buyer profile not found" });
//     }

//     const buyer_profile_id = buyerProfile.id;

//     const insertPayload = {
//       buyer_profile_id,
//       farmer_profile_id,
//       crop_name,
//       price_per_quintal,
//       quantity,
//       location,
//       duration_months,
//       quality_badges,
//       delivery_start_date,
//       offer_valid_till,
//       turn: (previous_turn ?? 0) + 1,
//       agree: 0,
//       contract_status: false,
//       status: "PENDING",
//       notes // ✅ include notes in insert
//     };

//     console.log("🧾 Final Supabase insert payload:");
//     console.table(insertPayload);

//     const { data, error } = await supabase
//       .from("counter_contract")
//       .insert([insertPayload])
//       .select()
//       .single();

//     if (error) {
//       console.error("❌ Supabase insert error:", error);
//       return res.status(500).json({ error: error.message, details: error });
//     }

//     console.log("✅ Counter contract created:", data);

//     res.status(201).json({
//       message: "Counter offer created successfully",
//       counter_contract: data
//     });

//   } catch (err) {
//     console.error("🔥 Unexpected server error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });


// router.post("/counter-contract", async (req, res) => {
//   console.log("📥 [POST] /counter-contract hit");
//   console.log("📦 Raw request body:", req.body);

//   try {
//     const {
//       buyer_user_id,
//       farmer_profile_id,
//       crop_name,
//       price_per_quintal,
//       quantity,
//       location,
//       duration_months,
//       quality_badges,
//       delivery_start_date,
//       delivery_end_date,
//       offer_valid_till,
//       previous_turn,
//       notes
//     } = req.body;

//     if (!buyer_user_id || !farmer_profile_id || !crop_name) {
//       return res.status(400).json({
//         error: "buyer_user_id, farmer_profile_id, crop_name are required"
//       });
//     }

//     /* ==============================
//        1. Resolve buyer_profile_id
//     ============================== */
//     const { data: buyerProfile, error: buyerErr } = await supabase
//       .from("buyer_profile")
//       .select("id")
//       .eq("user_id", buyer_user_id)
//       .single();

//     if (buyerErr || !buyerProfile) {
//       return res.status(404).json({ error: "Buyer profile not found" });
//     }

//     const buyer_profile_id = buyerProfile.id;

//     /* ==============================
//        2. Insert into Supabase
//     ============================== */
//     const insertPayload = {
//       buyer_profile_id,
//       farmer_profile_id,
//       crop_name,
//       price_per_quintal,
//       quantity,
//       location,
//       duration_months,
//       quality_badges,
//       delivery_start_date,
//       offer_valid_till,
//       turn: (previous_turn ?? 0) + 1,
//       agree: 0,
//       contract_status: false,
//       status: "PENDING",
//       notes
//     };

//     const { data: counterContract, error: insertErr } = await supabase
//       .from("counter_contract")
//       .insert([insertPayload])
//       .select()
//       .single();

//     if (insertErr) {
//       console.error("❌ Supabase insert error:", insertErr);
//       return res.status(500).json({ error: insertErr.message });
//     }

//     /* ==============================
//        3. Insert MongoDB document
//     ============================== */
//     const mongoContract = await Contract.create({
//       contract_id: counterContract.contract_id,

//       buyer_profile_id,
//       farmer_profile_id,
//       farmer_action: "COUNTER_OFFER",
//       contract_status: "PENDING_BUYER_APPROVAL",

//       crop_name,
//       price_per_quintal,
//       quantity,
//       location,
//       duration_months,
//       quality_badges,

//       delivery_start_date,
//       delivery_end_date,
//       notes
//     });

//     /* ==============================
//        4. Success response
//     ============================== */
//     res.status(201).json({
//       message: "Counter offer created successfully",
//       supabase_contract: counterContract,
//       mongo_contract: mongoContract
//     });

//   } catch (err) {
//     console.error("🔥 Unexpected server error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });


// export default router;


// import express from "express";
// import { supabase } from "../config/supabase.js";
// import Contract from "../models/Contract.js";

// const router = express.Router();
// const farmer_action = "COUNTER_OFFER";

// /**
//  * Farmer creates a counter offer
//  */
// router.post("/counter-contract", async (req, res) => {
//   console.log("📥 [POST] /counter-contract hit");
//   console.log("📦 Raw request body:", req.body);

//   try {
//     const {
//       buyer_user_id,
//       farmer_profile_id,
//       crop_name,
//       price_per_quintal,
//       quantity,
//       location,
//       duration_months,
//       quality_badges,
//       delivery_start_date,
//       delivery_end_date,
//       offer_valid_till,
//       previous_turn,
//       notes
//     } = req.body;

//     if (!buyer_user_id || !farmer_profile_id || !crop_name) {
//       return res.status(400).json({
//         error: "buyer_user_id, farmer_profile_id, crop_name are required"
//       });
//     }

//     /* ==============================
//        1. Resolve buyer_profile_id
//     ============================== */
//     const { data: buyerProfile, error: buyerErr } = await supabase
//       .from("buyer_profile")
//       .select("id, organization_name, buyer_type, registered_address")
//       .eq("id", buyer_user_id) // assuming frontend sends buyer_profile id here
//       .single();

//     if (buyerErr || !buyerProfile) {
//       return res.status(404).json({ error: "Buyer profile not found" });
//     }

//     const buyer_profile_id = buyerProfile.id;
//     const { organization_name, buyer_type, registered_address } = buyerProfile;

//     /* ==============================
//        2. Insert into Supabase
//     ============================== */
//     const insertPayload = {
//       buyer_profile_id,
//       farmer_profile_id,
//       crop_name,
//       price_per_quintal,
//       quantity,
//       location,
//       duration_months,
//       quality_badges,
//       delivery_start_date,
//       offer_valid_till,
//       turn: (previous_turn ?? 0) + 1,
//       agree: 0,
//       contract_status: false,
//       status: "PENDING",
//       notes
//     };

//     const { data: counterContract, error: insertErr } = await supabase
//       .from("counter_contract")
//       .insert([insertPayload])
//       .select()
//       .single();

//     if (insertErr) {
//       console.error("❌ Supabase insert error:", insertErr);
//       return res.status(500).json({ error: insertErr.message });
//     }

//     /* ==============================
//        3. Insert MongoDB document
//     ============================== */
//     const mongoContract = await Contract.create({
//       contract_id: counterContract.contract_id,

//       buyer_profile_id,
//       farmer_profile_id,
//       farmer_action: "COUNTER_OFFER",
//       contract_status: "PENDING_BUYER_APPROVAL",

//       crop_name,
//       price_per_quintal,
//       quantity,
//       location,
//       duration_months,
//       quality_badges,

//       delivery_start_date,
//       delivery_end_date,
//       notes,

//       /* ===== New fields from buyer_profile ===== */
//       organization_name,
//       buyer_type,
//       registered_address
//     });

//     /* ==============================
//        4. Success response
//     ============================== */
//     res.status(201).json({
//       message: "Counter offer created successfully",
//       supabase_contract: counterContract,
//       mongo_contract: mongoContract
//     });

//   } catch (err) {
//     console.error("🔥 Unexpected server error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;




import express from "express";
import { supabase } from "../config/supabase.js";
import Contract from "../models/Contract.js";
import { v4 as uuidv4 } from "uuid";


const router = express.Router();
const farmer_action = "COUNTER_OFFER";

/**
 * Farmer creates a counter offer
 */
router.post("/counter-contract", async (req, res) => {
  console.log("📥 [POST] /counter-contract hit");
  console.log("📦 Raw request body:", req.body);

  try {
    const {
      buyer_user_id,
      farmer_profile_id,
      crop_name,
      price_per_quintal,
      quantity,
      location,
      duration_months,
      quality_badges,
      delivery_start_date,
      delivery_end_date,
      offer_valid_till,
      previous_turn,
      notes
    } = req.body;

    if (!buyer_user_id || !farmer_profile_id || !crop_name) {
      return res.status(400).json({
        error: "buyer_user_id, farmer_profile_id, crop_name are required"
      });
    }

    /* ==============================
       1. Resolve buyer_profile info
    ============================== */
    const { data: buyerProfile, error: buyerErr } = await supabase
      .from("buyer_profile")
      .select("id, organization_name, buyer_type, registered_address")
      .eq("user_id", buyer_user_id)
      .single();

    if (buyerErr || !buyerProfile) {
      return res.status(404).json({ error: "Buyer profile not found" });
    }

    const buyer_profile_id = buyerProfile.id;
    const { organization_name, buyer_type, registered_address } = buyerProfile;

    /* ==============================
       2. Resolve farmer name
    ============================== */
    const { data: farmerProfile, error: farmerErr } = await supabase
      .from("farmer_profile")
      .select("user_id")
      .eq("id", farmer_profile_id)
      .single();

    if (farmerErr || !farmerProfile) {
      return res.status(404).json({ error: "Farmer profile not found" });
    }

    const { data: farmerUser, error: userErr } = await supabase
      .from("users")
      .select("name")
      .eq("id", farmerProfile.user_id)
      .single();

    if (userErr || !farmerUser) {
      return res.status(404).json({ error: "Farmer user not found" });
    }

    const farmer_name = farmerUser.name;

    /* ==============================
       3. Insert into Supabase
    ============================== */
    const insertPayload = {
      buyer_profile_id,
      farmer_profile_id,
      crop_name,
      price_per_quintal,
      quantity,
      location,
      duration_months,
      quality_badges,
      delivery_start_date,
      offer_valid_till,
      turn: (previous_turn ?? 0) + 1,
      agree: 0,
      contract_status: false,
      status: "PENDING",
      notes
    };

    const { data: counterContract, error: insertErr } = await supabase
      .from("counter_contract")
      .insert([insertPayload])
      .select()
      .single();

    if (insertErr) {
      console.error("❌ Supabase insert error:", insertErr);
      return res.status(500).json({ error: insertErr.message });
    }

    /* ==============================
       4. Insert MongoDB document
    ============================== */
    const mongoContract = await Contract.create({
      contract_id: counterContract.contract_id,

      buyer_profile_id,
      farmer_profile_id,
      farmer_name,

      farmer_action: "COUNTER_OFFER",
      contract_status: "PENDING_BUYER_APPROVAL",

      crop_name,
      price_per_quintal,
      quantity,
      location,
      duration_months,
      quality_badges,

      delivery_start_date,
      delivery_end_date,
      notes,

      organization_name,
      buyer_type,
      registered_address
    });

    /* ==============================
       5. Success response
    ============================== */
    res.status(201).json({
      message: "Counter offer created successfully",
      supabase_contract: counterContract,
      mongo_contract: mongoContract
    });

  } catch (err) {
    console.error("🔥 Unexpected server error:", err);
    res.status(500).json({ error: err.message });
  }
});


router.post("/accept-offer", async (req, res) => {
  console.log("📥 [POST] /accept-offer hit");
  console.log("📦 Body:", req.body);

  const contract_id = uuidv4(); 

  try {
    const {
      buyer_user_id,
      farmer_profile_id,
      crop_name,
      price_per_quintal,
      quantity,
      location,
      duration_months,
      quality_badges,
      delivery_start_date,
      delivery_end_date,
      offer_valid_till,
      notes
    } = req.body;

    if (!buyer_user_id || !farmer_profile_id || !crop_name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    /* ==============================
       1. Resolve buyer profile
    ============================== */
    const { data: buyerProfile } = await supabase
      .from("buyer_profile")
      .select("id, organization_name, buyer_type, registered_address")
      .eq("user_id", buyer_user_id)
      .single();

    if (!buyerProfile) {
      return res.status(404).json({ error: "Buyer profile not found" });
    }

    const { id: buyer_profile_id, organization_name, buyer_type, registered_address } = buyerProfile;

    /* ==============================
       2. Resolve farmer name
    ============================== */
    const { data: farmerProfile } = await supabase
      .from("farmer_profile")
      .select("user_id")
      .eq("id", farmer_profile_id)
      .single();

    const { data: farmerUser } = await supabase
      .from("users")
      .select("name")
      .eq("id", farmerProfile.user_id)
      .single();

    const farmer_name = farmerUser.name;

    /* ==============================
       3. Insert into Supabase
    ============================== */
    const { data: acceptedContract } = await supabase
      .from("counter_contract")
      .insert([{
        contract_id,
        buyer_profile_id,
        farmer_profile_id,
        crop_name,
        price_per_quintal,
        quantity,
        location,
        duration_months,
        quality_badges,
        delivery_start_date,
        offer_valid_till,
        turn: 1,
        agree: 1,
        contract_status: false,
        status: "PENDING",
        notes
      }])
      .select()
      .single();

      console.log("🧪 acceptedContract from Supabase:", acceptedContract);

    /* ==============================
       4. Insert into MongoDB
    ============================== */
    const mongoContract = await Contract.create({
      contract_id: acceptedContract.contract_id,

      buyer_profile_id,
      farmer_profile_id,
      farmer_name,

      farmer_action: "APPROVE", // ✅ ONLY DIFFERENCE
      contract_status: "PENDING_BUYER_APPROVAL",

      crop_name,
      price_per_quintal,
      quantity,
      location,
      duration_months,
      quality_badges,

      delivery_start_date,
      delivery_end_date,
      notes,

      organization_name,
      buyer_type,
      registered_address
    });

    /* ==============================
       5. Response
    ============================== */
    res.status(201).json({
      message: "Offer accepted successfully",
      supabase_contract: acceptedContract,
      mongo_contract: mongoContract
    });

  } catch (err) {
    console.error("🔥 error:", err);
    res.status(500).json({ error: err.message });
  }
});



export default router;
