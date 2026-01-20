import React, { useState } from 'react';
import styles from './PaymentGatewayModal.module.css';
import { CreditCard, Lock, Smartphone, CheckCircle, Loader } from 'lucide-react';

const PaymentGatewayModal = ({ isOpen, onClose, amount, onProcessPayment }) => {
    const [step, setStep] = useState('method'); // method | processing | success
    const [method, setMethod] = useState('upi');

    if (!isOpen) return null;

    const handlePay = () => {
        setStep('processing');
        // Simulate bank delay
        setTimeout(() => {
            setStep('success');
            // Wait a moment so user sees success message, then close
            setTimeout(() => {
                onProcessPayment();
                onClose();
                setStep('method'); // Reset for next time
            }, 1500);
        }, 2000);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.brand}>
                        <ShieldLockIcon />
                        <span>SecurePay Escrow</span>
                    </div>
                    <div className={styles.amount}>
                        <small>Amount to Lock</small>
                        ₹{amount?.toLocaleString()}
                    </div>
                </div>

                {/* Content based on Step */}
                <div className={styles.body}>
                    {step === 'method' && (
                        <>
                            <p className={styles.instruction}>Select Payment Method</p>

                            <div
                                className={`${styles.option} ${method === 'upi' ? styles.selected : ''}`}
                                onClick={() => setMethod('upi')}
                            >
                                <div className={styles.iconBox}><Smartphone size={24} /></div>
                                <div className={styles.optInfo}>
                                    <h4>UPI / BHIM</h4>
                                    <p>Google Pay, PhonePe, Paytm</p>
                                </div>
                                <div className={styles.radio}></div>
                            </div>

                            <div
                                className={`${styles.option} ${method === 'card' ? styles.selected : ''}`}
                                onClick={() => setMethod('card')}
                            >
                                <div className={styles.iconBox}><CreditCard size={24} /></div>
                                <div className={styles.optInfo}>
                                    <h4>Credit / Debit Card</h4>
                                    <p>Visa, Mastercard, RuPay</p>
                                </div>
                                <div className={styles.radio}></div>
                            </div>

                            <button className={styles.payBtn} onClick={handlePay}>
                                Secure Pay ₹{amount?.toLocaleString()}
                            </button>

                            <div className={styles.trustFooter}>
                                <Lock size={12} />
                                128-bit Encryption. Funds physically held in Escrow Node.
                            </div>
                        </>
                    )}

                    {step === 'processing' && (
                        <div className={styles.statusView}>
                            <div className={styles.spinner}></div>
                            <h3>Processing Transaction...</h3>
                            <p>Connecting to secure banking gateway.</p>
                            <small>Do not close this window.</small>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className={styles.statusView}>
                            <CheckCircle size={64} className={styles.successIcon} />
                            <h3>Payment Successful!</h3>
                            <p>Funds have been securely verified and moved to the Escrow Vault.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ShieldLockIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="#16a34a" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 12H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default PaymentGatewayModal;
