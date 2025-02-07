import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import useUserAuth from "../CustomHooks/useUserAuth";

const UserDashboard = () => {
  useUserAuth();
  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h3><i className="ri-dashboard-horizontal-line"></i> Dashboard</h3>
        <div className="ha-link-grp">
            <NavLink to="profile"><i className="ri-user-line"></i> My Profile</NavLink>
            <NavLink to="reservations"><i className="ri-reserved-line"></i> My reservations</NavLink>
        </div>
      </aside>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default UserDashboard;