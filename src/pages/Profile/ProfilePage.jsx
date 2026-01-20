import { useState } from "react";
import { Camera, MapPin, Mic } from "lucide-react";
import "./ProfilePage.css";

const cropOptions = ["Wheat", "Rice", "Cotton", "Sugarcane", "Maize", "Other"];

const ProfilePage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [farmer, setFarmer] = useState({
    name: "John Singh",
    email: "johnsingh@gmail.com",
    phone: "+91 98765 43210",
    age: "",
    gender: "",
    crops: [],
    otherCrop: "",
    location: "",
    landArea: "",
    bank: "",
    aadhar: "",
    photo: null,
  });

  /* ---------- COMMON HANDLERS ---------- */
  const saveProfileToBackend = async () => {
    const res = await fetch("http://localhost:5000/api/profile/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "demo-user-123", // replace with real auth id
      },
      body: JSON.stringify(farmer),
    });

    if (!res.ok) throw new Error("Save failed");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFarmer((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCrop = (crop) => {
    setFarmer((prev) => ({
      ...prev,
      crops: prev.crops.includes(crop)
        ? prev.crops.filter((c) => c !== crop)
        : [...prev.crops, crop],
      otherCrop: crop === "Other" ? prev.otherCrop : "",
    }));
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files?.[0]) {
      setFarmer((prev) => ({
        ...prev,
        photo: URL.createObjectURL(e.target.files[0]),
      }));
    }
  };

  /* ---------- LOCATION ---------- */

  const fetchLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setFarmer((prev) => ({
          ...prev,
          location: `Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`,
        }));
      },
      () => alert("Location permission denied"),
    );
  };

  /* ---------- AUDIO INPUT ---------- */

  const startVoiceInput = (field) => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript.replace(/\s/g, "");
      setFarmer((prev) => ({ ...prev, [field]: spokenText }));
    };
  };

  /* ---------- VALIDATION ---------- */

  const validateForm = () => {
    if (
      !farmer.name ||
      !farmer.phone ||
      !farmer.gender ||
      !farmer.location ||
      !farmer.landArea ||
      !farmer.photo ||
      farmer.crops.length === 0
    )
      return "Please fill all mandatory fields";

    if (Number(farmer.age) <= 0) return "Age must be greater than 0";

    if (farmer.crops.includes("Other") && !farmer.otherCrop)
      return "Please specify other crop";

    if (!/^\d{12}$/.test(farmer.aadhar))
      return "Aadhaar must be exactly 12 digits";

    if (!/^\d{9,18}$/.test(farmer.bank))
      return "Bank account must be 9–18 digits";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      farm_location: farmer.location,
      land_area: Number(farmer.landArea),
      primary_crops: farmer.crops,
      bank_account_last4: farmer.bank.slice(-4),
    };

    console.log("Sending payload:", payload);

    try {
      const res = await fetch("http://localhost:5000/api/farmer-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Profile saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  /* ---------- UI ---------- */

  return (
    <div className="profile-container">
      <h2 className="page-title">My Profile</h2>
      <p className="page-subtitle">
        Manage your personal and farming information
      </p>

      {error && <p className="error-text">{error}</p>}

      <form className="profile-card" onSubmit={handleSubmit}>
        {/* PHOTO */}
        <div className="photo-box">
          <div className="avatar-small">
            {farmer.photo ? <img src={farmer.photo} alt="Profile" /> : "JS"}
          </div>

          <label className="upload-btn">
            <Camera size={14} />
            Upload Photo *
            <input type="file" hidden onChange={handlePhotoUpload} />
          </label>
        </div>

        <div className="profile-form">
          <input
            name="name"
            value={farmer.name}
            onChange={handleChange}
            placeholder="Name *"
          />
          <input value={farmer.email} disabled />
          <input
            name="phone"
            value={farmer.phone}
            onChange={handleChange}
            placeholder="Phone *"
          />

          <input
            name="age"
            type="number"
            min="1"
            value={farmer.age}
            onChange={handleChange}
            placeholder="Age *"
          />

          <select name="gender" value={farmer.gender} onChange={handleChange}>
            <option value="">Select Gender *</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          {/* CROPS */}
          <div className="checkbox-group">
            {cropOptions.map((crop) => (
              <label key={crop}>
                <input
                  type="checkbox"
                  checked={farmer.crops.includes(crop)}
                  onChange={() => toggleCrop(crop)}
                />
                {crop}
              </label>
            ))}
          </div>

          {farmer.crops.includes("Other") && (
            <input
              name="otherCrop"
              value={farmer.otherCrop}
              onChange={handleChange}
              placeholder="Specify other crop *"
            />
          )}

          {/* LOCATION */}
          <div className="location-row">
            <input
              value={farmer.location}
              readOnly
              placeholder="Farm Location *"
            />
            <button type="button" onClick={fetchLocation}>
              <MapPin size={16} />
            </button>
          </div>

          {/* LAND */}
          <input
            name="landArea"
            value={farmer.landArea}
            onChange={handleChange}
            placeholder="Land Area (Acres) *"
          />

          {/* BANK */}
          <div className="audio-row">
            <input
              name="bank"
              value={farmer.bank}
              onChange={handleChange}
              placeholder="Bank Account (9–18 digits) *"
            />
            <button type="button" onClick={() => startVoiceInput("bank")}>
              <Mic size={16} />
            </button>
          </div>

          {/* AADHAAR */}
          <div className="audio-row">
            <input
              name="aadhar"
              value={farmer.aadhar}
              onChange={handleChange}
              placeholder="Aadhaar (12 digits) *"
            />
            <button type="button" onClick={() => startVoiceInput("aadhar")}>
              <Mic size={16} />
            </button>
          </div>

          <button className="submit-btn" type="submit">
            Save Profile
          </button>
        </div>
      </form>

      {submitted && <h3>✅ Profile Saved Successfully</h3>}
    </div>
  );
};

export default ProfilePage;
