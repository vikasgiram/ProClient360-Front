import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { RequiredStar } from '../../../RequiredStar/RequiredStar';

const actionOptions = [
  'Requirement Understanding',
  'Site Visit',
  'Online Demo',
  'Proof of Concept (POC)',
  'Documentation & Planning',
  'Quotation Submission',
  'Quotation Discussion',
  'Follow-Up Call',
  'Negotiation Call',
  'Negotiation Meetings',
  'Deal Status'
];

const UpdateSalesPopUp = ({ selectedLead, onUpdate, onClose }) => {

  const [actionData, setActionData] = useState({
    actionType: '',
    date: '',
    completion: '',
    status: '',
    quotationValue: '' 
  });

  useEffect(() => {
    if (selectedLead) {
      setActionData({
        actionType: '',
        date: '',
        completion: '',
        status: selectedLead.status || '',
        quotationValue: '' 
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
    } else {
      if (name === 'actionType' && value !== 'Quotation Submission') {
        setActionData(prev => ({ ...prev, [name]: value, quotationValue: '' }));
      } else {
        setActionData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleActionSubmit = (e) => {
    e.preventDefault();

    const isQuotationRequired = actionData.actionType === 'Quotation Submission';
    if (!actionData.status || !actionData.actionType || !actionData.date || !actionData.completion || (isQuotationRequired && !actionData.quotationValue)) {
      toast.error('Please fill in all required fields, including Quotation Amount.');
      return;
    }

    const now = new Date();
    const dateTime = now.toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata'
    });

    const updatedFormData = {
      ...selectedLead,
      status: actionData.status,
      actionDetails: {
        manualAction: actionData.actionType,
        submissionDateTime: dateTime,
        followUpDate: actionData.date,
        completionPercentage: actionData.completion,

        quotationValue: actionData.quotationValue || null
      }
    };

    onUpdate(selectedLead._id, updatedFormData);

    toast.success(`Action submitted successfully!`);
    onClose();
  };

  return (
    <div className="modal fade show" style={{
      display: "flex",
      alignItems: "center",
      backgroundColor: "#00000050",
      zIndex: 1070,
    
    }}>
      <div className="modal-dialog" style={{ maxWidth: '680px' }}>
        <div className="modal-content p-3">
          <form onSubmit={handleActionSubmit}>
            <div className="modal-header pt-0">
              <h5 className="card-title fw-bold">Task Bar</h5>
              <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
            </div>

            <div className="modal-body">
              <div className="row g-3">

                <div className="col-12" style={{ width: 320 }}>
                  <label htmlFor="status" className="form-label fw-bold">Status<RequiredStar/></label>
                  <select
                    id="status"
                    className="form-select bg_edit"
                    name="status"
                    onChange={handleActionChange}
                    value={actionData.status}
                    required
                  >
                    <option value="" disabled>-- Select a status --</option>
                    <option value="Win">Win</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Pending">Pending</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                 
                 <div className="col-12" style={{ width: 300 }}>
                  <label htmlFor="completion" className="form-label fw-bold">Completion (%)<RequiredStar/></label>
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


                <div className="col-12" style={{ width: 320 }}>
                  <label htmlFor="actionType" className="form-label fw-bold">Steps<RequiredStar/></label>
                  <select
                    id="actionType"
                    name="actionType"
                    className="form-select"
                    value={actionData.actionType}
                    onChange={handleActionChange}
                    required
                  >
                    <option value="" disabled>-- Select an action --</option>
                    {actionOptions.map((action, index) => (
                      <option key={index} value={action}>
                        {index + 1}. {action}
                      </option>
                    ))}
                  </select>
                </div>


                {actionData.actionType === 'Quotation Submission' && (
                  <div className="col-12" style={{ width: 250 }}>
                    <label htmlFor="quotationValue" className="form-label fw-bold">
                      Quotation Amount (₹)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="quotationValue"
                      name="quotationValue"
                      placeholder="Enter quotation amount"
                      value={actionData.quotationValue}
                      onChange={handleActionChange}
                      required
                    />
                  </div>
                )}

                

                <div className="col-12" style={{ width: 320 }}>
                  <label htmlFor="date" className="form-label fw-bold">Next Follow-up Date</label>
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
            </div>

            <div className="modal-footer border-0 justify-content-start">
              <button type="submit" className="btn addbtn rounded-0 add_button px-4 ">Submit</button>
              <button type="button" onClick={onClose} className="btn addbtn rounded-0 Cancel_button px-4">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSalesPopUp;