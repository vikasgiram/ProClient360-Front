import React from 'react';
import TradeIndiaApiKeyInput from './TradeIndia';
import IndiaMartWebhookInfo from './IndiaMart';
import { sendTradeIndiaApiKey } from '../../../../hooks/leadApis';
import toast from 'react-hot-toast';

// LeadApis: Combines TradeIndia API key input and IndiaMart webhook info
const LeadApis = () => {
  // Example: handle API key submission (optional)
  const handleTradeIndiaApiKey = async (tradeIndiaApiKey) => {
    // You can handle the API key here (e.g., save to state, send to backend, etc.)
    const data = await sendTradeIndiaApiKey({ tradeIndiaApiKey });
    if (data.success) {
        toast.success(data.message || 'TradeIndia API key sent successfully');

    } else {
        console.error('Failed to send API key');
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 mb-4">
          <TradeIndiaApiKeyInput onApiKeySubmit={handleTradeIndiaApiKey} />
        </div>
        <div className="col-12 col-md-6 mb-4">
          <IndiaMartWebhookInfo />
        </div>
      </div>
    </div>
  );
};

export default LeadApis;
