import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import StarRating from '../../components/StarRating';
import api from '../../api/axios';

const ROLE_BADGE = {
  SYSTEM_ADMIN: 'badge badge-admin',
  NORMAL_USER: 'badge badge-user',
  STORE_OWNER: 'badge badge-owner',
};
const ROLE_LABEL = {
  SYSTEM_ADMIN: 'System Administrator',
  NORMAL_USER: 'Normal User',
  STORE_OWNER: 'Store Owner',
};

export default function AdminUserDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then(({ data }) => setData(data))
      .catch(() => setError('Could not load user details'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Layout title="User Detail">
      <div className="page-header">
        <h2>User Details</h2>
        <Link to="/admin/users" className="btn btn-secondary">← Back to Users</Link>
      </div>

      {loading ? <Loader /> : error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div className="avatar" style={{ width: 56, height: 56, fontSize: 22 }}>
                {data.user.name[0].toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: 18 }}>{data.user.name}</h3>
                <span className={ROLE_BADGE[data.user.role]}>{ROLE_LABEL[data.user.role]}</span>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <label>Email</label>
                <p>{data.user.email}</p>
              </div>
              <div className="detail-item">
                <label>Role</label>
                <p>{ROLE_LABEL[data.user.role]}</p>
              </div>
              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                <label>Address</label>
                <p>{data.user.address}</p>
              </div>
              <div className="detail-item">
                <label>Member Since</label>
                <p>{new Date(data.user.createdAt).toLocaleDateString()}</p>
              </div>

              {data.user.role === 'STORE_OWNER' && (
                <div className="detail-item">
                  <label>Store Average Rating</label>
                  {data.averageRating ? (
                    <div className="rating-display">
                      <span className="rating-number">{data.averageRating}</span>
                      <StarRating value={Math.round(data.averageRating)} readonly size="sm" />
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No ratings yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
