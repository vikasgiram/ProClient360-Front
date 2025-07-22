import  { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { RequiredStar } from '../../../RequiredStar/RequiredStar';
import useUpdateLead from '../../../../../hooks/leads/useUpdateLead';

const LeadInfoView = ({ selectedLead, actionData }) => {
  if (!selectedLead) {
    return null;
  }


  const formatDate = (dateString) => {  
    if (!dateString) return "N/A";
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('en-IN', options);
    } catch (error) {
      return dateString;
    }
  };

  const fullAddress = [
    selectedLead.SENDER_ADDRESS,
    selectedLead.SENDER_CITY,
    selectedLead.SENDER_STATE,
    selectedLead.SENDER_PINCODE,
    selectedLead.SENDER_COUNTRY_ISO,
  ].filter(Boolean).join(", ");

  return (
    <div className="row">
      <div className="col-md-6 mb-3">
        <h6 className="text-muted border-bottom pb-2 mb-3">Sender Information</h6>

        <h6 className="mt-3 d-flex align-items-center">
          <span className="fw-bold me-2">Source:</span>

          {selectedLead?.SOURCE?.toLowerCase() === "indiamart" && (
            <span>
              <img src="/static/assets/img/indiamart.png" alt="Indiamart" style={{ height: "40px", marginLeft: "10px" }} />
            </span>
          )}

          {selectedLead?.SOURCE?.toLowerCase() === "tradeindia" && (
            <span>
              <img src="/static/assets/img/tradeindia.png" alt="TradeIndia" style={{ height: "40px", marginLeft: "10px" }} />
            </span>
          )}

          {selectedLead?.SOURCE?.toLowerCase() === "facebook" && (
            <span>
              <img src="/static/assets/img/facebook.png" alt="Facebook" style={{ height: "40px", marginLeft: "10px" }} />
            </span>
          )}

          {selectedLead?.SOURCE?.toLowerCase() === "google" && (
            <span>
              <img src="/static/assets/img/google.png" alt="Google" style={{ height: "40px", marginLeft: "10px" }} />
            </span>
          )}

          {selectedLead?.SOURCE?.toLowerCase() === "linkedin" && (
            <span>
              <img src="/static/assets/img/linkedin.png" alt="LinkedIn" style={{ height: "40px", marginLeft: "10px" }}
              />
            </span>
          )}

          {selectedLead?.SOURCE?.toLowerCase() === "direct" && (
            <span>
              <img src="/static/assets/img/nav/DACCESS.png" alt="direct" style={{ height: "40px", marginLeft: "10px" }}
              />
            </span>
          )}

          {!["indiamart", "tradeindia", "facebook", "google", "linkedin", "direct"].includes(selectedLead?.SOURCE?.toLowerCase()) && (
            <span>{selectedLead?.SOURCE || "-"}</span>
          )}
        </h6>

        <h6 className='mt-3'><p className="fw-bold d-inline">Name: </p>{selectedLead?.SENDER_NAME || "-"}</h6>
        <h6 className="mt-3"><p className="fw-bold d-inline">Company: </p>{selectedLead?.SENDER_COMPANY || "-"}</h6>
        <h6 className="mt-3"><p className="fw-bold d-inline">Email: </p>{selectedLead?.SENDER_EMAIL || "-"}</h6>
        <h6 className="mt-3"><p className="fw-bold d-inline">Mobile: </p>{selectedLead?.SENDER_MOBILE || "-"}</h6>
        <h6 className="mt-3"><p className="fw-bold d-inline">Address: </p>{fullAddress || "-"}</h6>
      </div>

      <div className="col-md-6 mb-3">
        <h6 className="text-muted border-bottom pb-2 mb-3">Query Information</h6>
        <h6><p className="fw-bold d-inline">Product: </p>{selectedLead?.QUERY_PRODUCT_NAME || "-"}</h6>
        <h6 className="mt-3"><p className="fw-bold d-inline">Subject: </p>{selectedLead?.SUBJECT || "-"}</h6>
        <h6 className="mt-3"><p className="fw-bold d-inline">Query Time: </p>{formatDate(selectedLead?.createdAt) || "-"}</h6>
        <h6 className="mt-3"><p className="fw-bold d-inline">Assigned By: </p>{selectedLead?.assignedBy?.name || "Unknown"}</h6>
        <h6 className="mt-3"><p className="fw-bold d-inline">Status: </p>{selectedLead?.STATUS || "-"}</h6>
        <h6 className="mt-3"><p className="fw-bold d-inline">Completion: </p>{selectedLead?.complated || "0"}%</h6>
        <h6 className="mt-3"><p className="fw-bold d-inline">Quotation Amount: </p>₹{selectedLead?.quotation || " "}</h6>
        <h6 className="mt-3"><p className="fw-bold d-inline">Next Follow-up Date: </p>{formatDate(selectedLead?.nextFollowUpDate) || "Not set"}</h6>
      </div>

      <div className="col-12 mt-2">
        <h6 className="text-muted bg-white border-bottom pb-2 mb-2 rounded-4 px-4">Message</h6>
        <p className="text-wrap" style={{ whiteSpace: "pre-wrap" }}>{selectedLead?.QUERY_MESSAGE || "No message provided."}</p>
      </div>
    </div>
  );
};

const actionOptions = [
    '1. Requirement Understanding',
    '2. Site Visit',
    '3. Online Demo',
    '4. Proof of Concept (POC)',
    '5. Documentation & Planning',
    '6. Quotation Submission',
    '7. Quotation Discussion',
    '8. Follow-Up Call',
    '9. Negotiation Call',
    '10. Negotiation Meetings',
    '11. Deal Status'
];

const UpdateSalesPopUp = ({ selectedLead, onUpdate, onClose, isCompany }) => {
  const [showInfo, setShowInfo] = useState(isCompany);
  const [actionData, setActionData] = useState({
    actionType: '', 
    date: '', 
    completion: '', 
    status: '', 
    quotation: ''
  });

  const useUpdate = useUpdateLead();

  useEffect(() => {
    if (selectedLead) {
      setActionData({
        actionType: selectedLead?.actionDetails?.step || selectedLead?.step || '',
        date: selectedLead?.actionDetails?.followUpDate || selectedLead?.nextFollowUpDate || '',
        completion: selectedLead?.complated?.toString() || selectedLead?.actionDetails?.completionPercentage?.toString() || '0',
        status: selectedLead.status || selectedLead?.STATUS || '',
        quotation: selectedLead?.quotation?.toString() || selectedLead?.actionDetails?.quotation?.toString() || '0'
      });
    }
  }, [selectedLead]);

  const handleActionChange = (e) => {
    const { name, value } = e.target;
    if (name === 'completion') {
      if (/^\d{0,3}(\.\d{0,2})?$/.test(value)) {
        const num = parseFloat(value);
        if (value === "" || (num >= 0 && num <= 100)) {
          setActionData(prev => ({ ...prev, [name]: value }));
        }
      }
    } else if (name === 'quotation') {
    
      if (/^\d*\.?\d*$/.test(value)) {
        setActionData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setActionData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleActionSubmit = (e) => {
    e.preventDefault();
    const isQuotationRequired = actionData.actionType === '6. Quotation Submission';
    
    if (!actionData.status || !actionData.actionType || !actionData.date || !actionData.completion || 
        (isQuotationRequired && !actionData.quotation)) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const now = new Date();
    const dateTime = now.toLocaleString('en-IN', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit',
      minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata'
    });

    console.log("Action Data:", actionData);
    const updatedFormData = {
      status: actionData.status,
      step: actionData.actionType,
      complated: actionData.completion ? parseFloat(actionData.completion) : 0,
      nextFollowUpDate: actionData.date ? new Date(actionData.date).toISOString() : null,
      quotation: actionData.quotation ? parseFloat(actionData.quotation) : 0,
    };

    console.log("Updated Form Data:", updatedFormData);

    //api call to store updated data
    useUpdate.updateLead(selectedLead?._id, updatedFormData);
    onUpdate(selectedLead._id, updatedFormData);

    onClose();
  };

  return (
    <div className="modal fade show" style={{
      display: "flex", alignItems: "center", backgroundColor: "#00000050", zIndex: 1070,
    }}>
      <div className="modal-dialog modal-lg" style={{ maxWidth: '680px' }}>
        <div className="modal-content p-3">
          <form onSubmit={handleActionSubmit}>
            <div className="modal-header">
              <h5 className="card-title fw-bold mb-0">Submit Work</h5>

              <div className="d-flex align-items-center ms-auto">
                <button
                  onClick={onClose}
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                ></button>
              </div>
            </div>

            {!isCompany&&<button
              type="button"
              className="btn btn-sm rounded-0 btn-outline-success d-flex align-items-center ms-auto me-4 justify-content-end"
              onClick={() => setShowInfo(!showInfo)}
            >
              {showInfo ? "Hide Info" : "Show Info"}
            </button>}

            <div className="modal-body" style={{ maxHeight: '45vh', overflowY: 'auto' }}>
              {showInfo && <LeadInfoView selectedLead={selectedLead} actionData={actionData} />}
              {!isCompany && (<div className={`text-muted border-top pb-2 mb-3 ${showInfo ? 'pt-3 mt-4' : 'pt-0 mt-0'}`}>
                <h5>
                  Work Data
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="status" className="form-label fw-bold">Status<RequiredStar /></label>
                    <select id="status" className="form-select bg_edit" name="status" onChange={handleActionChange} value={actionData.status} required>
                      <option value="" disabled>-- Select a status --</option>
                      <option value="Pending">Pending</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="actionType" className="form-label fw-bold">Steps<RequiredStar /></label>
                    <select id="actionType" name="actionType" className="form-select" value={actionData.actionType} onChange={handleActionChange} required>
                      <option value="" disabled>-- Select an action --</option>
                      {actionOptions.map((action, index) => (
                        <option key={index} value={action}>{action}</option>
                      ))}
                    </select>
                  </div>            

                  <div className="col-md-6">
                    <label htmlFor="completion" className="form-label fw-bold">Completion (%)<RequiredStar /></label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="completion" 
                      name="completion" 
                      placeholder="Enter work completion %" 
                      maxLength={6} 
                      value={actionData.completion} 
                      onChange={handleActionChange} 
                      required 
                    />
                  </div>

                  {actionData.actionType === '6. Quotation Submission' && (
                    <div className="col-md-6">
                      <label htmlFor="quotation" className="form-label fw-bold">Quotation Amount (₹)<RequiredStar /></label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="quotation" 
                        name="quotation" 
                        placeholder="Enter quotation amount" 
                        value={actionData.quotation}
                        onChange={handleActionChange} 
                        required 
                      />
                    </div>
                  )}

                  <div className="col-md-6">
                    <label htmlFor="date" className="form-label fw-bold">Next Follow-up Date<RequiredStar /></label>
                    <input 
                      id="date" 
                      type="datetime-local" 
                      className="form-control bg_edit" 
                      name="date" 
                      value={actionData.date || ''} 
                      onChange={handleActionChange} 
                      required 
                    />
                  </div>
                </div>
            

            <div className="modal-footer border-0 justify-content-start mt-3">
              <button type="submit" className="btn addbtn rounded-0 add_button px-4">Submit</button>
              <button type="button" onClick={onClose} className="btn addbtn rounded-0 Cancel_button px-4">Cancel</button>
            </div>
            </div>)}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSalesPopUp;