import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDisputes } from '../../contexts/DisputeContext';
import {
    StatusBadge,
    PriorityTag,
    EvidenceGallery,
    DisputeTimeline,
    CommentsThread
} from '../../components/disputes/DisputeComponents';
import styles from './AdminDisputes.module.css';

const AdminDisputeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { disputes, resolveDispute, addComment, updateDisputeStatus } = useDisputes();

    const dispute = disputes.find(d => d.id === id);

    const [resolution, setResolution] = useState({
        decision: 'Approve Farmer Claim',
        notes: '',
        settlementAmount: ''
    });

    if (!dispute) return <div>Loading...</div>;

    const handleResolve = (e) => {
        e.preventDefault();
        resolveDispute(id, {
            ...resolution,
            settlementAmount: parseFloat(resolution.settlementAmount) || 0
        });
    };

    const handleUpdateStatus = (newStatus) => {
        updateDisputeStatus(id, newStatus, `Status updated to ${newStatus} by Admin Reviewer`);
    };

    const handleAddAdminComment = (text) => {
        addComment(id, {
            author: 'System Admin',
            role: 'admin',
            text: text
        });
    };

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => navigate('/admin/disputes')}>
                ← Back to List
            </button>

            <div className={styles.grid}>
                <div className={styles.leftCol}>
                    <div className={styles.section}>
                        <div className={styles.headerRow}>
                            <div>
                                <h1>{dispute.id}: {dispute.summary}</h1>
                                <p>Contract: {dispute.contractId} | {dispute.category}</p>
                            </div>
                            <div className={styles.actions}>
                                <StatusBadge status={dispute.status} />
                                {dispute.status === 'Open' && (
                                    <button
                                        className={styles.statusBtn}
                                        onClick={() => handleUpdateStatus('Under Review')}
                                    >
                                        Start Review
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={styles.description}>
                            <h3>Description</h3>
                            <p>{dispute.description}</p>
                        </div>

                        <div className={styles.partiesInfo}>
                            <div className={styles.partyCard}>
                                <h4>Farmer</h4>
                                <p><strong>Name:</strong> {dispute.partyFarmer}</p>
                                <p><strong>Rating:</strong> 4.8/5</p>
                            </div>
                            <div className={styles.partyCard}>
                                <h4>Buyer</h4>
                                <p><strong>Name:</strong> {dispute.partyBuyer}</p>
                                <p><strong>Rating:</strong> 4.5/5</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3>Evidence Provided</h3>
                        <EvidenceGallery evidence={dispute.evidence} />
                    </div>

                    <div className={styles.section}>
                        <h3>Dispute History / Timeline</h3>
                        <DisputeTimeline steps={dispute.timeline} />
                    </div>
                </div>

                <div className={styles.rightCol}>
                    <div className={styles.section}>
                        <h3>Resolution Panel</h3>
                        {dispute.status === 'Resolved' ? (
                            <div className={styles.resolvedInfo}>
                                <div className={styles.successBadge}>RESOLVED</div>
                                <p><strong>Decision:</strong> {dispute.resolution.decision}</p>
                                <p><strong>Total Settlement:</strong> ₹{dispute.resolution.settlementAmount.toLocaleString()}</p>
                                <p><strong>Official Notes:</strong> {dispute.resolution.notes}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleResolve} className={styles.resolveForm}>
                                <div className={styles.inputGroup}>
                                    <label>Final Decision</label>
                                    <select
                                        value={resolution.decision}
                                        onChange={e => setResolution({ ...resolution, decision: e.target.value })}
                                    >
                                        <option>Approve Farmer Claim</option>
                                        <option>Approve Buyer Claim</option>
                                        <option>Suggest Settlement</option>
                                        <option>Reject Dispute</option>
                                    </select>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Settlement Amount (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="E.g. 5000"
                                        value={resolution.settlementAmount}
                                        onChange={e => setResolution({ ...resolution, settlementAmount: e.target.value })}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Decision Notes</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Provide justification for this decision..."
                                        value={resolution.notes}
                                        onChange={e => setResolution({ ...resolution, notes: e.target.value })}
                                        required
                                    />
                                </div>

                                <button type="submit" className={styles.resolveBtn}>
                                    Mark as Resolved
                                </button>
                            </form>
                        )}
                    </div>

                    <div className={styles.section}>
                        <h3>Communication Log</h3>
                        <CommentsThread
                            comments={dispute.comments}
                            onAddComment={handleAddAdminComment}
                            currentUser={{ role: 'admin' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDisputeDetail;
