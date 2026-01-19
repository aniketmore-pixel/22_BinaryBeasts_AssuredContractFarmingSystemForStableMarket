import React from 'react';
import styles from './DisputeComponents.module.css';

export const StatusBadge = ({ status }) => {
    const getStatusClass = () => {
        switch (status.toLowerCase()) {
            case 'open': return styles.statusOpen;
            case 'under review': return styles.statusReview;
            case 'resolved': return styles.statusResolved;
            default: return '';
        }
    };

    return (
        <span className={`${styles.badge} ${getStatusClass()}`}>
            {status}
        </span>
    );
};

export const PriorityTag = ({ priority }) => {
    const getPriorityClass = () => {
        switch (priority.toLowerCase()) {
            case 'high': return styles.priorityHigh;
            case 'medium': return styles.priorityMedium;
            case 'low': return styles.priorityLow;
            default: return '';
        }
    };

    return (
        <span className={`${styles.tag} ${getPriorityClass()}`}>
            {priority}
        </span>
    );
};

export const EvidenceGallery = ({ evidence }) => {
    if (!evidence || evidence.length === 0) {
        return <p className={styles.noEvidence}>No evidence uploaded.</p>;
    }

    return (
        <div className={styles.gallery}>
            {evidence.map((item) => (
                <div key={item.id} className={styles.evidenceItem}>
                    {item.type === 'image' ? (
                        <img src={item.url} alt={item.name} className={styles.thumbnail} />
                    ) : (
                        <div className={styles.pdfIcon}>
                            <span>PDF</span>
                        </div>
                    )}
                    <span className={styles.fileName}>{item.name}</span>
                </div>
            ))}
        </div>
    );
};

export const DisputeTimeline = ({ steps }) => {
    return (
        <div className={styles.timeline}>
            {steps.map((step, index) => (
                <div key={index} className={styles.timelineItem}>
                    <div className={styles.timelineDot}></div>
                    <div className={styles.timelineContent}>
                        <div className={styles.timelineHeader}>
                            <span className={styles.timelineStatus}>{step.status}</span>
                            <span className={styles.timelineDate}>
                                {new Date(step.date).toLocaleDateString()} {new Date(step.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <p className={styles.timelineDesc}>{step.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const EvidenceUploader = ({ onUpload }) => {
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        // Mock upload - just create local URLs
        const newEvidence = files.map(file => ({
            id: `ev-${Date.now()}-${Math.random()}`,
            type: file.type.startsWith('image/') ? 'image' : 'pdf',
            url: URL.createObjectURL(file),
            name: file.name
        }));
        onUpload(newEvidence);
    };

    return (
        <div className={styles.uploader}>
            <input
                type="file"
                multiple
                onChange={handleFileChange}
                id="fileInput"
                className={styles.hiddenInput}
            />
            <label htmlFor="fileInput" className={styles.uploadLabel}>
                <div className={styles.uploadIcon}>+</div>
                <span>Upload Evidence (Images/PDF)</span>
            </label>
        </div>
    );
};

export const CommentsThread = ({ comments, onAddComment, currentUser }) => {
    const [newComment, setNewComment] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        onAddComment(newComment);
        setNewComment('');
    };

    return (
        <div className={styles.commentsSection}>
            <div className={styles.commentsList}>
                {comments.map((comment) => (
                    <div key={comment.id} className={`${styles.comment} ${comment.role === currentUser.role ? styles.myComment : ''}`}>
                        <div className={styles.commentHeader}>
                            <span className={styles.commentAuthor}>{comment.author}</span>
                            <span className={styles.commentTime}>{new Date(comment.timestamp).toLocaleString()}</span>
                        </div>
                        <p className={styles.commentText}>{comment.text}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className={styles.commentForm}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className={styles.commentInput}
                />
                <button type="submit" className={styles.commentBtn} disabled={!newComment.trim()}>
                    Send
                </button>
            </form>
        </div>
    );
};
