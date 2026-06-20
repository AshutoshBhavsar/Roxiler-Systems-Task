import React, { useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const PASSWORD_RE = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=]).{8,16}$/;

export default function UpdatePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Current password is required';
    if (!PASSWORD_RE.test(form.newPassword))
      e.newPassword = '8-16 characters, at least one uppercase letter and one special character';
    if (form.newPassword !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { data } = await api.put('/auth/update-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setMessage({ type: 'success', text: data.message });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Change Password">
      <div style={{ maxWidth: 480 }}>
        <h2 style={{ marginBottom: 20, fontSize: 19, fontWeight: 700 }}>Change Password</h2>

        <div className="card">
          <div className="card-body">
            {message.text && (
              <div className={`alert alert-${message.type}`}>{message.text}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Current Password</label>
                <input
                  className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                  type="password" name="currentPassword"
                  placeholder="Your current password"
                  value={form.currentPassword} onChange={handleChange}
                />
                {errors.currentPassword && <span className="form-error">{errors.currentPassword}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">New Password</label>
                <input
                  className={`form-input ${errors.newPassword ? 'error' : ''}`}
                  type="password" name="newPassword"
                  placeholder="8-16 chars, 1 uppercase, 1 special char"
                  value={form.newPassword} onChange={handleChange}
                />
                {errors.newPassword && <span className="form-error">{errors.newPassword}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: 22 }}>
                <label className="form-label">Confirm New Password</label>
                <input
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  type="password" name="confirmPassword"
                  placeholder="Re-enter new password"
                  value={form.confirmPassword} onChange={handleChange}
                />
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>

              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
