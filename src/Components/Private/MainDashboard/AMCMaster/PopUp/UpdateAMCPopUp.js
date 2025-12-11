import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { ObjectId } from 'bson';

const actionOptions = [
  '1. Call Not Connect/ Callback',
  '2. Requirement Understanding',
  '3. Site Visit',
  '4. Online Demo',
  '5. Proof of Concept (POC)',
  '6. Documentation & Planning',
  '7. Quotation Submission',
  '8. Quotation Discussion',
  '9. Follow-Up Call',
  '10. Negotiation Call',
  '11. Negotiation Meetings',
  '12. Deal Status',
  '15. Not Feasible'
];

const UpdateAMCPopup = ({ selectedAMC, onUpdateAMC, onClose }) => {
  const [formData, setFormData] = useState({
    _id: '',
    type: 'CMC',
    invoiceNumber: '',
    invoiceDate: '',
    invoiceAmount: '',
    amcStartDate: '',
    amcEndDate: '',
    quotationAmount: '',
    description: '',
    // Customer information fields
    customerName: '',
    contactPerson: '',
    email: '',
    contact: '',
    address: {
      pincode: '',
      state: '',
      city: '',
      country: '',
      add: ''
    },
    // Work data fields
    status: 'Pending',
    step: '',
    completion: '0',
    nextFollowUpDate: '',
    rem: ''
  });

  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [showWorkData, setShowWorkData] = useState(true); // Show work data by default
  const [workHistory, setWorkHistory] = useState([]);
  const types = ['CMC']; // Only CMC option available for update

  useEffect(() => {
    if (selectedAMC) {
      setFormData({
        _id: selectedAMC._id,
        type: 'CMC', // Force type to be CMC on update
        invoiceNumber: selectedAMC.invoiceNumber || '',
        invoiceDate: selectedAMC.invoiceDate ? new Date(selectedAMC.invoiceDate).toISOString().split('T')[0] : '',
        invoiceAmount: selectedAMC.invoiceAmount || '',
        amcStartDate: selectedAMC.amcStartDate ? new Date(selectedAMC.amcStartDate).toISOString().split('T')[0] : '',
        amcEndDate: selectedAMC.amcEndDate ? new Date(selectedAMC.amcEndDate).toISOString().split('T')[0] : '',
        quotationAmount: selectedAMC.quotationAmount || '',
        description: selectedAMC.description || '',
        // Customer information
        customerName: selectedAMC.customerName || '',
        contactPerson: selectedAMC.contactPerson || '',
        email: selectedAMC.email || '',
        contact: selectedAMC.contact || '',
        address: {
          pincode: selectedAMC.address?.pincode || '',
          state: selectedAMC.address?.state || '',
          city: selectedAMC.address?.city || '',
          country: selectedAMC.address?.country || 'India',
          add: selectedAMC.address?.add || ''
        },
        // Work data
        status: selectedAMC.status || 'Pending',
        step: selectedAMC.step || '',
        completion: selectedAMC.completion?.toString() || '0',
        nextFollowUpDate: selectedAMC.nextFollowUpDate ? new Date(selectedAMC.nextFollowUpDate).toISOString().slice(0, 16) : '',
        rem: selectedAMC.rem || ''
      });
      
      // Initialize work history
      let history = [];
      
      // Check for workHistory in selectedAMC
      if (selectedAMC.workHistory && selectedAMC.workHistory.length > 0) {
        history = [...selectedAMC.workHistory];
      } 
      // If no history exists, create initial action from current lead data
      else if (selectedAMC.status || selectedAMC.step) {
        const initialAction = {
          _id: new ObjectId(),
          status: selectedAMC.status || 'Pending',
          step: selectedAMC.step || 'Initial',
          nextFollowUpDate: selectedAMC.nextFollowUpDate || null,
          rem: selectedAMC.rem || '',
          completion: selectedAMC.completion || 0,
          actionBy: {
            name: selectedAMC.lastUpdatedBy?.name || "System"
          },
          createdAt: selectedAMC.updatedAt || new Date().toISOString()
        };
        history.push(initialAction);
      }
      
      // Sort actions by creation date to ensure chronological order
      history.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      setWorkHistory(history);
    }
  }, [selectedAMC]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for work data fields
    if (name === 'status') {
      // When status changes to Won or Lost, set completion to 100 and set appropriate step
      if (value === 'Won') {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          completion: '100',
          step: '12. Deal Status'
        }));
      } else if (value === 'Lost') {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          completion: '100',
          step: '15. Not Feasible'
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } 
    else if (name === 'completion') {
      if (/^\d{0,3}(\.\d{0,2})?$/.test(value)) {
        const num = parseFloat(value);
        if (value === "" || (num >= 0 && num <= 100)) {
          setFormData(prev => ({ ...prev, [name]: value }));
        }
      }
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    if (['state', 'city', 'country'].includes(name)) {
      if (!/^[A-Za-z\s]*$/.test(value)) return;
    }

    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      type,
      // Work data fields
      status,
      step,
      completion,
      nextFollowUpDate
    } = formData;

    // Validate dates if provided
    if (formData.amcStartDate && formData.amcEndDate && new Date(formData.amcStartDate) >= new Date(formData.amcEndDate)) {
      toast.error('AMC End Date must be after Start Date');
      return;
    }

    // Validate amounts if provided
    if (formData.invoiceAmount && parseFloat(formData.invoiceAmount) <= 0) {
      toast.error('Invoice Amount must be greater than 0');
      return;
    }

    if (formData.quotationAmount && parseFloat(formData.quotationAmount) <= 0) {
      toast.error('Quotation Amount must be greater than 0');
      return;
    }

    // Validate work data fields
    let requiredWorkFields = ['status'];
    
    // For Won status, require remark
    if (status === 'Won' || status === 'Lost') {
      requiredWorkFields.push('rem');
    }
    // For other statuses, require normal fields
    else {
      requiredWorkFields.push('step', 'completion', 'nextFollowUpDate');
    }
    
    const hasEmptyRequiredWorkField = requiredWorkFields.some(field => !formData[field]);
    
    if (hasEmptyRequiredWorkField) {
      toast.error('Please fill in all required work data fields');
      return;
    }

    // Prepare data to send - include all fields
    const dataToSend = {
      type, // This will always be 'CMC'
      invoiceNumber: formData.invoiceNumber || null,
      invoiceDate: formData.invoiceDate || null,
      invoiceAmount: formData.invoiceAmount || null,
      amcStartDate: formData.amcStartDate || null,
      amcEndDate: formData.amcEndDate || null,
      quotationAmount: formData.quotationAmount || null,
      description: formData.description || '',
      // Customer information
      customerName: formData.customerName,
      contactPerson: formData.contactPerson,
      email: formData.email,
      contact: formData.contact,
      address: {
        pincode: formData.address.pincode,
        state: formData.address.state,
        city: formData.address.city,
        country: formData.address.country,
        add: formData.address.add
      },
      // Work data
      status,
      step,
      completion: completion ? parseFloat(completion) : 0,
      nextFollowUpDate: nextFollowUpDate ? new Date(nextFollowUpDate).toISOString() : null,
      rem: formData.rem || ''
    };

    onUpdateAMC(dataToSend);
  };

  // Helper function to format dates for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-IN', options);
    } catch (error) {
      return dateString;
    }
  };

  return (
    <>
      <div className="modal fade show" style={{ display: "flex", alignItems: "center", backgroundColor: "#00000090" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content p-3">
            <form onSubmit={handleSubmit}>
              <div className="modal-header pt-0">
                <h5 className="card-title fw-bold" id="exampleModalLongTitle">Update AMC</h5>
                <button onClick={onClose} type="button" className="btn-close" aria-label="Close" style={{ backgroundColor: 'red' }}></button>
              </div>

              <div className="modal-body" style={{ maxHeight: 'calc(80vh - 240px)', overflowY: 'auto' }}>
                {/* Button to toggle work data */}
                <div className="mb-3">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => setShowWorkData(!showWorkData)}
                  >
                    {showWorkData ? 'Hide Work Data' : 'Show Work Data'}
                  </button>
                  
                  {/* Button to toggle customer information */}
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-info"
                    onClick={() => setShowCustomerInfo(!showCustomerInfo)}
                  >
                    {showCustomerInfo ? 'Hide Customer Information' : 'Show Customer Information'}
                  </button>
                </div>

                {/* Work Data Section */}
                {showWorkData && (
                  <div className="card mb-3">
                    <div className="card-body">
                      <h6
                        className="pb-2 mb-3"
                        style={{
                          color: "#000",
                          borderBottom: "2px solid #000",
                          fontWeight: "600",
                          display: "inline-block",
                        }}
                      >
                        Work Data :-
                      </h6>
                      
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label htmlFor="status" className="form-label fw-bold">
                            Status<RequiredStar />
                          </label>
                          <select 
                            id="status" 
                            className="form-select bg_edit" 
                            name="status" 
                            onChange={handleInputChange} 
                            value={formData.status} 
                            required
                          >
                            <option value="Pending">Pending</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Won">Won</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </div>

                        {/* Show Steps field only when status is not Won or Lost */}
                        {formData.status !== 'Won' && formData.status !== 'Lost' && (
                          <div className="col-md-6">
                            <label htmlFor="step" className="form-label fw-bold">
                              Steps<RequiredStar />
                            </label>
                            <select 
                              id="step" 
                              name="step" 
                              className="form-select" 
                              value={formData.step} 
                              onChange={handleInputChange} 
                              required
                            >
                              <option value="" disabled>-- Select an action --</option>
                              {actionOptions.map((action, index) => (
                                <option key={index} value={action}>{action}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Show completion field only when status is not Won or Lost */}
                        {formData.status !== 'Won' && formData.status !== 'Lost' && (
                          <div className="col-md-6">
                            <label htmlFor="completion" className="form-label fw-bold">
                              Status (%)<RequiredStar />
                            </label>
                            <input 
                              type="text" 
                              className="form-control" 
                              id="completion" 
                              name="completion" 
                              placeholder="Enter work completion %" 
                              maxLength={6} 
                              value={formData.completion} 
                              onChange={handleInputChange} 
                              required 
                            />
                          </div>
                        )}

                        {/* Hide next follow-up date when status is Won or Lost */}
                        {formData.status !== 'Won' && formData.status !== 'Lost' && (
                          <div className="col-md-6">
                            <label htmlFor="nextFollowUpDate" className="form-label fw-bold">
                              Next Follow-up Date<RequiredStar />
                            </label>
                            <input 
                              id="nextFollowUpDate" 
                              type="datetime-local" 
                              className="form-control bg_edit" 
                              name="nextFollowUpDate" 
                              value={formData.nextFollowUpDate || ''} 
                              onChange={handleInputChange} 
                              required 
                            />
                          </div>
                        )}

                        <div className="col-12">
                          <label htmlFor="rem" className="form-label fw-bold">
                            Remark
                            {/* Make remark required for Won and Lost status */}
                            {(formData.status === 'Won' || formData.status === 'Lost') && <RequiredStar />}
                          </label>
                          <textarea 
                            id="rem" 
                            name="rem"
                            className="form-control" 
                            placeholder="Enter your remarks here..." 
                            rows="3"
                            value={formData.rem} 
                            onChange={handleInputChange}
                            required={formData.status === 'Won' || formData.status === 'Lost'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Work History Table */}
                {showWorkData && workHistory.length > 0 && (
                  <div className="card mb-3">
                    <div className="card-body">
                      <h6 className="text-muted border-bottom pb-2 mb-3">Work History</h6>
                      <div className="table-responsive" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <table className="table table-sm table-hover">
                          <thead className="sticky-top bg-light">
                            <tr>
                              <th scope="col" className="text-center">Sr.No</th>
                              <th scope="col">Status</th>
                              <th scope="col">Steps</th>
                              <th scope="col" className="text-center">Completion</th>
                              <th scope="col">Next Follow-up Date</th>
                              <th scope="col">Remark</th> 
                              <th scope="col">Action By</th>
                            </tr>
                          </thead>
                          <tbody>
                            {workHistory.map((action, index) => (
                              <tr key={action._id || index}>
                                <td className="text-center">{index + 1}</td>
                                <td>{action.status}</td>
                                <td>{action.step}</td>
                                <td className="text-center">{action.completion}%</td>
                                <td>{formatDateForDisplay(action.nextFollowUpDate)}</td>
                                <td>{action.rem}</td>
                                <td>{action.actionBy?.name || "Unknown"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                <div className="row g-3">
                  {/* AMC Fields */}
                  <div className="col-md-6">
                    <label htmlFor="type" className="form-label">Type <RequiredStar /></label>
                    <select 
                      id="type" 
                      className="form-select" 
                      name="type" 
                      value={formData.type} 
                      onChange={handleInputChange}
                      required
                      disabled // Disabled to prevent changing type
                    >
                      {types.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <small className="text-muted">AMC type cannot be changed</small>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="invoiceNumber" className="form-label">Invoice Number</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="invoiceNumber" 
                      name="invoiceNumber" 
                      placeholder="Enter Invoice Number...." 
                      maxLength={50} 
                      value={formData.invoiceNumber} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="invoiceDate" className="form-label">Invoice Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="invoiceDate" 
                      name="invoiceDate" 
                      value={formData.invoiceDate} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="invoiceAmount" className="form-label">Invoice Amount (Without Tax)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="invoiceAmount" 
                      name="invoiceAmount" 
                      placeholder="Enter Invoice Amount...." 
                      min="0"
                      step="0.01"
                      value={formData.invoiceAmount} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="amcStartDate" className="form-label">AMC Start Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="amcStartDate" 
                      name="amcStartDate" 
                      value={formData.amcStartDate} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="amcEndDate" className="form-label">AMC End Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="amcEndDate" 
                      name="amcEndDate" 
                      value={formData.amcEndDate} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="quotationAmount" className="form-label">Quotation Amount</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="quotationAmount" 
                      name="quotationAmount" 
                      placeholder="Enter Quotation Amount...." 
                      min="0"
                      step="0.01"
                      value={formData.quotationAmount} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="description" className="form-label">Remark</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      placeholder="Enter Remark...."
                      value={formData.description}
                      onChange={handleInputChange}
                      style={{ width: '100%', height: '100px' }}
                      maxLength={500}
                    />
                  </div>

                  {/* Customer Information Fields - Only shown when toggle is on */}
                  {showCustomerInfo && (
                    <>
                      <h6
                        className="pb-2 mb-3"
                        style={{
                          color: "#000",
                          borderBottom: "2px solid #000",
                          fontWeight: "600",
                          display: "inline-block",
                        }}
                      >
                        Customer Information :-
                      </h6>

                      <div className="col-md-6">
                        <label htmlFor="customerName" className="form-label">Customer Name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="customerName" 
                          name="customerName" 
                          placeholder="Enter Customer Name...." 
                          maxLength={100} 
                          value={formData.customerName} 
                          onChange={handleInputChange} 
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="contactPerson" className="form-label">Contact Person</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="contactPerson" 
                          name="contactPerson" 
                          placeholder="Enter Contact Person...." 
                          maxLength={50} 
                          value={formData.contactPerson} 
                          onChange={handleInputChange} 
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder="Enter Email ID...."
                          maxLength={50}
                          value={formData.email}
                          onChange={handleInputChange}
                          pattern='[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
                          title="Please enter a valid email address"
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="contact" className="form-label">Contact Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="contact"
                          name="contact"
                          placeholder="Enter Contact Number...."
                          inputMode="numeric"
                          maxLength={10}
                          pattern="\d{10}"
                          value={formData.contact}
                          onChange={handleInputChange}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                          }}
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="pincode" className="form-label">Pincode</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Pincode"
                          id="pincode"
                          name="pincode"
                          maxLength="6"
                          onChange={handleAddressChange}
                          value={formData.address.pincode}
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="state" className="form-label">State</label>
                        <input
                          type="text"
                          maxLength={50}
                          className="form-control"
                          placeholder="Enter State"
                          id="state"
                          name="state"
                          onChange={handleAddressChange}
                          value={formData.address.state}
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="city" className="form-label">City</label>
                        <input
                          type="text"
                          maxLength={50}
                          className="form-control"
                          placeholder="Enter City"
                          id="city"
                          name="city"
                          onChange={handleAddressChange}
                          value={formData.address.city}
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="country" className="form-label">Country</label>
                        <input
                          type="text"
                          maxLength={50}
                          className="form-control"
                          placeholder="Enter Country"
                          id="country"
                          name="country"
                          onChange={handleAddressChange}
                          value={formData.address.country}
                        />
                      </div>

                      <div className="col-12">
                        <label htmlFor="add" className="form-label">Address</label>
                        <textarea
                          className="form-control"
                          id="add"
                          maxLength={500}
                          name="add"
                          placeholder="House No., Building Name, Road Name, Area, Colony"
                          onChange={handleAddressChange}
                          value={formData.address.add}
                          rows="2"
                        ></textarea>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="modal-footer border-0 justify-content-start">
                <button type="submit" className="btn addbtn rounded-0 add_button px-4">Update</button>
                <button type="button" className="btn addbtn rounded-0 Cancel_button px-4" onClick={onClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateAMCPopup;