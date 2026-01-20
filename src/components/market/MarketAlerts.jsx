import React from 'react';
import { Bell, Clock, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import styles from './MarketAlerts.module.css';

const MarketAlerts = ({ trends }) => {
    const { contracts } = useMarketplace();

    // Helper to calculate days diff
    const getDaysDifference = (dateString) => {
        const today = new Date();
        const target = new Date(dateString);
        const diffTime = target - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // 1. Generate Contract/Delivery Alerts
    const contractAlerts = contracts.flatMap(contract => {
        const alerts = [];

        // Check Contract Expiry
        if (contract.status === 'active' && contract.endDate !== 'TBD') {
            const daysLeft = getDaysDifference(contract.endDate);
            if (daysLeft <= 7 && daysLeft >= 0) {
                alerts.push({
                    id: `exp-${contract.id}`,
                    type: 'deadline',
                    priority: daysLeft <= 3 ? 'high' : 'medium',
                    message: `Contract #${contract.id.split('-').pop()} for ${contract.crop} expires in ${daysLeft} days.`,
                    date: contract.endDate
                });
            }
        }

        // Check Milestones (Deliveries/Payments)
        if (contract.milestones) {
            contract.milestones.forEach(m => {
                if (m.status !== 'PAID' && m.dueDate && m.dueDate !== 'Upon Delivery') {
                    const daysLeft = getDaysDifference(m.dueDate);
                    if (daysLeft <= 5 && daysLeft >= 0) {
                        alerts.push({
                            id: `milestone-${m.id}-${contract.id}`,
                            type: 'delivery',
                            priority: 'high',
                            message: `Due: ${m.title} for ${contract.crop} is due on ${m.dueDate}.`,
                            date: m.dueDate
                        });
                    }
                }
            });
        }

        return alerts;
    });

    // 2. Generate Context-Aware Price Alerts
    const priceAlerts = [];
    if (trends) {
        // Create a map for quick lookup of trends
        const winnersMap = new Map(trends.topWinners.map(item => [item[0].toLowerCase(), item]));
        const losersMap = new Map(trends.topLosers.map(item => [item[0].toLowerCase(), item]));

        // Check user's active crops against market trends
        const userCrops = new Set(contracts.map(c => c.crop.split(' ')[0].toLowerCase())); // Simplistic crop extraction

        userCrops.forEach(crop => {
            if (winnersMap.has(crop)) {
                const data = winnersMap.get(crop);
                priceAlerts.push({
                    id: `trend-win-${crop}`,
                    type: 'price',
                    priority: 'medium',
                    message: `📈 Good News! Your active crop (${data[0]}) is trending UP by +${data[2]}%.`,
                    date: 'Market Watch'
                });
            }
            if (losersMap.has(crop)) {
                const data = losersMap.get(crop);
                priceAlerts.push({
                    id: `trend-loss-${crop}`,
                    type: 'price',
                    priority: 'high',
                    message: `⚠️ Shield Alert: Your crop (${data[0]}) price dropped by ${data[2]}%. Your contract price is protected.`,
                    date: 'Market Watch'
                });
            }
        });

        // Add a general market alert if no specific user crops matches, just to keep them informed
        if (priceAlerts.length === 0 && trends.topWinners.length > 0) {
            const winner = trends.topWinners[0];
            priceAlerts.push({
                id: 'gen-winner',
                type: 'price',
                priority: 'low',
                message: `Market Insight: ${winner[0]} is the top gainer this month (+${winner[2]}%).`,
                date: 'General Trend'
            });
        }
    }

    const allAlerts = [...contractAlerts, ...priceAlerts];

    if (allAlerts.length === 0) {
        allAlerts.push({
            id: 'empty-state',
            type: 'info',
            priority: 'low',
            message: 'No immediate alerts. Your contracts and markets look stable.',
            date: 'Just now'
        });
    }

    const getIcon = (type) => {
        switch (type) {
            case 'delivery': return <Clock size={16} />;
            case 'deadline': return <Calendar size={16} />;
            case 'price': return <TrendingUp size={16} />;
            case 'info': return <Bell size={16} />;
            default: return <Bell size={16} />;
        }
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    return (
        <div className={styles.alertsParams}>
            <div className={styles.header}>
                <h3><Bell size={18} /> Smart Alerts</h3>
                <span className={styles.badge}>{allAlerts.length} Active</span>
            </div>

            <div className={styles.list}>
                {allAlerts.map(alert => (
                    <div key={alert.id} className={styles.alertItem}>
                        <div className={styles.iconBox} style={{ color: getPriorityColor(alert.priority) }}>
                            {getIcon(alert.type)}
                        </div>
                        <div className={styles.content}>
                            <p className={styles.message}>{alert.message}</p>
                            <span className={styles.date}>{alert.date}</span>
                        </div>
                        {alert.priority === 'high' && <AlertCircle size={14} className={styles.highIndicator} />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketAlerts;
