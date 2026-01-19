import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDisputes } from '../../contexts/DisputeContext';
import { useAuth } from '../../contexts/AuthContext';
import {
    StatusBadge,
    PriorityTag,
    EvidenceGallery,
    DisputeTimeline,
    CommentsThread,
    EvidenceUploader
} from '../../components/disputes/DisputeComponents';
import styles from './DisputePages.module.css';

const DisputeDetailView = ({ role }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { disputes, addComment, updateDisputeStatus } = useDisputes();
    const { user } = useAuth(); // Assuming AuthContext provides user info

    const dispute = disputes.find(d => d.id === id);

    if (!dispute) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <h3>Dispute not found</h3>
                    <button className={styles.secondaryBtn} onClick={() => navigate(`/${role}/disputes`)}>
                        Back to List
                    </button>
                </div>
            </div>
        );
    }

    const handleAddComment = (text) => {
        addComment(id, {
            author: user?.name || (role === 'farmer' ? 'Farmer' : 'Buyer'),
            role: role,
            text: text
        });
    };

    const handleUploadMore = (newEvidence) => {
        // In a real app, this would update the evidence array in DB
        console.log("Uploaded more evidence:", newEvidence);
        // For demo, we can just log it or update local state if we had updateDisputeEvidence helper
    };

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => navigate(`/${role}/disputes`)}>
                ← Back to Disputes
            </button>

            <div className={styles.detailGrid}>
                <div className={styles.mainCol}>
                    <div className={styles.section}>
                        <div className={styles.detailHeader}>
                            <div>
                                <div className={styles.idRow}>
                                    <span className={styles.detailId}>{dispute.id}</span>
                                    <PriorityTag priority={dispute.priority} />
                                </div>
                                <h1 className={styles.detailTitle}>{dispute.summary}</h1>
                                <p className={styles.detailSub}>Contract ID: <strong>{dispute.contractId}</strong> • Created on {new Date(dispute.createdAt).toLocaleDateString()}</p>
                            </div>
                            <StatusBadge status={dispute.status} />
                        </div>

                        <div className={styles.contentBlock}>
                            <h3>Description</h3>
                            <p className={styles.descriptionText}>{dispute.description}</p>
                        </div>

                        <div className={styles.contentBlock}>
                            <h3>Expected Resolution</h3>
                            <div className={styles.resolutionBox}>
                                {dispute.expectedResolution}
                            </div>
                        </div>

                        {dispute.status === 'Resolved' && dispute.resolution && (
                            <div className={`${styles.contentBlock} ${styles.resolutionFinal}`}>
                                <h3>Final Resolution Decision</h3>
                                <div className={styles.decisionHighlight}>
                                    <strong>Decision:</strong> {dispute.resolution.decision}
                                </div>
                                <p><strong>Admin Notes:</strong> {dispute.resolution.notes}</p>
                                {dispute.resolution.settlementAmount && (
                                    <div className={styles.amount}>
                                        Settlement Amount: <span>₹{dispute.resolution.settlementAmount.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>Evidence</h3>
                            <EvidenceUploader onUpload={handleUploadMore} />
                        </div>
                        <EvidenceGallery evidence={dispute.evidence} />
                    </div>

                    <div className={styles.section}>
                        <h3>Conversation</h3>
                        <CommentsThread
                            comments={dispute.comments}
                            onAddComment={handleAddComment}
                            currentUser={{ role }}
                        />
                    </div>
                </div>

                <div className={styles.sideCol}>
                    <div className={styles.section}>
                        <h3>Dispute Progress</h3>
                        <div className={styles.timelineWrapper}>
                            <DisputeTimeline steps={dispute.timeline} />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3>Parties Involved</h3>
                        <div className={styles.partyItem}>
                            <div className={styles.partyRole}>Farmer</div>
                            <div className={styles.partyName}>{dispute.partyFarmer}</div>
                        </div>
                        <div className={styles.partyItem}>
                            <div className={styles.partyRole}>Buyer</div>
                            <div className={styles.partyName}>{dispute.partyBuyer}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisputeDetailView;
