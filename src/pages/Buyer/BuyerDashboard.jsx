import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card, Badge, Button } from '../../components/ui/Base';
import {
    Briefcase,
    Users,
    FileCheck,
    ShieldAlert,
    ArrowRight,
    Plus
} from 'lucide-react';
import './Buyer.css';

const supplyData = [
    { crop: 'Wheat', amount: 4000 },
    { crop: 'Rice', amount: 3000 },
    { crop: 'Maize', amount: 2000 },
    { crop: 'Cotton', amount: 2780 },
    { crop: 'Sugarcane', amount: 1890 },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const BuyerDashboard = () => {
    return (
        <motion.div
            className="dashboard-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="welcome-section">
                <motion.div variants={itemVariants}>
                    <h1>Corporate Portal 🏢</h1>
                    <p>Manage your procurement and contracts efficiently.</p>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Button className="create-btn">
                        <Plus size={20} /> Create New Offer
                    </Button>
                </motion.div>
            </div>

            <motion.div className="stats-grid" variants={containerVariants}>
                <Card className="stat-card">
                    <div className="stat-icon supply"><Briefcase size={24} /></div>
                    <div className="stat-info">
                        <span className="label">Active Procurements</span>
                        <span className="value">245 Tons</span>
                        <span className="subtitle">Across 12 crops</span>
                    </div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-icon farmers"><Users size={24} /></div>
                    <div className="stat-info">
                        <span className="label">Registered Farmers</span>
                        <span className="value">1,240</span>
                        <span className="subtitle">45 new this week</span>
                    </div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-icon quality"><FileCheck size={24} /></div>
                    <div className="stat-info">
                        <span className="label">Quality Checks Pass</span>
                        <span className="value">98.2%</span>
                        <span className="subtitle">Last 30 days</span>
                    </div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-icon escrow"><ShieldAlert size={24} /></div>
                    <div className="stat-info">
                        <span className="label">Escrow Locked</span>
                        <span className="value">₹12.4L</span>
                        <span className="subtitle">Secured funds</span>
                    </div>
                </Card>
            </motion.div>

            <motion.div className="main-grid" variants={containerVariants}>
                <Card title="Current Supply Volume" className="chart-card">
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={supplyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="crop" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Pending Verifications" className="list-card">
                    <div className="verification-list">
                        {[1, 2, 3].map(item => (
                            <motion.div key={item} className="verify-item" variants={itemVariants}>
                                <div className="verify-info">
                                    <h4>Delivery #{1020 + item}</h4>
                                    <p>Basmati Rice • 40 Tons</p>
                                </div>
                                <Button variant="secondary" className="small-btn">Verify</Button>
                            </motion.div>
                        ))}
                    </div>
                    <Button variant="secondary" style={{ width: '100%', marginTop: '1rem' }}>View All Verification Requests</Button>
                </Card>
            </motion.div>

            <motion.div className="market-insights" variants={itemVariants}>
                <Card title="Farmer Performance Map">
                    <div className="placeholder-map">
                        <div className="map-overlay">
                            <p>📍 Most active: Punjab, Haryana, Madhya Pradesh</p>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default BuyerDashboard;
