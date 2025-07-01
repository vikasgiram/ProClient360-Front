import React, { useContext, useState } from 'react';
import { UserContext } from '../../../../context/UserContext';

const IndiaMartWebhookInfo = () => {

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

   const { user } = useContext(UserContext);

   const url = process.env.REACT_APP_API_URL + '/api/webhook/indiamart/' + user._id;

  return (
    <div className="card shadow-sm p-4 mb-4 bg-white rounded" style={{ maxWidth: 500, margin: '0 auto', border: '1px solid var(--primary, #1b3066)' }}>
      <div className="d-flex align-items-center mb-3">
        <i className="fa-solid fa-link fa-lg me-2 text-primary" aria-hidden="true"></i>
        <h5 className="mb-0" style={{ color: 'var(--primary, #1b3066)' }}>IndiaMart Webhook URL</h5>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Add this webhook URL to your IndiaMart account:</label>
        <div className="input-group">
          <input
            type="text"
            className="form-control bg-light"
            value={url}
            readOnly
            style={{ borderColor: 'var(--primary, #1b3066)', fontWeight: 500 }}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            <i className="fa-solid fa-copy"></i>
          </button>
        </div>
        {copied && <small className="text-success mt-1 d-block">Copied to clipboard!</small>}
      </div>
      <div className="alert alert-info d-flex align-items-center mt-3" role="alert" style={{ fontSize: '0.98rem' }}>
        <i className="fa-solid fa-circle-info me-2"></i>
        Please copy and paste this URL into your IndiaMart account's webhook settings to enable lead integration.
      </div>
    </div>
  );
};

export default IndiaMartWebhookInfo;
