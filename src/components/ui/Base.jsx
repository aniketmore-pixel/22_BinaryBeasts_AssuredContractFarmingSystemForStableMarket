import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
    return (
        <motion.button
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseClass} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export const Card = ({ children, title, className = '', ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`card ${className}`}
            {...props}
        >
            {title && <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>{title}</h3>}
            {children}
        </motion.div>
    );
};

export const Badge = ({ children, status = 'success', className = '' }) => {
    const statusClass = `badge-${status}`;
    return (
        <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`badge ${statusClass} ${className}`}
        >
            {children}
        </motion.span>
    );
};
