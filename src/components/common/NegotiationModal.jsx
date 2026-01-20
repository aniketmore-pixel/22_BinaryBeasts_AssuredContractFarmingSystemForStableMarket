import React, { useState, useEffect, useRef } from 'react';
import { X, Send, CheckCircle, AlertCircle, History } from 'lucide-react';
import styles from './NegotiationModal.module.css';

import FairPriceMeter from '../insights/FairPriceMeter';
import '../insights/Insights.css';

const NegotiationModal = ({ contract, isOpen, onClose, onSubmitOffer, onAcceptOffer, userRole = 'farmer' }) => {
    const [offerPrice, setOfferPrice] = useState(contract?.price || 0);
    const [message, setMessage] = useState('');
    const scrollRef = useRef(null);

    // Derived Market Data (Simulated)
    const marketMin = contract ? Math.floor(contract.price * 0.9) : 0;
    const marketMax = contract ? Math.floor(contract.price * 1.1) : 0;

    useEffect(() => {
        if (contract) {
            setOfferPrice(contract.price);
        }
    }, [contract]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [contract?.negotiationHistory, isOpen]);

    if (!isOpen || !contract) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!offerPrice) return;

        onSubmitOffer(contract.id, offerPrice, message || 'Counter Offer');
        setMessage('');
    };

    const lastOffer = contract.negotiationHistory[contract.negotiationHistory.length - 1];
    const isFormattedUserTurn = lastOffer?.role !== userRole; // It's my turn if the last offer wasn't from me

    // Simple formatted date
    const formatDate = (isoString) => {
        const d = new Date(isoString);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div>
                        <h2>Negotiate Contract</h2>
                        <p className={styles.subtext}>#{contract.id} • {contract.crop}</p>
                    </div>
                    <div className={styles.headerRight}>
                        <button onClick={onClose} className={styles.closeBtn}>
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className={styles.body}>
                    {/* Integrated Insight Widget */}
                    <div className="modal-insight-section" style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <FairPriceMeter
                            marketMin={marketMin}
                            marketMax={marketMax}
                            offerPrice={offerPrice}
                            unit="₹"
                        />
                    </div>

                    <div className={styles.historyContainer} ref={scrollRef}>
                        {contract.negotiationHistory && contract.negotiationHistory.map((item, index) => {
                            const isMe = item.role === userRole;
                            return (
                                <div key={index} className={`${styles.messageRow} ${isMe ? styles.myMessage : styles.partnerMessage}`}>
                                    <div className={styles.messageBubble}>
                                        <div className={styles.messageHeader}>
                                            <span className={styles.roleName}>{isMe ? 'You' : contract.partner}</span>
                                            <span className={styles.timestamp}>{formatDate(item.date)}</span>
                                        </div>
                                        <div className={styles.priceHighlight}>
                                            Suggested: ₹{item.price}/unit
                                        </div>
                                        {item.message && <p className={styles.messageText}>{item.message}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.actionArea}>
                        <div className={styles.currentStatus}>
                            <AlertCircle size={16} />
                            <span>
                                Current Price: <strong>₹{contract.price}</strong>
                                {isFormattedUserTurn ? " (Waiting for you)" : " (Waiting for partner)"}
                            </span>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.inputForm}>
                            <div className={styles.inputs}>
                                <div className={styles.priceInputGroup}>
                                    <label>Counter Price (₹)</label>
                                    <input
                                        type="number"
                                        value={offerPrice}
                                        onChange={(e) => setOfferPrice(e.target.value)}
                                        min="1"
                                    />
                                </div>
                                <div className={styles.messageInputGroup}>
                                    <label>Note (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Reason for price change..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.buttons}>
                                <button
                                    type="button"
                                    className={styles.acceptBtn}
                                    onClick={() => onAcceptOffer(contract.id)}
                                >
                                    <CheckCircle size={18} />
                                    Accept ₹{contract.price}
                                </button>
                                <button type="submit" className={styles.sendBtn}>
                                    <Send size={18} />
                                    Counter Offer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NegotiationModal;
