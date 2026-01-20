import React, { createContext, useContext, useEffect, useState } from "react";
import { dummyContracts } from "../data/dummyContracts";

const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
    // -------------------------------------------------------------------------
    // 1. OFFERS (Backend Integrated with Mapping)
    // -------------------------------------------------------------------------
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initial fetch
    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        console.log("📡 Fetching offers from backend...");
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/offers");
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

            const data = await res.json();

            if (Array.isArray(data)) {
                // Map Backend Columns (snake_case) to Frontend Props (camelCase)
                const formattedOffers = data.map(o => ({
                    id: o.offer_id || o.id || o._id, // Added _id for Mongo fallback
                    crop: o.crop_name || o.crop || "Unknown Crop",
                    buyer: o.buyer_profile?.organization_name || o.buyer_name || "Verified Buyer",
                    price: o.price_per_quintal || o.price || 0,
                    quantity: o.quantity_required ? `${o.quantity_required} Tons` : (o.quantity || "Variable"),
                    location: o.delivery_location || o.location || "India",
                    duration: o.contract_duration || "Harvest Cycle",
                    requirements: o.quality_requirements ? [o.quality_requirements] : ["Standard Quality", "Organic Preferred"],
                    unit: "Quintal",
                    verified: true
                }));
                console.log("✅ Formatted Offers:", formattedOffers);
                setOffers(formattedOffers);
            }
        } catch (err) {
            console.error("🔥 Failed to fetch offers:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------------------------
    // 2. CONTRACTS & ESCROW (Restored from Backup - LocalStorage)
    // -------------------------------------------------------------------------
    const [contracts, setContracts] = useState(() => {
        const saved = localStorage.getItem('krishi_contracts');
        return saved ? JSON.parse(saved) : dummyContracts;
    });

    useEffect(() => {
        localStorage.setItem('krishi_contracts', JSON.stringify(contracts));
    }, [contracts]);

    const updateContractStatus = (contractId, newStatus) => {
        setContracts(prev => prev.map(c =>
            c.id === contractId ? { ...c, status: newStatus } : c
        ));
    };

    const applyForOffer = (offer) => {
        const newContract = {
            id: `C-${Date.now()}`,
            crop: offer.crop,
            partner: offer.buyer,
            farmerName: 'You (Farmer)',
            startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            endDate: 'TBD',
            price: Number(offer.price || 0),
            value: Number(offer.price || 0) * Number(offer.quantity?.split(' ')[0] || 100),
            quantity: offer.quantity,
            status: 'pending',
            progress: 0,
            originalOfferId: offer.id,
            negotiationHistory: [
                {
                    role: 'buyer',
                    price: Number(offer.price || 0),
                    date: new Date().toISOString(),
                    message: 'Initial Offer Listing'
                }
            ]
        };
        setContracts(prev => [newContract, ...prev]);
        addAuditLog('APPLICATION_SUBMITTED', `Applied for ${offer.crop} offer by ${offer.buyer}`);
    };

    const submitCounterOffer = (contractId, newPrice, message, role = 'farmer') => {
        setContracts(prev => prev.map(c => {
            if (c.id === contractId) {
                const quantityNum = Number(c.quantity?.toString().split(' ')[0] || 100);
                return {
                    ...c,
                    price: Number(newPrice),
                    value: Number(newPrice) * quantityNum,
                    status: 'negotiating',
                    negotiationHistory: [
                        ...(c.negotiationHistory || []),
                        {
                            role,
                            price: Number(newPrice),
                            date: new Date().toISOString(),
                            message
                        }
                    ]
                };
            }
            return c;
        }));
    };

    // The "Escrow Payment Working Properly" Logic
    const acceptOffer = (contractId) => {
        setContracts(prev => prev.map(c => {
            if (c.id === contractId) {
                // Generate Escrow Milestones
                const totalVal = c.value || 50000;
                const advanceAmount = Math.floor(totalVal * 0.30); // 30% Advance
                const finalAmount = totalVal - advanceAmount;      // 70% Final

                const newMilestones = [
                    {
                        id: 'M1',
                        title: 'Advance Payment (Escrow)',
                        description: '30% upfront payment secured in escrow.',
                        amount: advanceAmount,
                        currency: 'INR',
                        dueDate: new Date().toISOString().split('T')[0], // Today
                        status: 'PENDING', // Ready to be released by buyer
                        actionLabel: 'Release Advance'
                    },
                    {
                        id: 'M2',
                        title: 'Final Settlement',
                        description: 'Remaining 70% released after delivery verification.',
                        amount: finalAmount,
                        currency: 'INR',
                        dueDate: 'Upon Delivery',
                        status: 'LOCKED', // Locked until delivery verified
                        actionLabel: 'Verify Delivery'
                    }
                ];

                return {
                    ...c,
                    status: 'active',
                    milestones: newMilestones,
                    escrowStatus: 'active'
                };
            }
            return c;
        }));
        addAuditLog('CONTRACT_ACTIVATED', `Contract ${contractId} activated and escrow initialized.`);
    };

    const releasePayment = (contractId, milestoneId) => {
        setContracts(prev => prev.map(c => {
            if (c.id === contractId && c.milestones) {
                const updatedMilestones = c.milestones.map(m => {
                    if (m.id === milestoneId) {
                        return {
                            ...m,
                            status: 'PAID',
                            paidDate: new Date().toISOString().split('T')[0],
                            actionLabel: null
                        };
                    }
                    return m;
                });
                return { ...c, milestones: updatedMilestones };
            }
            return c;
        }));
        addAuditLog('PAYMENT_RELEASED', `Payment ${milestoneId} released for Contract ${contractId}`);
    };

    const verifyDelivery = (contractId) => {
        setContracts(prev => prev.map(c => {
            if (c.id === contractId && c.milestones) {
                const updatedMilestones = c.milestones.map(m => {
                    if (m.id === 'M2') {
                        return {
                            ...m,
                            status: 'PENDING', // Unlocked, ready for payment
                            actionLabel: 'Release Final Payment'
                        };
                    }
                    return m;
                });
                return { ...c, milestones: updatedMilestones };
            }
            return c;
        }));
        addAuditLog('DELIVERY_VERIFIED', `Delivery verified for Contract ${contractId}`);
    };

    // -------------------------------------------------------------------------
    // 3. DISPUTES & AUDIT (Restored from Backup)
    // -------------------------------------------------------------------------
    const [disputes, setDisputes] = useState(() => {
        const saved = localStorage.getItem('krishi_disputes');
        return saved ? JSON.parse(saved) : [{
            id: 'D-2024-001',
            contractId: 'C-Dummy',
            raisedBy: 'Farmer',
            category: 'Payment Delay',
            description: 'Example dispute for testing.',
            status: 'Open',
            date: '2026-01-18'
        }];
    });

    const [auditLogs, setAuditLogs] = useState(() => {
        const saved = localStorage.getItem('krishi_audit');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('krishi_disputes', JSON.stringify(disputes));
    }, [disputes]);

    useEffect(() => {
        localStorage.setItem('krishi_audit', JSON.stringify(auditLogs));
    }, [auditLogs]);

    const addAuditLog = (action, details) => {
        const newLog = {
            id: Date.now(),
            action,
            details,
            date: new Date().toISOString().split('T')[0]
        };
        setAuditLogs(prev => [newLog, ...prev]);
    };

    const raiseDispute = (contractId, category, description, role) => {
        const newDispute = {
            id: `D-${Date.now()}`,
            contractId,
            raisedBy: role,
            category,
            description,
            status: 'Open',
            date: new Date().toISOString().split('T')[0]
        };
        setDisputes(prev => [newDispute, ...prev]);
        addAuditLog('DISPUTE_RAISED', `Dispute raised by ${role} for Contract ${contractId}`);
    };

    const resolveDispute = (disputeId, resolution) => {
        setDisputes(prev => prev.map(d =>
            d.id === disputeId ? { ...d, status: 'Resolved', resolution } : d
        ));
        addAuditLog('DISPUTE_RESOLVED', `Dispute ${disputeId} marked as resolved.`);
    };

    return (
        <MarketplaceContext.Provider
            value={{
                offers,
                loading,
                error,
                contracts,
                disputes,
                auditLogs,
                fetchOffers, // EXPORTED NOW
                applyForOffer,
                acceptOffer,
                submitCounterOffer,
                releasePayment,
                verifyDelivery,
                updateContractStatus,
                raiseDispute,
                resolveDispute,
                addAuditLog
            }}
        >
            {children}
        </MarketplaceContext.Provider>
    );
};

export const useMarketplace = () => {
    const ctx = useContext(MarketplaceContext);
    if (!ctx) {
        throw new Error("useMarketplace must be used inside MarketplaceProvider");
    }
    return ctx;
};
