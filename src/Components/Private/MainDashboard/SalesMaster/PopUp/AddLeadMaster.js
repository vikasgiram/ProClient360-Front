import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { getAddress } from "../../../../../hooks/usePincode";

const AddLeadMaster = ({ onAddLead, onClose }) => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    company: '',
    subject: '',
    products: '',
    sources: '',  
    message: '',
    status: 'enquiry',
    value: '',
    address: {
      pincode: '',
      state: '',
      city: '',
      country: '',
      add: ''
    }
  });

  const [showCustomSource, setShowCustomSource] = useState(false);
  const [customSource, setCustomSource] = useState('');

  const products = ['surveillance System', 'Access Control System', 'TurnKey Project', 'Alleviz', 'CafeLive', 'WorksJoy', 'WorksJoy Blu', 'Fire Alarm System', 'Fire Hydrant System', 'IDS', 'AI Face Machines', 'Entrance Automation', 'Guard Tour System', 'Home Automation', 'IP PA and Communication System', 'CRM', 'Security Systems', 'KMS', 'VMS', 'Boom Barrier System', 'Tripod System', 'Flap Barrier System', 'EPBX System', 'CMS', 'Lift Eliviter System', 'AV6', 'Walky Talky System', 'Device Management System'];  

  const sources = ['Indiamart', 'TradeIndia','Google','JustDial', 'Facebook', 'LinkedIn', 'Twitter', 'YouTube', 'WhatsApp', 'Referral', 'Email Campaign', 'Cold Call', 'Website','Walk-In', 'Direct', 'Other']; 

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "sources") {
      if (value === "Other") {
        setShowCustomSource(true);
        setFormData(prev => ({ ...prev, [name]: '' }));
      } else {
        setShowCustomSource(false);
        setCustomSource('');
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomSourceChange = (e) => {
    const value = e.target.value;
    setCustomSource(value);
    setFormData(prev => ({ ...prev, sources: value }));
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;

    if (/^\d{0,6}$/.test(pincode)) {
      handleAddressChange(e);

      if (pincode.length === 6) {
        toast.loading('Fetching address details...');
        try {
          const addressDetails = await getAddress(pincode);
          if (addressDetails) {
            setFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                city: addressDetails.city,
                state: addressDetails.state,
                country: addressDetails.country || 'India'
              }
            }));
            toast.dismiss();
            toast.success('Address fetched!');
          } else {
            toast.dismiss();
            toast.error('Invalid Pincode. Please check and try again.');
          }
        } catch (error) {
          toast.dismiss();
          toast.error('Failed to fetch address.');
          console.error("Pincode fetch error:", error);
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      name,
      email,
      contact,
      subject,
      company,
      products,
      sources,  
      message,
      address
    } = formData;

    if (!name || !company || !contact || !products || !address.pincode || !address.add || !sources) {
      toast.error('Please fill in all required fields, including Pincode, full address, and source.');
      return;
    }

    const mappedData = {
      SENDER_NAME: name,
      SENDER_EMAIL: email,
      SENDER_MOBILE: contact,
      SUBJECT: subject,
      SENDER_COMPANY: company,
      SENDER_ADDRESS: address.add,
      SENDER_CITY: address.city,
      SENDER_STATE: address.state,
      SENDER_PINCODE: address.pincode,
      SENDER_COUNTRY_ISO: address.country,
      QUERY_PRODUCT_NAME: products,
      QUERY_SOURCES_NAME: sources,  
      QUERY_MESSAGE: message || ""
    };

    onAddLead(mappedData);
  };

  return (
    <>
      <div className="modal fade show" style={{ display: "flex", alignItems: "center", backgroundColor: "#00000090" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content p-3">
            <form onSubmit={handleSubmit}>

              <div className="modal-header pt-0">
                <h5 className="card-title fw-bold" id="exampleModalLongTitle"> Add Lead</h5>
                <button onClick={onClose} type="button" className="btn-close" aria-label="Close" style={{ backgroundColor: 'red' }}></button>
              </div>

              <div className="modal-body" style={{ maxHeight: 'calc(80vh - 240px)', overflowY: 'auto' }}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">Contact Name <RequiredStar /></label>
                    <input type="text" className="form-control" id="name" name="name" placeholder="Enter a Contact Name...." maxLength={50} value={formData.name} onChange={handleInputChange} required />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Contact Email <RequiredStar />
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter Email ID...."
                      maxLength={50}
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      pattern='[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
                      title="Please enter a valid email address (e.g., example@domain.com)"
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="contact" className="form-label">
                      Contact Number <RequiredStar />
                    </label>
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
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="subject" className="form-label">Subject <RequiredStar /></label>
                    <textarea type="text" className="form-control" id="subject" name="subject" placeholder="Enter a Subject...." maxLength={200} value={formData.subject} onChange={handleInputChange} required ></textarea>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="company" className="form-label">Company Name<RequiredStar /></label>
                    <input type="text" className="form-control" id="company" name="company" placeholder="Enter a Company Name...." maxLength={100} value={formData.company} onChange={handleInputChange} required />
                  </div>

                  <div className='col-md-6'>
                    <label htmlFor="products" className="form-label">Products<RequiredStar /></label>
                    <select id="products" className="form-select" name="products" value={formData.products} onChange={handleInputChange} required>
                      <option value="">Select Products....</option>
                      {products.map(product => <option key={product} value={product}>{product}</option>)}
                    </select>
                  </div>
                  
                  <div className='col-md-6'>
                    <label htmlFor="sources" className="form-label">Sources<RequiredStar /></label>
                    <select 
                      id="sources" 
                      className="form-select" 
                      name="sources" 
                      value={formData.sources === customSource ? "Other" : formData.sources} 
                      onChange={handleInputChange}
                      style={{ width: '100%', height: '35px' }}
                      required
                    >
                      <option value="">Select Sources....</option>
                      {sources.map(source => <option key={source} value={source}>{source}</option>)}
                    </select>
                    
                    {showCustomSource && (
                      <div className="mt-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter custom source"
                          value={customSource}
                          onChange={handleCustomSourceChange}
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      placeholder="Enter a Message...."
                      value={formData.message}
                      onChange={handleInputChange}
                      style={{ width: '100%', height: '100px' }}
                      maxLength={500}
                    />
                  </div>

                  <div className="col-12">
                    <div className="row border rounded p-3 m-1" style={{ backgroundColor: '#FAF6F6' }}>
                      <div className="col-12 mb-2">
                        <label className="form-label fw-bold">Address <RequiredStar /></label>
                      </div>

                      <div className="col-12 col-lg-6 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Pincode"
                          id="pincode"
                          name="pincode"
                          maxLength="6"
                          onChange={handlePincodeChange}
                          value={formData.address.pincode}
                          required
                        />
                      </div>

                      <div className="col-12 col-lg-6 mb-3">
                        <input
                          type="text"
                          maxLength={50}
                          className="form-control"
                          placeholder="State"
                          id="state"
                          name="state"
                          onChange={handleAddressChange}
                          value={formData.address.state}
                          required
                        />
                      </div>

                      <div className="col-12 col-lg-6 mb-3">
                        <input
                          type="text"
                          maxLength={50}
                          className="form-control"
                          placeholder="City"
                          id="city"
                          name="city"
                          onChange={handleAddressChange}
                          value={formData.address.city}
                          required
                        />
                      </div>

                      <div className="col-12 col-lg-6 mb-3">
                        <input
                          type="text"
                          maxLength={50}
                          className="form-control"
                          placeholder="Country"
                          id="country"
                          name="country"
                          onChange={handleAddressChange}
                          value={formData.address.country}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <textarea
                          className="form-control"
                          id="add"
                          maxLength={500}
                          name="add"
                          placeholder="House No., Building Name, Road Name, Area, Colony"
                          onChange={handleAddressChange}
                          value={formData.address.add}
                          rows="2"
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 justify-content-start">
                <button type="submit" className=" btn addbtn rounded-0 add_button px-4">Add</button>
                <button type="button" className=" btn addbtn rounded-0 Cancel_button px-4" onClick={onClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddLeadMaster;