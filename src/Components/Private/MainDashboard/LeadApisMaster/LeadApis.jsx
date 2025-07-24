import React, { useState } from 'react';
import TradeIndiaApiKeyInput from './TradeIndia';
import IndiaMartWebhookInfo from './IndiaMart';
import { sendTradeIndiaApiKey } from '../../../../hooks/leadApis';
import toast from 'react-hot-toast';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';

const LeadApis = () => {


  const [loading, setLoading] = useState(true);
   const [isopen, setIsOpen] = useState(false);
    const toggle = () => {
      setIsOpen(!isopen);
    };


  const handleTradeIndiaApiKey = async (tradeIndiaConfig) => {
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
            <Sidebar isopen={isopen} active="TaskSheetMaster"  style={{ width: isopen ? "" : "calc(100%  - 120px )", marginLeft: isopen ? "" : "125px" }} />

            <div
              className="main-panel"
              style={{
                width: isopen ? "" : "calc(100%  - 120px )",
                marginLeft: isopen ? "" : "125px",
              }}
            ></div>

            <div className="container py-4 mt-4">
              <div className="row justify-content-center mt-5">

                <div className="accordion" id="leadApiAccordion">

                  {/* TradeIndia */}
                  <div className="accordion-item border rounded-3 mb-3 shadow">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button bg-light"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#tradeIndiaCollapse"
                        aria-expanded="true"
                        aria-controls="tradeIndiaCollapse"
                        style={{ paddingTop: "14px", paddingBottom: "14px", fontSize: "0.95rem", lineHeight: "2.2" }}
                      >
                        <i className="bi bi-gear-fill text-primary me-3"></i>
                        <div>
                          <strong>TradeIndia API Configuration</strong>
                          <div className="small text-muted mt-1">Configure your TradeIndia API key and settings</div>
                        </div>
                      </button>
                    </h2>

                    <div
                      id="tradeIndiaCollapse"
                      className="accordion-collapse collapse show"
                      data-bs-parent="#leadApiAccordion"
                    >
                      <div className="accordion-body bg-white" style={{ textAlign: 'left' }}>
                        <div className="row">
                          <div className="col-lg-6">
                            <TradeIndiaApiKeyInput onApiKeySubmit={handleTradeIndiaApiKey} />
                          </div>

                          <div className="col-lg-6">
                            <div className="ps-lg-4">
                              <h5 className="mb-3 text-primary">How to get TradeIndia Credentials</h5>

                              <div className="mb-3">
                                <h6><strong>Step 1.</strong> Prepare a Business Plan</h6>
                                <p className="text-muted small">The export trade procedure in India involves several stages.</p>
                              </div>

                              <div className="mb-3">
                                <h6><strong>Step 2.</strong> Product and Market Research</h6>
                                <p className="text-muted small">The export trade procedure in India involves several stages.</p>
                              </div>

                              <div className="mb-3">
                                <h6><strong>Step 3.</strong> Legal and Compliance Registration</h6>
                                <p className="text-muted small">The export trade procedure in India involves several stages.</p>
                              </div>

                              <div className="mb-3">
                                <h6><strong>Step 4.</strong> Market Identification and Analysis</h6>
                                <p className="text-muted small">The export trade procedure in India involves several stages.</p>
                              </div>

                              <div className="mb-3">
                                <h6><strong>Step 5.</strong> Payment Terms and Order Fulfillment</h6>
                                <p className="text-muted small">The export trade procedure in India involves several stages.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* IndiaMart */}
                  <div className="accordion-item border rounded-3 mb-3 shadow-sm">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed bg-light"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#indiaMartCollapse"
                        aria-expanded="false"
                        aria-controls="indiaMartCollapse"
                        style={{ paddingTop: "14px", paddingBottom: "14px", fontSize: "0.95rem", lineHeight: "2.2" }}
                      >
                        <i className="bi bi-webhook text-success me-3"></i>
                        <div>
                          <strong>IndiaMart Webhook Information</strong>
                          <div className="small text-muted mt-1">View and manage your IndiaMart webhook settings</div>
                        </div>
                      </button>
                    </h2>

                    <div
                      id="indiaMartCollapse"
                      className="accordion-collapse collapse"
                      data-bs-parent="#leadApiAccordion"
                    >
                      <div className="accordion-body bg-white" style={{ textAlign: 'left' }}>
                        <div className="row">
                          <div className="col-lg-6">
                            <IndiaMartWebhookInfo />
                          </div>

                          <div className="col-lg-6">
                            <div className="ps-lg-4">
                              <h5 className="mb-3 text-success">How to get IndiaMart Credentials</h5>

                              <div className="mb-3">
                                <h6><strong>Step 1.</strong> Setup Webhook URL</h6>
                                <p className="text-muted small">Configure your webhook endpoint to receive IndiaMart leads.</p>
                              </div>

                              <div className="mb-3">
                                <h6><strong>Step 2.</strong> Verify Authentication</h6>
                                <p className="text-muted small">Ensure your authentication credentials are properly configured.</p>
                              </div>

                              <div className="mb-3">
                                <h6><strong>Step 3.</strong> Test Connection</h6>
                                <p className="text-muted small">Verify that your webhook is receiving data correctly.</p>
                              </div>

                              <div className="mb-3">
                                <h6><strong>Step 4.</strong> Configure Lead Processing</h6>
                                <p className="text-muted small">Set up your lead processing and notification systems.</p>
                              </div>

                              <div className="mb-3">
                                <h6><strong>Step 5.</strong> Monitor and Maintain</h6>
                                <p className="text-muted small">Regularly monitor webhook status and maintain the integration.</p>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadApis;