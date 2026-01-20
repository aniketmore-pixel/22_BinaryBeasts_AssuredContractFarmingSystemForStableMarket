import React, { useEffect, useMemo, useState } from "react";
import styles from "./BuyerContracts.module.css";

const STATUS_TABS = [
    { key: "APPROVALS", label: "Approvals" },
    { key: "COUNTER_OFFER", label: "Counter Offers" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "DELIVERED", label: "Delivered" },
    { key: "CANCELLED", label: "Cancelled" },
    { key: "REJECTED", label: "Rejected" }
];

const TAB_STATUS_MAP = {
    APPROVALS: "PENDING_BUYER_APPROVAL",
    IN_PROGRESS: "IN_PROGRESS",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
    REJECTED: "REJECTED"
};

const BuyerContracts = () => {
    const [buyerProfileId, setBuyerProfileId] = useState(null);
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("APPROVALS");

    /* =========================
     Add these handlers inside BuyerContracts component
  ========================= */
    const handleApprove = async (contractId) => {
        console.log("🖱️ Approve clicked for contract:", contractId);

        try {
            const res = await fetch(
                `http://localhost:5000/api/contracts/${contractId}/approve`,
                { method: "POST" }
            );
            const data = await res.json();
            console.log("✅ Approve response:", data);
            alert("Contract approved successfully!");
            // Optional: refresh contracts
            setContracts(prev => prev.map(c => c.contract_id === contractId ? { ...c, contract_status: "IN_PROGRESS" } : c));
        } catch (err) {
            console.error("❌ Approve failed:", err);
            alert("Failed to approve contract");
        }
    };

    const handleReject = async (contractId) => {
        console.log("🖱️ Reject clicked for contract:", contractId);

        try {
            const res = await fetch(
                `http://localhost:5000/api/contracts/${contractId}/reject`,
                { method: "POST" }
            );
            const data = await res.json();
            console.log("✅ Reject response:", data);
            alert("Contract rejected successfully!");
            // Optional: remove rejected contract from UI
            setContracts(prev => prev.filter(c => c.contract_id !== contractId));
        } catch (err) {
            console.error("❌ Reject failed:", err);
            alert("Failed to reject contract");
        }
    };


    /* =========================
       1️⃣ Fetch buyer_profile_id
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
       2️⃣ Fetch contracts
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
       3️⃣ Tab classification
    ========================= */
    const filteredContracts = useMemo(() => {
        if (activeTab === "COUNTER_OFFER") {
            return contracts.filter(
                c => c.farmer_action === "COUNTER_OFFER"
            );
        }

        return contracts.filter(
            c => c.contract_status === TAB_STATUS_MAP[activeTab]
        );
    }, [contracts, activeTab]);

    if (loading) {
        return <div className={styles.container}>Loading contracts...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Procurement Contracts</h1>

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

                            {contract.contract_status === "PENDING_BUYER_APPROVAL" && (
                                <div className={styles.actions}>
                                    <button
                                        className={styles.reject}
                                        onClick={() => handleReject(contract.contract_id)}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        className={styles.approve}
                                        onClick={() => handleApprove(contract.contract_id)}
                                    >
                                        Approve
                                    </button>
                                </div>
                            )}


                            {/* {contract.farmer_action === "COUNTER_OFFER" && (
                                <div className={styles.actions}>
                                    <button className={styles.negotiate}>
                                        Review Counter Offer
                                    </button>
                                </div>
                            )} */}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BuyerContracts;
