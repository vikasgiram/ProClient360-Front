import React,{ useState } from 'react';
import TradeIndiaApiKeyInput from './TradeIndia';
import IndiaMartWebhookInfo from './IndiaMart';
import { sendTradeIndiaApiKey } from '../../../../hooks/leadApis';
import toast from 'react-hot-toast';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';

const LeadApis = () => {


  const [loading, setLoading] = useState(false);
   const [isopen, setIsOpen] = useState(false);
    const toggle = () => {
      setIsOpen(!isopen);
    };

  const handleTradeIndiaApiKey = async (tradeIndiaConfig) => {
    setLoading(true);
    try {
      const data = await sendTradeIndiaApiKey({ tradeIndiaConfig });
      if (data?.success) {
        toast?.success(data.message || 'TradeIndia API key sent successfully');
      } else {
        toast?.error('Failed to send API key');
        console.error('Failed to send API key');
      }
    } catch (error) {
      toast?.error('An error occurred while sending API key');
      console.error('Error sending API key:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="overlay">
          <span className="loader"></span>
        </div>
      )}
      <div className="container-scroller">
        <div className="row background_main_all">
          <Header toggle={toggle} isopen={isopen} />
          <div className="container-fluid page-body-wrapper">
            <Sidebar 
              isopen={isopen} 
              active="TaskSheetMaster" 
              style={{ 
                width: isopen ? "" : "calc(100% - 120px)", 
                marginLeft: isopen ? "" : "125px" 
              }} 
            />

            <div
              className="main-panel"
              style={{
                width: isopen ? "" : "calc(100% - 120px)",
                marginLeft: isopen ? "" : "125px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                minHeight: "100vh",
                paddingTop: "170px"
              }}
            >
              <div className="w-full px-6 py-8">
                {/* Page Header */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Lead API Configuration</h1>
                  <p className="text-gray-600">Configure your lead generation APIs to automatically capture leads from various platforms</p>
                </div>

                {/* API Cards Container */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  
                  {/* TradeIndia Configuration Card */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                      <div className="flex items-center">
                        <div className="bg-white bg-opacity-20 rounded-lg p-2 mr-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-white">TradeIndia API</h2>
                          <p className="text-blue-100 text-sm">Configure your TradeIndia credentials</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <TradeIndiaApiKeyInput onApiKeySubmit={handleTradeIndiaApiKey} loading={loading} />
                    </div>
                  </div>

                  {/* IndiaMart Webhook Card */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                      <div className="flex items-center">
                        <div className="bg-white bg-opacity-20 rounded-lg p-2 mr-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-white">IndiaMart Webhook</h2>
                          <p className="text-green-100 text-sm">Your webhook URL for lead integration</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <IndiaMartWebhookInfo />
                    </div>
                  </div>

                </div>

                {/* Help Section */}
                <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Need Help?</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Follow our step-by-step guides to configure your lead APIs correctly and start capturing leads automatically from your preferred platforms.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        TradeIndia Setup Guide
                      </h4>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-start">
                          <span className="font-medium text-blue-600 mr-2">1.</span>
                          <span>Login to your TradeIndia account and navigate to API settings</span>
                        </div>
                        <div className="flex items-start">
                          <span className="font-medium text-blue-600 mr-2">2.</span>
                          <span>Generate your API credentials (User ID, Profile ID, API Key)</span>
                        </div>
                        <div className="flex items-start">
                          <span className="font-medium text-blue-600 mr-2">3.</span>
                          <span>Enter the credentials in the form above and submit</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        IndiaMart Webhook Setup
                      </h4>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-start">
                          <span className="font-medium text-green-600 mr-2">1.</span>
                          <span>Copy the webhook URL provided above</span>
                        </div>
                        <div className="flex items-start">
                          <span className="font-medium text-green-600 mr-2">2.</span>
                          <span>Login to your IndiaMart account and go to webhook settings</span>
                        </div>
                        <div className="flex items-start">
                          <span className="font-medium text-green-600 mr-2">3.</span>
                          <span>Paste the URL and activate the webhook integration</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadApis;