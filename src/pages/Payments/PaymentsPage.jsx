import React, { useState, useEffect } from 'react';
import { Wallet, ShieldCheck, TrendingUp, Clock, FileText, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import PaymentMilestoneTimeline from '../../components/payments/PaymentMilestoneTimeline';
import PaymentGatewayModal from '../../components/payments/PaymentGatewayModal';
import styles from './PaymentsPage.module.css';

const PaymentsPage = ({ role = 'farmer' }) => { // Change role to 'buyer' to test buyer flow
    const { contracts, releasePayment, verifyDelivery } = useMarketplace();
    const [activeTab, setActiveTab] = useState('active');
    const [stats, setStats] = useState({ available: 0, escrow: 0, total: 0 });
    const [paymentRequest, setPaymentRequest] = useState(null); // { contractId, milestoneId, amount }

    // Filter only active contracts with milestones
    const activeContracts = contracts.filter(c => c.status === 'active' && c.milestones);

    // Calculate Wallet Stats Dynamically
    useEffect(() => {
        let available = 0;
        let escrow = 0;
        let total = 0;

        activeContracts.forEach(c => {
            c.milestones.forEach(m => {
                if (m.status === 'PAID') {
                    // For Farmer: Paid means available funds
                    // For Buyer: Paid means money left the account (outflow), so we tracked it differently or just ignore for "Wallet" view?
                    // Let's assume this view is the "Recipient" view (Farmer) mostly, or "Escrow Balance" for Buyer.
                    // For simplicity:
                    available += m.amount;
                    total += m.amount;
                } else {
                    // Pending or Locked
                    escrow += m.amount;
                }
            });
        });

        // Add some base fictitious balance so it's not zero
        const baseBalance = role === 'farmer' ? 15000 : 500000;

        setStats({
            available: baseBalance + (role === 'farmer' ? available : -available),
            escrow: escrow,
            total: total
        });
    }, [contracts, role]);

    const handleAction = (contractId, milestone) => {
        if (role === 'buyer') {
            // Buyer Logic
            if (milestone.id === 'M1' && milestone.status === 'PENDING') {
                // Open Payment Gateway for Advance
                setPaymentRequest({ contractId, milestoneId: milestone.id, amount: milestone.amount });
            } else if (milestone.id === 'M2' && milestone.status === 'PENDING') {
                // Open Payment Gateway for Final
                setPaymentRequest({ contractId, milestoneId: milestone.id, amount: milestone.amount });
            } else if (milestone.id === 'M2' && milestone.status === 'LOCKED') {
                verifyDelivery(contractId); // Buyer confirms delivery
            }
        } else {
            // Farmer Logic
            if (milestone.id === 'M2' && milestone.status === 'LOCKED') {
                // Farmer could requesting verification, but simpler to let Buyer do it
                alert("Waiting for Buyer to verify delivery.");
            }
        }
    };

    const handlePaymentSuccess = () => {
        if (paymentRequest) {
            releasePayment(paymentRequest.contractId, paymentRequest.milestoneId);
            setPaymentRequest(null);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Payments & Escrow Wallet</h1>
                <p className={styles.subtitle}>Manage your funds, track contract payments, and view transaction history.</p>
            </div>

            {/* Wallet Summary Cards */}
            <div className={styles.walletGrid}>
                {/* Available Balance */}
                <div className={styles.walletCard}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardLabel}>Available Balance</span>
                        <div className={`${styles.cardIcon} ${styles.primary}`}>
                            <Wallet size={24} />
                        </div>
                    </div>
                    <div className={styles.cardAmount}>₹{stats.available.toLocaleString()}</div>
                    <div className={styles.cardTrend}>
                        <ArrowUpRight size={16} className={styles.trendUp} />
                        <span className={styles.trendUp}>Live</span>
                        <span style={{ color: 'var(--text-muted)' }}> updated just now</span>
                    </div>
                </div>

                {/* In Escrow */}
                <div className={styles.walletCard}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardLabel}>Locked in Escrow</span>
                        <div className={`${styles.cardIcon} ${styles.warning}`}>
                            <ShieldCheck size={24} />
                        </div>
                    </div>
                    <div className={styles.cardAmount}>₹{stats.escrow.toLocaleString()}</div>
                    <div className={styles.cardTrend}>
                        <span style={{ color: 'var(--text-muted)' }}>
                            {role === 'farmer' ? 'Releasing on milestones' : 'Reserved for contracts'}
                        </span>
                    </div>
                </div>

                {/* Total Volume */}
                <div className={styles.walletCard}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardLabel}>Total Contract Value</span>
                        <div className={`${styles.cardIcon} ${styles.success}`}>
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className={styles.cardAmount}>₹{(stats.escrow + stats.total).toLocaleString()}</div>
                    <div className={styles.cardTrend}>
                        <span style={{ color: 'var(--text-muted)' }}>Active deals</span>
                    </div>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'active' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Active Contract Payments
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'history' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    Transaction History
                </button>
            </div>

            {activeTab === 'active' ? (
                <div className={styles.contractList}>
                    {activeContracts.length > 0 ? (
                        activeContracts.map(contract => (
                            <div key={contract.id} className={styles.contractCard}>
                                <div className={styles.contractHeader}>
                                    <div className={styles.contractInfo}>
                                        <h3>{contract.crop}</h3>
                                        <div className={styles.contractMeta}>
                                            <div className={styles.metaItem}>
                                                <FileText size={16} />
                                                <span>Contract #{contract.id}</span>
                                            </div>
                                            <div className={styles.metaItem}>
                                                <Clock size={16} />
                                                <span>Started {contract.startDate}</span>
                                            </div>
                                            <div className={styles.metaItem}>
                                                <ShieldCheck size={16} />
                                                <span>{role === 'farmer' ? `Buyer: ${contract.partner}` : `Farmer: ${contract.farmerName}`}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.contractValue}>
                                        <span className={styles.valueLabel}>Total Value</span>
                                        <div className={styles.totalValue}>₹{contract.value.toLocaleString()}</div>
                                    </div>
                                </div>

                                {/* The Timeline Component */}
                                <PaymentMilestoneTimeline
                                    milestones={contract.milestones}
                                    currentMilestoneId={null} // Not really needed if we render all
                                    // Pass role-based action handler
                                    onAction={(milestoneId) => {
                                        const m = contract.milestones.find(x => x.id === milestoneId);
                                        if (m) handleAction(contract.id, m);
                                    }}
                                    userRole={role} // Pass role to timeline to verify button visibility
                                />
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <h3>No Active Payment Streams</h3>
                            <p>Once you accept a contract offer, the escrow milestones will appear here.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    <div className={styles.emptyState}>
                        <p>Transaction history will appear here once payments are released.</p>
                    </div>
                </div>
            )}

            {/* Payment Gateway Modal */}
            {paymentRequest && (
                <PaymentGatewayModal
                    isOpen={!!paymentRequest}
                    onClose={() => setPaymentRequest(null)}
                    amount={paymentRequest.amount}
                    onProcessPayment={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default PaymentsPage;
