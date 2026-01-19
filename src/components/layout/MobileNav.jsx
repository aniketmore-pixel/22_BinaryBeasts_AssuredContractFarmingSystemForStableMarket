import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Search, Wallet, User } from 'lucide-react';
import './MobileNav.css';

const MobileNav = ({ role }) => {
    const links = [
        { name: 'Home', path: `/${role}`, icon: LayoutDashboard },
        { name: 'Contracts', path: `/${role}/contracts`, icon: FileText },
        { name: 'Find', path: role === 'farmer' ? '/farmer/offers' : '/buyer/create-offer', icon: Search },
        { name: 'Wallet', path: `/${role}/payments`, icon: Wallet },
        { name: 'Profile', path: `/${role}/profile`, icon: User },
    ];

    return (
        <div className="mobile-nav">
            {links.map((link) => (
                <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                    end={link.path.split('/').length === 2}
                >
                    <link.icon size={20} />
                    <span>{link.name}</span>
                </NavLink>
            ))}
        </div>
    );
};

export default MobileNav;
