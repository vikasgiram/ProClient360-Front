import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { getAddress } from "../../../../../hooks/usePincode";
import { getCustomers, getCustomerById } from "../../../../../hooks/useCustomer";
import Select from "react-select";

const PAGE_SIZE = 15;

const AddAMCPopup = ({ onAddAMC, onClose }) => {
  const [customerType, setCustomerType] = useState('new');
  const [formData, setFormData] = useState({
    type: 'AMC',
    invoiceNumber: '',
    invoiceDate: '',
    invoiceAmount: '',
    amcStartDate: '',
    amcEndDate: '',
    quotationAmount: '',
    description: '',
    // Customer fields
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
    }
  });

  // Customer dropdown state
  const [custOptions, setCustOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [custPage, setCustPage] = useState(1);
  const [custHasMore, setCustHasMore] = useState(true);
  const [custLoading, setCustLoading] = useState(false);
  const [custSearch, setCustSearch] = useState("");
  const [isLoadingCustomerAddress, setIsLoadingCustomerAddress] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const types = ['CMC', 'NCMC', 'One Time Charge'];

  // Load customers function
  const loadCustomers = useCallback(async (page, search) => {
    if (custLoading || !custHasMore) return;
    setCustLoading(true);
    
    try {
      const data = await getCustomers(page, PAGE_SIZE, search);

      if (data.error) {
        toast.error(data.error || 'Failed to load customers');
        setCustLoading(false);
        return;
      }

      const customers = data.customers || data.data || [];
      
      const newOpts = customers.map(c => ({ 
        value: c._id, 
        label: c.custName || c.name || 'Unnamed Customer' 
      }));
      
      setCustOptions(prev => page === 1 ? newOpts : [...prev, ...newOpts]);
      setCustHasMore(customers.length === PAGE_SIZE);
      setCustPage(page + 1);
    } catch (error) {
      console.error("Fetch customers error:", error);
      toast.error('Failed to load customers');
    } finally {
      setCustLoading(false);
    }
  }, [custLoading, custHasMore]);

  // Handle customer selection
  const handleCustomerSelect = async (selectedOption) => {
    setSelectedCustomer(selectedOption);
    
    if (selectedOption) {
      setIsLoadingCustomerAddress(true);
      try {
        const customerData = await getCustomerById(selectedOption.value);
        
        if (customerData && (customerData.customer || customerData.data)) {
          const customer = customerData.customer || customerData.data;
          const billingAddress = customer.billingAddress || customer.address || {};
          
          setFormData(prev => ({
            ...prev,
            customerName: customer.custName || customer.name || customer.companyName || '',
            contactPerson: customer.contactPerson || customer.name || '',
            email: customer.email || customer.contactPersonEmail || '',
            contact: customer.phoneNumber1 || customer.contact || customer.contactNumber || '',
            address: {
              pincode: billingAddress.pincode || '',
              state: billingAddress.state || '',
              city: billingAddress.city || '',
              add: billingAddress.add || billingAddress.addressLine1 || billingAddress.address || 
                    `${billingAddress.houseNo || ''}, ${billingAddress.buildingName || ''}, ${billingAddress.roadName || ''}, ${billingAddress.area || ''}, ${billingAddress.colony || ''}`.trim() || '',
              country: billingAddress.country || 'India'
            }
          }));
          
          toast.success("Customer details loaded successfully");
        } else {
          resetCustomerFormData();
          toast("No details found for this customer");
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
        toast.error("Failed to load customer details");
        resetCustomerFormData();
      } finally {
        setIsLoadingCustomerAddress(false);
      }
    } else {
      resetCustomerFormData();
    }
  };

  // Helper function to reset customer form data
  const resetCustomerFormData = () => {
    setFormData(prev => ({
      ...prev,
      customerName: '',
      contactPerson: '',
      email: '',
      contact: '',
      address: {
        pincode: '',
        state: '',
        city: '',
        add: '',
        country: ''
      }
    }));
  };

  // Load customers when customer type changes to existing
  useEffect(() => {
    if (customerType === 'existing') {
      setCustPage(1);
      setCustHasMore(true);
      setCustOptions([]);
      loadCustomers(1, custSearch);
    }
  }, [customerType]);

  // Load customers when search changes (with debounce)
  useEffect(() => {
    if (customerType === 'existing') {
      const timer = setTimeout(() => {
        setCustPage(1);
        setCustHasMore(true);
        setCustOptions([]);
        loadCustomers(1, custSearch);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [custSearch]);

  // Auto-fetch address when pincode changes (with debounce)
  useEffect(() => {
    const fetchData = async () => {
      if (formData.address.pincode && formData.address.pincode.length === 6) {
        setIsLoadingAddress(true);
        try {
          const data = await getAddress(formData.address.pincode);

          if (data && data !== "Error") {
            setFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                state: data.state || "",
                city: data.city || "",
                country: data.country || "India"
              }
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                state: "",
                city: "",
                country: ""
              }
            }));
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        } finally {
          setIsLoadingAddress(false);
        }
      } else if (formData.address.pincode.length < 6) {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            state: "",
            city: "",
            country: ""
          }
        }));
      }
    };
    
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.address.pincode]);

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerTypeChange = (e) => {
    const type = e.target.value;
    setCustomerType(type);
    
    if (type === 'new') {
      resetCustomerFormData();
      setSelectedCustomer(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      type,
      invoiceNumber,
      invoiceDate,
      invoiceAmount,
      amcStartDate,
      amcEndDate,
      quotationAmount,
      customerName,
      contactPerson,
      contact,
      address
    } = formData;

    // Validation for AMC fields
    if (!type || !invoiceNumber || !invoiceDate || !invoiceAmount || 
        !amcStartDate || !amcEndDate || !quotationAmount) {
      toast.error('Please fill in all required AMC fields');
      return;
    }

    // Validation for customer fields
    if (customerType === 'existing' && !selectedCustomer) {
      toast.error('Please select a customer');
      return;
    }

    if (!customerName || !contactPerson || !contact || !address.pincode || !address.add) {
      toast.error('Please fill in all required customer fields');
      return;
    }

    // Validate dates
    if (new Date(amcStartDate) >= new Date(amcEndDate)) {
      toast.error('AMC End Date must be after Start Date');
      return;
    }

    // Validate amounts
    if (parseFloat(invoiceAmount) <= 0 || parseFloat(quotationAmount) <= 0) {
      toast.error('Amounts must be greater than 0');
      return;
    }

    // Prepare data to send
    const dataToSend = {
      customerType,
      customerId: customerType === 'existing' ? selectedCustomer.value : null,
      type,
      invoiceNumber,
      invoiceDate,
      invoiceAmount,
      amcStartDate,
      amcEndDate,
      quotationAmount,
      description: formData.description || '',
      // Customer info (editable for both new and existing)
      customerName,
      contactPerson,
      email: formData.email,
      contact,
      address: {
        add: address.add,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country
      }
    };

    onAddAMC(dataToSend);
  };

  return (
    <>
      <div className="modal fade show" style={{ display: "flex", alignItems: "center", backgroundColor: "#00000090" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content p-3">
            <form onSubmit={handleSubmit}>
              <div className="modal-header pt-0">
                <h5 className="card-title fw-bold" id="exampleModalLongTitle">Add AMC</h5>
                <button onClick={onClose} type="button" className="btn-close" aria-label="Close" style={{ backgroundColor: 'red' }}></button>
              </div>

              <div className="modal-body" style={{ maxHeight: 'calc(80vh - 240px)', overflowY: 'auto' }}>
                <div className="row g-3">
                  
                  {/* Customer Type Selection */}
                  <div className="col-12">
                    <label className="form-label fw-bold">Customer Type <RequiredStar /></label>
                    <div className="d-flex gap-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="customerType"
                          id="newCustomer"
                          value="new"
                          checked={customerType === 'new'}
                          onChange={handleCustomerTypeChange}
                        />
                        <label className="form-check-label" htmlFor="newCustomer">
                          New Customer
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="customerType"
                          id="existingCustomer"
                          value="existing"
                          checked={customerType === 'existing'}
                          onChange={handleCustomerTypeChange}
                        />
                        <label className="form-check-label" htmlFor="existingCustomer">
                          Existing Customer
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Customer Selection for Existing */}
                  {customerType === 'existing' && (
                    <div className="col-12">
                      <label htmlFor="existingCustomerSelect" className="form-label">Select Customer <RequiredStar /></label>
                      <Select
                        options={custOptions}
                        value={selectedCustomer}
                        onChange={handleCustomerSelect}
                        onInputChange={val => setCustSearch(val)}
                        onMenuScrollToBottom={() => {
                          if (!custLoading && custHasMore) {
                            loadCustomers(custPage, custSearch);
                          }
                        }}
                        isLoading={custLoading}
                        placeholder="Search and select customer..."
                        noOptionsMessage={({ inputValue }) => 
                          inputValue 
                            ? 'No customers found. Try a different search.' 
                            : 'Type to search customers...'
                        }
                        loadingMessage={() => 'Loading customers...'}
                        closeMenuOnSelect={true}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderRadius: 0,
                            borderColor: '#ced4da',
                            fontSize: '16px',
                            minHeight: '38px',
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#f8f9fa' : 'white',
                            color: state.isSelected ? 'white' : '#212529',
                          }),
                        }}
                      />
                      {isLoadingCustomerAddress && (
                        <small className="text-info d-block mt-1">Loading customer details...</small>
                      )}
                    </div>
                  )}

                  {/* Customer Name */}
                  <div className="col-md-6">
                    <label htmlFor="customerName" className="form-label">Customer Name <RequiredStar /></label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="customerName" 
                      name="customerName" 
                      placeholder="Enter Customer Name...." 
                      maxLength={100} 
                      value={formData.customerName} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  {/* Contact Person */}
                  <div className="col-md-6">
                    <label htmlFor="contactPerson" className="form-label">Contact Person <RequiredStar /></label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="contactPerson" 
                      name="contactPerson" 
                      placeholder="Enter Contact Person...." 
                      maxLength={50} 
                      value={formData.contactPerson} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  {/* Email */}
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

                  {/* Contact Number */}
                  <div className="col-md-6">
                    <label htmlFor="contact" className="form-label">Contact Number <RequiredStar /></label>
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

                  {/* Pincode */}
                  <div className="col-md-6">
                    <label htmlFor="pincode" className="form-label">Pincode <RequiredStar /></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Pincode"
                      id="pincode"
                      name="pincode"
                      maxLength="6"
                      onChange={handleAddressChange}
                      value={formData.address.pincode}
                      required
                    />
                    {isLoadingAddress && (
                      <small className="text-info">Loading address details...</small>
                    )}
                  </div>

                  {/* State */}
                  <div className="col-md-6">
                    <label htmlFor="state" className="form-label">State <RequiredStar /></label>
                    <input
                      type="text"
                      maxLength={50}
                      className="form-control"
                      placeholder="Enter State"
                      id="state"
                      name="state"
                      onChange={handleAddressChange}
                      value={formData.address.state}
                      required
                    />
                  </div>

                  {/* City */}
                  <div className="col-md-6">
                    <label htmlFor="city" className="form-label">City <RequiredStar /></label>
                    <input
                      type="text"
                      maxLength={50}
                      className="form-control"
                      placeholder="Enter City"
                      id="city"
                      name="city"
                      onChange={handleAddressChange}
                      value={formData.address.city}
                      required
                    />
                  </div>

                  {/* Country */}
                  <div className="col-md-6">
                    <label htmlFor="country" className="form-label">Country <RequiredStar /></label>
                    <input
                      type="text"
                      maxLength={50}
                      className="form-control"
                      placeholder="Enter Country"
                      id="country"
                      name="country"
                      onChange={handleAddressChange}
                      value={formData.address.country}
                      required
                    />
                  </div>

                  {/* Full Address */}
                  <div className="col-12">
                    <label htmlFor="add" className="form-label">Address <RequiredStar /></label>
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

                  {/* AMC Type */}
                  <div className="col-md-6">
                    <label htmlFor="type" className="form-label">Type <RequiredStar /></label>
                    <select 
                      id="type" 
                      className="form-select" 
                      name="type" 
                      value={formData.type} 
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Type</option>
                      {types.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>

                  {/* Invoice Number */}
                  <div className="col-md-6">
                    <label htmlFor="invoiceNumber" className="form-label">Invoice Number <RequiredStar /></label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="invoiceNumber" 
                      name="invoiceNumber" 
                      placeholder="Enter Invoice Number...." 
                      maxLength={50} 
                      value={formData.invoiceNumber} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  {/* Invoice Date */}
                  <div className="col-md-6">
                    <label htmlFor="invoiceDate" className="form-label">Invoice Date <RequiredStar /></label>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="invoiceDate" 
                      name="invoiceDate" 
                      value={formData.invoiceDate} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  {/* Invoice Amount */}
                  <div className="col-md-6">
                    <label htmlFor="invoiceAmount" className="form-label">Invoice Amount (Without Tax)<RequiredStar /></label>
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
                      required 
                    />
                  </div>

                  {/* AMC Start Date */}
                  <div className="col-md-6">
                    <label htmlFor="amcStartDate" className="form-label">AMC Start Date <RequiredStar /></label>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="amcStartDate" 
                      name="amcStartDate" 
                      value={formData.amcStartDate} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  {/* AMC End Date */}
                  <div className="col-md-6">
                    <label htmlFor="amcEndDate" className="form-label">AMC End Date <RequiredStar /></label>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="amcEndDate" 
                      name="amcEndDate" 
                      value={formData.amcEndDate} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  {/* Quotation Amount */}
                  <div className="col-md-6">
                    <label htmlFor="quotationAmount" className="form-label">Quotation Amount <RequiredStar /></label>
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
                      required 
                    />
                  </div>

                  {/* Remark */}
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

                </div>
              </div>
              
              <div className="modal-footer border-0 justify-content-start">
                <button type="submit" className="btn addbtn rounded-0 add_button px-4">Add</button>
                <button type="button" className="btn addbtn rounded-0 Cancel_button px-4" onClick={onClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAMCPopup;