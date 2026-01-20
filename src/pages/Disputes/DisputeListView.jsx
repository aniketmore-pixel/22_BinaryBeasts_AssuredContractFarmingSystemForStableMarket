import React, { useEffect, useState } from "react";
import styles from "./ContractsPage.module.css";

const DisputeListView = () => {
    const [buyerProfileId, setBuyerProfileId] = useState(null);
    const [disputedContracts, setDisputedContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleAddNote = async (contractId) => {
        const note = prompt("Enter your note:");
        if (!note || note.trim() === "") return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/contracts/${contractId}/buyer-note`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ note })
                }
            );

            if (!res.ok) throw new Error("Failed to add note");

            alert("Note added successfully");

            // optional UI update
            setDisputedContracts(prev =>
                prev.map(c =>
                    c.contract_id === contractId
                        ? { ...c, buyer_dispute_note: note }
                        : c
                )
            );
        } catch (err) {
            console.error("❌ Failed to add note", err);
        }
    };

    const handleResolve = async (contractId) => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/contracts/${contractId}/resolve/buyer`,
                { method: "POST" }
            );

            if (!res.ok) throw new Error("Failed to resolve dispute");

            alert("Dispute resolved from buyer side");

            // optional: remove from list after resolve
            setDisputedContracts(prev =>
                prev.filter(c => c.contract_id !== contractId)
            );
        } catch (err) {
            console.error("❌ Failed to resolve dispute", err);
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
       2️⃣ Fetch buyer contracts & filter disputes
    ========================= */
    useEffect(() => {
        if (!buyerProfileId) return;

        const fetchDisputes = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/contracts/buyer/${buyerProfileId}`
                );
                const data = await res.json();

                const disputesOnly = data.filter(
                    c =>
                        (c.farmer_dispute_note && c.farmer_dispute_note.trim() !== "") ||
                        (c.buyer_dispute_note && c.buyer_dispute_note.trim() !== "")
                );

                setDisputedContracts(disputesOnly);
            } catch (err) {
                console.error("❌ Failed to fetch disputed contracts", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDisputes();
    }, [buyerProfileId]);

    if (loading) {
        return <div className={styles.container}>Loading disputes...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Contract Disputes</h1>

            {disputedContracts.length === 0 ? (
                <div className={styles.emptyState}>
                    No disputes found
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
                                <span>Farmer</span>
                                <span>{contract.farmer_name || "Farmer"}</span>
                            </div>

                            <div className={styles.row}>
                                <span>Farmer Note</span>
                                <span>{contract.farmer_dispute_note || "—"}</span>
                            </div>

                            <div className={styles.row}>
                                <span>Your Note</span>
                                <span>{contract.buyer_dispute_note || "—"}</span>
                            </div>

                            <div className={styles.row}>
                                <span>Contract ID</span>
                                <span className={styles.contractId}>
                                    {contract.contract_id.slice(-6)}
                                </span>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    className={styles.dispute}
                                    onClick={() => handleAddNote(contract.contract_id)}
                                >
                                    Add Note
                                </button>

                                <button
                                    className={styles.resolve}
                                    onClick={() => handleResolve(contract.contract_id)}
                                >
                                    Resolve
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DisputeListView;
