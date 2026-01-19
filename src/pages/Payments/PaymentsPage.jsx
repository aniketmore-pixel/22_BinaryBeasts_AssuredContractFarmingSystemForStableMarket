import React, { useState } from 'react';
import { Wallet, ShieldCheck, TrendingUp, Clock, FileText, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import PaymentMilestoneTimeline from '../../components/payments/PaymentMilestoneTimeline';
import styles from './PaymentsPage.module.css';

const PaymentsPage = ({ role = 'farmer' }) => {
    const [activeTab, setActiveTab] = useState('active');

    // Dummy Wallet Data
    const walletData = {
        totalBalance: role === 'farmer' ? 145000 : 2500000,
        inEscrow: role === 'farmer' ? 48000 : 850000,
        available: role === 'farmer' ? 97000 : 1650000,
    };

    // Dummy Contracts Data for Timeline
    const activeContracts = [
        {
            id: 'C101',
            crop: 'Organic Wheat Shrbati',
            buyer: 'AgroCorp India Ltd.',
            farmer: 'Ramesh Kumar',
            totalValue: 60000,
            startDate: '2026-01-15',
            milestones: [
                {
                    id: "M1",
                    title: "Advance Payment",
                    description: "20% advance payment upon contract signing.",
                    amount: 12000,
                    currency: "INR",
                    dueDate: "2026-01-15",
                    paidDate: "2026-01-16",
                    status: "PAID"
                },
                {
                    id: "M2",
                    title: "Delivery Verification",
                    description: "Quality check and weighing at collection center.",
                    amount: 0,
                    currency: "INR",
                    dueDate: "2026-04-10",
                    paidDate: null,
                    status: "PENDING",
                    actionLabel: role === 'buyer' ? "Verify Delivery" : null
                },
                {
                    id: "M3",
                    title: "Final Settlement",
                    description: "Remaining 80% released after verification.",
                    amount: 48000,
                    currency: "INR",
                    dueDate: "2026-04-15",
                    paidDate: null,
                    status: "PENDING",
                    actionLabel: role === 'buyer' ? "Release Payment" : null
                }
            ]
        },
        {
            id: 'C102',
            crop: 'Soybean Grade A',
            buyer: 'PureFoods Pvt Ltd',
            farmer: 'Ramesh Kumar',
            totalValue: 85000,
            startDate: '2025-12-20',
            milestones: [
                {
                    id: "M1",
                    title: "Advance Payment",
                    amount: 17000,
                    currency: "INR",
                    dueDate: "2025-12-20",
                    paidDate: "2025-12-21",
                    status: "PAID"
                },
                {
                    id: "M2",
                    title: "Interim Inspection",
                    description: "Field visit by buyer agent.",
                    amount: 0,
                    currency: "INR",
                    dueDate: "2026-02-15",
                    paidDate: null,
                    status: "PENDING",
                    actionLabel: role === 'buyer' ? "Log Inspection" : null
                },
                {
                    id: "M3",
                    title: "Final Settlement",
                    amount: 68000,
                    currency: "INR",
                    dueDate: "2026-03-30",
                    paidDate: null,
                    status: "PENDING"
                }
            ]
        }
    ];

    // Dummy Transactions
    const transactions = [
        { id: 'T1', date: '2026-01-16', desc: 'Advance Payment - C101 Wheat', amount: 12000, type: 'credit', status: 'Completed' },
        { id: 'T2', date: '2025-12-21', desc: 'Advance Payment - C102 Soybean', amount: 17000, type: 'credit', status: 'Completed' },
        { id: 'T3', date: '2025-12-10', desc: 'Withdrawal to Bank Account', amount: -25000, type: 'debit', status: 'Completed' },
        { id: 'T4', date: '2025-11-05', desc: 'Final Settlement - C099 Corn', amount: 45000, type: 'credit', status: 'Completed' },
    ];

    const currentMilestoneIds = {
        'C101': 'M2',
        'C102': 'M2'
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
                    <div className={styles.cardAmount}>₹{walletData.available.toLocaleString()}</div>
                    <div className={styles.cardTrend}>
                        <ArrowUpRight size={16} className={styles.trendUp} />
                        <span className={styles.trendUp}>+12%</span>
                        <span style={{ color: 'var(--text-muted)' }}>vs last month</span>
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
                    <div className={styles.cardAmount}>₹{walletData.inEscrow.toLocaleString()}</div>
                    <div className={styles.cardTrend}>
                        <span style={{ color: 'var(--text-muted)' }}>{role === 'farmer' ? 'Releasing soon' : 'Securing contracts'}</span>
                    </div>
                </div>

                {/* Total Lifetime Volume (or some other stat) */}
                <div className={styles.walletCard}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardLabel}>Total Volume</span>
                        <div className={`${styles.cardIcon} ${styles.success}`}>
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className={styles.cardAmount}>₹{walletData.totalBalance.toLocaleString()}</div>
                    <div className={styles.cardTrend}>
                        <span style={{ color: 'var(--text-muted)' }}>Lifetime earnings</span>
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
                    {activeContracts.map(contract => (
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
                                            <span>{role === 'farmer' ? `Buyer: ${contract.buyer}` : `Farmer: ${contract.farmer}`}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.contractValue}>
                                    <span className={styles.valueLabel}>Total Value</span>
                                    <div className={styles.totalValue}>₹{contract.totalValue.toLocaleString()}</div>
                                </div>
                            </div>

                            {/* The Timeline Component */}
                            <PaymentMilestoneTimeline
                                milestones={contract.milestones}
                                currentMilestoneId={currentMilestoneIds[contract.id]}
                                onAction={(id) => console.log('Action on', id)}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Reference</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.id}>
                                    <td>{tx.date}</td>
                                    <td>{tx.desc}</td>
                                    <td>{tx.id}</td>
                                    <td>
                                        <span className={`badge badge-success`}>{tx.status}</span>
                                    </td>
                                    <td style={{ textAlign: 'right' }} className={tx.amount > 0 ? styles.amountPositive : styles.amountNegative}>
                                        {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PaymentsPage;
