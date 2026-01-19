import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '../../../contexts/MarketplaceContext';
import styles from './CreateOffer.module.css';
import { Plus, X } from 'lucide-react';

const CreateOffer = () => {
    const navigate = useNavigate();
    const { addOffer } = useMarketplace();

    const [formData, setFormData] = useState({
        crop: '',
        price: '',
        quantity: '',
        unit: 'Quintal',
        location: '',
        duration: '',
        buyer: 'My Company Ltd.', // Hardcoded for demo
        requirements: []
    });

    const [reqInput, setReqInput] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddRequirement = (e) => {
        e.preventDefault();
        if (reqInput.trim()) {
            setFormData({
                ...formData,
                requirements: [...formData.requirements, reqInput.trim()]
            });
            setReqInput('');
        }
    };

    const removeRequirement = (index) => {
        const newReqs = formData.requirements.filter((_, i) => i !== index);
        setFormData({ ...formData, requirements: newReqs });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addOffer(formData);
        alert('Offer Published Successfully!');
        navigate('/buyer/contracts'); // Redirect back to dashboard or list
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.header}>
                <h1>Create New Contract Offer</h1>
                <p>Post your requirements to find suitable farmers.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Crop Name</label>
                        <input
                            name="crop"
                            className={styles.input}
                            placeholder="e.g. Organic Wheat (Sharbati)"
                            value={formData.crop}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Price (₹)</label>
                        <input
                            name="price"
                            type="number"
                            className={styles.input}
                            placeholder="2800"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Quantity & Unit</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                name="quantity"
                                className={styles.input}
                                placeholder="500"
                                style={{ flex: 1 }}
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                            />
                            <select
                                name="unit"
                                className={styles.select}
                                value={formData.unit}
                                onChange={handleChange}
                            >
                                <option>Quintal</option>
                                <option>Kg</option>
                                <option>Ton</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Preferred Location</label>
                        <input
                            name="location"
                            className={styles.input}
                            placeholder="e.g. Madhya Pradesh"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Contract Duration</label>
                        <input
                            name="duration"
                            className={styles.input}
                            placeholder="e.g. 4 Months"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Quality Requirements</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                className={styles.input}
                                placeholder="Add a requirement (e.g. Moisture < 12%)"
                                value={reqInput}
                                onChange={(e) => setReqInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddRequirement(e)}
                            />
                            <button
                                type="button"
                                onClick={handleAddRequirement}
                                className="btn-primary"
                                style={{ padding: '0 1rem' }}
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className={styles.requirementsContainer}>
                            {formData.requirements.map((req, i) => (
                                <span key={i} className={styles.reqTag}>
                                    {req}
                                    <X
                                        size={14}
                                        className={styles.removeReq}
                                        onClick={() => removeRequirement(i)}
                                    />
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <button type="submit" className={styles.submitBtn}>
                    🚀 Publish Offer
                </button>
            </form>
        </div>
    );
};

export default CreateOffer;
