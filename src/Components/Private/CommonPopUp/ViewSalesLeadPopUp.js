import React from 'react';
import { formatDateforTaskUpdate } from '../../../utils/formatDate';

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (error) {
    return dateString;
  }
};


const ViewSalesLeadPopUp = ({ closePopUp, selectedLead }) => {
  if (!selectedLead) {
    return null;
  }

  console.log("Selected Lead Data:", selectedLead);

  const fullAddress = [
    selectedLead.SENDER_ADDRESS,
    selectedLead.SENDER_CITY,
    selectedLead.SENDER_STATE,
    selectedLead.SENDER_PINCODE,
    selectedLead.SENDER_COUNTRY_ISO,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <div
        className="modal fade show"
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#00000090",
        }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content p-3">
            <div className="modal-header pt-0 border-0">
              <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                Sales Lead Details{" "}
                {selectedLead?.SOURCE?.toLowerCase().includes("indiamart") && (
                  <img src="/static/assets/img/indiamart.png" alt="Indiamart" style={{ height: "60px", marginLeft:"23px" }} />
                )}
                {selectedLead?.SOURCE?.toLowerCase().includes("tradeindia") && (
                  <img src="/static/assets/img/tradeindia.png" alt="TradeIndia" style={{ width: "60px", marginLeft:"23px"}} />
                )}
                {selectedLead?.SOURCE?.toLowerCase().includes("facebook") && (
                  <img src="/static/assets/img/facebook.png" alt="facebook" style={{ height: "40px", marginLeft:"23px" }} />
                )}
                {selectedLead?.SOURCE?.toLowerCase().includes("google") && (
                  <img src="/static/assets/img/google.png" alt="google" style={{ height: "40px", marginLeft:"23px" }} />
                )}
                {selectedLead?.SOURCE?.toLowerCase().includes("linkedin") && (
                  <img src="/static/assets/img/linkedin.png" alt="linkedin" style={{ height: "40px",marginLeft:"23px" }} />
                )}
                {selectedLead?.SOURCE?.toLowerCase().includes("direct") && (
                  <img src="/static/assets/img/nav/DACCESS.png" alt="direct" style={{ height: "40px",marginLeft:"23px" }} />
                )}

              </h5>

              <button
                onClick={closePopUp}
                type="button"
                className="btn-close"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body pt-0">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <h6 className="text-muted border-bottom pb-2 mb-3">Sender Information</h6>


                  <h6 className="mt-3 d-flex align-items-center gap-2">
                    <span className="fw-bold">Source:</span>

                    {selectedLead?.SOURCE?.toLowerCase() === "indiamart" && (
                      <>
                        <span>IndiaMart</span>
                      </>
                    )}

                    {selectedLead?.SOURCE?.toLowerCase() === "tradeindia" && (
                      <>
                        <span>TradeIndia</span>
                      </>
                    )}

                    {selectedLead?.SOURCE?.toLowerCase() === "facebook" && (
                      <>
                        <span>Facebook</span>
                      </>
                    )}

                    {selectedLead?.SOURCE?.toLowerCase() === "google" && (
                      <>
                        <span>Google</span>
                      </>
                    )}

                    {selectedLead?.SOURCE?.toLowerCase() === "linkedin" && (
                      <>
                        <span>LinkedIn</span>
                      </>
                    )}

                    { selectedLead?.SOURCE.toLowerCase() === "direct" && (
                      <>
                      <span>direct</span>
                      </>
                    )}

                    {!["indiamart", "tradeindia", "facebook", "google", "linkedin", "direct"].includes(selectedLead?.SOURCE?.toLowerCase()) && (
                      <span>{selectedLead?.SOURCE || "-"}</span>
                    )}

                  </h6>

                  <h6 className='mt-3'>
                    <p className="fw-bold d-inline">Name: </p>
                    {selectedLead?.SENDER_NAME || "-"}
                  </h6>
                  <h6 className="mt-3">
                    <p className="fw-bold d-inline">Company: </p>
                    {selectedLead?.SENDER_COMPANY || "-"}
                  </h6>
                  <h6 className="mt-3">
                    <p className="fw-bold d-inline">Email: </p>
                    {selectedLead?.SENDER_EMAIL || "-"}
                  </h6>
                  <h6 className="mt-3">
                    <p className="fw-bold d-inline">Mobile: </p>
                    {selectedLead?.SENDER_MOBILE || "-"}
                  </h6>
                  <h6 className="mt-3">
                    <p className="fw-bold d-inline">Address: </p>
                    {fullAddress || "-"}
                  </h6>
                </div>

                <div className="col-md-6 mb-3">
                  <h6 className="text-muted border-bottom pb-2 mb-3">Query Information</h6>
                  <h6>
                    <p className="fw-bold d-inline">Product: </p>
                    {selectedLead?.QUERY_PRODUCT_NAME || "-"}
                  </h6>
                  <h6 className="mt-3">
                    <p className="fw-bold d-inline">Subject: </p>
                    {selectedLead?.SUBJECT || "-"}
                  </h6>
                  <h6 className="mt-3">
                    <p className="fw-bold d-inline">Query Time: </p>
                    {formatDate(selectedLead?.createdAt) || "-"}
                  </h6>

                  <h6 className="mt-3">
                    <p className="fw-bold d-inline">Assigned By: </p>
                    {selectedLead?.assignedBy?.name || "Unknown"}
                  </h6>

                  <h6 className="mt-3">
                    <p className="fw-bold d-inline">Status: </p>
                    {selectedLead?.STATUS || "-"}
                  </h6>

                  <h6 className="mt-3">
                    <p className="fw-bold d-inline">Current Stage: </p>
                    {selectedLead?.step || "-"}
                  </h6>

                  <h6 className="mt-3">
                    <p className="fw-bold d-inline">Complated: </p>
                    {selectedLead?.complated || "-"}
                  </h6>
                </div>

                <div className="col-12 mt-2">
                  <h6 className="text-muted border-bottom pb-2 mb-2">Message</h6>
                  <p className="text-wrap" style={{ whiteSpace: "pre-wrap" }}>
                    {selectedLead?.QUERY_MESSAGE || "No message provided."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewSalesLeadPopUp;