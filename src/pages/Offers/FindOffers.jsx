import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, Scale, ShieldCheck } from 'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import styles from './FindOffers.module.css';

const FindOffers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { offers, applyForOffer } = useMarketplace();

    const filteredOffers = offers.filter(offer =>
        offer.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.buyer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Find Contract Offers</h1>
                <p className={styles.subtitle}>Browse and apply for contract farming opportunities from verified buyers.</p>
            </div>

            {/* Filters */}
            <div className={styles.filtersContainer}>
                <div className={styles.searchBox}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Search for crops (e.g., Wheat) or buyers..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className={styles.filterButton}>
                    <Filter size={18} />
                    Filters
                </button>
                <button className={styles.filterButton}>
                    <MapPin size={18} />
                    Location
                </button>
            </div>

            {/* Grid */}
            <div className={styles.offersGrid}>
                {filteredOffers.map(offer => (
                    <div key={offer.id} className={styles.offerCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cropInfo}>
                                <h3>{offer.crop}</h3>
                                <div className={styles.buyerName}>
                                    {offer.buyer}
                                    {offer.verified && (
                                        <ShieldCheck size={14} className={styles.verifiedBadge} />
                                    )}
                                </div>
                            </div>
                            <div className={styles.priceTag}>
                                <div className={styles.priceAmount}>₹{offer.price}</div>
                                <div className={styles.priceUnit}>per {offer.unit}</div>
                            </div>
                        </div>

                        <div className={styles.cardBody}>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}><Scale size={14} style={{ display: 'inline', marginRight: '4px' }} /> Quantity</span>
                                <span className={styles.detailValue}>{offer.quantity}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> Location</span>
                                <span className={styles.detailValue}>{offer.location}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> Duration</span>
                                <span className={styles.detailValue}>{offer.duration}</span>
                            </div>

                            <div className={styles.requirementsList}>
                                {offer.requirements.map((req, i) => (
                                    <span key={i} className={styles.reqTag}>{req}</span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.cardFooter}>
                            <button className={styles.viewButton}>Details</button>
                            <button
                                className={styles.applyButton}
                                onClick={() => {
                                    applyForOffer(offer);
                                    alert('Application Sent! Check "My Contracts" for status.');
                                }}
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FindOffers;
