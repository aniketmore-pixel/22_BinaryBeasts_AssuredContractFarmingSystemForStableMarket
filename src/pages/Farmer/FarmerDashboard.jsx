import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import { Card, Badge, Button } from "../../components/ui/Base";
import { useNavigate } from "react-router-dom";

import { TrustScore, Timeline } from "../../components/common/Indicators";
import {
    TrendingUp,
    Package,
    Clock,
    CheckCircle,
    IndianRupee,
    BookOpen,
    ChevronRight,
} from "lucide-react";
import "./Farmer.css";

/* ---------------- DUMMY DATA ---------------- */

const dummyData = [
    { name: "Jan", income: 4000 },
    { name: "Feb", income: 3000 },
    { name: "Mar", income: 5000 },
    { name: "Apr", income: 2780 },
    { name: "May", income: 1890 },
    { name: "Jun", income: 2390 },
];

const activeContracts = [
    {
        id: 1,
        crop: "Organic Wheat",
        buyer: "Reliance Retail",
        price: "₹2,500/q",
        status: "Active",
        progress: 2,
    },
    {
        id: 2,
        crop: "Basmati Rice",
        buyer: "ITC Limited",
        price: "₹4,200/q",
        status: "Pending Delivery",
        progress: 4,
    },
];

/* ---------------- ANIMATIONS ---------------- */

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

/* =========================
   FARMER DASHBOARD
========================= */

const FarmerDashboard = () => {
    const [userName, setUserName] = useState("");
    const [loadingUser, setLoadingUser] = useState(true);
    const navigate = useNavigate();

    /* =========================
       FETCH USER NAME
    ========================= */
    useEffect(() => {
        const loadUser = async () => {
            const userStr = localStorage.getItem("user");
            if (!userStr) return;

            const user = JSON.parse(userStr);

            try {
                const res = await fetch(
                    `http://localhost:5000/api/profile/user-core/${user.id}`
                );
                const data = await res.json();

                setUserName(data.name);
            } catch (err) {
                console.error("❌ Failed to load user name", err);
            } finally {
                setLoadingUser(false);
            }
        };

        loadUser();
    }, []);

    return (
        <motion.div
            className="dashboard-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* =========================
               WELCOME SECTION
            ========================= */}
            <div className="welcome-section">
                <motion.div variants={itemVariants}>
                    <h1>
                        Namaste, {loadingUser ? "Farmer" : userName}! 👋
                    </h1>
                    <p>Here's what's happening with your farm today.</p>
                </motion.div>

                <motion.div variants={itemVariants} className="trust-summary">
                    <div className="trust-left">
                        <span>Your Trust Score</span>
                        <TrustScore score={92} size="sm" />
                    </div>

                    <Button
                        variant="secondary"
                        className="courses-btn"
                        onClick={() => navigate("/farmer/courses")}
                    >
                        <BookOpen size={16} />
                        Courses
                    </Button>
                    
                </motion.div>
            </div>

            {/* =========================
               STATS
            ========================= */}
            <motion.div className="stats-grid" variants={containerVariants}>
                <Card className="stat-card">
                    <div className="stat-icon income">
                        <IndianRupee size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="label">Total Earnings</span>
                        <span className="value">₹1,24,500</span>
                        <span className="trend positive">
                            <TrendingUp size={14} /> +12%
                        </span>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-icon contracts">
                        <Package size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="label">Active Contracts</span>
                        <span className="value">04</span>
                        <span className="subtitle">2 due this month</span>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-icon pending">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="label">Pending Offers</span>
                        <span className="value">07</span>
                        <span className="subtitle">3 high-match</span>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-icon completed">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="label">Completed</span>
                        <span className="value">12</span>
                        <span className="subtitle">100% fulfill rate</span>
                    </div>
                </Card>
            </motion.div>

            {/* =========================
               MAIN GRID
            ========================= */}
            <motion.div className="main-grid" variants={containerVariants}>
                <Card title="Monthly Revenue Overview" className="chart-card">
                    <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dummyData}>
                                <defs>
                                    <linearGradient
                                        id="colorIncome"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="var(--primary)"
                                            stopOpacity={0.1}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--primary)"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#eee"
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="income"
                                    stroke="var(--primary)"
                                    fillOpacity={1}
                                    fill="url(#colorIncome)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Recent Active Contracts" className="list-card">
                    <div className="contract-list">
                        {activeContracts.map((contract) => (
                            <motion.div
                                key={contract.id}
                                className="contract-item"
                                variants={itemVariants}
                            >
                                <div className="contract-main">
                                    <div className="crop-img">🌾</div>
                                    <div>
                                        <h4>{contract.crop}</h4>
                                        <p>{contract.buyer}</p>
                                    </div>
                                </div>

                                <div className="contract-status">
                                    <span className="price">{contract.price}</span>
                                    <Badge
                                        status={
                                            contract.status === "Active"
                                                ? "success"
                                                : "warning"
                                        }
                                    >
                                        {contract.status}
                                    </Badge>
                                </div>

                                <Button
                                    variant="secondary"
                                    className="action-btn"
                                >
                                    <ChevronRight size={18} />
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    <Button
                        variant="secondary"
                        style={{ width: "100%", marginTop: "1rem" }}
                    >
                        View All Contracts
                    </Button>
                </Card>
            </motion.div>

            {/* =========================
               PROGRESS
            ========================= */}
            <motion.div className="bottom-sections" variants={itemVariants}>
                <Card
                    title="Current Contract Progress (Organic Wheat)"
                    className="progress-card"
                >
                    <Timeline
                        steps={[
                            "Draft",
                            "Negotiation",
                            "Accepted",
                            "Sowing",
                            "Growing",
                            "Harvesting",
                            "Delivery",
                        ]}
                        currentStep={4}
                    />
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default FarmerDashboard;
