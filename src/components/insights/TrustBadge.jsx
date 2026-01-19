import React, { useState } from 'react';
import { Shield, ShieldCheck, ShieldAlert, ChevronDown, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import './Insights.css';

const TrustBadge = ({ score = 0, label = "User" }) => {
    const [showPopover, setShowPopover] = useState(false);

    const getStatus = (s) => {
        if (s >= 80) return { type: 'trusted', color: '#10b981', icon: <ShieldCheck size={16} />, text: 'Trusted' };
        if (s >= 50) return { type: 'medium', color: '#f59e0b', icon: <Shield size={16} />, text: 'Verified' };
        return { type: 'risky', color: '#ef4444', icon: <ShieldAlert size={16} />, text: 'Risky' };
    };

    const status = getStatus(score);

    return (
        <div className="trust-badge-container">
            <div
                className={`trust-chip ${status.type}`}
                onClick={() => setShowPopover(!showPopover)}
            >
                <span className="chip-icon" style={{ color: status.color }}>{status.icon}</span>
                <span className="chip-label">{label} Score: <strong>{score}</strong></span>
                <ChevronDown size={14} className={`dropdown-arrow ${showPopover ? 'open' : ''}`} />
            </div>

            {showPopover && (
                <div className="trust-popover">
                    <div className="popover-header">
                        <h4>Trust Analysis</h4>
                        <span className={`status-pill ${status.type}`}>{status.text}</span>
                    </div>
                    <p className="popover-desc">Based on historical platform activity and contract fulfillment.</p>

                    <div className="breakdown-list">
                        <div className="breakdown-item">
                            <div className="item-label">
                                <CheckCircle2 size={14} className="success" />
                                <span>Completed Contracts</span>
                            </div>
                            <span className="item-value">24</span>
                        </div>
                        <div className="breakdown-item">
                            <div className="item-label">
                                <Clock size={14} className="warning" />
                                <span>Avg. Payment Delay</span>
                            </div>
                            <span className="item-value">0.4 Days</span>
                        </div>
                        <div className="breakdown-item">
                            <div className="item-label">
                                <AlertTriangle size={14} className="danger" />
                                <span>Disputes Raised</span>
                            </div>
                            <span className="item-value">01</span>
                        </div>
                    </div>

                    <div className="popover-footer">
                        <span>Why this matters?</span>
                        <div className="info-tooltip">
                            Higher scores qualify for lower escrow fees and faster settlements.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrustBadge;
