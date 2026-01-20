// import React, { useEffect, useState } from "react";
// import styles from "./ContractsPage.module.css";

// const FarmerDisputes = () => {
//   const [farmerProfileId, setFarmerProfileId] = useState(null);
//   const [disputedContracts, setDisputedContracts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   /* =========================
//      1️⃣ Fetch farmer_profile_id
//   ========================= */
//   useEffect(() => {
//     const initFarmerProfile = async () => {
//       const userStr = localStorage.getItem("user");
//       if (!userStr) return;

//       const user = JSON.parse(userStr);
//       if (user.role !== "FARMER") return;

//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/farmer-profile/by-user/${user.id}`
//         );
//         const data = await res.json();
//         setFarmerProfileId(data.farmer_profile_id);
//       } catch (err) {
//         console.error("❌ Failed to fetch farmer profile id", err);
//       }
//     };

//     initFarmerProfile();
//   }, []);

//   /* =========================
//      2️⃣ Fetch contracts & filter disputes
//   ========================= */
//   useEffect(() => {
//     if (!farmerProfileId) return;

//     const fetchDisputedContracts = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/contracts/farmer/${farmerProfileId}`
//         );
//         const data = await res.json();

//         // Only keep contracts with a dispute note
//         const disputes = data.filter(
//           c =>
//             (c.farmer_dispute_note && c.farmer_dispute_note.trim() !== "") ||
//             (c.buyer_dispute_note && c.buyer_dispute_note.trim() !== "")
//         );

//         setDisputedContracts(disputes);
//       } catch (err) {
//         console.error("❌ Failed to fetch contracts", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDisputedContracts();
//   }, [farmerProfileId]);

//   if (loading) {
//     return <div className={styles.container}>Loading disputes...</div>;
//   }

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Disputes for My Contracts</h1>

//       {disputedContracts.length === 0 ? (
//         <div className={styles.emptyState}>
//           No disputes found for your contracts
//         </div>
//       ) : (
//         <div className={styles.contractList}>
//           {disputedContracts.map(contract => (
//             <div key={contract.contract_id} className={styles.card}>
//               <div className={styles.headerRow}>
//                 <h3>{contract.crop_name}</h3>
//                 <span className={styles.status}>
//                   {contract.contract_status}
//                 </span>
//               </div>

//               <div className={styles.row}>
//                 <span>Buyer</span>
//                 <span>{contract.buyer_name || "Buyer"}</span>
//               </div>

//               <div className={styles.row}>
//                 <span>Farmer Note</span>
//                 <span>{contract.farmer_dispute_note || "N/A"}</span>
//               </div>

//               <div className={styles.row}>
//                 <span>Buyer Note</span>
//                 <span>{contract.buyer_dispute_note || "N/A"}</span>
//               </div>

//               <div className={styles.row}>
//                 <span>Contract ID</span>
//                 <span className={styles.contractId}>
//                   {contract.contract_id.slice(-6)}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FarmerDisputes;

import React, { useEffect, useState } from "react";
import styles from "./ContractsPage.module.css";

const FarmerDisputes = () => {
  const [farmerProfileId, setFarmerProfileId] = useState(null);
  const [disputedContracts, setDisputedContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     1️⃣ Fetch farmer_profile_id
  ========================= */
  useEffect(() => {
    const initFarmerProfile = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      if (user.role !== "FARMER") return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/farmer-profile/by-user/${user.id}`
        );
        const data = await res.json();
        setFarmerProfileId(data.farmer_profile_id);
      } catch (err) {
        console.error("❌ Failed to fetch farmer profile id", err);
      }
    };

    initFarmerProfile();
  }, []);

  /* =========================
     2️⃣ Fetch contracts & filter disputes
  ========================= */
  useEffect(() => {
    if (!farmerProfileId) return;

    const fetchDisputedContracts = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/contracts/farmer/${farmerProfileId}`
        );
        const data = await res.json();

        const disputes = data.filter(
          c =>
            (c.farmer_dispute_note && c.farmer_dispute_note.trim() !== "") ||
            (c.buyer_dispute_note && c.buyer_dispute_note.trim() !== "")
        );

        setDisputedContracts(disputes);
      } catch (err) {
        console.error("❌ Failed to fetch contracts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputedContracts();
  }, [farmerProfileId]);

  /* =========================
     3️⃣ Handle 'Resolved' button
  ========================= */
  const handleResolved = async (contractId) => {
    try {
      await fetch(`http://localhost:5000/api/contracts/${contractId}/resolve`, {
        method: "POST"
      });

      alert("Query resolved from farmer side");

      // Optional: remove resolved dispute from the list
      setDisputedContracts(prev => prev.filter(c => c.contract_id !== contractId));
    } catch (err) {
      console.error("❌ Failed to resolve dispute", err);
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading disputes...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Disputes for My Contracts</h1>

      {disputedContracts.length === 0 ? (
        <div className={styles.emptyState}>
          No disputes found for your contracts
        </div>
      ) : (
        <div className={styles.contractList}>
          {disputedContracts.map(contract => (
            <div key={contract.contract_id} className={styles.card}>
              <div className={styles.headerRow}>
                <h3>{contract.crop_name}</h3>
                <span className={styles.status}>
                  {contract.contract_status}
                </span>
              </div>

              <div className={styles.row}>
                <span>Buyer</span>
                <span>{contract.buyer_name || "Buyer"}</span>
              </div>

              <div className={styles.row}>
                <span>Farmer Note</span>
                <span>{contract.farmer_dispute_note || "N/A"}</span>
              </div>

              <div className={styles.row}>
                <span>Buyer Note</span>
                <span>{contract.buyer_dispute_note || "N/A"}</span>
              </div>

              <div className={styles.row}>
                <span>Contract ID</span>
                <span className={styles.contractId}>
                  {contract.contract_id.slice(-6)}
                </span>
              </div>

              {/* ✅ Resolved button */}
              <div className={styles.actions}>
                <button
                  className={styles.resolved}
                  onClick={() => handleResolved(contract.contract_id)}
                >
                  Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerDisputes;

