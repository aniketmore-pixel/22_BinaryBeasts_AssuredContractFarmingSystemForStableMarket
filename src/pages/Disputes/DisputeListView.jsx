import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisputes } from '../../contexts/DisputeContext';
import { StatusBadge, PriorityTag } from '../../components/disputes/DisputeComponents';
import styles from './DisputePages.module.css';

const DisputeListView = ({ role }) => {
    const { disputes } = useDisputes();
    const navigate = useNavigate();
    const [filter, setFilter] = useState({ status: 'All', category: 'All', search: '' });

    const filteredDisputes = disputes.filter(d => {
        // In a real app, we'd also filter by userId matching the role
        // For now we show all or simulate based on role labels in dummy data if needed
        const statusMatch = filter.status === 'All' || d.status === filter.status;
        const categoryMatch = filter.category === 'All' || d.category === filter.category;
        const searchMatch = d.id.toLowerCase().includes(filter.search.toLowerCase()) ||
            d.contractId.toLowerCase().includes(filter.search.toLowerCase());
        return statusMatch && categoryMatch && searchMatch;
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Dispute Center</h1>
                    <p className={styles.subtitle}>Manage and track your contract disputes</p>
                </div>
                <button
                    className={styles.primaryBtn}
                    onClick={() => navigate(`/${role}/disputes/new`)}
                >
                    Raise New Dispute
                </button>
            </div>

            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <label>Status</label>
                    <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
                        <option>All</option>
                        <option>Open</option>
                        <option>Under Review</option>
                        <option>Resolved</option>
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label>Category</label>
                    <select value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })}>
                        <option>All</option>
                        <option>Payment Delay</option>
                        <option>Quality Issue</option>
                        <option>Quantity Mismatch</option>
                        <option>Delivery Delay</option>
                        <option>Other</option>
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label>Search</label>
                    <input
                        type="text"
                        placeholder="Search ID or Contract..."
                        value={filter.search}
                        onChange={e => setFilter({ ...filter, search: e.target.value })}
                    />
                </div>
            </div>

            <div className={styles.list}>
                {filteredDisputes.length > 0 ? (
                    filteredDisputes.map(dispute => (
                        <div
                            key={dispute.id}
                            className={styles.card}
                            onClick={() => navigate(`/${role}/disputes/${dispute.id}`)}
                        >
                            <div className={styles.cardHeader}>
                                <span className={styles.disputeId}>{dispute.id}</span>
                                <StatusBadge status={dispute.status} />
                            </div>
                            <h3 className={styles.cardTitle}>{dispute.summary}</h3>
                            <div className={styles.cardMeta}>
                                <span>Contract: <strong>{dispute.contractId}</strong></span>
                                <span>•</span>
                                <span>{dispute.category}</span>
                            </div>
                            <div className={styles.cardFooter}>
                                <span className={styles.date}>{new Date(dispute.createdAt).toLocaleDateString()}</span>
                                <PriorityTag priority={dispute.priority} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🔍</div>
                        <h3>No disputes found</h3>
                        <p>Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DisputeListView;
