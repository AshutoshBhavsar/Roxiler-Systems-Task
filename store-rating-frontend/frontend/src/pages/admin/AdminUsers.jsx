import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import api from '../../api/axios';

const ROLES = ['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'];

const ROLE_BADGE = {
  SYSTEM_ADMIN: 'badge badge-admin',
  NORMAL_USER: 'badge badge-user',
  STORE_OWNER: 'badge badge-owner',
};

const ROLE_LABEL = {
  SYSTEM_ADMIN: 'Admin',
  NORMAL_USER: 'User',
  STORE_OWNER: 'Store Owner',
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ field: 'name', order: 'ASC' });

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = { ...filters, sortBy: sort.field, order: sort.order };
    api.get('/admin/users', { params })
      .then(({ data }) => setUsers(data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters, sort]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

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
    <Layout title="Users">
      <div className="page-header">
        <h2>All Users</h2>
        <Link to="/admin/users/add" className="btn btn-primary">+ Add User</Link>
      </div>

      <div className="card">
        {/* Filters */}
        <div className="filters-bar">
          <div className="filter-group">
            <label>Name</label>
            <input className="filter-input" placeholder="Filter by name…"
              value={filters.name}
              onChange={(e) => setFilters((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="filter-group">
            <label>Email</label>
            <input className="filter-input" placeholder="Filter by email…"
              value={filters.email}
              onChange={(e) => setFilters((p) => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="filter-group">
            <label>Address</label>
            <input className="filter-input" placeholder="Filter by address…"
              value={filters.address}
              onChange={(e) => setFilters((p) => ({ ...p, address: e.target.value }))} />
          </div>
          <div className="filter-group">
            <label>Role</label>
            <select className="filter-input"
              value={filters.role}
              onChange={(e) => setFilters((p) => ({ ...p, role: e.target.value }))}>
              <option value="">All Roles</option>
              {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
            </select>
          </div>
          <button className="btn btn-secondary btn-sm"
            onClick={() => setFilters({ name: '', email: '', address: '', role: '' })}>
            Clear
          </button>
        </div>

        {/* Table */}
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
                  <th className="sortable" onClick={() => handleSort('role')}>
                    Role <SortIcon field="role" />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={5}>
                    <div className="empty-state"><p>No users found.</p></div>
                  </td></tr>
                ) : users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar">{u.name[0].toUpperCase()}</div>
                        {u.name}
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.address}
                    </td>
                    <td><span className={ROLE_BADGE[u.role]}>{ROLE_LABEL[u.role]}</span></td>
                    <td>
                      <Link to={`/admin/users/${u.id}`} className="btn btn-secondary btn-sm">
                        View
                      </Link>
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
