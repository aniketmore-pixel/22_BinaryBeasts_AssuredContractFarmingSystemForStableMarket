import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import './Insights.css';

const RiskIndicator = ({ level = "low", reasons = [] }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const config = {
        low: { color: '#10b981', label: 'Low Risk', bg: '#ecfdf5', dark: '#065f46' },
        medium: { color: '#f59e0b', label: 'Medium Risk', bg: '#fffbeb', dark: '#92400e' },
        high: { color: '#ef4444', label: 'High Risk', bg: '#fef2f2', dark: '#991b1b' }
    };

    const current = config[level] || config.low;

    return (
        <div className="risk-indicator-wrapper">
            <div className="risk-main-card" style={{ background: current.bg, border: `1px solid ${current.color}33` }}>
                <div className="risk-header">
                    <div className="risk-visual">
                        <svg width="60" height="60" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                            <motion.circle
                                cx="50" cy="50" r="40"
                                fill="none"
                                stroke={current.color}
                                strokeWidth="8"
                                strokeDasharray="251.2"
                                initial={{ strokeDashoffset: 251.2 }}
                                animate={{ strokeDashoffset: 251.2 - (251.2 * (level === 'low' ? 0.3 : level === 'medium' ? 0.6 : 0.9)) }}
                                strokeLinecap="round"
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </svg>
                        <div className="risk-level-icon" style={{ color: current.color }}>
                            <AlertCircle size={20} />
                        </div>
                    </div>
                    <div className="risk-info">
                        <h4 style={{ color: current.dark }}>{current.label}</h4>
                        <p>Contract assessment based on current market volatility and buyer history.</p>
                    </div>
                </div>

                {level === 'high' && (
                    <motion.div
                        className="high-risk-alert"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <AlertCircle size={14} />
                        Extreme caution advised. Escrow protection mandatory.
                    </motion.div>
                )}

                <button
                    className="risk-expand-btn"
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{ color: current.dark }}
                >
                    {isExpanded ? 'Hide Details' : 'Why this is risky?'}
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            className="risk-details"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                        >
                            <ul className="reasons-list">
                                {reasons.length > 0 ? reasons.map((reason, i) => (
                                    <li key={i}><Info size={12} /> {reason}</li>
                                )) : (
                                    <>
                                        <li><Info size={12} /> Market price volatility exceeds 15%.</li>
                                        <li><Info size={12} /> Unverified logistics partner selected.</li>
                                        <li><Info size={12} /> Regional weather warning (Heavy Rain).</li>
                                    </>
                                )}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RiskIndicator;
