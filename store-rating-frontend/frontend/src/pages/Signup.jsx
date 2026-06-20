import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
    if (form.address.trim().length === 0 || form.address.trim().length > 400)
      e.address = 'Address is required and must be at most 400 characters';
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=]).{8,16}$/.test(form.password))
      e.password = 'Password must be 8-16 characters with at least one uppercase letter and one special character';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      login(data.user, data.token);
      navigate('/user/stores');
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed. Please try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        <div className="auth-logo">
          <div className="logo-icon">⭐</div>
          <h1>Store Rating Platform</h1>
        </div>

        <h2>Create an account</h2>
        <p>Join to discover and rate stores</p>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">Full Name</label>
              <input
                className={`form-input ${errors.name ? 'error' : ''}`}
                name="name"
                placeholder="Min 20 characters required"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name
                ? <span className="form-error">{errors.name}</span>
                : <span className="form-hint">{form.name.length}/60 characters</span>
              }
            </div>

            <div className="form-group full-width">
              <label className="form-label">Email Address</label>
              <input
                className={`form-input ${errors.email ? 'error' : ''}`}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group full-width">
              <label className="form-label">Address</label>
              <input
                className={`form-input ${errors.address ? 'error' : ''}`}
                name="address"
                placeholder="Your street address"
                value={form.address}
                onChange={handleChange}
              />
              {errors.address && <span className="form-error">{errors.address}</span>}
            </div>

            <div className="form-group full-width">
              <label className="form-label">Password</label>
              <input
                className={`form-input ${errors.password ? 'error' : ''}`}
                type="password"
                name="password"
                placeholder="8-16 chars, 1 uppercase, 1 special char"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: 18 }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
