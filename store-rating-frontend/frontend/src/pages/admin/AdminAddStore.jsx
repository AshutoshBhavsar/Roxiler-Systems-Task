import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const PASSWORD_RE = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=]).{8,16}$/;

export default function AdminAddStore() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/admin/owners').then(({ data }) => setOwners(data.owners)).catch(console.error);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  }

  function validate() {
    const e = {};
    if (form.name.trim().length < 20 || form.name.trim().length > 60)
      e.name = 'Store name must be between 20 and 60 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address';
    if (!form.address.trim() || form.address.length > 400)
      e.address = 'Address is required (max 400 characters)';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError(''); setSuccess('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = { ...form, ownerId: form.ownerId || null };
      await api.post('/admin/stores', payload);
      setSuccess('Store created successfully!');
      setTimeout(() => navigate('/admin/stores'), 1500);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Add Store">
      <div className="page-header">
        <h2>Add New Store</h2>
        <Link to="/admin/stores" className="btn btn-secondary">← Back</Link>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        <div className="card-header"><h3>Store Information</h3></div>
        <div className="card-body">
          {apiError && <div className="alert alert-error">{apiError}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Store Name</label>
                <input className={`form-input ${errors.name ? 'error' : ''}`}
                  name="name" placeholder="Min 20 characters"
                  value={form.name} onChange={handleChange} />
                {errors.name
                  ? <span className="form-error">{errors.name}</span>
                  : <span className="form-hint">{form.name.length}/60</span>}
              </div>

              <div className="form-group full-width">
                <label className="form-label">Store Email</label>
                <input className={`form-input ${errors.email ? 'error' : ''}`}
                  type="email" name="email" placeholder="store@example.com"
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

              <div className="form-group full-width">
                <label className="form-label">Assign Store Owner <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <select className="form-select" name="ownerId" value={form.ownerId} onChange={handleChange}>
                  <option value="">— No owner yet —</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                  ))}
                </select>
                <span className="form-hint">Only users with the Store Owner role appear here.</span>
              </div>

              <div className="full-width" style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? 'Creating…' : 'Create Store'}
                </button>
                <Link to="/admin/stores" className="btn btn-secondary">Cancel</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
