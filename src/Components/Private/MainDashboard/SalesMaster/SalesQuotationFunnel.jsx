
import React, { useState } from 'react';

const SalesQuotationFunnel = ({
  totalQuotationAmount = 0,
  activeQuotationLeads = [],
  wonAmount = 0,
  lostAmount = 0
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-IN', options);
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="position-relative">
      {/* Main Funnel Card */}
      <div
        className="card shadow-sm border-0 mb-3 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          transition: 'transform 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="mb-0 d-flex align-items-center">
              <i className="fa fa-chart-line me-2"></i>
              Active Quotation Pipeline
            </h5>
            <span className="badge bg-light text-dark">
              {activeQuotationLeads.length} Leads
            </span>
          </div>
         
          <div className="text-center mb-3">
            <h1 className="display-4 fw-bold mb-0">
              {formatCurrency(totalQuotationAmount)}
            </h1>
            <p className="mb-0 opacity-75">Total Active Quotations</p>
          </div>

          <div className="row g-2 mt-2">
            <div className="col-6">
              <div className="bg-green-500 rounded p-2 text-center">
                <small className="d-block opacity-75">Won Amount</small>
                <strong>{formatCurrency(wonAmount)}</strong>
              </div>
            </div>
            <div className="col-6">
              <div className="bg-red-500 bg-opacity-25 rounded p-2 text-center">
                <small className="d-block opacity-75">Lost Amount</small>
                <strong>{formatCurrency(lostAmount)}</strong>
              </div>
            </div>
          </div>

          <div className="text-center mt-3">
            <small className="opacity-75">
              <i className="fa fa-info-circle me-1"></i>
              Click to view lead details
            </small>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div
          className="modal fade show"
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#00000050",
            zIndex: 1060
          }}
          onClick={() => setShowDetails(false)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fa fa-rupee-sign me-2"></i>
                  Active Quotation Leads Details
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowDetails(false)}
                ></button>
              </div>
             
              <div className="modal-body p-0">
                {activeQuotationLeads.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fa fa-inbox fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No active quotation leads found</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light sticky-top">
                        <tr>
                          <th>Sr.No</th>
                          <th>Company</th>
                          <th>Contact</th>
                          <th>Product</th>
                          <th>Status</th>
                          <th>Step</th>
                          <th className="text-end">Amount</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeQuotationLeads.map((lead, index) => (
                          <tr key={lead._id}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="fw-bold">{lead.SENDER_COMPANY || "N/A"}</div>
                              <small className="text-muted">{lead.SENDER_NAME || ""}</small>
                            </td>
                            <td>
                              <small>{lead.SENDER_MOBILE || "N/A"}</small>
                            </td>
                            <td>
                              <small>{lead.QUERY_PRODUCT_NAME || "N/A"}</small>
                            </td>
                            <td>
                              <span className={`badge ${
                                lead.STATUS === 'Ongoing' ? 'bg-primary' :
                                lead.STATUS === 'Pending' ? 'bg-warning' :
                                'bg-secondary'
                              }`}>
                                {lead.STATUS}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">{lead.step || "N/A"}</small>
                            </td>
                            <td className="text-end">
                              <strong className="text-success">
                                {formatCurrency(lead.quotation || 0)}
                              </strong>
                            </td>
                            <td>
                              <small>{formatDate(lead.nextFollowUpDate || lead.createdAt)}</small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="table-light">
                        <tr>
                          <td colSpan="6" className="text-end fw-bold">Total Pipeline:</td>
                          <td className="text-end fw-bold text-primary">
                            {formatCurrency(totalQuotationAmount)}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
             
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesQuotationFunnel;   