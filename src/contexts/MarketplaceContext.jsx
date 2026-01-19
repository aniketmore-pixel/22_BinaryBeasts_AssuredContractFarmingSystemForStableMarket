import React, { createContext, useContext, useState, useEffect } from 'react';

const MarketplaceContext = createContext();

export const useMarketplace = () => {
    return useContext(MarketplaceContext);
};

export const MarketplaceProvider = ({ children }) => {
    // Initial dummy data to start with (so the list isn't empty)
    const initialOffers = [
        {
            id: 1,
            crop: 'Organic Wheat (Sharbati)',
            buyer: 'AgroCorp India Ltd.',
            verified: true,
            price: 2800,
            unit: 'Quintal',
            quantity: '500 Quintals',
            location: 'Madhya Pradesh',
            duration: '4 Months',
            requirements: ['Organic Certified', 'Grade A', 'Moisture < 12%'],
            postedDate: '2 days ago'
        },
        {
            id: 2,
            crop: 'Soybean (Yellow)',
            buyer: 'PureFoods Pvt Ltd',
            verified: true,
            price: 4200,
            unit: 'Quintal',
            quantity: '200 Quintals',
            location: 'Maharashtra',
            duration: '3 Months',
            requirements: ['Non-GMO', 'Cleaned'],
            postedDate: '5 hours ago'
        }
    ];

    // Try to load from localStorage first, otherwise use initialOffers
    const [offers, setOffers] = useState(() => {
        const saved = localStorage.getItem('krishi_offers');
        return saved ? JSON.parse(saved) : initialOffers;
    });

    useEffect(() => {
        localStorage.setItem('krishi_offers', JSON.stringify(offers));
    }, [offers]);

    const [contracts, setContracts] = useState(() => {
        const saved = localStorage.getItem('krishi_contracts');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('krishi_contracts', JSON.stringify(contracts));
    }, [contracts]);

    const addOffer = (newOffer) => {
        const offerWithId = {
            ...newOffer,
            id: Date.now(), // Generate unique ID based on timestamp
            postedDate: 'Just now',
            verified: true // Assume buyer is verified for this demo
        };
        setOffers(prevOffers => [offerWithId, ...prevOffers]);
    };

    const applyForOffer = (offer) => {
        const newContract = {
            id: `C-${Date.now()}`,
            crop: offer.crop,
            partner: offer.buyer,
            farmerName: 'Ramesh Kumar', // Hardcoded for demo
            startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            endDate: 'TBD',
            price: Number(offer.price), // Track unit price separately
            value: Number(offer.price) * Number(offer.quantity.split(' ')[0] || 100), // Approx value
            quantity: offer.quantity,
            status: 'pending',
            progress: 0,
            originalOfferId: offer.id,
            negotiationHistory: [
                {
                    role: 'buyer', // The one who created the original offer
                    price: Number(offer.price),
                    date: new Date().toISOString(),
                    message: 'Initial Offer Listing'
                }
            ]
        };
        setContracts(prev => [newContract, ...prev]);
    };

    const submitCounterOffer = (contractId, newPrice, message, role = 'farmer') => {
        setContracts(prev => prev.map(c => {
            if (c.id === contractId) {
                const quantityNum = Number(c.quantity?.split(' ')[0] || 100);
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

    const acceptOffer = (contractId) => {
        setContracts(prev => prev.map(c =>
            c.id === contractId ? { ...c, status: 'active' } : c
        ));
    };

    const updateContractStatus = (contractId, newStatus) => {
        setContracts(prev => prev.map(c =>
            c.id === contractId ? { ...c, status: newStatus } : c
        ));
    };

    const value = {
        offers,
        contracts,
        addOffer,
        applyForOffer,
        updateContractStatus,
        submitCounterOffer,
        acceptOffer
    };

    return (
        <MarketplaceContext.Provider value={value}>
            {children}
        </MarketplaceContext.Provider>
    );
};
