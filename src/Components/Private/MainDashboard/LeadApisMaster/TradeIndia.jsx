import React, { useState } from 'react';

// TradeIndiaApiKeyInput: A simple, themed, Bootstrap-styled component for API key input
const TradeIndiaApiKeyInput = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [show, setShow] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      if (onApiKeySubmit) onApiKeySubmit(apiKey);
    }
  };

  return (
    <div className="card shadow-sm p-4 mb-4 bg-white rounded" style={{ maxWidth: 400, margin: '0 auto', border: '1px solid var(--primary, #1b3066)' }}>
      <div className="d-flex align-items-center mb-3">
        <i className="fa-solid fa-key fa-lg me-2 text-primary" aria-hidden="true"></i>
        <h5 className="mb-0" style={{ color: 'var(--primary, #1b3066)' }}>TradeIndia API Key</h5>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 position-relative">
          <label htmlFor="tradeindia-api-key" className="form-label fw-semibold">Enter your API Key</label>
          <div className="input-group">
            <input
              type={show ? 'text' : 'password'}
              className="form-control"
              id="tradeindia-api-key"
              placeholder="API Key"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
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
