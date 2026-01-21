import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import "./BuyerProfile.css";

const BUYER_TYPES = [
  "HOTEL",
  "PROCESSOR",
  "WHOLESALER",
  "RETAILER",
  "EXPORTER",
  "COOPERATIVE",
  "GOVERNMENT",
];

function BuyerProfile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [buyer, setBuyer] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    buyer_type: "",
    organization_name: "",
    registered_address: "",
    photo: null,
  });

  /* =========================
     LOAD USER FROM LOCALSTORAGE → BACKEND
  ========================= */
  useEffect(() => {
    const initProfile = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setError("User not logged in");
        return;
      }

      const user = JSON.parse(userStr);
      console.log(user.id);

      try {
        const res = await fetch(
          `http://localhost:5000/api/profile/user-core/${user.id}`
        );
        const data = await res.json();

        setBuyer((prev) => ({
          ...prev,
          userId: user.id,
          name: data.name,
          email: data.email,
          phone: data.phone || "",
        }));
      } catch (err) {
        console.error(err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    initProfile();
  }, []);

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBuyer((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files?.[0]) {
      setBuyer((prev) => ({
        ...prev,
        photo: URL.createObjectURL(e.target.files[0]),
      }));
    }
  };

  /* =========================
     SAVE BUYER PROFILE
  ========================= */
  const saveProfile = async (e) => {
    e.preventDefault();

    if (
      !buyer.buyer_type ||
      !buyer.organization_name ||
      !buyer.registered_address
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/buyer-profile/onboard-create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: buyer.userId,
            buyer_type: buyer.buyer_type,
            organization_name: buyer.organization_name,
            registered_address: buyer.registered_address,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save profile");
        return;
      }

      setSubmitted(true);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <h2 className="page-title">Buyer Profile</h2>
      <p className="page-subtitle">
        Complete your buyer details to start procurement
      </p>

      {error && <p className="error-text">{error}</p>}

      <form className="profile-card" onSubmit={saveProfile}>
        {/* PHOTO */}
        <div className="photo-box">
          <div className="avatar-small">
            {buyer.photo ? <img src={buyer.photo} alt="Profile" /> : "👤"}
          </div>

          <label className="upload-btn">
            <Camera size={14} />
            Upload Photo
            <input type="file" hidden onChange={handlePhotoUpload} />
          </label>
        </div>

        {/* FORM */}
        <div className="profile-form">
        <input value={buyer.name} readOnly className="readonly-input" />
        <input value={buyer.email} readOnly className="readonly-input" />
        <input value={buyer.phone} readOnly className="readonly-input" />

          <select
            name="buyer_type"
            value={buyer.buyer_type}
            onChange={handleChange}
          >
            <option value="">Select Buyer Type *</option>
            {BUYER_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            name="organization_name"
            value={buyer.organization_name}
            onChange={handleChange}
            placeholder="Organization Name *"
          />

          <textarea
            name="registered_address"
            value={buyer.registered_address}
            onChange={handleChange}
            placeholder="Registered Office Address *"
            rows={3}
          />

          <button className="submit-btn" type="submit">
            Save Buyer Profile
          </button>
        </div>
      </form>

      {submitted && <h3>✅ Buyer Profile Saved Successfully</h3>}
    </div>
  );
}

export default BuyerProfile;
