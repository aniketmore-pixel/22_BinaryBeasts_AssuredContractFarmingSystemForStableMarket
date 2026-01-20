import React, { useState, useEffect } from 'react';
import { marketService } from '../../utils/marketService';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Loader } from 'lucide-react';
import styles from './MarketTrendsPage.module.css';
import MarketAlerts from '../../components/market/MarketAlerts';

const commodities = [
    "Wheat", "Paddy", "Barley", "Maize", "Cotton", "Sugarcane",
    "Soyabean", "Gram", "Groundnut", "Arhar", "Moong", "Masoor"
];

const MarketTrendsPage = () => {
    const [trends, setTrends] = useState(null);
    const [selectedCrop, setSelectedCrop] = useState('Wheat');
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const trendsData = await marketService.getTrends();
                setTrends(trendsData);
                await fetchCropForecast('Wheat');
            } catch (err) {
                console.error(err);
                setError("Could not connect to AI Prediction Engine. Ensure Python backend is running.");
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const fetchCropForecast = async (crop) => {
        setLoading(true);
        try {
            const data = await marketService.getForecast(crop);
            setForecastData(data);
            setSelectedCrop(crop);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <AlertTriangle size={48} color="#ef4444" />
                <h2>Connection Error</h2>
                <p>{error}</p>
                <p className={styles.hint}>Running on localhost:5000</p>
                <button onClick={() => window.location.reload()} className={styles.retryBtn}>Retry Connection</button>
            </div>
        );
    }

    if (!trends && loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader className={styles.spin} size={40} />
                <p>Analyzing Market Trends...</p>
            </div>
        );
    }

    const getInsight = (data) => {
        if (!data) return null;
        const current = data.currentPrice;
        const peak = data.maxPrice[1];
        const peakMonth = data.maxPrice[0];
        const low = data.minPrice[1];
        const cropName = data.name;

        const growth = ((peak - current) / current) * 100;
        const volatility = ((peak - low) / low) * 100;

        // Helper to categorize crop for tailored advice
        const getCategory = (c) => {
            if (['Wheat', 'Paddy', 'Barley', 'Maize'].includes(c)) return 'grain';
            if (['Cotton', 'Sugarcane'].includes(c)) return 'commercial';
            if (['Gram', 'Arhar', 'Moong', 'Masoor'].includes(c)) return 'pulse';
            if (['Soyabean', 'Groundnut'].includes(c)) return 'oilseed';
            return 'general';
        };

        const category = getCategory(cropName);

        // Dynamic Insight Generation
        if (growth > 15) {
            let specificAdvice = "";
            if (category === 'grain') specificAdvice = "Consider utilizing warehouse receipts (e-NWR) to hold stock.";
            else if (category === 'commercial') specificAdvice = "Mills are likely increasing procurement; negotiate purely on quality grades.";
            else if (category === 'pulse') specificAdvice = "Shortage expected in retail markets.";

            return (
                <span>
                    🚀 <strong>High Growth Alert:</strong> {cropName} is projected to surge by <strong>{growth.toFixed(1)}%</strong>, peaking in {peakMonth}. {specificAdvice} Farmers should consider <strong>holding stock</strong> or negotiating premium rates for forward contracts.
                </span>
            );
        } else if (growth > 5) {
            return (
                <span>
                    📈 <strong>Positive Outlook:</strong> A steady upward trend is observed. Expect a peak in {peakMonth}. A balanced strategy of <strong>staggered contracts</strong> can capture this moderate growth while mitigating risk.
                </span>
            );
        } else if (volatility < 5) {
            let stabilityAdvice = "Excellent for long-term forward contracts.";
            if (category === 'commercial') stabilityAdvice = "Ideal for securing guaranteed buyback agreements with factories.";

            return (
                <span>
                    🛡️ <strong>Stable Market:</strong> {cropName} shows very low volatility. {stabilityAdvice} Focus on maximizing yield as prices are predictable.
                </span>
            );
        } else { // Downward or volatile
            let cautionAdvice = "Avoid holding large inventories.";
            if (category === 'oilseed') cautionAdvice = "Global oil prices may be affecting local rates.";

            return (
                <span>
                    ⚠️ <strong>Market Correction:</strong> Prices may fluctuate or dip slightly. {cautionAdvice} Creating long-term contracts <strong>at current rates</strong> is recommended to protect against potential future lows.
                </span>
            );
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Market Insights & AI Forecasts</h1>
                    <p>Real-time price predictions powered by Random Forest Regression</p>
                </div>
                <div className={styles.controls}>
                    <select
                        value={selectedCrop}
                        onChange={(e) => fetchCropForecast(e.target.value)}
                        className={styles.cropSelect}
                    >
                        {commodities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Top Movers Section */}
            <div className={styles.mainGrid}>
                <div className={styles.alertsColumn}>
                    <MarketAlerts trends={trends} />
                </div>

                <div className={styles.trendsColumn}>
                    {trends && (
                        <div className={styles.moversGrid}>
                            <div className={styles.moversCard}>
                                <div className={styles.cardHeader}>
                                    <TrendingUp className={styles.trendUp} />
                                    <h3>Top Gainers (Next Month)</h3>
                                </div>
                                <div className={styles.moversList}>
                                    {trends.topWinners.map((item, i) => (
                                        <div key={i} className={styles.moverItem}>
                                            <span className={styles.moverName}>{item[0]}</span>
                                            <span className={styles.moverPrice}>₹{item[1]}</span>
                                            <span className={styles.moverChangePositive}>+{item[2]}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.moversCard}>
                                <div className={styles.cardHeader}>
                                    <TrendingDown className={styles.trendDown} />
                                    <h3>Top Losers (Next Month)</h3>
                                </div>
                                <div className={styles.moversList}>
                                    {trends.topLosers.map((item, i) => (
                                        <div key={i} className={styles.moverItem}>
                                            <span className={styles.moverName}>{item[0]}</span>
                                            <span className={styles.moverPrice}>₹{item[1]}</span>
                                            <span className={styles.moverChangeNegative}>{item[2]}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Forecast Chart */}
            {forecastData && (
                <div className={styles.chartSection}>
                    <div className={styles.chartHeader}>
                        <h2>{selectedCrop} Price Forecast (12 Months)</h2>
                        <div className={styles.currentStats}>
                            <div className={styles.statBox}>
                                <label>Current Price</label>
                                <span>₹{forecastData.currentPrice.toFixed(2)}</span>
                            </div>
                            <div className={styles.statBox}>
                                <label>Peak Forecast</label>
                                <span className={styles.highVal}>₹{forecastData.maxPrice[1]}</span>
                                <small>in {forecastData.maxPrice[0]}</small>
                            </div>
                            <div className={styles.statBox}>
                                <label>Low Forecast</label>
                                <span className={styles.lowVal}>₹{forecastData.minPrice[1]}</span>
                                <small>in {forecastData.minPrice[0]}</small>
                            </div>
                        </div>
                    </div>

                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart data={forecastData.forecast} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" />
                                <YAxis domain={['auto', 'auto']} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Tooltip
                                    contentStyle={{ background: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#16a34a"
                                    fillOpacity={1}
                                    fill="url(#colorPrice)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className={styles.insightBox}>
                        <h4>💡 AI Insight</h4>
                        <p>{getInsight(forecastData)}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketTrendsPage;
