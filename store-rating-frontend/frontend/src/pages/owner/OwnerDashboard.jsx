import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import StarRating from '../../components/StarRating';
import api from '../../api/axios';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/owner/dashboard')
      .then(({ data }) => setData(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="My Store Dashboard">
      {loading ? <Loader /> : error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <>
          {/* Store info + average rating */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card">
              <div className="stat-icon green">🏪</div>
              <div className="stat-info">
                <div className="number" style={{ fontSize: 18 }}>{data.store.name}</div>
                <div className="label">Your Store</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">⭐</div>
              <div className="stat-info">
                <div className="number">{data.averageRating}</div>
                <div className="label">Average Rating</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue">📝</div>
              <div className="stat-info">
                <div className="number">{data.ratings.length}</div>
                <div className="label">Total Ratings</div>
              </div>
            </div>
          </div>

          {/* Star display of average */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header"><h3>Overall Rating</h3></div>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 42, fontWeight: 800, color: 'var(--text)' }}>
                  {data.averageRating}
                </span>
                <div>
                  <StarRating value={Math.round(parseFloat(data.averageRating))} readonly />
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                    Based on {data.ratings.length} rating{data.ratings.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ratings table */}
          <div className="card">
            <div className="card-header"><h3>Ratings Received</h3></div>
            {data.ratings.length === 0 ? (
              <div className="empty-state">
                <div className="icon">⭐</div>
                <p>No ratings submitted yet. Share your store to get started!</p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Rating</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ratings.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="avatar">{r.user.name[0].toUpperCase()}</div>
                            {r.user.name}
                          </div>
                        </td>
                        <td>{r.user.email}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <StarRating value={r.value} readonly size="xs" />
                            <span style={{ fontSize: 13, fontWeight: 600 }}>{r.value}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
