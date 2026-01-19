import React, { createContext, useContext, useState, useEffect } from 'react';
import { dummyDisputes as initialDisputes } from '../data/dummyDisputes';

const DisputeContext = createContext();

export const DisputeProvider = ({ children }) => {
    const [disputes, setDisputes] = useState(() => {
        const saved = localStorage.getItem('krishiSetu_disputes');
        return saved ? JSON.parse(saved) : initialDisputes;
    });

    useEffect(() => {
        localStorage.setItem('krishiSetu_disputes', JSON.stringify(disputes));
    }, [disputes]);

    const addDispute = (newDispute) => {
        const dispute = {
            ...newDispute,
            id: `DISP-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'Open',
            createdAt: new Date().toISOString(),
            timeline: [
                { status: 'Open', date: new Date().toISOString(), description: 'Dispute raised' }
            ],
            comments: [],
            evidence: newDispute.evidence || []
        };
        setDisputes([dispute, ...disputes]);
        return dispute;
    };

    const updateDisputeStatus = (id, status, description) => {
        setDisputes(disputes.map(d => {
            if (d.id === id) {
                return {
                    ...d,
                    status,
                    timeline: [...d.timeline, { status, date: new Date().toISOString(), description }]
                };
            }
            return d;
        }));
    };

    const addComment = (id, comment) => {
        setDisputes(disputes.map(d => {
            if (d.id === id) {
                return {
                    ...d,
                    comments: [...d.comments, {
                        id: `c-${Date.now()}`,
                        timestamp: new Date().toISOString(),
                        ...comment
                    }]
                };
            }
            return d;
        }));
    };

    const resolveDispute = (id, resolution) => {
        setDisputes(disputes.map(d => {
            if (d.id === id) {
                return {
                    ...d,
                    status: 'Resolved',
                    resolution,
                    timeline: [...d.timeline, { status: 'Resolved', date: new Date().toISOString(), description: 'Dispute resolved by Admin' }]
                };
            }
            return d;
        }));
    };

    return (
        <DisputeContext.Provider value={{
            disputes,
            addDispute,
            updateDisputeStatus,
            addComment,
            resolveDispute
        }}>
            {children}
        </DisputeContext.Provider>
    );
};

export const useDisputes = () => {
    const context = useContext(DisputeContext);
    if (!context) {
        throw new Error('useDisputes must be used within a DisputeProvider');
    }
    return context;
};
