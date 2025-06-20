import React, { useState } from 'react';

// TradeIndiaApiKeyInput: A simple, themed, Bootstrap-styled component for API key input
const TradeIndiaApiKeyInput = ({ onApiKeySubmit }) => {
  const [form, setForm] = useState({
    userid: '',
    profile_id: '',
    apiKey: '',
  });
  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers for userid and profile_id
    if ((name === 'userid' || name === 'profile_id') && value && !/^\d*$/.test(value)) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.userid.trim() && form.profile_id.trim() && form.apiKey.trim()) {
      if (onApiKeySubmit) onApiKeySubmit(form);
        setForm({ userid: '', profile_id: '', apiKey: '' }); 
    }
  };

  return (
    <div className="card shadow-sm p-4 mb-4 bg-white rounded" style={{ maxWidth: 400, margin: '0 auto', border: '1px solid var(--primary, #1b3066)' }}>
      <div className="d-flex align-items-center mb-3">
        <i className="fa-solid fa-key fa-lg me-2 text-primary" aria-hidden="true"></i>
        <h5 className="mb-0" style={{ color: 'var(--primary, #1b3066)' }}>TradeIndia API Credentials</h5>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="mb-3">
          <label htmlFor="tradeindia-userid" className="form-label fw-semibold">User ID</label>
          <input
            type="number"
            className="form-control"
            id="tradeindia-userid"
            name="userid"
            placeholder="User ID"
            value={form.userid}
            onChange={handleChange}
            style={{ borderColor: 'var(--primary, #1b3066)' }}
            required
            min="0"
            inputMode="numeric"
            pattern="\\d*"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tradeindia-profileid" className="form-label fw-semibold">Profile ID</label>
          <input
            type="number"
            className="form-control"
            id="tradeindia-profileid"
            name="profile_id"
            placeholder="Profile ID"
            value={form.profile_id}
            onChange={handleChange}
            style={{ borderColor: 'var(--primary, #1b3066)' }}
            required
            min="0"
            inputMode="numeric"
            pattern="\\d*"
          />
        </div>
        <div className="mb-3 position-relative">
          <label htmlFor="tradeindia-api-key" className="form-label fw-semibold">API Key</label>
          <div className="input-group">
            <input
              type={show ? 'text' : 'password'}
              className="form-control"
              id="tradeindia-api-key"
              name="apiKey"
              placeholder="API Key"
              value={form.apiKey}
              onChange={handleChange}
              style={{ borderColor: 'var(--primary, #1b3066)' }}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              tabIndex={-1}
              onClick={() => setShow(s => !s)}
              title={show ? 'Hide Key' : 'Show Key'}
            >
              <i className={`fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          <i className="fa-solid fa-paper-plane me-2"></i>Submit
        </button>
      </form>
    </div>
  );
};

export default TradeIndiaApiKeyInput;
