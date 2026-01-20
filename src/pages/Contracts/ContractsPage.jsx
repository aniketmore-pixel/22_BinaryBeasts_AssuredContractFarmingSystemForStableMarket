import React from 'react';
import { FileText, Clock, CheckCircle, ChevronRight, Shield } from 'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import styles from './ContractsPage.module.css';
import NegotiationModal from '../../components/common/NegotiationModal';

const ContractsPage = ({ role = 'farmer' }) => {
    const { contracts, submitCounterOffer, acceptOffer } = useMarketplace();
    const [selectedContract, setSelectedContract] = React.useState(null);
    const [isNegotiationOpen, setIsNegotiationOpen] = React.useState(false);

    const handleNegotiateClick = (contract) => {
        setSelectedContract(contract);
        setIsNegotiationOpen(true);
    };

    const handleCloseNegotiation = () => {
        setIsNegotiationOpen(false);
        setSelectedContract(null);
    };

    const handleSubmitOffer = (id, price, message) => {
        submitCounterOffer(id, price, message, role);
        // Don't close immediately, let them see it updated
    };

    const handleAcceptOffer = (id) => {
        acceptOffer(id);
        setIsNegotiationOpen(false);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <Clock size={16} />;
            case 'completed': return <CheckCircle size={16} />;
            case 'pending': return <Clock size={16} />;
            case 'negotiating': return <Shield size={16} />;
            default: return <FileText size={16} />;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>My Contracts</h1>
                    <p>Manage your active farming agreements and track history.</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#DCFCE7', color: '#166534' }}>
                        <FileText />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Active Contracts</h3>
                        <div className={styles.statValue}>
                            {contracts.filter(c => c.status === 'active').length}
                        </div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#FEF3C7', color: '#92400E' }}>
                        <Clock />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Pending Approval</h3>
                        <div className={styles.statValue}>
                            {contracts.filter(c => c.status === 'pending').length}
                        </div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#E0E7FF', color: '#3730A3' }}>
                        <Shield />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Total Volume</h3>
                        <div className={styles.statValue}>₹4.5L</div>
                    </div>
                </div>
            </div>

            {/* Contracts List */}
            <div className={styles.contractList}>
                {contracts.length > 0 ? (
                    contracts.map(contract => (
                        <div key={contract.id} className={`${styles.contractCard} ${styles[`status-${contract.status}`]}`}>
                            <div className={styles.statusStrip}></div>
                            <div className={styles.cardContent}>
                                <div className={styles.mainInfo}>
                                    <h3>{contract.crop}</h3>
                                    <div className={styles.partnerName}>
                                        <Shield size={14} className={styles.verifiedIcon} />
                                        {role === 'farmer' ? contract.partner : 'Farmer Name'}
                                    </div>
                                </div>

                                <div className={styles.detailBlock}>
                                    <label>Contract ID</label>
                                    <span>#{contract.id.split('-').pop()}</span>
                                </div>

                                <div className={styles.detailBlock}>
                                    <label>Duration</label>
                                    <span>{contract.startDate} - {contract.endDate}</span>
                                </div>

                                <div className={styles.detailBlock}>
                                    <label>Value</label>
                                    <span>₹{contract.value.toLocaleString()}</span>
                                </div>

                                <div className={styles.statusBlock}>
                                    <span className={`${styles.statusBadge} ${styles[`status-${contract.status}`]}`}>
                                        {getStatusIcon(contract.status)}
                                        {contract.status}
                                    </span>
                                </div>

                                <div className={styles.actionsGroup}>
                                    {/* Buyer Actions */}
                                    {role === 'buyer' && contract.status === 'pending' && (
                                        <>
                                            <button
                                                className={styles.acceptButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAcceptOffer(contract.id);
                                                }}
                                            >
                                                Accept Application
                                            </button>
                                            <button
                                                className={styles.negotiateButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleNegotiateClick(contract);
                                                }}
                                            >
                                                Negotiate
                                            </button>
                                        </>
                                    )}

                                    {/* Farmer Actions */}
                                    {role === 'farmer' && (contract.status === 'pending' || contract.status === 'negotiating') && (
                                        <button
                                            className={styles.negotiateButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNegotiateClick(contract);
                                            }}
                                        >
                                            {contract.status === 'pending' ? 'Negotiate / View' : 'Respond to Offer'}
                                        </button>
                                    )}

                                    {/* Common Actions */}
                                    {contract.status === 'active' && (
                                        <div className={styles.activeTag}>
                                            In Progress
                                        </div>
                                    )}

                                    <button className={styles.actionButton}>
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <h3>No contracts found</h3>
                        <p>Go to "Find Offers" to apply for new opportunities.</p>
                    </div>
                )}
            </div>

            <NegotiationModal
                contract={selectedContract}
                isOpen={isNegotiationOpen}
                onClose={handleCloseNegotiation}
                onSubmitOffer={handleSubmitOffer}
                onAcceptOffer={handleAcceptOffer}
                userRole={role}
            />
        </div >
    );
};

export default ContractsPage;
