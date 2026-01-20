import React, { useEffect, useMemo, useState } from "react";
import styles from "./DeliveryTracking.module.css";

const DELIVERY_STAGES = [
  "LAND",
  "SOWING",
  "IRRIGATION",
  "GROWTH",
  "HARVEST",
  "PACKING",
];

const DeliveryTracking = () => {
  const [buyerProfileId, setBuyerProfileId] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [deliveryStatusMap, setDeliveryStatusMap] = useState({});
  const [loading, setLoading] = useState(true);

  /* =========================
     Fetch buyer_profile_id
  ========================= */
  useEffect(() => {
    const initBuyerProfile = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      if (user.role !== "BUYER") return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/getbp/profile-id/${user.id}`
        );
        const data = await res.json();
        setBuyerProfileId(data.buyer_profile_id);
      } catch (err) {
        console.error("❌ Failed to fetch buyer profile id", err);
      }
    };

    initBuyerProfile();
  }, []);

  /* =========================
     Fetch buyer contracts
  ========================= */
  useEffect(() => {
    if (!buyerProfileId) return;

    const fetchContracts = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/contracts/buyer/${buyerProfileId}`
        );
        const data = await res.json();
        setContracts(data);
      } catch (err) {
        console.error("❌ Failed to fetch contracts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [buyerProfileId]);

  /* =========================
     Filter IN_PROGRESS only
  ========================= */
  const inProgressContracts = useMemo(() => {
    return contracts.filter(
      (c) => c.contract_status === "IN_PROGRESS"
    );
  }, [contracts]);

  /* =========================
     Fetch delivery tracking
  ========================= */
  useEffect(() => {
    if (inProgressContracts.length === 0) return;

    const fetchDeliveryStatuses = async () => {
      try {
        const results = await Promise.all(
          inProgressContracts.map(async (contract) => {
            const res = await fetch(
              `http://localhost:5000/api/contracts/${contract.contract_id}/current-delivery-status`
            );
            const data = await res.json();
            return {
              contractId: contract.contract_id,
              delivery_tracking: data.delivery_tracking,
            };
          })
        );

        const map = {};
        results.forEach((r) => {
          map[r.contractId] = r.delivery_tracking;
        });

        setDeliveryStatusMap(map);
      } catch (err) {
        console.error("❌ Failed to fetch delivery status", err);
      }
    };

    fetchDeliveryStatuses();
  }, [inProgressContracts]);

  if (loading) {
    return <div className={styles.container}>Loading contracts...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>In-Progress Contracts</h1>

      {inProgressContracts.length === 0 ? (
        <div className={styles.emptyState}>
          No contracts currently in progress
        </div>
      ) : (
        <div className={styles.contractList}>
          {inProgressContracts.map((contract) => {
            const currentStage =
              deliveryStatusMap[contract.contract_id];

            const currentIndex = DELIVERY_STAGES.indexOf(currentStage);

            return (
              <div key={contract.contract_id} className={styles.card}>
                {/* Header */}
                <div className={styles.headerRow}>
                  <h3>{contract.crop_name}</h3>
                  <span className={styles.status}>IN PROGRESS</span>
                </div>

                {/* Details */}
                <div className={styles.row}>
                  <span>Farmer</span>
                  <span>{contract.farmer_name || "Farmer"}</span>
                </div>

                <div className={styles.row}>
                  <span>Quantity</span>
                  <span>{contract.quantity} Quintals</span>
                </div>

                <div className={styles.row}>
                  <span>Price</span>
                  <span>₹{contract.price_per_quintal} / quintal</span>
                </div>

                <div className={styles.row}>
                  <span>Location</span>
                  <span>{contract.location}</span>
                </div>

                <div className={styles.row}>
                  <span>Contract ID</span>
                  <span className={styles.contractId}>
                    {contract.contract_id.slice(-6)}
                  </span>
                </div>

                {/* Delivery Progress */}
                <div className={styles.progressContainer}>
                  <div className={styles.progressLabel}>
                    Delivery Status:{" "}
                    <strong>{currentStage || "Loading..."}</strong>
                  </div>

                  <div className={styles.progressBar}>
                    {DELIVERY_STAGES.map((stage, index) => {
                      const isCompleted = index <= currentIndex;
                      const isActive = index === currentIndex;

                      return (
                        <div
                          key={stage}
                          className={`${styles.step}
                            ${isCompleted ? styles.completed : ""}
                            ${isActive ? styles.active : ""}
                          `}
                        >
                          {stage}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DeliveryTracking;
