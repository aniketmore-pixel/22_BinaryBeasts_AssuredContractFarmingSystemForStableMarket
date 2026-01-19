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
            value: Number(offer.price) * Number(offer.quantity.split(' ')[0] || 100), // Approx value
            status: 'pending',
            progress: 0,
            originalOfferId: offer.id
        };
        setContracts(prev => [newContract, ...prev]);
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
        updateContractStatus
    };

    return (
        <MarketplaceContext.Provider value={value}>
            {children}
        </MarketplaceContext.Provider>
    );
};
