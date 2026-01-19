import React, { useState } from 'react';
import TrustBadge from '../../components/insights/TrustBadge';
import RiskIndicator from '../../components/insights/RiskIndicator';
import FairPriceMeter from '../../components/insights/FairPriceMeter';
import { Card } from '../../components/ui/Base';
import './InsightsDemo.css';

const InsightsDemo = () => {
    // State for interactive controls
    const [trustScore, setTrustScore] = useState(85);
    const [riskLevel, setRiskLevel] = useState('low');
    const [offerPrice, setOfferPrice] = useState(2400);
    const [marketMin, setMarketMin] = useState(2100);
    const [marketMax, setMarketMax] = useState(2600);

    return (
        <div className="demo-wrapper">
            <header className="insights-header">
                <div className="label-tag">Market Intelligence</div>
                <h1>Contract Analysis & Insights</h1>
                <p>Advanced predictive metrics for smarter contract farming decisions.</p>
            </header>

            <div className="insights-grid">
                {/* 1. Left Column: Controls */}
                <div className="demo-sidebar">
                    <Card title="Widget Controls" className="controls-card">
                        <div className="control-group">
                            <label>Trust Score: {trustScore}</label>
                            <input
                                type="range" min="0" max="100"
                                value={trustScore}
                                onChange={(e) => setTrustScore(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="control-group">
                            <label>Risk Level</label>
                            <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}>
                                <option value="low">Low Risk</option>
                                <option value="medium">Medium Risk</option>
                                <option value="high">High Risk</option>
                            </select>
                        </div>

                        <div className="control-group">
                            <label>Offer Price: ₹{offerPrice}</label>
                            <input
                                type="range" min="1500" max="3500" step="50"
                                value={offerPrice}
                                onChange={(e) => setOfferPrice(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="market-range-controls">
                            <div className="control-group">
                                <label>Market Min</label>
                                <input
                                    type="number" value={marketMin}
                                    onChange={(e) => setMarketMin(parseInt(e.target.value))}
                                />
                            </div>
                            <div className="control-group">
                                <label>Market Max</label>
                                <input
                                    type="number" value={marketMax}
                                    onChange={(e) => setMarketMax(parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* 2. Right Column: Widgets */}
                <div className="demo-main">
                    <div className="widgets-top-row">
                        <Card className="trust-demo-card">
                            <div className="widget-label">Identity & Verification</div>
                            <div className="badge-demo-row">
                                <div className="badge-item">
                                    <label>Farmer Profile</label>
                                    <TrustBadge score={trustScore} label="Farmer" />
                                </div>
                                <div className="badge-item">
                                    <label>Buyer Profile</label>
                                    <TrustBadge score={92} label="Corporate" />
                                </div>
                            </div>
                        </Card>

                        <Card className="risk-demo-card">
                            <div className="widget-label">Contract Risk Assessment</div>
                            <RiskIndicator
                                level={riskLevel}
                                reasons={[
                                    "Price drop predicted for Wheat in Feb 2026",
                                    "Unusual rainfall patterns in farmer region",
                                    "Buyer has 1 pending settlement dispute"
                                ]}
                            />
                        </Card>
                    </div>

                    <div className="widgets-bottom-row">
                        <Card className="price-demo-card">
                            <div className="widget-label">Price Comparison</div>
                            <FairPriceMeter
                                marketMin={marketMin}
                                marketMax={marketMax}
                                offerPrice={offerPrice}
                                unit="₹"
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsightsDemo;
