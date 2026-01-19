import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import './Topbar.css';

const Topbar = ({ title, userProfile }) => {
    return (
        <div className="topbar">
            <div className="topbar-left">
                <h2>{title}</h2>
            </div>
            <div className="topbar-right">
                <div className="search-bar">
                    <Search size={18} />
                    <input type="text" placeholder="Search contracts, farmers..." />
                </div>
                <button className="icon-btn">
                    <Bell size={20} />
                    <span className="notification-dot"></span>
                </button>
                <div className="user-profile">
                    <div className="avatar">
                        {userProfile?.photoURL ? <img src={userProfile.photoURL} alt="User" /> : 'JS'}
                    </div>
                    <div className="user-info">
                        <span className="user-name">{userProfile?.displayName || 'John Singh'}</span>
                        <span className="user-role">{userProfile?.role || 'Farmer'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
