import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisputes } from '../../contexts/DisputeContext';
import { dummyContracts } from '../../data/dummyDisputes';
import { EvidenceUploader, EvidenceGallery } from '../../components/disputes/DisputeComponents';
import styles from './DisputePages.module.css';

const NewDisputeForm = ({ role }) => {
    const navigate = useNavigate();
    const { addDispute } = useDisputes();
    const [formData, setFormData] = useState({
        contractId: '',
        category: '',
        priority: 'Medium',
        summary: '',
        description: '',
        expectedResolution: '',
        evidence: []
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.contractId) newErrors.contractId = 'Please select a contract';
        if (!formData.category) newErrors.category = 'Please select a category';
        if (!formData.summary.trim()) newErrors.summary = 'Summary is required';
        if (formData.summary.length > 100) newErrors.summary = 'Summary is too long';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Find the contract to get party info (simulated)
        const contract = dummyContracts.find(c => c.id === formData.contractId);

        const newDispute = {
            ...formData,
            partyFarmer: role === 'farmer' ? "My Farm" : "Registered Farmer", // In real app, get from Context
            partyBuyer: contract ? contract.buyer : "Company Ltd"
        };

        const created = addDispute(newDispute);
        navigate(`/${role}/disputes/${created.id}`);
    };

    const handleUpload = (newFiles) => {
        setFormData(prev => ({
            ...prev,
            evidence: [...prev.evidence, ...newFiles]
        }));
    };

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => navigate(`/${role}/disputes`)}>
                ← Back
            </button>

            <div className={styles.formCard}>
                <h1 className={styles.formTitle}>Raise New Dispute</h1>
                <p className={styles.formSubtitle}>Provide detailed information for faster resolution</p>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Select Contract</label>
                            <select
                                value={formData.contractId}
                                onChange={e => setFormData({ ...formData, contractId: e.target.value })}
                                className={errors.contractId ? styles.errorInput : ''}
                            >
                                <option value="">-- Choose Contract --</option>
                                {dummyContracts.map(c => (
                                    <option key={c.id} value={c.id}>{c.id} - {c.crop} ({c.buyer})</option>
                                ))}
                            </select>
                            {errors.contractId && <span className={styles.errorText}>{errors.contractId}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className={errors.category ? styles.errorInput : ''}
                            >
                                <option value="">-- Select Category --</option>
                                <option>Payment Delay</option>
                                <option>Quality Issue</option>
                                <option>Quantity Mismatch</option>
                                <option>Delivery Delay</option>
                                <option>Other</option>
                            </select>
                            {errors.category && <span className={styles.errorText}>{errors.category}</span>}
                        </div>

                        <div className={styles.inputGroupFull}>
                            <label>Short Summary (Max 100 characters)</label>
                            <input
                                type="text"
                                placeholder="Briefly describe the issue"
                                value={formData.summary}
                                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                                className={errors.summary ? styles.errorInput : ''}
                            />
                            {errors.summary && <span className={styles.errorText}>{errors.summary}</span>}
                        </div>

                        <div className={styles.inputGroupFull}>
                            <label>Detailed Description</label>
                            <textarea
                                rows="5"
                                placeholder="Explain what happened, including dates and names..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className={errors.description ? styles.errorInput : ''}
                            />
                            {errors.description && <span className={styles.errorText}>{errors.description}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Expected Resolution</label>
                            <select
                                value={formData.expectedResolution}
                                onChange={e => setFormData({ ...formData, expectedResolution: e.target.value })}
                            >
                                <option value="">-- Select Preference --</option>
                                <option>Full Refund</option>
                                <option>Penalty Payment</option>
                                <option>Renegotiate Terms</option>
                                <option>Reprocessing of Goods</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Priority</label>
                            <select
                                value={formData.priority}
                                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>

                        <div className={styles.inputGroupFull}>
                            <label>Evidence (Photos/Documents)</label>
                            <EvidenceUploader onUpload={handleUpload} />
                            {formData.evidence.length > 0 && (
                                <div style={{ marginTop: '1rem' }}>
                                    <EvidenceGallery evidence={formData.evidence} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" className={styles.secondaryBtn} onClick={() => navigate(`/${role}/disputes`)}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.primaryBtn}>
                            Submit Dispute
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewDisputeForm;
