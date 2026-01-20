import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateOffer.module.css";
import { Plus, X } from "lucide-react";

const CreateOffer = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    crop_name: "",
    price_per_quintal: "",
    quantity: "",
    location: "",
    duration_months: "",
    delivery_start_date: "",
    offer_valid_till: "",
    quality_badges: []
  });

  const [reqInput, setReqInput] = useState("");
  const [loading, setLoading] = useState(false);

  /* -------------------- Helpers -------------------- */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRequirement = (e) => {
    e.preventDefault();
    if (reqInput.trim()) {
      setFormData({
        ...formData,
        quality_badges: [...formData.quality_badges, reqInput.trim()]
      });
      setReqInput("");
    }
  };

  const removeRequirement = (index) => {
    const updated = formData.quality_badges.filter((_, i) => i !== index);
    setFormData({ ...formData, quality_badges: updated });
  };

  /* -------------------- Submit -------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      /* 1️⃣ Get logged-in user */
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) throw new Error("User not logged in");

      /* 2️⃣ Fetch buyer_profile.user_id using users.id */
      const buyerProfileRes = await fetch(
        `http://localhost:5000/api/buyer-profile/${user.id}`
      );

      if (!buyerProfileRes.ok) {
        throw new Error("Buyer profile not found");
      }

      const buyerProfile = await buyerProfileRes.json();

      /* 3️⃣ Construct offer payload */
      const payload = {
        offer_id: crypto.randomUUID(),
        buyer_user_id: buyerProfile.user_id,

        crop_name: formData.crop_name,
        price_per_quintal: Number(formData.price_per_quintal),
        quantity: Number(formData.quantity),
        location: formData.location,
        duration_months: Number(formData.duration_months),

        quality_badges: formData.quality_badges,

        delivery_start_date: formData.delivery_start_date,
        offer_valid_till: formData.offer_valid_till
      };

      /* 4️⃣ Send to backend */
      const res = await fetch("http://localhost:5000/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to create offer");
      }

      alert("✅ Offer Published Successfully!");
      navigate("/buyer/contracts");

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h1>Create New Contract Offer</h1>
        <p>Post your requirements to find suitable farmers.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>

          <Input label="Crop Name" name="crop_name" value={formData.crop_name} onChange={handleChange} required />

          <Input label="Price (₹ / Quintal)" type="number" name="price_per_quintal" value={formData.price_per_quintal} onChange={handleChange} required />

          <Input label="Quantity (Quintals)" type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />

          <Input label="Location" name="location" value={formData.location} onChange={handleChange} required />

          <Input label="Duration (Months)" type="number" name="duration_months" value={formData.duration_months} onChange={handleChange} required />

          <Input label="Delivery Start Date" type="date" name="delivery_start_date" value={formData.delivery_start_date} onChange={handleChange} required />

          <Input label="Offer Valid Till" type="date" name="offer_valid_till" value={formData.offer_valid_till} onChange={handleChange} required />

          {/* Quality Badges */}
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Quality Requirements</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                className={styles.input}
                placeholder="e.g. Moisture < 12%"
                value={reqInput}
                onChange={(e) => setReqInput(e.target.value)}
              />
              <button type="button" onClick={handleAddRequirement}>
                <Plus />
              </button>
            </div>

            <div className={styles.requirementsContainer}>
              {formData.quality_badges.map((req, i) => (
                <span key={i} className={styles.reqTag}>
                  {req}
                  <X size={14} onClick={() => removeRequirement(i)} />
                </span>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Publishing..." : "🚀 Publish Offer"}
        </button>
      </form>
    </div>
  );
};

/* -------------------- Reusable Input -------------------- */
const Input = ({ label, ...props }) => (
  <div className={styles.inputGroup}>
    <label className={styles.label}>{label}</label>
    <input className={styles.input} {...props} />
  </div>
);

export default CreateOffer;
