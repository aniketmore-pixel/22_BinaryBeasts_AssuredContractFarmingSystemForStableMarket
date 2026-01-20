import React, { useEffect, useMemo, useState } from "react";
import styles from "./ContractsPage.module.css";

const STATUS_TABS = [
    { key: "COUNTER_OFFER", label: "Counter Offers" },
    { key: "PENDING", label: "Pending Approval" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "DELIVERED", label: "Delivered" },
    { key: "CANCELLED", label: "Cancelled" },
    { key: "REJECTED", label: "Rejected" }
];


const TAB_STATUS_MAP = {
    IN_PROGRESS: "IN_PROGRESS",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
    REJECTED: "REJECTED"
};

const FarmerContracts = () => {
    const [farmerProfileId, setFarmerProfileId] = useState(null);
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("IN_PROGRESS");

    const handleAction = async (contractId, action) => {
        try {
            let body = null;

    // If action is dispute, ask user for a note
    if (action === "dispute") {
      const note = prompt("Enter your dispute note (optional):", "");
      body = JSON.stringify({ note });
    }
          // Replace with your actual backend route later
          const res = await fetch(
            `http://localhost:5000/api/contracts/${contractId}/${action}`,
            { method: "POST", 

                headers: { "Content-Type": "application/json" },
    body: body
            }
          );
      
          if (!res.ok) throw new Error("Action failed");
      
          // Optional: refresh the contracts list
          setContracts(prev =>
            prev.map(c =>
              c.contract_id === contractId
                ? { ...c, contract_status: action.toUpperCase() } // temporary local update
                : c
            )
          );
      
          console.log(`✅ Action ${action} executed on contract ${contractId}`);
        } catch (err) {
          console.error(`❌ Failed to ${action} contract ${contractId}`, err);
        }
      };
      

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
       2️⃣ Fetch contracts
    ========================= */
    useEffect(() => {
        if (!farmerProfileId) return;

        const fetchContracts = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/contracts/farmer/${farmerProfileId}`
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
    }, [farmerProfileId]);

    /* =========================
       3️⃣ Tab classification
    ========================= */
    const filteredContracts = useMemo(() => {
        if (activeTab === "COUNTER_OFFER") {
            // check farmer_action instead of buyer_action
            return contracts.filter(c => c.farmer_action === "COUNTER_OFFER");
        }

        // Map tabs to actual contract_status values
        const statusMap = {
            IN_PROGRESS: "IN_PROGRESS",
            DELIVERED: "DELIVERED",
            CANCELLED: "CANCELLED",
            REJECTED: "REJECTED",
            PENDING: "PENDING_BUYER_APPROVAL" // Add this mapping
        };

        const expectedStatus = statusMap[activeTab] || activeTab;

        return contracts.filter(c => c.contract_status === expectedStatus);
    }, [contracts, activeTab]);


    if (loading) {
        return <div className={styles.container}>Loading contracts...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Sales Contracts</h1>

            {/* Tabs */}
            <div className={styles.navbar}>
                {STATUS_TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`${styles.navButton} ${activeTab === tab.key ? styles.active : ""
                            }`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Contracts */}
            <div className={styles.contractList}>
                {filteredContracts.length === 0 ? (
                    <div className={styles.emptyState}>
                        No contracts found for this category
                    </div>
                ) : (
                    filteredContracts.map(contract => (
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

                            {/* Actions buttons */}
                            <div className={styles.actions}>
                                {/* Cancel Button */}
                                <button
                                    className={styles.cancel}
                                    onClick={() => handleAction(contract.contract_id, "cancel")}
                                >
                                    Cancel
                                </button>

                                {/* Raise Dispute Button */}
                                <button
                                    className={styles.dispute}
                                    onClick={() => handleAction(contract.contract_id, "dispute")}
                                >
                                    Raise Dispute
                                </button>

                                {/* Set as Delivered Button */}
                                <button
                                    className={styles.delivered}
                                    onClick={() => handleAction(contract.contract_id, "delivered")}
                                >
                                    Set as Delivered
                                </button>

                                
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FarmerContracts;
