import React, { useEffect, useState } from "react";
import styles from "./ContractsPage.module.css";
import { MapPin, Activity, Droplet, Zap, Package, Box } from "lucide-react";


const DELIVERY_STATUSES = ["LAND", "SOWING", "IRRIGATION", "GROWTH", "HARVEST", "PACKING"];

const STATUS_ICONS = {
    LAND: <MapPin className="stepIcon" />,
    SOWING: <Activity className="stepIcon" />,
    IRRIGATION: <Droplet className="stepIcon" />,
    GROWTH: <Zap className="stepIcon" />,
    HARVEST: <Package className="stepIcon" />,
    PACKING: <Box className="stepIcon" />,
  };
  

const FarmerContracts = () => {
    const [farmerProfileId, setFarmerProfileId] = useState(null);
    const [contracts, setContracts] = useState([]);
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
       2️⃣ Fetch contracts for this farmer, IN_PROGRESS only
    ========================= */
    useEffect(() => {
        if (!farmerProfileId) return;

        const fetchContracts = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/contracts/farmer/${farmerProfileId}`
                );
                const data = await res.json();

                // Only keep IN_PROGRESS
                const inProgressContracts = data.filter(
                    (c) => c.contract_status === "IN_PROGRESS"
                );

                setContracts(inProgressContracts);
            } catch (err) {
                console.error("❌ Failed to fetch contracts", err);
            } finally {
                setLoading(false);
            }
        };

        fetchContracts();
    }, [farmerProfileId]);


    /* =========================
       3️⃣ Handle Delivery Tracking Update
    ========================= */
    const handleDeliveryStatus = async (contractId, status) => {
        try {
            // Call backend API route
            const res = await fetch(
                `http://localhost:5000/api/contracts/${contractId}/update-delivery`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ delivery_tracking: status }),
                }
            );

            if (!res.ok) throw new Error("Failed to update delivery status");

            // Update locally
            setContracts((prev) =>
                prev.map((c) =>
                    c.contract_id === contractId ? { ...c, delivery_tracking: status } : c
                )
            );

            console.log(`✅ Updated delivery status for ${contractId} to ${status}`);
        } catch (err) {
            console.error("❌ Error updating delivery status:", err);
        }
    };

    if (loading) return <div className={styles.container}>Loading contracts...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My In-Progress Contracts</h1>

            {contracts.length === 0 && (
                <div className={styles.emptyState}>No in-progress contracts found</div>
            )}

            {contracts.map((contract) => (
                <div key={contract.contract_id} className={styles.card}>
                    <div className={styles.headerRow}>
                        <h3>{contract.crop_name}</h3>
                        <span className={styles.status}>{contract.contract_status}</span>
                    </div>

                    <div className={styles.row}>
                        <span>Buyer</span>
                        <span>{contract.buyer_name || "Buyer"}</span>
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
                        <span>Delivery Location</span>
                        <span>{contract.location}</span>
                    </div>

                    <div className={styles.row}>
                        <span>Contract ID</span>
                        <span className={styles.contractId}>
                            {contract.contract_id.slice(-6)}
                        </span>
                    </div>

                    {/* ========================
              Delivery Tracking UI
          ======================== */}
                    <div className={styles.deliveryTracking}>
                        {DELIVERY_STATUSES.map((status) => {
                            const isActive = DELIVERY_STATUSES.indexOf(status) <= DELIVERY_STATUSES.indexOf(contract.delivery_tracking);

                            return (
                                <div
                                    key={status}
                                    className={`${styles.deliveryStep} ${isActive ? styles.activeStep : ""}`}
                                    onClick={() => handleDeliveryStatus(contract.contract_id, status)}
                                >
                                    <div className={styles.stepCircle}>{STATUS_ICONS[status]}</div>
                                    <span className={styles.stepLabel}>{status}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FarmerContracts;
