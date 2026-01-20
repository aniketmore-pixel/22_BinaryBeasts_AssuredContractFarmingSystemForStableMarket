// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { MapPin, Calendar, Scale, ShieldCheck, ArrowLeft } from "lucide-react";

// const OfferDetails = () => {
//     const { offerId } = useParams();
//     const navigate = useNavigate();

//     const [offer, setOffer] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [counterPrice, setCounterPrice] = useState("");
//     const [counterQty, setCounterQty] = useState("");

//     useEffect(() => {
//         const fetchOffer = async () => {
//             try {
//                 const res = await fetch(`http://localhost:5000/api/offers/${offerId}`);
//                 const data = await res.json();
//                 setOffer(data);
//             } catch (err) {
//                 console.error("Failed to load offer", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOffer();
//     }, [offerId]);

//     const fetchFarmerProfile = async (userId) => {
//         if (!userId) return null;
//         try {
//           const res = await axios.get(
//             `http://localhost:5000/api/farmer-profile/by-user/${userId}`
//           );
//           return res.data?.farmer_profile_id || null;
//         } catch (err) {
//           console.error("❌ Failed to fetch farmer profile:", err);
//           return null;
//         }
//       };
      

//     if (loading) return <p style={{ textAlign: "center" }}>Loading offer...</p>;
//     if (!offer) return <p style={{ textAlign: "center" }}>Offer not found</p>;

//     const handleAccept = async () => {
//         try {
//           const userStr = localStorage.getItem("user");
//           if (!userStr) return alert("User not logged in");
      
//           const user = JSON.parse(userStr);
      
//           // 🔑 Same logic as CounterOffer
//           const farmerProfileId = await fetchFarmerProfile(user.id);
//           if (!farmerProfileId) {
//             return alert("Farmer profile not found");
//           }
      
//           const payload = {
//             buyer_user_id: offer.buyer_user_id, // ✅ from offer API
//             farmer_profile_id: farmerProfileId,
      
//             crop_name: offer.crop,
//             price_per_quintal: offer.price,
//             quantity: offer.quantity,
//             location: offer.location,
//             duration_months: Number(offer.duration),
//             quality_badges: offer.requirements ?? [],
      
//             delivery_start_date: offer.deliveryStartDate,
//             delivery_end_date: offer.deliveryEndDate,
//             offer_valid_till: offer.validTill,
      
//             notes: "Farmer accepted offer without changes"
//           };
      
//           await axios.post(
//             "http://localhost:5000/api/accept-offer",
//             payload
//           );
      
//           alert("Offer accepted successfully!");
//           navigate("/farmer/contracts");
      
//         } catch (err) {
//           console.error("❌ Accept failed:", err.response?.data || err.message);
//           alert("Failed to accept offer");
//         }
//       };
      
      

//     const handleCounterOffer = () => {
//         if (!counterPrice || !counterQty) return alert("Enter price and quantity");
//         // TODO: Call backend to submit counter offer
//         alert(`Counter offer submitted: ₹${counterPrice} / ${counterQty} Quintals`);
//     };

//     return (
//         <div style={{ maxWidth: "960px", margin: "2.5rem auto", padding: "0 1rem" }}>
//             {/* Back Button */}
//             <button
//                 onClick={() => navigate(-1)}
//                 style={{
//                     display: "inline-flex",
//                     alignItems: "center",
//                     gap: "0.5rem",
//                     backgroundColor: "#16a34a",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: "8px",
//                     padding: "0.45rem 0.9rem",
//                     fontSize: "0.9rem",
//                     cursor: "pointer",
//                     marginBottom: "1.25rem",
//                     boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
//                 }}
//             >
//                 <ArrowLeft size={16} />
//                 Back to offers
//             </button>

//             {/* Card */}
//             <div
//                 style={{
//                     background: "#ffffff",
//                     borderRadius: "14px",
//                     padding: "2rem",
//                     boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
//                     border: "1px solid #f0f0f0"
//                 }}
//             >
//                 {/* Header */}
//                 <div style={{ marginBottom: "1.5rem" }}>
//                     <h1 style={{ margin: 0, fontSize: "1.9rem" }}>{offer.crop}</h1>
//                     <p
//                         style={{
//                             marginTop: "0.4rem",
//                             color: "#555",
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "0.4rem"
//                         }}
//                     >
//                         <strong>{offer.buyer.name}</strong>
//                         <ShieldCheck size={16} color="#16a34a" />
//                     </p>
//                     <h2 style={{ marginTop: "1rem", color: "#15803d", fontSize: "1.5rem" }}>
//                         ₹{offer.price} / Quintal
//                     </h2>
//                 </div>

//                 {/* Key Details */}
//                 <div
//                     style={{
//                         display: "grid",
//                         gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//                         gap: "1rem",
//                         marginBottom: "2rem"
//                     }}
//                 >
//                     <Detail icon={<Scale size={18} />} label="Quantity" value={`${offer.quantity} Quintals`} />
//                     <Detail icon={<MapPin size={18} />} label="Location" value={offer.location} />
//                     <Detail icon={<Calendar size={18} />} label="Duration" value={offer.duration} />
//                     <Detail label="Delivery Start" value={offer.deliveryStartDate} />
//                     <Detail label="Valid Till" value={offer.validTill} />
//                     <Detail label="Reliability Score" value={offer.reliabilityScore ?? "—"} />
//                 </div>

//                 {/* Quality */}
//                 <Section title="Quality Requirements">
//                     <ul style={{ paddingLeft: "1.2rem" }}>
//                         {offer.requirements?.map((r, i) => (
//                             <li key={i} style={{ marginBottom: "0.4rem" }}>{r}</li>
//                         ))}
//                     </ul>
//                 </Section>

//                 {/* Buyer */}
//                 <Section title="Buyer Details">
//                     <p><strong>Type:</strong> {offer.buyer.type}</p>
//                     <p><strong>Address:</strong> {offer.buyer.address}</p>
//                 </Section>

//                 {/* Action Buttons */}
//                 <div style={{ display: "flex", gap: "1rem", marginTop: "2.5rem" }}>
//                     <button
//                         style={{
//                             flex: 1,
//                             padding: "0.75rem 1.8rem",
//                             backgroundColor: "#16a34a",
//                             color: "#fff",
//                             border: "none",
//                             borderRadius: "10px",
//                             cursor: "pointer",
//                             fontSize: "1rem",
//                             fontWeight: "600",
//                             boxShadow: "0 4px 12px rgba(0,0,0,0.18)"
//                         }}
//                         onClick={handleAccept}
//                     >
//                         Accept
//                     </button>

//                     <button
//                         style={{
//                             flex: 1,
//                             padding: "0.75rem 1.8rem",
//                             backgroundColor: "#fff",
//                             color: "#16a34a",
//                             border: "2px solid #16a34a",
//                             borderRadius: "10px",
//                             cursor: "pointer",
//                             fontSize: "1rem",
//                             fontWeight: "600",
//                             boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
//                         }}
//                         onClick={() => navigate(`/offers/${offerId}/counter`)}
//                     >
//                         Counter Offer
//                     </button>

//                 </div>

               
//             </div>
//         </div>
//     );
// };

// /* Reusable UI Helpers */
// const Section = ({ title, children }) => (
//     <div style={{ marginTop: "1.8rem" }}>
//         <h3 style={{ marginBottom: "0.75rem", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.4rem" }}>{title}</h3>
//         {children}
//     </div>
// );

// const Detail = ({ icon, label, value }) => (
//     <div style={{ background: "#f9fafb", padding: "0.9rem", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
//         <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>{icon} {label}</p>
//         <p style={{ margin: "0.2rem 0 0", fontWeight: "600" }}>{value}</p>
//     </div>
// );

// export default OfferDetails;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Scale, ShieldCheck, ArrowLeft } from "lucide-react";
import axios from "axios";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";


const OfferDetails = () => {
    const { offerId } = useParams();
    const navigate = useNavigate();

    
    const [showContractModal, setShowContractModal] = useState(false);
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);

    const sigCanvasRef = useRef(null);
    const contractRef = useRef(null);

    // Note: These state variables were present but not fully utilized in the UI provided
    const [counterPrice, setCounterPrice] = useState("");
    const [counterQty, setCounterQty] = useState("");

    // LOGGING: Component Init
    console.log("📍 [OfferDetails] Component Rendered. Offer ID:", offerId);

    useEffect(() => {
        const fetchOffer = async () => {
            console.log(`🔄 [fetchOffer] Fetching details for Offer ID: ${offerId}...`);
            try {
                const res = await fetch(`http://localhost:5000/api/offers/${offerId}`);
                console.log(res);
                console.log("📡 [fetchOffer] Raw response status:", res.status);
                
                const data = await res.json();
                console.log("✅ [fetchOffer] Data received:", data);
                
                setOffer(data);
            } catch (err) {
                console.error("❌ [fetchOffer] Failed to load offer:", err);
            } finally {
                setLoading(false);
                console.log("🏁 [fetchOffer] Loading state set to false");
            }
        };

        if (offerId) {
            fetchOffer();
        } else {
            console.warn("⚠️ [OfferDetails] No offerId present in params");
        }
    }, [offerId]);

    const fetchFarmerProfile = async (userId) => {
        console.log(`🔍 [fetchFarmerProfile] Fetching profile for User ID: ${userId}`);
        
        if (!userId) {
            console.warn("⚠️ [fetchFarmerProfile] User ID is missing, aborting fetch.");
            return null;
        }

        try {
            const res = await axios.get(
                `http://localhost:5000/api/farmer-profile/by-user/${userId}`
            );
            
            console.log("✅ [fetchFarmerProfile] API Response:", res.data);
            const profileId = res.data?.farmer_profile_id || null;
            console.log("🆔 [fetchFarmerProfile] Extracted Profile ID:", profileId);
            
            return profileId;
        } catch (err) {
            console.error("❌ [fetchFarmerProfile] Failed request:", err.message);
            return null;
        }
    };

    if (loading) return <p style={{ textAlign: "center" }}>Loading offer...</p>;
    if (!offer) return <p style={{ textAlign: "center" }}>Offer not found</p>;

    // const handleAccept = async () => {
    //     console.log("🖱️ [handleAccept] Accept button clicked");

    //     try {
    //         // 1. Get User
    //         const userStr = localStorage.getItem("user");
    //         console.log("📂 [handleAccept] LocalStorage 'user':", userStr);

    //         if (!userStr) {
    //             console.error("❌ [handleAccept] User not found in localStorage");
    //             return alert("User not logged in");
    //         }

    //         const user = JSON.parse(userStr);
    //         console.log("👤 [handleAccept] Parsed User Object:", user);

    //         // 2. Get Farmer Profile
    //         console.log("🔄 [handleAccept] Calling fetchFarmerProfile...");
    //         const farmerProfileId = await fetchFarmerProfile(user.id);
            
    //         if (!farmerProfileId) {
    //             console.error("❌ [handleAccept] Could not retrieve farmerProfileId");
    //             return alert("Farmer profile not found");
    //         }

    //         // 3. Construct Payload
    //         const payload = {
    //             buyer_user_id: offer.buyer_user_id,
    //             farmer_profile_id: farmerProfileId,

    //             crop_name: offer.crop,
    //             price_per_quintal: offer.price,
    //             quantity: offer.quantity,
    //             location: offer.location,
    //             duration_months: Number(offer.duration),
    //             quality_badges: offer.requirements ?? [],

    //             delivery_start_date: offer.deliveryStartDate,
    //             delivery_end_date: offer.deliveryEndDate,
    //             offer_valid_till: offer.validTill,

    //             notes: "Farmer accepted offer without changes"
    //         };

    //         console.log("📦 [handleAccept] Constructed Payload for API:", payload);

    //         // 4. Send Request
    //         console.log("🚀 [handleAccept] Sending POST request to /api/accept-offer...");
    //         const response = await axios.post(
    //             "http://localhost:5000/api/accept-offer",
    //             payload
    //         );

    //         console.log("✅ [handleAccept] Success Response:", response.data);

    //         alert("Offer accepted successfully!");
    //         navigate("/farmer/contracts");

    //     } catch (err) {
    //         console.error("❌ [handleAccept] Error Detail:", err);
    //         console.error("❌ [handleAccept] Server Response Data:", err.response?.data);
    //         alert("Failed to accept offer");
    //     }
    // };

    const handleAccept = async () => {
        console.log("🖱️ [handleAccept] Accept button clicked");
    
        try {
            // 1. Get User
            const userStr = localStorage.getItem("user");
            console.log("📂 [handleAccept] LocalStorage 'user':", userStr);
    
            if (!userStr) {
                console.error("❌ [handleAccept] User not found in localStorage");
                return alert("User not logged in");
            }
    
            const user = JSON.parse(userStr);
            console.log("👤 [handleAccept] Parsed User Object:", user);
    
            // 2. Get Farmer Profile
            console.log("🔄 [handleAccept] Calling fetchFarmerProfile...");
            const farmerProfileId = await fetchFarmerProfile(user.id);
    
            if (!farmerProfileId) {
                console.error("❌ [handleAccept] Could not retrieve farmerProfileId");
                return alert("Farmer profile not found");
            }
    
            // ===============================
            // 3. DATE FALLBACK LOGIC (FIX)
            // ===============================
    
            const today = new Date();

// ---------- delivery_start_date ----------
let deliveryStartDate;
            if (offer.deliveryStartDate && !isNaN(Date.parse(offer.deliveryStartDate))) {
                deliveryStartDate = new Date(offer.deliveryStartDate);
            } else {
                deliveryStartDate = new Date(today);
            }

            // Duration & End Date
            // 🔴 OLD: const durationNum = Number(offer.duration); // Result was NaN
            // 🟢 NEW: Use parseInt to extract "4" from "4 months"
            const durationNum = parseInt(offer.duration, 10); 
            
            console.log(`   - Duration Raw: "${offer.duration}"`);
            console.log(`   - Duration Parsed: ${durationNum}`); // Should now see 4

            let deliveryEndDate;
            if (offer.deliveryEndDate && !isNaN(Date.parse(offer.deliveryEndDate))) {
                deliveryEndDate = new Date(offer.deliveryEndDate);
            } else {
                deliveryEndDate = new Date(deliveryStartDate);
                // Check if we have a valid number now
                if (!isNaN(durationNum) && durationNum > 0) {
                    deliveryEndDate.setMonth(deliveryEndDate.getMonth() + durationNum);
                }
            }

// ---------- offer_valid_till ----------
let offerValidTill;
if (offer.validTill && !isNaN(Date.parse(offer.validTill))) {
    offerValidTill = new Date(offer.validTill);
} else {
    offerValidTill = new Date(today);
    offerValidTill.setDate(offerValidTill.getDate() + 15);
}

            // ===============================
            // 4. Construct Payload
            // ===============================
    
            const payload = {
                buyer_user_id: offer.buyer_user_id,
                farmer_profile_id: farmerProfileId,
    
                crop_name: offer.crop,
                price_per_quintal: offer.price,
                quantity: offer.quantity,
                location: offer.location,
                duration_months: durationNum,
                quality_badges: offer.requirements ?? [],
    
                delivery_start_date: deliveryStartDate.toISOString().split("T")[0],
                delivery_end_date: deliveryEndDate.toISOString().split("T")[0],
                offer_valid_till: offerValidTill.toISOString().split("T")[0],
    
                notes: "Farmer accepted offer without changes"
            };
    
            console.log("📦 [handleAccept] Final Payload for API:", payload);
    
            // 5. Send Request
            console.log("🚀 [handleAccept] Sending POST request to /api/accept-offer...");
            const response = await axios.post(
                "http://localhost:5000/api/accept-offer",
                payload
            );
    
            console.log("✅ [handleAccept] Success Response:", response.data);
    
            alert("Offer accepted successfully!");
            navigate("/farmer/contracts");
    
        } catch (err) {
            console.error("❌ [handleAccept] Error Detail:", err);
            console.error("❌ [handleAccept] Server Response Data:", err.response?.data);
            alert("Failed to accept offer");
        }
    };
    

    const handleCounterOffer = () => {
        console.log("🖱️ [handleCounterOffer] Clicked");
        console.log("📊 [handleCounterOffer] Current State - Price:", counterPrice, "Qty:", counterQty);
        
        if (!counterPrice || !counterQty) {
            console.warn("⚠️ [handleCounterOffer] Missing inputs");
            return alert("Enter price and quantity");
        }
        
        // TODO: Call backend to submit counter offer
        const msg = `Counter offer submitted: ₹${counterPrice} / ${counterQty} Quintals`;
        console.log("✅ [handleCounterOffer]", msg);
        alert(msg);
    };

    return (
        <div style={{ maxWidth: "960px", margin: "2.5rem auto", padding: "0 1rem" }}>
            {/* Back Button */}
            <button
                onClick={() => {
                    console.log("🔙 [Navigation] Going back");
                    navigate(-1);
                }}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: "#16a34a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.45rem 0.9rem",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    marginBottom: "1.25rem",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                }}
            >
                <ArrowLeft size={16} />
                Back to offers
            </button>

            {/* Card */}
            <div
                style={{
                    background: "#ffffff",
                    borderRadius: "14px",
                    padding: "2rem",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    border: "1px solid #f0f0f0"
                }}
            >
                {/* Header */}
                <div style={{ marginBottom: "1.5rem" }}>
                    <h1 style={{ margin: 0, fontSize: "1.9rem" }}>{offer.crop}</h1>
                    <p
                        style={{
                            marginTop: "0.4rem",
                            color: "#555",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem"
                        }}
                    >
                        <strong>{offer.buyer?.name || "Unknown Buyer"}</strong>
                        <ShieldCheck size={16} color="#16a34a" />
                    </p>
                    <h2 style={{ marginTop: "1rem", color: "#15803d", fontSize: "1.5rem" }}>
                        ₹{offer.price} / Quintal
                    </h2>
                </div>

                {/* Key Details */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "1rem",
                        marginBottom: "2rem"
                    }}
                >
                    <Detail icon={<Scale size={18} />} label="Quantity" value={`${offer.quantity} Quintals`} />
                    <Detail icon={<MapPin size={18} />} label="Location" value={offer.location} />
                    <Detail icon={<Calendar size={18} />} label="Duration" value={offer.duration} />
                    <Detail label="Delivery Start" value={offer.deliveryStartDate} />
                    <Detail label="Valid Till" value={offer.validTill} />
                    <Detail label="Reliability Score" value={offer.reliabilityScore ?? "—"} />
                </div>

                {/* Quality */}
                <Section title="Quality Requirements">
                    <ul style={{ paddingLeft: "1.2rem" }}>
                        {offer.requirements?.map((r, i) => (
                            <li key={i} style={{ marginBottom: "0.4rem" }}>{r}</li>
                        ))}
                    </ul>
                </Section>

                {/* Buyer */}
                <Section title="Buyer Details">
                    <p><strong>Type:</strong> {offer.buyer?.type}</p>
                    <p><strong>Address:</strong> {offer.buyer?.address}</p>
                </Section>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "1rem", marginTop: "2.5rem" }}>
                    <button
                        style={{
                            flex: 1,
                            padding: "0.75rem 1.8rem",
                            backgroundColor: "#16a34a",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: "600",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.18)"
                        }}
                        onClick={() => setShowContractModal(true)}
                    >
                        Accept
                    </button>

                    <button
                        style={{
                            flex: 1,
                            padding: "0.75rem 1.8rem",
                            backgroundColor: "#fff",
                            color: "#16a34a",
                            border: "2px solid #16a34a",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: "600",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                        }}
                        onClick={() => {
                            console.log("🖱️ [Navigation] Navigating to Counter Offer page");
                            navigate(`/offers/${offerId}/counter`);
                        }}
                    >
                        Counter Offer
                    </button>

                </div>
            </div>

            {showContractModal && (
  <div style={overlayStyle}>
    <div style={modalStyle}>

      {/* DOCUMENT */}
      <div ref={contractRef} style={documentStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Crop Supply Agreement
        </h2>

        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>

        <p style={paragraphStyle}>
          This agreement is made between <strong>{offer.buyer?.name}</strong> (Buyer)
          and the undersigned Farmer for the supply of agricultural produce under
          the terms stated below.
        </p>

        <table style={tableStyle}>
          <tbody>
            <tr><td>Crop</td><td>{offer.crop}</td></tr>
            <tr><td>Quantity</td><td>{offer.quantity} Quintals</td></tr>
            <tr><td>Price</td><td>₹{offer.price} / Quintal</td></tr>
            <tr><td>Location</td><td>{offer.location}</td></tr>
            <tr><td>Duration</td><td>{offer.duration}</td></tr>
            <tr><td>Valid Till</td><td>{offer.validTill}</td></tr>
          </tbody>
        </table>

        <p style={paragraphStyle}>
          The farmer agrees to deliver the crop in good condition and on the agreed
          timeline. Payment shall be made as per mutually agreed terms.
        </p>

        <p style={{ marginTop: "1.5rem" }}>
          <strong>Farmer Signature:</strong>
        </p>

        {/* SIGNATURE PAD */}
        <div style={signatureBoxStyle}>
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor="black"
            canvasProps={{
              width: 500,
              height: 150,
              style: { background: "#fff" }
            }}
          />
        </div>

        <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
          Sign above using mouse or touch
        </p>
      </div>

      {/* ACTIONS */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <button
          style={cancelBtnStyle}
          onClick={() => {
            sigCanvasRef.current?.clear();
            setShowContractModal(false);
          }}
        >
          Cancel
        </button>

        <button
          style={cancelBtnStyle}
          onClick={() => sigCanvasRef.current.clear()}
        >
          Clear Signature
        </button>

        <button
          style={signBtnStyle}
          onClick={async () => {
            if (sigCanvasRef.current.isEmpty()) {
              alert("Please sign before accepting");
              return;
            }

            // Generate PDF
            const canvas = await html2canvas(contractRef.current, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
            pdf.save("Crop-Contract.pdf");

            setShowContractModal(false);
            handleAccept(); // 🔥 your original accept logic
          }}
        >
          Sign, Download & Accept
        </button>
      </div>
    </div>
  </div>
)}

        </div>
    );
};

/* Reusable UI Helpers */
const Section = ({ title, children }) => (
    <div style={{ marginTop: "1.8rem" }}>
        <h3 style={{ marginBottom: "0.75rem", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.4rem" }}>{title}</h3>
        {children}
    </div>
);

const Detail = ({ icon, label, value }) => (
    <div style={{ background: "#f9fafb", padding: "0.9rem", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>{icon} {label}</p>
        <p style={{ margin: "0.2rem 0 0", fontWeight: "600" }}>{value}</p>
    </div>
);

const documentStyle = {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontFamily: "serif",
    color: "#111827"
  };
  
  const paragraphStyle = {
    margin: "0.75rem 0",
    lineHeight: "1.6",
    fontSize: "0.95rem"
  };
  
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    margin: "1rem 0"
  };
  
  const signatureBoxStyle = {
    border: "1px solid #000",
    marginTop: "0.5rem",
    width: "500px"
  };

  // ==========================================
// 👇 PASTE THIS AT THE BOTTOM OF YOUR FILE
// ==========================================

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };
  
  const modalStyle = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };
  
  const cancelBtnStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: "#ef4444", // Red
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
  };
  
  const signBtnStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: "#16a34a", // Green
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
  };
  

export default OfferDetails;