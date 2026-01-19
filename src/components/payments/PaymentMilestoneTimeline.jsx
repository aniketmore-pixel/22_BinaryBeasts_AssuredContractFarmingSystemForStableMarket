import React from 'react';
import { Check, Clock, AlertTriangle, Calendar, ChevronRight } from 'lucide-react';
import styles from './PaymentMilestoneTimeline.module.css';

const PaymentMilestoneTimeline = ({ milestones = [], onAction, currentMilestoneId }) => {
    if (!milestones || milestones.length === 0) return null;

    // Helper to determine status color/icon
    const getStatusConfig = (status) => {
        switch (status) {
            case 'PAID':
                return { icon: Check, label: 'Paid', styleClass: styles.statusPaid, wrapperClass: styles.completed };
            case 'FAILED':
                return { icon: AlertTriangle, label: 'Failed', styleClass: styles.statusFailed, wrapperClass: styles.failed };
            default:
                return { icon: Clock, label: 'Pending', styleClass: styles.statusPending, wrapperClass: '' };
        }
    };

    // Calculate progress for desktop view
    // Find the index of the current active milestone or the last paid one
    const activeIndex = milestones.findIndex(m => m.id === currentMilestoneId);

    // If found, user is ON that step. If not found, maybe all are done or none? 
    // Let's assume progress goes up to the active index.
    // If activeIndex is 0 (first step), progress is 0%.
    // If activeIndex is last step, progress is 100%.
    const totalSteps = milestones.length;
    const progressPercentage = activeIndex !== -1
        ? (activeIndex / (totalSteps - 1)) * 100
        : 0;

    // Override progress if all are paid
    const allPaid = milestones.every(m => m.status === 'PAID');
    const displayProgress = allPaid ? 100 : Math.max(0, Math.min(progressPercentage, 100));

    return (
        <div className={styles.container}>
            {/* Desktop Horizontal View */}
            <div className={styles.timelineWrapper}>
                <div className={styles.timelineDesktop}>
                    <div className={styles.progressTrack}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${displayProgress}%` }}
                        />
                    </div>

                    {milestones.map((milestone, index) => {
                        const config = getStatusConfig(milestone.status);
                        const Icon = config.icon;
                        const isActive = milestone.id === currentMilestoneId;

                        let stepClasses = styles.step;
                        if (isActive) stepClasses += ` ${styles.active}`;
                        if (milestone.status === 'PAID') stepClasses += ` ${styles.completed}`;
                        if (milestone.status === 'FAILED') stepClasses += ` ${styles.failed}`;

                        return (
                            <div key={milestone.id} className={stepClasses} style={{ flex: 1 }}>
                                <div className={styles.stepIconWrapper}>
                                    <Icon size={20} />
                                </div>
                                <div className={styles.stepContent}>
                                    <div className={styles.stepTitle}>{milestone.title}</div>
                                    <div className={styles.amount}>
                                        {milestone.currency} {milestone.amount.toLocaleString()}
                                    </div>
                                    <div className={styles.date}>
                                        {milestone.status === 'PAID' && milestone.paidDate
                                            ? `Paid: ${milestone.paidDate}`
                                            : `Due: ${milestone.dueDate}`
                                        }
                                    </div>
                                    <span className={`${styles.statusBadge} ${config.styleClass}`}>
                                        {config.label}
                                    </span>

                                    {milestone.actionLabel && onAction && (
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => onAction(milestone.id)}
                                        >
                                            {milestone.actionLabel}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Vertical View */}
            <div className={styles.mobileContainer}>
                {milestones.map((milestone) => {
                    const config = getStatusConfig(milestone.status);
                    const Icon = config.icon;
                    const isActive = milestone.id === currentMilestoneId;

                    let cardClasses = styles.mobileStepCard;
                    if (isActive) cardClasses += ` ${styles.activeMobile}`;
                    if (milestone.status === 'PAID') cardClasses += ` ${styles.completedMobile}`;
                    if (milestone.status === 'FAILED') cardClasses += ` ${styles.failedMobile}`;

                    return (
                        <div key={milestone.id} className={cardClasses}>
                            <div className={styles.mobileIcon}>
                                <Icon size={20} />
                            </div>
                            <div className={styles.mobileContent}>
                                <div className={styles.mobileHeader}>
                                    <span className={styles.mobileTitle}>{milestone.title}</span>
                                    <span className={`${styles.statusBadge} ${config.styleClass}`}>
                                        {config.label}
                                    </span>
                                </div>

                                <div className={styles.mobileAmount}>
                                    {milestone.currency} {milestone.amount.toLocaleString()}
                                </div>

                                {milestone.description && (
                                    <p className={styles.mobileDescription}>
                                        {milestone.description}
                                    </p>
                                )}

                                <div className={styles.mobileFooter}>
                                    <div className={styles.mobileDate}>
                                        <Calendar size={14} />
                                        <span>
                                            {milestone.status === 'PAID' && milestone.paidDate
                                                ? `Paid on ${milestone.paidDate}`
                                                : `Due by ${milestone.dueDate}`
                                            }
                                        </span>
                                    </div>

                                    {milestone.actionLabel && onAction && (
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => onAction(milestone.id)}
                                        >
                                            {milestone.actionLabel} <ChevronRight size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PaymentMilestoneTimeline;
