import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { RequiredStar } from "../../../RequiredStar/RequiredStar";

const UpdateSalesPopUp = ({ selectedLead, onUpdate, onClose }) => {

  const [actionData, setActionData] = useState({
    feasibility: '',
    manualAction: '',
    submissionDateTime: '',
    date: ''
  });

  const handleActionChange = (e) => {
    const { name, value } = e.target;
    setActionData(prev => ({ ...prev, [name]: value }));
  };

  const handleActionSubmit = (e) => {
    e.preventDefault();
    if (!actionData.feasibility || !actionData.manualAction) {
      toast.error('Please fill in all action fields.');
      return;
    }

    if (actionData.feasibility === 'feasible' && !actionData.date) {
      toast.error('Please select a follow-up date.');
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

    setActionData(prev => ({ ...prev, submissionDateTime: dateTime }));

    const updatedFormData = {
      ...selectedLead,
      actionDetails: {
        feasibility: actionData.feasibility,
        manualAction: actionData.manualAction,
        submissionDateTime: dateTime,
        ...(actionData.feasibility === 'feasible' && { followUpDate: actionData.date })
      }
    };

    onUpdate(selectedLead._id, updatedFormData);

    toast.success(`Action submitted at ${dateTime}`);
    onClose();
  };

  return (
    <div className="modal fade show" style={{
      display: "flex",
      alignItems: "center",
      backgroundColor: "#00000050",
      zIndex: 1070
    }}>
      <div className="modal-dialog modal-md">
        <div className="modal-content p-3">
          <form onSubmit={handleActionSubmit}>
            <div className="modal-header pt-0">
              <h5 className="card-title fw-bold">Task Bar</h5>
              <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-bold">Feasibility <RequiredStar /></label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="feasibility"
                      id="feasible"
                      value="feasible"
                      onChange={handleActionChange}
                      checked={actionData.feasibility === 'feasible'}
                      required
                    />
                    <label className="form-check-label" htmlFor="feasible">
                      Feasible
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="feasibility"
                      id="notFeasible"
                      value="not-feasible"
                      onChange={handleActionChange}
                      checked={actionData.feasibility === 'not-feasible'}
                      required
                    />
                    <label className="form-check-label" htmlFor="notFeasible">
                      Not Feasible
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  {actionData.feasibility === 'feasible' && (
                    <>
                      <label className="form-label fw-bold">
                        Next Follow-up Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control bg_edit"
                        name="date"
                        value={actionData.date || ''}
                        onChange={handleActionChange}
                        required
                      />
                    </>
                  )}
                </div>

                <div className="col-12">
                  <label htmlFor="manualAction" className="form-label fw-bold"> Action :- <RequiredStar /></label>
                  <textarea
                    className="form-control"
                    id="manualAction"
                    name="manualAction"
                    rows="4"
                    placeholder="Enter action details..."
                    value={actionData.manualAction}
                    onChange={handleActionChange}
                    required
                  ></textarea>
                </div>

                {actionData.submissionDateTime && (
                  <div className="col-12">
                    <div className="alert alert-info">
                      <strong>Submission Date & Time:</strong> {actionData.submissionDateTime}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer border-0 justify-content-start">
              <button type="submit" className="btn btn-outline-success rounded-0">Submit</button>
              <button type="button" onClick={onClose} className="btn btn-outline-danger me-2 rounded-0">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSalesPopUp;