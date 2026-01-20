import React, { useState } from 'react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import styles from './DisputesPage.module.css';
import { AlertCircle, FileText, CheckCircle, Clock } from 'lucide-react';

const DisputesPage = ({ role = 'farmer' }) => {
    const { disputes, auditLogs, raiseDispute, contracts } = useMarketplace();
    const [activeTab, setActiveTab] = useState('active');

    // Form State
    const [formData, setFormData] = useState({
        contractId: '',
        category: 'Payment Issue',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.contractId) {
            alert("Please select a contract.");
            return;
        }
        raiseDispute(formData.contractId, formData.category, formData.description, role);
        alert("Dispute Raised Successfully. It is now logged in the Audit Trail.");
        setActiveTab('active');
        setFormData({ contractId: '', category: 'Payment Issue', description: '' });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Dispute Resolution & Audit Center</h1>
                <p>Track contract violations and view the immutable audit trail.</p>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'active' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Active Disputes
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'raise' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('raise')}
                >
                    Raise New Dispute
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'audit' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('audit')}
                >
                    Audit Logs
                </button>
            </div>

            {/* Active Disputes Tab */}
            {activeTab === 'active' && (
                <div className={styles.disputeList}>
                    {disputes.length > 0 ? (
                        disputes.map(dispute => (
                            <div key={dispute.id} className={styles.disputeCard}>
                                <div className={styles.disputeInfo}>
                                    <h3>{dispute.category} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>#{dispute.id}</span></h3>
                                    <div className={styles.disputeMeta}>
                                        <span>Contract: {dispute.contractId}</span>
                                        <span>Raised by: {dispute.raisedBy}</span>
                                        <span>Date: {dispute.date}</span>
                                    </div>
                                    <div className={styles.disputeDesc}>
                                        {dispute.description}
                                    </div>
                                </div>
                                <div className={styles.disputeStatus}>
                                    <span className={`${styles.statusBadge} ${dispute.status === 'Resolved' ? styles.statusResolved : styles.statusOpen}`}>
                                        {dispute.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>No active disputes.</div>
                    )}
                </div>
            )}

            {/* Raise Dispute Tab */}
            {activeTab === 'raise' && (
                <div className={styles.formContainer}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Select Contract</label>
                            <select
                                className={styles.select}
                                value={formData.contractId}
                                onChange={e => setFormData({ ...formData, contractId: e.target.value })}
                                required
                            >
                                <option value="">Select a contract...</option>
                                {contracts.map(c => (
                                    <option key={c.id} value={c.id}>{c.crop} (#{c.id})</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Issue Category</label>
                            <select
                                className={styles.select}
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Payment Issue</option>
                                <option>Quality Rejection</option>
                                <option>Logistics/Delivery</option>
                                <option>Breach of Contract</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea
                                className={styles.textarea}
                                placeholder="Describe the issue in detail..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className={styles.submitBtn}>
                            Raise Dispute
                        </button>
                    </form>
                </div>
            )}

            {/* Audit Logs Tab */}
            {activeTab === 'audit' && (
                <div className={styles.logList}>
                    {auditLogs.map(log => (
                        <div key={log.id} className={styles.logItem}>
                            <div className={styles.logIcon}>
                                {log.action.includes('PAYMENT') ? <CheckCircle size={20} /> :
                                    log.action.includes('DISPUTE') ? <AlertCircle size={20} /> :
                                        <FileText size={20} />}
                            </div>
                            <div className={styles.logContent}>
                                <h4>{log.action.replace(/_/g, ' ')}</h4>
                                <p>{log.details}</p>
                                <div className={styles.logDate}>
                                    <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                                    {log.date}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DisputesPage;
