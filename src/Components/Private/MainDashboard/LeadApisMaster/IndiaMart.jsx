import React, { useContext, useState } from 'react';
import { UserContext } from '../../../../context/UserContext';

const IndiaMartWebhookInfo = () => {
  const [copied, setCopied] = useState(false);
  const { user } = useContext(UserContext);

  // Check if user exists before constructing URL
  const url = user?._id ? process.env.REACT_APP_API_URL + '/api/webhook/indiamart/' + user._id : '';

  const handleCopy = () => {
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // Show loading state if user is not available yet
  if (!user?._id) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 font-medium">Loading webhook URL...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Webhook URL Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Your IndiaMart Webhook URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <input
              type="text"
              value={url}
              readOnly
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm font-mono focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-green-700 focus:outline-none"
              title="Copy to clipboard"
            >
              {copied ? (
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-400 hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
          {copied && (
            <p className="text-sm text-green-600 font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Copied to clipboard!
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-green-700">
              <p className="font-medium mb-1">Setup Instructions:</p>
              <p>Copy the webhook URL above and paste it into your IndiaMart account's webhook settings to enable automatic lead integration with your system.</p>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-700">Webhook Status: Active</span>
          </div>
          <div className="text-sm text-gray-500">Ready to receive leads</div>
        </div>

        {/* Quick Setup Guide */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800">Quick Setup Steps:</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-xs font-medium mr-3 mt-0.5">1</span>
              <span>Copy the webhook URL from the field above</span>
            </div>
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-xs font-medium mr-3 mt-0.5">2</span>
              <span>Login to your IndiaMart seller account</span>
            </div>
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-xs font-medium mr-3 mt-0.5">3</span>
              <span>Navigate to Settings → Lead Management → Webhooks</span>
            </div>
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-xs font-medium mr-3 mt-0.5">4</span>
              <span>Paste the URL and activate the webhook integration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndiaMartWebhookInfo;
