import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(({ data }) => setStats(data))
      .catch(() => setError('Failed to load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Dashboard">
      {loading ? <Loader /> : error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">👥</div>
              <div className="stat-info">
                <div className="number">{stats.userCount}</div>
                <div className="label">Total Users</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">🏪</div>
              <div className="stat-info">
                <div className="number">{stats.storeCount}</div>
                <div className="label">Total Stores</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">⭐</div>
              <div className="stat-info">
                <div className="number">{stats.ratingCount}</div>
                <div className="label">Total Ratings</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Quick Actions</h3></div>
            <div className="card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/admin/users/add" className="btn btn-primary">+ Add New User</Link>
              <Link to="/admin/stores/add" className="btn btn-secondary">+ Add New Store</Link>
              <Link to="/admin/users" className="btn btn-secondary">View All Users</Link>
              <Link to="/admin/stores" className="btn btn-secondary">View All Stores</Link>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
