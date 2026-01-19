import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Info } from 'lucide-react';
import './ContractTimeline.css';

const STAGES = [
    { id: 'created', label: 'Offer Created', description: 'Buyer has posted a new contract requirement.' },
    { id: 'negotiation', label: 'Negotiation', description: 'Price and terms are being discussed.' },
    { id: 'accepted', label: 'Accepted', description: 'Contract terms are locked and signed by both parties.' },
    { id: 'active', label: 'Active', description: 'Farming operations are currently in progress.' },
    { id: 'scheduled', label: 'Delivery Scheduled', description: 'Logistics and pickup timing confirmed.' },
    { id: 'delivered', label: 'Delivered', description: 'Goods have reached the buyer warehouse.' },
    { id: 'paid', label: 'Payment Released', description: 'Funds transferred from escrow to farmer wallet.' },
    { id: 'closed', label: 'Closed', description: 'Contract successfully completed and archived.' }
];

const ContractTimeline = ({ currentStatus, history = [] }) => {
    const currentIndex = STAGES.findIndex(s => s.id === currentStatus);

    return (
        <div className="timeline-wrapper">
            {/* Desktop Horizontal View */}
            <div className="timeline-horizontal">
                <div className="progress-bar-bg">
                    <motion.div
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                </div>

                <div className="stages-container">
                    {STAGES.map((stage, index) => {
                        const isCompleted = index < currentIndex;
                        const isActive = index === currentIndex;
                        const event = history.find(h => h.status === stage.id);

                        return (
                            <div key={stage.id} className={`stage-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                                <div className="node-wrapper">
                                    <div className="node">
                                        {isCompleted ? <Check size={14} /> : (isActive ? <Clock size={14} className="pulse-icon" /> : index + 1)}
                                    </div>
                                    <div className="tooltip">
                                        <Info size={12} />
                                        <span>{stage.description}</span>
                                    </div>
                                </div>
                                <div className="stage-content">
                                    <span className="stage-label">{stage.label}</span>
                                    {event && <span className="stage-time">{event.timestamp}</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Vertical View */}
            <div className="timeline-vertical">
                {STAGES.map((stage, index) => {
                    const isCompleted = index < currentIndex;
                    const isActive = index === currentIndex;
                    const event = history.find(h => h.status === stage.id);

                    return (
                        <div key={stage.id} className={`v-stage-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                            <div className="v-node-line">
                                <div className="v-node">
                                    {isCompleted ? <Check size={14} /> : (isActive ? <Clock size={14} className="pulse-icon" /> : index + 1)}
                                </div>
                                {index !== STAGES.length - 1 && <div className="v-line"></div>}
                            </div>
                            <div className="v-stage-content">
                                <div className="v-header">
                                    <span className="v-label">{stage.label}</span>
                                    {event && <span className="v-time">{event.timestamp}</span>}
                                </div>
                                <p className="v-desc">{stage.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ContractTimeline;
