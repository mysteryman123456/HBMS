import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import useAdminAuth from '../CustomHooks/useAdminAuth';

const HotelAdminDashboard = () => {

  useAdminAuth();

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h3><i className="ri-dashboard-horizontal-line"></i> Dashboard</h3>
        <div className="ha-link-grp">
            <NavLink to="add-listing"><i className="ri-add-line"></i> Add listing</NavLink>
            <NavLink to="edit-listing"><i className="ri-edit-box-line"></i> Edit listing</NavLink>
            <NavLink to="see-reservations"><i className="ri-reserved-line"></i> Reservations</NavLink>
        </div>
      </aside>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default HotelAdminDashboard;