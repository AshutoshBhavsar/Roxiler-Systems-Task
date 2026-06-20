import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const ROLES = [
  { value: 'NORMAL_USER',   label: 'Normal User' },
  { value: 'STORE_OWNER',   label: 'Store Owner' },
  { value: 'SYSTEM_ADMIN',  label: 'System Administrator' },
];

const PASSWORD_RE = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=]).{8,16}$/;

export default function AdminAddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'NORMAL_USER' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  }

  function validate() {
    const e = {};
    if (form.name.trim().length < 20 || form.name.trim().length > 60)
      e.name = 'Name must be between 20 and 60 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address';
    if (!form.address.trim() || form.address.length > 400)
      e.address = 'Address is required (max 400 characters)';
    if (!PASSWORD_RE.test(form.password))
      e.password = '8-16 characters, at least one uppercase letter and one special character';
    if (!form.role)
      e.role = 'Role is required';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    setSuccess('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.post('/admin/users', form);
      setSuccess('User created successfully!');
      setTimeout(() => navigate('/admin/users'), 1500);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Add User">
      <div className="page-header">
        <h2>Add New User</h2>
        <Link to="/admin/users" className="btn btn-secondary">← Back</Link>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        <div className="card-header"><h3>User Information</h3></div>
        <div className="card-body">
          {apiError && <div className="alert alert-error">{apiError}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Full Name</label>
                <input className={`form-input ${errors.name ? 'error' : ''}`}
                  name="name" placeholder="Min 20 characters"
                  value={form.name} onChange={handleChange} />
                {errors.name
                  ? <span className="form-error">{errors.name}</span>
                  : <span className="form-hint">{form.name.length}/60</span>}
              </div>

              <div className="form-group full-width">
                <label className="form-label">Email Address</label>
                <input className={`form-input ${errors.email ? 'error' : ''}`}
                  type="email" name="email" placeholder="email@example.com"
                  value={form.email} onChange={handleChange} />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group full-width">
                <label className="form-label">Address</label>
                <input className={`form-input ${errors.address ? 'error' : ''}`}
                  name="address" placeholder="Street address"
                  value={form.address} onChange={handleChange} />
                {errors.address && <span className="form-error">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input className={`form-input ${errors.password ? 'error' : ''}`}
                  type="password" name="password"
                  placeholder="8-16 chars, 1 uppercase, 1 special"
                  value={form.password} onChange={handleChange} />
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select className={`form-select ${errors.role ? 'error' : ''}`}
                  name="role" value={form.role} onChange={handleChange}>
                  {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                {errors.role && <span className="form-error">{errors.role}</span>}
              </div>

              <div className="full-width" style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? 'Creating…' : 'Create User'}
                </button>
                <Link to="/admin/users" className="btn btn-secondary">Cancel</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
