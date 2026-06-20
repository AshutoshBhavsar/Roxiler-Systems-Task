import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_NAV = {
  SYSTEM_ADMIN: [
    { to: '/admin',        label: 'Dashboard',   icon: '📊' },
    { to: '/admin/users',  label: 'Users',        icon: '👥' },
    { to: '/admin/stores', label: 'Stores',       icon: '🏪' },
  ],
  NORMAL_USER: [
    { to: '/user/stores',           label: 'Browse Stores',  icon: '🏪' },
    { to: '/user/update-password',  label: 'Change Password', icon: '🔒' },
  ],
  STORE_OWNER: [
    { to: '/owner/dashboard',          label: 'Dashboard',    icon: '📊' },
    { to: '/owner/update-password',    label: 'Change Password', icon: '🔒' },
  ],
};

const ROLE_LABEL = {
  SYSTEM_ADMIN: 'System Administrator',
  NORMAL_USER: 'Normal User',
  STORE_OWNER: 'Store Owner',
};

export default function Layout({ title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = ROLE_NAV[user?.role] || [];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>⭐ Store Ratings</h2>
          <p>{ROLE_LABEL[user?.role]}</p>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-section-label">Navigation</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin' || item.to === '/owner/dashboard'}
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' active' : '')
              }
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            {user?.name}
            <span>{user?.email}</span>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <h1>{title}</h1>
        </header>
        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}
