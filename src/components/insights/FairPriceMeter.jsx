import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import './Insights.css';

const FairPriceMeter = ({ marketMin, marketMax, offerPrice, unit = "₹/kg" }) => {
    const marketAvg = (marketMin + marketMax) / 2;
    const deviation = ((offerPrice - marketAvg) / marketAvg) * 100;

    // Scale for visual positioning
    const minScale = 10;
    const maxScale = 90;
    const range = marketMax - marketMin;

    // Calculate position relative to the market range (0-100%)
    let pointerPos = ((offerPrice - marketMin) / range) * (maxScale - minScale) + minScale;
    pointerPos = Math.max(0, Math.min(100, pointerPos)); // Clamp

    const isFair = offerPrice >= marketMin && offerPrice <= marketMax;
    const status = offerPrice < marketMin ? 'below' : (offerPrice > marketMax ? 'above' : 'fair');

    return (
        <div className="price-meter-card">
            <div className="meter-header">
                <h3>Fair Price Analysis</h3>
                <span className={`status-text ${status}`}>
                    {status === 'fair' ? 'Fair Market Value' : status === 'below' ? 'Below Market' : 'Premium Pricing'}
                </span>
            </div>

            <div className="meter-visual-container">
                <div className="meter-track">
                    <div className="market-band" style={{ left: `${minScale}%`, right: `${100 - maxScale}%` }}>
                        <span className="band-label">Market Range</span>
                    </div>

                    <motion.div
                        className="price-pointer"
                        initial={{ left: '0%' }}
                        animate={{ left: `${pointerPos}%` }}
                        transition={{ type: 'spring', stiffness: 50, damping: 10 }}
                    >
                        <div className="pointer-tag">
                            <span className="current-price">{unit} {offerPrice}</span>
                            <div className="tag-arrow"></div>
                        </div>
                        <div className="pointer-dot"></div>
                    </motion.div>
                </div>

                <div className="meter-labels">
                    <span>{unit} {marketMin}</span>
                    <span>{unit} {marketAvg} (Avg)</span>
                    <span>{unit} {marketMax}</span>
                </div>
            </div>

            <div className="price-analysis-footer">
                <div className="deviation-stat">
                    {deviation >= 0 ? <TrendingUp size={16} className="danger" /> : <TrendingDown size={16} className="success" />}
                    <span className={deviation > 0 ? 'text-danger' : 'text-success'}>
                        {Math.abs(deviation).toFixed(1)}% {deviation >= 0 ? 'Above' : 'Below'} Average
                    </span>
                </div>
                <div className="suggestion-box">
                    <Target size={14} />
                    <span>Suggested Range: <strong>{unit} {marketMin} - {marketMax}</strong></span>
                </div>
            </div>
        </div>
    );
};

export default FairPriceMeter;
