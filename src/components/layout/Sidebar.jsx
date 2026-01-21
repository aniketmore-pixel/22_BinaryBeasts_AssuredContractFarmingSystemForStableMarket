import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard,
    FileText,
    Search,
    Wallet,
    User,
    LogOut,
    AlertCircle,
    ShieldCheck,
    TrendingUp,
    Clock,
    Calendar,
    Truck,
    Box
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ role }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const farmerLinks = [
        { name: 'Dashboard', path: '/farmer', icon: LayoutDashboard },
        { name: 'Calendar', path: '/farmer/calendar', icon: Calendar },
        { name: 'My Contracts', path: '/farmer/contracts', icon: FileText },
        { name: 'Find Offers', path: '/farmer/offers', icon: Search },
        { name: 'Payments', path: '/farmer/payments', icon: Wallet },
        { name: 'Dispute Center', path: '/farmer/disputes', icon: AlertCircle },
        { name: 'Delivery Tracking', path: '/farmer/delivery-tracking', icon: Truck },
        { name: 'Market Trends', path: '/farmer/market-trends', icon: TrendingUp },
        { name: 'Blockchain Ledger', path: '/farmer/contract-audit', icon: Box },
        { name: 'Profile', path: '/farmer/profile', icon: User },
        
    ];

    const buyerLinks = [
        { name: 'Dashboard', path: '/buyer', icon: LayoutDashboard },
        { name: "Marketplace", path: "/buyer/marketplace", icon: User },
        { name: 'Calendar', path: '/buyer/calendar', icon: Calendar },
        { name: 'Create Offer', path: '/buyer/create-offer', icon: FileText },
        { name: 'Manage Contracts', path: '/buyer/contracts', icon: ShieldCheck },
        { name: 'Payments', path: '/buyer/payments', icon: Wallet },
        { name: 'Dispute Center', path: '/buyer/disputes', icon: AlertCircle },
        // { name: 'Market Insights', path: '/buyer/insights', icon: TrendingUp },
        { name: 'Delivery Tracking', path: '/buyer/delivery-tracking', icon: Truck },
        { name: 'Blockchain Ledger', path: '/buyer/contract-audit', icon: Box },
        { name: "Buyer Profile ", path: "/buyer/profile", icon: User },
    ];

    const adminLinks = [
        { name: 'Control Panel', path: '/admin', icon: LayoutDashboard },
        { name: 'Calendar', path: '/admin/calendar', icon: Calendar },
        { name: 'Verify Users', path: '/admin/verify', icon: ShieldCheck },
        { name: 'Disputes', path: '/admin/disputes', icon: AlertCircle },
        { name: 'Analytics', path: '/admin/analytics', icon: TrendingUp },
    ];



    const links = role === 'farmer' ? farmerLinks : role === 'buyer' ? buyerLinks : adminLinks;

    return (
        <div className="sidebar">
            <div className="logo">
                <div className="logo-icon">🌾</div>
                <span>KrishiSetu</span>
            </div>
            <nav className="nav-menu">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        end={link.path.split('/').length === 2}
                    >
                        <link.icon className="nav-icon" size={20} />
                        <span>{link.name}</span>
                    </NavLink>
                ))}

                <div className="nav-divider"></div>
                <div className="nav-section-label">UI Demos</div>

                <NavLink to="/ui-demo/timeline" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Clock className="nav-icon" size={20} />
                    <span>Timeline Demo</span>
                </NavLink>
                <NavLink to="/ui-demo/insights" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <TrendingUp className="nav-icon" size={20} />
                    <span>Insights Demo</span>
                </NavLink>
            </nav>
            <div className="sidebar-footer">
                <button className="nav-item logout-btn" onClick={handleLogout}>
                    <LogOut className="nav-icon" size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
