import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisputes } from '../../contexts/DisputeContext';
import { StatusBadge, PriorityTag } from '../../components/disputes/DisputeComponents';
import styles from './AdminDisputes.module.css';

const AdminDisputeList = () => {
    const { disputes } = useDisputes();
    const navigate = useNavigate();
    const [filter, setFilter] = useState({ status: 'All', priority: 'All', search: '' });

    const filtered = disputes.filter(d => {
        const statusMatch = filter.status === 'All' || d.status === filter.status;
        const priorityMatch = filter.priority === 'All' || d.priority === filter.priority;
        const searchMatch = d.id.toLowerCase().includes(filter.search.toLowerCase()) ||
            d.contractId.toLowerCase().includes(filter.search.toLowerCase()) ||
            d.partyFarmer.toLowerCase().includes(filter.search.toLowerCase()) ||
            d.partyBuyer.toLowerCase().includes(filter.search.toLowerCase());
        return statusMatch && priorityMatch && searchMatch;
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Admin Dispute Resolution</h1>
                    <p className={styles.subtitle}>Review and resolve conflicts between Farmers and Buyers</p>
                </div>
            </div>

            <div className={styles.statsBar}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Open Disputes</span>
                    <span className={styles.statValue}>{disputes.filter(d => d.status === 'Open').length}</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Under Review</span>
                    <span className={styles.statValue}>{disputes.filter(d => d.status === 'Under Review').length}</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Resolved</span>
                    <span className={styles.statValue}>{disputes.filter(d => d.status === 'Resolved').length}</span>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Search ID, Contract, or Parties..."
                        value={filter.search}
                        onChange={e => setFilter({ ...filter, search: e.target.value })}
                    />
                </div>
                <div className={styles.filterGroup}>
                    <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
                        <option value="All">All Statuses</option>
                        <option>Open</option>
                        <option>Under Review</option>
                        <option>Resolved</option>
                    </select>
                    <select value={filter.priority} onChange={e => setFilter({ ...filter, priority: e.target.value })}>
                        <option value="All">All Priorities</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Dispute ID</th>
                            <th>Contract ID</th>
                            <th>Parties</th>
                            <th>Category</th>
                            <th>Priority</th>
                            <th>Created Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(d => (
                            <tr key={d.id} className={styles.tableRow}>
                                <td><strong>{d.id}</strong></td>
                                <td>{d.contractId}</td>
                                <td>
                                    <div className={styles.partiesCell}>
                                        <span>F: {d.partyFarmer}</span>
                                        <span>B: {d.partyBuyer}</span>
                                    </div>
                                </td>
                                <td>{d.category}</td>
                                <td><PriorityTag priority={d.priority} /></td>
                                <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                                <td><StatusBadge status={d.status} /></td>
                                <td>
                                    <button
                                        className={styles.viewBtn}
                                        onClick={() => navigate(`/admin/disputes/${d.id}`)}
                                    >
                                        Review
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className={styles.noResults}>No disputes match your filters.</div>
                )}
            </div>
        </div>
    );
};

export default AdminDisputeList;
