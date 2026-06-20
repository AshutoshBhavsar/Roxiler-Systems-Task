import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import StarRating from '../../components/StarRating';
import api from '../../api/axios';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ field: 'name', order: 'ASC' });
  const [ratingStates, setRatingStates] = useState({});   

  const fetchStores = useCallback(() => {
    setLoading(true);
    const params = { ...search, sortBy: sort.field, order: sort.order };
    api.get('/user/stores', { params })
      .then(({ data }) => {
        setStores(data.stores);
        
        const init = {};
        data.stores.forEach((s) => {
          init[s.id] = { selected: s.userRating || 0, submitting: false, message: '' };
        });
        setRatingStates(init);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, sort]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  function handleSort(field) {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  }

  function selectRating(storeId, value) {
    setRatingStates((prev) => ({
      ...prev,
      [storeId]: { ...prev[storeId], selected: value, message: '' },
    }));
  }

  async function submitRating(storeId) {
    const state = ratingStates[storeId];
    if (!state?.selected) return;

    setRatingStates((prev) => ({
      ...prev,
      [storeId]: { ...prev[storeId], submitting: true, message: '' },
    }));

    try {
      const { data } = await api.post('/user/ratings', { storeId, value: state.selected });
      setRatingStates((prev) => ({
        ...prev,
        [storeId]: { ...prev[storeId], submitting: false, message: data.message },
      }));
     
      fetchStores();
    } catch (err) {
      setRatingStates((prev) => ({
        ...prev,
        [storeId]: {
          ...prev[storeId],
          submitting: false,
          message: err.response?.data?.message || 'Failed to submit rating',
        },
      }));
    }
  }

  function SortIcon({ field }) {
    if (sort.field !== field) return <span className="sort-icon">↕</span>;
    return <span className="sort-icon active">{sort.order === 'ASC' ? '↑' : '↓'}</span>;
  }

  return (
    <Layout title="Browse Stores">
      {/* Search bar */}
      <div className="card" style={{ marginBottom: 20, padding: '14px 20px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="filter-group">
            <label>Search by Name</label>
            <input className="filter-input" placeholder="Store name…"
              value={search.name}
              onChange={(e) => setSearch((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="filter-group">
            <label>Search by Address</label>
            <input className="filter-input" placeholder="Address…"
              value={search.address}
              onChange={(e) => setSearch((p) => ({ ...p, address: e.target.value }))} />
          </div>
          <button className="btn btn-secondary btn-sm"
            onClick={() => setSearch({ name: '', address: '' })}>
            Clear
          </button>
        </div>
      </div>

      {loading ? <Loader /> : stores.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon">🏪</div>
            <p>No stores found.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Sort controls */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, fontSize: 13, color: 'var(--text-muted)' }}>
            <span>Sort by:</span>
            {['name', 'address'].map((f) => (
              <button key={f} onClick={() => handleSort(f)}
                style={{
                  background: sort.field === f ? 'var(--primary-light)' : 'none',
                  border: '1px solid var(--border)', borderRadius: 6, padding: '3px 10px',
                  cursor: 'pointer', fontSize: 12.5,
                  color: sort.field === f ? 'var(--primary)' : 'var(--text-muted)',
                }}>
                {f.charAt(0).toUpperCase() + f.slice(1)} <SortIcon field={f} />
              </button>
            ))}
          </div>

          <div className="stores-grid">
            {stores.map((store) => {
              const rs = ratingStates[store.id] || { selected: 0, submitting: false, message: '' };
              const hasExisting = !!store.userRating;

              return (
                <div className="store-card" key={store.id}>
                  <div>
                    <h3>{store.name}</h3>
                    <p className="address">📍 {store.address}</p>
                  </div>

                  {/* Overall rating */}
                  <div className="store-meta">
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Overall Rating</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <StarRating value={Math.round(parseFloat(store.averageRating))} readonly size="sm" />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{store.averageRating}</span>
                      </div>
                    </div>

                    {hasExisting && (
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Your Rating</div>
                        <StarRating value={store.userRating} readonly size="sm" />
                      </div>
                    )}
                  </div>

                  {/* Submit / modify rating */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                      {hasExisting ? 'Modify your rating:' : 'Submit your rating:'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <StarRating
                        value={rs.selected}
                        onChange={(v) => selectRating(store.id, v)}
                      />
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => submitRating(store.id)}
                        disabled={rs.submitting || !rs.selected}
                      >
                        {rs.submitting ? 'Saving…' : hasExisting ? 'Update' : 'Submit'}
                      </button>
                    </div>
                    {rs.message && (
                      <div style={{
                        marginTop: 6, fontSize: 12,
                        color: rs.message.includes('Failed') ? 'var(--error)' : 'var(--success)',
                      }}>
                        {rs.message}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Layout>
  );
}
