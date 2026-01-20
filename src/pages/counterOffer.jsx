// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function CounterOffer() {
//   const { offerId } = useParams();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     crop_name: "",
//     price_per_quintal: "",
//     quantity: "",
//     location: "",
//     duration_months: "",
//     delivery_start_date: "",
//     offer_valid_till: "",
//     buyer_profile_id: "",
//     farmer_profile_id: "",
//     turn: 0
//   });

//   /* ---------------- FETCH FARMER PROFILE ---------------- */
//   const fetchFarmerProfile = async (userId) => {
//     console.log("🟡 fetchFarmerProfile called with userId:", userId);

//     if (!userId) {
//       console.warn("⚠️ No userId provided to fetchFarmerProfile");
//       return null;
//     }

//     try {
//       // ✅ Correctly use the userId argument
//       const res = await axios.get(
//         `http://localhost:5000/api/farmer-profile/by-user/${userId}`
//       );

//       console.log("✅ Farmer profile API response:", res.data);

//       if (!res.data || !res.data.farmer_profile_id) {
//         console.warn("⚠️ Farmer profile ID missing in response:", res.data);
//         return null;
//       }

//       return res.data.farmer_profile_id;
//     } catch (err) {
//       console.error(
//         "❌ Failed to fetch farmer profile:",
//         err.response?.data || err.message
//       );
//       return null;
//     }
//   };

//   /* ---------------- FETCH ORIGINAL OFFER ---------------- */
//   useEffect(() => {
//     console.log("🟡 CounterOffer mounted");
//     console.log("📌 offerId from URL:", offerId);

//     const initializeForm = async () => {
//       // get logged-in user from localStorage
//       const userStr = localStorage.getItem("user");
//       console.log("📦 Raw user from localStorage:", userStr);

//       if (!userStr) {
//         console.error("❌ No user found in localStorage");
//         return;
//       }

//       let user;
//       try {
//         user = JSON.parse(userStr);
//         console.log("✅ Parsed user object:", user);
//       } catch (err) {
//         console.error("❌ Failed to parse user JSON:", err);
//         return;
//       }

//       // ✅ Pass the correct user.id to fetchFarmerProfile
//       const farmerProfileId = await fetchFarmerProfile(user.id);
//       console.log("📌 Fetched farmerProfileId:", farmerProfileId);

//       try {
//         const res = await axios.get(`http://localhost:5000/api/offers/${offerId}`);
//         console.log("✅ Offer fetched from backend:", res.data);

//         if (!res.data) {
//           console.warn("⚠️ Backend returned empty offer data");
//           return;
//         }

//         setForm({
//           crop_name: res.data.crop,
//           price_per_quintal: res.data.price,
//           quantity: res.data.quantity,
//           location: res.data.location,
//           duration_months: parseInt(res.data.duration),
//           delivery_start_date: res.data.delivery_start_date,
//           offer_valid_till: res.data.validTill,
//           buyer_profile_id: res.data.buyer_user_id,
//           farmer_profile_id: farmerProfileId, // dynamically fetched
//           turn: res.data.turn ?? 0
//         });

//         console.log("📦 Form state initialized:", {
//           crop_name: res.data.crop,
//           buyer_profile_id: res.data.buyer_user_id,
//           farmer_profile_id: farmerProfileId
//         });
//       } catch (err) {
//         console.error("❌ Failed to fetch offer:", err.response?.data || err.message);
//       }
//     };

//     initializeForm();
//   }, [offerId]);

//   /* ---------------- HANDLE FORM CHANGE ---------------- */
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     console.log("✏️ handleChange called for field:", name, "value:", value);

//     setForm((prev) => {
//       const newState = { ...prev, [name]: value };
//       console.log("📦 Updated form state:", newState);
//       return newState;
//     });
//   };

//   const checkIfAlreadyCountered = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:5000/api/cntr/check",
//         {
//           params: {
//             buyer_profile_id: form.buyer_profile_id,
//             farmer_profile_id: form.farmer_profile_id,
//             crop_name: form.crop_name
//           }
//         }
//       );
  
//       if (res.data.alreadyCountered) {
//         alert(res.data.message || "Already countered");
//         return true;
//       }
  
//       return false;
//     } catch (err) {
//       if (err.response?.status === 409) {
//         alert(err.response.data.message);
//         return true;
//       }
  
//       console.error("❌ Counter check failed:", err);
//       alert("Unable to verify counter offer. Try again.");
//       return true; // fail safe
//     }
//   };
  

//   /* ---------------- SUBMIT COUNTER OFFER ---------------- */
//   const submitCounter = async () => {
//     console.log("🟡 submitCounter called with form state:", form);

//     const payload = {
//       // buyer_profile_id: form.buyer_profile_id,
//       buyer_user_id: form.buyer_profile_id,
//       farmer_profile_id: form.farmer_profile_id,
//       crop_name: form.crop_name,
//       price_per_quintal: Number(form.price_per_quintal),
//       quantity: Number(form.quantity),
//       location: form.location,
//       duration_months: Number(form.duration_months),
//       delivery_start_date: form.delivery_start_date,
//       offer_valid_till: form.offer_valid_till,
//       previous_turn: form.turn
//     };

//     console.log("🚀 Final payload to backend:", payload);

//     if (!payload.farmer_profile_id) {
//       console.error("❌ Cannot submit: farmer_profile_id is null or undefined");
//       return;
//     }

//     const alreadyCountered = await checkIfAlreadyCountered();
//   if (alreadyCountered) return;

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/counter-contract",
//         payload
//       );
//       console.log("✅ Backend response:", res.data);
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("❌ Counter offer submission failed:", err.response?.data || err.message);
//     }
//   };

  

//   return (
//     <div>
//       <h2>Counter Offer</h2>

//       <input
//         name="price_per_quintal"
//         placeholder="Price per Quintal"
//         value={form.price_per_quintal}
//         onChange={handleChange}
//       />

//       <input
//         name="quantity"
//         placeholder="Quantity"
//         value={form.quantity}
//         onChange={handleChange}
//       />

//       <input
//         name="duration_months"
//         placeholder="Duration (months)"
//         value={form.duration_months}
//         onChange={handleChange}
//       />

//       <button onClick={submitCounter}>Submit Counter Offer</button>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function CounterOffer() {
//   const { offerId } = useParams();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     crop_name: "",
//     price_per_quintal: "",
//     quantity: "",
//     location: "",
//     duration_months: "",
//     delivery_start_date: "",
//     offer_valid_till: "",
//     buyer_profile_id: "",
//     farmer_profile_id: "",
//     turn: 0,
//     notes: "" // ✅ added notes field
//   });

//   /* ---------------- FETCH FARMER PROFILE ---------------- */
//   const fetchFarmerProfile = async (userId) => {
//     console.log("🟡 fetchFarmerProfile called with userId:", userId);

//     if (!userId) {
//       console.warn("⚠️ No userId provided to fetchFarmerProfile");
//       return null;
//     }

//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/farmer-profile/by-user/${userId}`
//       );

//       console.log("✅ Farmer profile API response:", res.data);

//       if (!res.data || !res.data.farmer_profile_id) {
//         console.warn("⚠️ Farmer profile ID missing in response:", res.data);
//         return null;
//       }

//       return res.data.farmer_profile_id;
//     } catch (err) {
//       console.error(
//         "❌ Failed to fetch farmer profile:",
//         err.response?.data || err.message
//       );
//       return null;
//     }
//   };

//   /* ---------------- FETCH ORIGINAL OFFER ---------------- */
//   useEffect(() => {
//     console.log("🟡 CounterOffer mounted");
//     console.log("📌 offerId from URL:", offerId);

//     const initializeForm = async () => {
//       const userStr = localStorage.getItem("user");
//       console.log("📦 Raw user from localStorage:", userStr);

//       if (!userStr) {
//         console.error("❌ No user found in localStorage");
//         return;
//       }

//       let user;
//       try {
//         user = JSON.parse(userStr);
//         console.log("✅ Parsed user object:", user);
//       } catch (err) {
//         console.error("❌ Failed to parse user JSON:", err);
//         return;
//       }

//       const farmerProfileId = await fetchFarmerProfile(user.id);
//       console.log("📌 Fetched farmerProfileId:", farmerProfileId);

//       try {
//         const res = await axios.get(`http://localhost:5000/api/offers/${offerId}`);
//         console.log("✅ Offer fetched from backend:", res.data);

//         if (!res.data) {
//           console.warn("⚠️ Backend returned empty offer data");
//           return;
//         }

//         setForm({
//           crop_name: res.data.crop,
//           price_per_quintal: res.data.price,
//           quantity: res.data.quantity,
//           location: res.data.location,
//           duration_months: parseInt(res.data.duration),
//           delivery_start_date: res.data.delivery_start_date,
//           offer_valid_till: res.data.validTill,
//           buyer_profile_id: res.data.buyer_user_id,
//           farmer_profile_id: farmerProfileId,
//           turn: res.data.turn ?? 0,
//           notes: "" // ✅ initialize notes as empty
//         });

//         console.log("📦 Form state initialized:", {
//           crop_name: res.data.crop,
//           buyer_profile_id: res.data.buyer_user_id,
//           farmer_profile_id: farmerProfileId
//         });
//       } catch (err) {
//         console.error("❌ Failed to fetch offer:", err.response?.data || err.message);
//       }
//     };

//     initializeForm();
//   }, [offerId]);

//   /* ---------------- HANDLE FORM CHANGE ---------------- */
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     console.log("✏️ handleChange called for field:", name, "value:", value);

//     setForm((prev) => {
//       const newState = { ...prev, [name]: value };
//       console.log("📦 Updated form state:", newState);
//       return newState;
//     });
//   };

//   const checkIfAlreadyCountered = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:5000/api/cntr/check",
//         {
//           params: {
//             buyer_profile_id: form.buyer_profile_id,
//             farmer_profile_id: form.farmer_profile_id,
//             crop_name: form.crop_name
//           }
//         }
//       );

//       if (res.data.alreadyCountered) {
//         alert(res.data.message || "Already countered");
//         return true;
//       }

//       return false;
//     } catch (err) {
//       if (err.response?.status === 409) {
//         alert(err.response.data.message);
//         return true;
//       }

//       console.error("❌ Counter check failed:", err);
//       alert("Unable to verify counter offer. Try again.");
//       return true;
//     }
//   };

//   /* ---------------- SUBMIT COUNTER OFFER ---------------- */
//   const submitCounter = async () => {
//     console.log("🟡 submitCounter called with form state:", form);

//     const payload = {
//       buyer_user_id: form.buyer_profile_id,
//       farmer_profile_id: form.farmer_profile_id,
//       crop_name: form.crop_name,
//       price_per_quintal: Number(form.price_per_quintal),
//       quantity: Number(form.quantity),
//       location: form.location,
//       duration_months: Number(form.duration_months),
//       delivery_start_date: form.delivery_start_date,
//       offer_valid_till: form.offer_valid_till,
//       previous_turn: form.turn,
//       notes: form.notes // ✅ include notes in payload
//     };

//     console.log("🚀 Final payload to backend:", payload);

//     if (!payload.farmer_profile_id) {
//       console.error("❌ Cannot submit: farmer_profile_id is null or undefined");
//       return;
//     }

//     const alreadyCountered = await checkIfAlreadyCountered();
//     if (alreadyCountered) return;

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/counter-contract",
//         payload
//       );
//       console.log("✅ Backend response:", res.data);
//       navigate("/farmer/offers");
//     } catch (err) {
//       console.error("❌ Counter offer submission failed:", err.response?.data || err.message);
//     }
//   };

//   return (
//     <div>
//       <h2>Counter Offer</h2>

//       <input
//         name="price_per_quintal"
//         placeholder="Price per Quintal"
//         value={form.price_per_quintal}
//         onChange={handleChange}
//       />

//       <input
//         name="quantity"
//         placeholder="Quantity"
//         value={form.quantity}
//         onChange={handleChange}
//       />

//       <input
//         name="duration_months"
//         placeholder="Duration (months)"
//         value={form.duration_months}
//         onChange={handleChange}
//       />

//       {/* ✅ Notes input field */}
//       <textarea
//         name="notes"
//         placeholder="Add a note (optional)"
//         value={form.notes}
//         onChange={handleChange}
//         rows={4}
//         style={{ width: "100%", marginTop: "10px" }}
//       />

//       <button onClick={submitCounter} style={{ marginTop: "10px" }}>
//         Submit Counter Offer
//       </button>
//     </div>
//   );
// }






import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./CounterOffer.module.css"; // We'll use a CSS module similar to FindOffers
import { toast } from "react-hot-toast"; // for toast notifications

export default function CounterOffer() {
  const { offerId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    crop_name: "",
    price_per_quintal: "",
    quantity: "",
    location: "",
    duration_months: "",
    delivery_start_date: "",
    offer_valid_till: "",
    buyer_profile_id: "",
    farmer_profile_id: "",
    turn: 0,
    notes: "" // added notes field
  });

  const fetchFarmerProfile = async (userId) => {
    if (!userId) return null;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/farmer-profile/by-user/${userId}`
      );
      return res.data?.farmer_profile_id || null;
    } catch (err) {
      console.error("❌ Failed to fetch farmer profile:", err);
      return null;
    }
  };

  useEffect(() => {
    const initializeForm = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      let user;
      try {
        user = JSON.parse(userStr);
      } catch { return; }

      const farmerProfileId = await fetchFarmerProfile(user.id);

      try {
        const res = await axios.get(`http://localhost:5000/api/offers/${offerId}`);
        if (!res.data) return;

        setForm({
          crop_name: res.data.crop,
          price_per_quintal: res.data.price,
          quantity: res.data.quantity,
          location: res.data.location,
          duration_months: parseInt(res.data.duration),
          delivery_start_date: res.data.delivery_start_date,
          offer_valid_till: res.data.validTill,
          buyer_profile_id: res.data.buyer_user_id,
          farmer_profile_id: farmerProfileId,
          turn: res.data.turn ?? 0,
          notes: ""
        });
      } catch (err) {
        console.error("❌ Failed to fetch offer:", err);
      }
    };

    initializeForm();
  }, [offerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const checkIfAlreadyCountered = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/cntr/check",
        {
          params: {
            buyer_profile_id: form.buyer_profile_id,
            farmer_profile_id: form.farmer_profile_id,
            crop_name: form.crop_name
          }
        }
      );
      if (res.data.alreadyCountered) {
        alert(res.data.message || "Already countered");
        return true;
      }
      return false;
    } catch (err) {
      if (err.response?.status === 409) {
        alert(err.response.data.message);
        return true;
      }
      console.error("❌ Counter check failed:", err);
      alert("Unable to verify counter offer. Try again.");
      return true;
    }
  };

  const submitCounter = async () => {
    const payload = {
      buyer_user_id: form.buyer_profile_id,
      farmer_profile_id: form.farmer_profile_id,
      crop_name: form.crop_name,
      price_per_quintal: Number(form.price_per_quintal),
      quantity: Number(form.quantity),
      location: form.location,
      duration_months: Number(form.duration_months),
      delivery_start_date: form.delivery_start_date,
      offer_valid_till: form.offer_valid_till,
      previous_turn: form.turn,
      notes: form.notes
    };

    if (!payload.farmer_profile_id) return;

    const alreadyCountered = await checkIfAlreadyCountered();
    if (alreadyCountered) return;

    try {
      await axios.post("http://localhost:5000/api/counter-contract", payload);
      alert("Counter offer submitted successfully!");
      navigate("/farmer/offers");
    } catch (err) {
      console.error("❌ Counter offer submission failed:", err.response?.data || err.message);
      alert("Failed to submit counter offer. Try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Submit Counter Offer</h1>
        <p className={styles.subtitle}>Adjust your offer details and add a note if needed.</p>
      </div>

      <div className={styles.formCard}>
        <div className={styles.inputGroup}>
          <label>Price per Quintal</label>
          <input
            name="price_per_quintal"
            value={form.price_per_quintal}
            onChange={handleChange}
            placeholder="₹ per quintal"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Quantity</label>
          <input
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Duration (months)</label>
          <input
            name="duration_months"
            value={form.duration_months}
            onChange={handleChange}
            placeholder="Duration in months"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Add a note (optional)"
            rows={4}
          />
        </div>

        <button className={styles.submitButton} onClick={submitCounter}>
          Submit Counter Offer
        </button>
      </div>
    </div>
  );
}
