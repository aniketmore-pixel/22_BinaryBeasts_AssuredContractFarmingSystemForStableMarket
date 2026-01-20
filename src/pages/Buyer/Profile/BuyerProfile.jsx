import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import "./BuyerProfile.css";

const buyerTypes = ["Hotel", "Supplier", "Retailer", "Exporter", "Wholesaler"];

function BuyerProfile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [buyer, setBuyer] = useState({
    name: "",
    email: "",
    mobile: "",
    buyerType: "",
    organization: "",
    address: "",
    photo: null,
  });

  /* ---------------- LOAD USER (MOCK / FROM STORAGE) ---------------- */

  useEffect(() => {
    loadBuyer();
  }, []);

  const loadBuyer = () => {
    /**
     * Replace this later with:
     * - auth context
     * - JWT decode
     * - backend API
     */

    const mockUser = {
      name: "John Singh",
      email: "johnsingh@gmail.com",
      mobile: "+91 98765 43210",
    };

    setBuyer((prev) => ({
      ...prev,
      ...mockUser,
    }));

    setLoading(false);
  };

  /* ---------------- HANDLERS ---------------- */

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

  /* ---------------- VALIDATION ---------------- */

  const validateForm = () => {
    if (
      !buyer.buyerType ||
      !buyer.organization ||
      !buyer.address ||
      !buyer.photo
    ) {
      return "Please fill all required fields";
    }
    return "";
  };

  /* ---------------- SAVE PROFILE ---------------- */

  const saveProfile = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      name: buyer.name,
      email: buyer.email,
      mobile: buyer.mobile,
      buyer_type: buyer.buyerType,
      organization_name: buyer.organization,
      registered_address: buyer.address,
    };

    console.log("Buyer Profile Payload:", payload);

    try {
      // TEMP: simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      setError("");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  /* ---------------- UI ---------------- */

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
            Upload Photo *
            <input type="file" hidden onChange={handlePhotoUpload} />
          </label>
        </div>

        {/* FORM */}
        <div className="profile-form">
          <input value={buyer.name} disabled />
          <input value={buyer.email} disabled />
          <input value={buyer.mobile} disabled />

          <select
            name="buyerType"
            value={buyer.buyerType}
            onChange={handleChange}
          >
            <option value="">Select Buyer Type *</option>
            {buyerTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            name="organization"
            value={buyer.organization}
            onChange={handleChange}
            placeholder="Organization Name *"
          />

          <textarea
            name="address"
            value={buyer.address}
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
