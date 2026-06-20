import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import StarRating from '../../components/StarRating';
import api from '../../api/axios';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ field: 'name', order: 'ASC' });

  const fetchStores = useCallback(() => {
    setLoading(true);
    const params = { ...filters, sortBy: sort.field, order: sort.order };
    api.get('/admin/stores', { params })
      .then(({ data }) => setStores(data.stores))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters, sort]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  function handleSort(field) {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  }

  function SortIcon({ field }) {
    if (sort.field !== field) return <span className="sort-icon">↕</span>;
    return <span className="sort-icon active">{sort.order === 'ASC' ? '↑' : '↓'}</span>;
  }

  return (
    <Layout title="Stores">
      <div className="page-header">
        <h2>All Stores</h2>
        <Link to="/admin/stores/add" className="btn btn-primary">+ Add Store</Link>
      </div>

      <div className="card">
        <div className="filters-bar">
          {['name', 'email', 'address'].map((field) => (
            <div className="filter-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input className="filter-input" placeholder={`Filter by ${field}…`}
                value={filters[field]}
                onChange={(e) => setFilters((p) => ({ ...p, [field]: e.target.value }))} />
            </div>
          ))}
          <button className="btn btn-secondary btn-sm"
            onClick={() => setFilters({ name: '', email: '', address: '' })}>
            Clear
          </button>
        </div>

        {loading ? <Loader /> : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort('name')}>
                    Name <SortIcon field="name" />
                  </th>
                  <th className="sortable" onClick={() => handleSort('email')}>
                    Email <SortIcon field="email" />
                  </th>
                  <th className="sortable" onClick={() => handleSort('address')}>
                    Address <SortIcon field="address" />
                  </th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.length === 0 ? (
                  <tr><td colSpan={4}>
                    <div className="empty-state"><p>No stores found.</p></div>
                  </td></tr>
                ) : stores.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 500 }}>{s.name}</td>
                    <td>{s.email}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.address}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <StarRating value={Math.round(s.averageRating)} readonly size="xs" />
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                          {s.averageRating} ({s.ratingCount})
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
