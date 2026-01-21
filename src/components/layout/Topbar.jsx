import React, { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import "./Topbar.css";

const Topbar = ({ title }) => {
  const [userCore, setUserCore] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const { id } = JSON.parse(storedUser);
    if (!id) return;

    const fetchUserCore = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/profile/user-core/${id}`
        );
        const data = await res.json();
        setUserCore(data);
      } catch (err) {
        console.error("❌ Failed to fetch user core:", err);
      }
    };

    fetchUserCore();
  }, []);

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
            {userCore?.name
              ? userCore.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div className="user-info">
            <span className="user-name">
              {userCore?.name || "Loading..."}
            </span>
            <span className="user-role"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
