import React from 'react';
import { Card, Badge, Button } from '../../components/ui/Base';
import {
    ShieldCheck,
    AlertTriangle,
    PieChart as PieIcon,
    Settings,
    Users,
    Check,
    X
} from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div className="dashboard-container">
            <div className="welcome-section">
                <h1>Admin Control Panel 🛡️</h1>
                <div className="actions">
                    <Button variant="secondary"><Settings size={18} /> Platform Settings</Button>
                </div>
            </div>

            <div className="stats-grid">
                <Card className="stat-card">
                    <div className="stat-icon supply"><Users size={24} /></div>
                    <div className="stat-info">
                        <span className="label">Total Users</span>
                        <span className="value">15,420</span>
                    </div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-icon farmers"><ShieldCheck size={24} /></div>
                    <div className="stat-info">
                        <span className="label">KYC Pending</span>
                        <span className="value">124</span>
                    </div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-icon completed"><AlertTriangle size={24} /></div>
                    <div className="stat-info">
                        <span className="label">Open Disputes</span>
                        <span className="value">08</span>
                    </div>
                </Card>
            </div>

            <div className="main-grid">
                <Card title="Pending KYC Verifications" className="list-card">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>ID Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3].map(i => (
                                <tr key={i}>
                                    <td>Farmer {i}</td>
                                    <td>Farmer</td>
                                    <td>Aadhar</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <Button className="small-btn" style={{ background: '#22c55e' }}><Check size={14} /></Button>
                                            <Button className="small-btn" style={{ background: '#ef4444' }}><X size={14} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                <Card title="Active Disputes" className="list-card">
                    <div className="dispute-list">
                        <div className="dispute-item" style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                            <strong style={{ display: 'block' }}>#D-992: Quality Rejection</strong>
                            <span style={{ fontSize: '0.8rem', color: '#666' }}>Buyer: PepsiCo • Farmer: Ramesh Kumar</span>
                            <div style={{ marginTop: '10px' }}>
                                <Badge status="danger">High Priority</Badge>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
