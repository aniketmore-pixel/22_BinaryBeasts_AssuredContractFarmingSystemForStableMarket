import React, { useState } from 'react';
import { useMarketplace } from '../../../contexts/MarketplaceContext';
import styles from './BuyerContracts.module.css';
import { User, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import NegotiationModal from '../../../components/common/NegotiationModal';

const BuyerContracts = () => {
    const { contracts, updateContractStatus, submitCounterOffer, acceptOffer } = useMarketplace();
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedContract, setSelectedContract] = useState(null);
    const [isNegotiationOpen, setIsNegotiationOpen] = useState(false);

    const filteredContracts = contracts.filter(c =>
        activeTab === 'all' ? true : c.status === activeTab
    );

    const handleApprove = (id) => {
        if (window.confirm('Are you sure you want to approve this contract?')) {
            updateContractStatus(id, 'active');
        }
    };

    const handleReject = (id) => {
        if (window.confirm('Are you sure you want to reject this application?')) {
            updateContractStatus(id, 'rejected');
        }
    };

    const handleNegotiateClick = (contract) => {
        setSelectedContract(contract);
        setIsNegotiationOpen(true);
    };

    const handleSubmitOffer = (id, price, message) => {
        submitCounterOffer(id, price, message, 'buyer');
    };

    const handleAcceptOffer = (id) => {
        acceptOffer(id);
        setIsNegotiationOpen(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Contract Management</h1>
                <p className={styles.subtitle}>Review applications and manage active procurement contracts.</p>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'pending' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending ({contracts.filter(c => c.status === 'pending').length})
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'negotiating' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('negotiating')}
                >
                    Negotiating ({contracts.filter(c => c.status === 'negotiating').length})
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'active' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Active Contracts ({contracts.filter(c => c.status === 'active').length})
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'rejected' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('rejected')}
                >
                    Rejected ({contracts.filter(c => c.status === 'rejected').length})
                </button>
            </div>

            <div className={styles.contractGrid}>
                {filteredContracts.length > 0 ? (
                    filteredContracts.map(contract => (
                        <div key={contract.id} className={`${styles.contractCard} ${styles[`status-${contract.status}`]}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cropInfo}>
                                    <h3>{contract.crop}</h3>
                                    <div className={styles.farmerName}>
                                        <User size={14} />
                                        {contract.farmerName || 'Farmer'}
                                    </div>
                                </div>
                                <div className={`${styles.statusBadge} ${styles[`status-${contract.status}`]}`}>
                                    {contract.status}
                                </div>
                            </div>

                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Contract ID</span>
                                <span className={styles.detailValue}>#{contract.id.split('-').pop()}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Total Value</span>
                                <span className={styles.detailValue}>₹{contract.value.toLocaleString()}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Start Date</span>
                                <span className={styles.detailValue}>{contract.startDate}</span>
                            </div>

                            {(contract.status === 'pending' || contract.status === 'negotiating') && (
                                <div className={styles.actions}>
                                    <button
                                        className={styles.rejectBtn}
                                        onClick={() => handleReject(contract.id)}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        className={styles.negotiateBtn}
                                        onClick={() => handleNegotiateClick(contract)}
                                    >
                                        Negotiate
                                    </button>
                                    <button
                                        className={styles.approveBtn}
                                        onClick={() => handleApprove(contract.id)}
                                    >
                                        Approve
                                    </button>
                                </div>
                            )}

                            {contract.status === 'active' && (
                                <div className={styles.actions}>
                                    <button
                                        className={styles.approveBtn}
                                        style={{ background: 'var(--surface-hover)', color: 'var(--text-primary)' }}
                                    >
                                        View Details
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <h3>No contracts found in this category</h3>
                        <p>Check "Pending Applications" for new offers from farmers.</p>
                    </div>
                )}
            </div>
            <NegotiationModal
                contract={selectedContract}
                isOpen={isNegotiationOpen}
                onClose={() => setIsNegotiationOpen(false)}
                onSubmitOffer={handleSubmitOffer}
                onAcceptOffer={handleAcceptOffer}
                userRole="buyer"
            />
        </div>
    );
};

export default BuyerContracts;
