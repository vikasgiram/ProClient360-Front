import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { getCustomers } from "../../../../../hooks/useCustomer";
import { getProducts } from "../../../../../hooks/useProduct";
import { getPurchaseOrders } from "../../../../../hooks/usePurchaseOrder";
import { createMRF } from "../../../../../hooks/useMRF";
import axios from "axios";
import Select from "react-select";

const PAGE_SIZE = 15;

const AddMRFPopUp = ({ handleAdd, projects }) => {
  const [mrfDate, setMrfDate] = useState(new Date().toISOString().split('T')[0]);
  const [choice, setChoice] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [projectPurchaseOrderNumber, setProjectPurchaseOrderNumber] = useState("");
  const [selectedPO, setSelectedPO] = useState(null);
  const [transactionType, setTransactionType] = useState("");
  const [purchaseType, setPurchaseType] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [warehouseLocation, setWarehouseLocation] = useState("");
  const [remark, setRemark] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [location, setLocation] = useState("");
  const [deliveryPersonName, setDeliveryPersonName] = useState("");
  const [deliveryContactNo, setDeliveryContactNo] = useState("");
  const [deliveryEmail, setDeliveryEmail] = useState("");
  const [type, setType] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // Financial fields
  const [transportCost, setTransportCost] = useState(0);
  const [transportTax, setTransportTax] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  
  // Customer dropdown state with pagination
  const [custOptions, setCustOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [custPage, setCustPage] = useState(1);
  const [custHasMore, setCustHasMore] = useState(true);
  const [custLoading, setCustLoading] = useState(false);
  const [custSearch, setCustSearch] = useState("");
  
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [poSearch, setPoSearch] = useState("");
  
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  
  const [items, setItems] = useState([{
    brandName: "",
    modelNo: "",
    quantity: 1,
    unit: "",
    rate: 0,
    discount: 0,
    tax: 0,
    total: 0,
    remark: "",
    baseUOM: "" 
  }]);

  const loadCustomers = useCallback(async (page, search) => {
    if (custLoading || !custHasMore) return;
    setCustLoading(true);
    const data = await getCustomers(page, PAGE_SIZE, search);

    if (data.error) {
      toast.error(data.error || 'Failed to load customers');
      setCustLoading(false);
      return;
    }

    const newOpts = (data.customers || []).map(c => ({ 
      value: c._id, 
      label: `${c.custName} - ${c.email || c.phoneNumber1}` 
    }));
    
    setCustOptions(prev => page === 1 ? newOpts : [...prev, ...newOpts]);
    setCustHasMore(newOpts.length === PAGE_SIZE);
    setCustLoading(false);
    setCustPage(page + 1);
  }, [custLoading, custHasMore]);

  // Handle customer selection
  const handleCustomerSelect = (selectedOption) => {
    setSelectedCustomer(selectedOption);
  };

  // Initial & search-triggered load
  useEffect(() => {
    setCustPage(1);
    setCustHasMore(true);
    setCustOptions([]);
    loadCustomers(1, custSearch);
  }, [custSearch]);

  // Load purchase orders
  useEffect(() => {
    const loadPurchaseOrders = async () => {
      const data = await getPurchaseOrders(1, 100, poSearch);
      if (data.success) {
        const poOptions = data.purchaseOrders.map(po => ({
          value: po._id,
          label: `${po.orderNumber}`,
          po: po
        }));
        setPurchaseOrders(poOptions);
      }
    };
    loadPurchaseOrders();
  }, [poSearch]);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts(1, 1000, productSearch);
      if (data.success) {
        setProducts(data.products);
        const uniqueBrands = [...new Set(data.products.map(p => p.brandName).filter(Boolean))];
        setBrands(uniqueBrands.map(brand => ({ value: brand, label: brand })));
      }
    };
    loadProducts();
  }, [productSearch]);

  // Handle PO Selection
  const handlePOChange = (selected) => {
    setSelectedPO(selected);
    if (selected && selected.po) {
      const po = selected.po;
      setPoNumber(po.orderNumber);
      setProjectPurchaseOrderNumber(po.projectPurchaseOrderNumber || "");
      setTransactionType(po.transactionType);
      setPurchaseType(po.purchaseType);
      setDeliveryAddress(po.deliveryAddress || "");
      setLocation(po.location || "");
      setWarehouseLocation(po.warehouseLocation || "");
      
      if (po.project) {
        setSelectedProject(projects.find(p => p.value === po.project._id));
      }
    } else {
      // Reset fields when PO is cleared
      setPoNumber("");
      setProjectPurchaseOrderNumber("");
      setTransactionType("");
      setPurchaseType("");
      setDeliveryAddress("");
      setLocation("");
      setWarehouseLocation("");
      setSelectedProject(null);
    }
  };

  const handleAddItem = () => {
    setItems([...items, {
      brandName: "",
      modelNo: "",
      quantity: 1,
      unit: "",
      rate: 0,
      discount: 0,
      tax: 0,
      total: 0,
      remark: "",
      baseUOM: "" 
    }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      calculateTotals(newItems);
    }
  };

  // Updated handleItemChange function to automatically set unit based on baseUOM
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // If brand is changed, update models list and clear model and unit
    if (field === 'brandName') {
      if (value) {
        const brandProducts = products.filter(p => p.brandName === value);
        const uniqueModels = [...new Set(brandProducts.map(p => p.model).filter(Boolean))];
        setModels(uniqueModels.map(model => ({ value: model, label: model })));
      } else {
        setModels([]);
      }
      // Clear model and unit when brand changes
      newItems[index].modelNo = "";
      newItems[index].unit = "";
      newItems[index].baseUOM = "";
    }
    
    // If model is changed, find the product and set unit to baseUOM
    if (field === 'modelNo' && value && newItems[index].brandName) {
      const product = products.find(
        p => p.brandName === newItems[index].brandName && p.model === value
      );
      if (product) {
        newItems[index].baseUOM = product.baseUOM;
        // Set unit to baseUOM by default
        newItems[index].unit = product.baseUOM || " ";
      }
    }
    
    // Calculate item total when quantity, rate, discount, or tax changes
    if (['quantity', 'rate', 'discount', 'tax'].includes(field)) {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const rate = parseFloat(newItems[index].rate) || 0;
      const discount = parseFloat(newItems[index].discount) || 0;
      const tax = parseFloat(newItems[index].tax) || 0;
      
      const itemTotal = quantity * rate;
      const discountedTotal = itemTotal - (itemTotal * discount / 100);
      const finalTotal = discountedTotal + (discountedTotal * tax / 100);
      
      newItems[index].total = finalTotal;
    }
    
    setItems(newItems);
    calculateTotals(newItems);
  };

  const calculateTotals = (itemsList) => {
    // Calculate subtotal
    const newSubtotal = itemsList.reduce((sum, item) => {
      const itemTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
      const discountedTotal = itemTotal - (itemTotal * (parseFloat(item.discount) || 0) / 100);
      return sum + discountedTotal;
    }, 0);
    
    // Calculate total tax
    const newTotalTax = itemsList.reduce((sum, item) => {
      const itemTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
      const discountedTotal = itemTotal - (itemTotal * (parseFloat(item.discount) || 0) / 100);
      return sum + (discountedTotal * (parseFloat(item.tax) || 0) / 100);
    }, 0);
    
    // Calculate grand total
    const newGrandTotal = newSubtotal + newTotalTax + (parseFloat(transportCost) || 0) + (parseFloat(transportTax) || 0);
    
    setSubtotal(newSubtotal);
    setTotalTax(newTotalTax);
    setGrandTotal(newGrandTotal);
  };

  const handleTransportCostChange = (value) => {
    const cost = parseFloat(value) || 0;
    setTransportCost(cost);
    const newGrandTotal = subtotal + totalTax + cost + (parseFloat(transportTax) || 0);
    setGrandTotal(newGrandTotal);
  };

  const handleTransportTaxChange = (value) => {
    const tax = parseFloat(value) || 0;
    setTransportTax(tax);
    const newGrandTotal = subtotal + totalTax + (parseFloat(transportCost) || 0) + tax;
    setGrandTotal(newGrandTotal);
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        const fileInfos = response.data.files.map(file => ({
          name: file.originalname,
          type: file.mimetype,
          size: file.size,
          url: file.path, 
        }));
        
        setAttachments(prev => [...prev, ...fileInfos]);
        toast.success("Files uploaded successfully");
      } else {
        toast.error(response.data.error || "Failed to upload files");
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast.error("Failed to upload files: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!choice) {
      return toast.error("Please select choice type");
    }

    if (!selectedCustomer) {
      return toast.error("Please select a customer");
    }

    if (!transactionType) {
      return toast.error("Please select transaction type");
    }

    if (!purchaseType) {
      return toast.error("Please select purchase type");
    }

    if (!mrfDate) {
      return toast.error("Please select MRF date");
    }

    if (!type) {
      return toast.error("Please select type");
    }

    if (purchaseType === "Project Purchase" && !selectedProject) {
      return toast.error("Please select a project");
    }

    if (purchaseType === "Stock" && !warehouseLocation) {
      return toast.error("Please enter warehouse location");
    }

    for (let item of items) {
      if (!item.brandName || !item.modelNo || item.quantity < 1 || item.rate < 0) {
        return toast.error("Please fill all item details correctly");
      }
    }

    // Prepare MRF data
    const mrfData = {
      mrfDate: new Date(mrfDate),
      choice,
      poNumber: poNumber || "",
      projectPurchaseOrderNumber: projectPurchaseOrderNumber || "",
      purchaseOrder: selectedPO?.value,
      customer: selectedCustomer.value,
      transactionType,
      purchaseType,
      project: purchaseType === "Project Purchase" ? selectedProject?.value : undefined,
      warehouseLocation: purchaseType === "Stock" ? warehouseLocation : undefined,
      deliveryAddress,
      location,
      deliveryPersonName,
      deliveryContactNo,
      deliveryEmail,
      type,
      items,
      remark,
      subtotal,
      totalTax,
      transportCost,
      transportTax,
      grandTotal,
      attachments: attachments.map(att => ({
        name: att.name,
        type: att.type,
        size: att.size,
        url: att.url
      }))
    };

    toast.loading("Creating MRF...");
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/mrf`, mrfData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      toast.dismiss();
      
      if (response.data.success) {
        toast.success(response.data.message);
        handleAdd();
      } else {
        toast.error(response.data.error || "Failed to create MRF");
      }
    } catch (error) {
      toast.dismiss();
      console.error('Submission error:', error);
      toast.error("Failed to create MRF: " + (error.response?.data?.error || error.message));
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal fade show" style={{ display: "flex", alignItems: "center", backgroundColor: "#00000090" }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content p-3">
          <form onSubmit={handleSubmit}>
            <div className="modal-header pt-0">
              <h5 className="card-title fw-bold">Create MRF</h5>
              <button onClick={handleAdd} type="button" className="close px-3" style={{ marginLeft: "auto" }}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <div className="row modal_body_height">
                
                <div className="col-12 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label label_text">Choice <RequiredStar /></label>
                    <select
                      className="form-select rounded-0"
                      value={choice}
                      onChange={(e) => setChoice(e.target.value)}
                      required
                    >
                      <option value="">Select Choice</option>
                      <option value="MRF Material Request">MRF Material Request</option>
                      <option value="returnable MRF">returnable MRF</option>
                      <option value="Rejected returnable MRF">Rejected returnable MRF</option>
                      <option value="scrap MRF">scrap MRF</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label label_text">PO No.</label>
                    <Select
                      value={selectedPO}
                      onChange={handlePOChange}
                      onInputChange={setPoSearch}
                      options={purchaseOrders}
                      placeholder="Select PO Number (Optional)..."
                      isClearable
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                    {poNumber && (
                      <small className="text-success mt-1 d-block">
                        Selected PO: {poNumber}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label label_text">Project Purchase Order No.</label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      value={projectPurchaseOrderNumber}
                      onChange={(e) => setProjectPurchaseOrderNumber(e.target.value)}
                      placeholder="Enter Project Purchase Order Number"
                    />
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label label_text">Customer Name <RequiredStar /></label>
                    <Select
                      options={custOptions}
                      value={selectedCustomer}
                      onChange={handleCustomerSelect}
                      onInputChange={val => setCustSearch(val)}
                      onMenuScrollToBottom={() => loadCustomers(custPage, custSearch)}
                      isLoading={custLoading}
                      placeholder="Search and select customer..."
                      noOptionsMessage={() => custLoading ? 'Loading...' : 'No customers found'}
                      closeMenuOnSelect={true}
                      isClearable
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          borderRadius: 0,
                          borderColor: '#ced4da',
                          fontSize: '16px',
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#f8f9fa' : 'white',
                          color: state.isSelected ? 'white' : '#212529',
                        }),
                      }}
                      required
                    />
                    {selectedCustomer && (
                      <small className="text-success">
                        Customer selected: {selectedCustomer.label}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label label_text">MRF Date <RequiredStar /></label>
                    <input
                      type="date"
                      className="form-control rounded-0"
                      value={mrfDate}
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        const currentDate = new Date();
                        currentDate.setHours(0, 0, 0, 0);
                        
                        if (selectedDate <= currentDate) {
                          setMrfDate(e.target.value);
                        } else {
                          setMrfDate(today);
                          toast.error("Future dates are not allowed");
                        }
                      }}
                      max={today}
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label label_text">Transaction Type <RequiredStar /></label>
                    <select
                      className="form-select rounded-0"
                      value={transactionType}
                      onChange={(e) => setTransactionType(e.target.value)}
                      required
                    >
                      <option value="">Select Transaction Type</option>
                      <option value="B2B">B2B</option>
                      <option value="SEZ">SEZ</option>
                      <option value="Import">Import</option>
                      <option value="Asset">Asset</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label label_text">Project Purchase / Stock <RequiredStar /></label>
                    <select
                      className="form-select rounded-0"
                      value={purchaseType}
                      onChange={(e) => setPurchaseType(e.target.value)}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Project Purchase">Project Purchase</option>
                      <option value="Stock">Stock</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label label_text">Type <RequiredStar /></label>
                    <select
                      className="form-select rounded-0"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="supply only">Supply Only</option>
                      <option value="project">Project</option>
                    </select>
                  </div>
                </div>

                {purchaseType === "Project Purchase" && (
                  <div className="col-12 col-lg-6">
                    <div className="mb-3">
                      <label className="form-label label_text">Project Name <RequiredStar /></label>
                      <Select
                        value={selectedProject}
                        onChange={setSelectedProject}
                        options={projects}
                        placeholder="Select Project..."
                        isClearable
                        required
                      />
                    </div>
                  </div>
                )}

                {purchaseType === "Stock" && (
                  <div className="col-12 col-lg-6">
                    <div className="mb-3">
                      <label className="form-label label_text">Warehouse Location <RequiredStar /></label>
                      <input
                        type="text"
                        className="form-control rounded-0"
                        value={warehouseLocation}
                        onChange={(e) => setWarehouseLocation(e.target.value)}
                        placeholder="Ex: Baner / Amazon / Mumbai / Bhosari"
                        maxLength={200}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="col-12 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label label_text">Delivery Person Name</label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      value={deliveryPersonName}
                      onChange={(e) => setDeliveryPersonName(e.target.value)}
                      placeholder="Enter delivery person name"
                      maxLength={100}
                    />
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label label_text">Delivery Contact No.</label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      value={deliveryContactNo}
                      onChange={(e) => setDeliveryContactNo(e.target.value)}
                      placeholder="Enter delivery contact number"
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label label_text">Delivery Email</label>
                    <input
                      type="email"
                      className="form-control rounded-0"
                      value={deliveryEmail}
                      onChange={(e) => setDeliveryEmail(e.target.value)}
                      placeholder="Enter delivery email"
                      maxLength={100}
                    />
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label label_text">Delivery Address</label>
                    <textarea
                      className="form-control rounded-0"
                      rows="2"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter delivery address"
                      maxLength={500}
                    />
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label label_text">Location</label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter location"
                      maxLength={200}
                    />
                  </div>
                </div>

                {/* Attachments Section */}
                <div className="col-12 mt-3">
                  <div className="mb-3">
                    <label className="form-label label_text">Attachments</label>
                    <div className="mb-2">
                      <input
                        type="file"
                        className="form-control rounded-0"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        disabled={uploading}
                      />
                      {uploading && <div className="mt-2">Uploading files...</div>}
                    </div>
                    
                    {attachments.length > 0 && (
                      <div className="mt-2">
                        <h6>Attached Files:</h6>
                        <div className="d-flex flex-wrap">
                          {attachments.map((file, index) => (
                            <div key={index} className="mb-2 me-2 d-flex align-items-center">
                              <span className="me-2">{file.name}</span>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => removeAttachment(index)}
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-12 mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold">Item Details</h6>
                    <button type="button" className="btn btn-sm btn-primary" onClick={handleAddItem}>
                      <i className="fa fa-plus"></i> Add Item
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Brand Name</th>
                          <th>Model no</th>
                          <th>Quantity</th>
                          <th>Unit</th>
                          <th>Rate</th>
                          <th>Discount (%)</th>
                          <th>Tax (%)</th>
                          <th>Total</th>
                          <th>Remark</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => {
                          const brandProducts = products.filter(p => p.brandName === item.brandName);
                          const uniqueModels = [...new Set(brandProducts.map(p => p.model).filter(Boolean))];
                          const modelOptions = uniqueModels.map(model => ({ value: model, label: model }));
                          
                          return (
                            <tr key={index}>
                              <td>
                                <Select
                                  value={brands.find(b => b.value === item.brandName) || null}
                                  onChange={(selected) => handleItemChange(index, 'brandName', selected ? selected.value : "")}
                                  options={brands}
                                  placeholder="Select Brand..."
                                  isClearable
                                  required
                                />
                              </td>
                              <td>
                                <Select
                                  value={modelOptions.find(m => m.value === item.modelNo) || null}
                                  onChange={(selected) => handleItemChange(index, 'modelNo', selected ? selected.value : "")}
                                  options={modelOptions}
                                  placeholder="Select Model..."
                                  isClearable
                                  isDisabled={!item.brandName}
                                  required
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={item.quantity}
                                  onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                  min="1"
                                  required
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={item.unit}
                                  onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                                  required
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={item.rate}
                                  onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                                  min="0"
                                  step="0.01"
                                  required
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={item.discount}
                                  onChange={(e) => handleItemChange(index, 'discount', Number(e.target.value))}
                                  min="0"
                                  max="100"
                                  step="0.01"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={item.tax}
                                  onChange={(e) => handleItemChange(index, 'tax', Number(e.target.value))}
                                  min="0"
                                  max="100"
                                  step="0.01"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={item.total}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={item.remark}
                                  onChange={(e) => handleItemChange(index, 'remark', e.target.value)}
                                  placeholder="Remark"
                                  maxLength={500}
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleRemoveItem(index)}
                                  disabled={items.length === 1}
                                >
                                  <i className="fa fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="col-12 mt-3">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="fw-bold mb-0">Financial Summary</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label className="form-label">Subtotal</label>
                            <input
                              type="number"
                              className="form-control"
                              value={subtotal}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label className="form-label">Total Tax</label>
                            <input
                              type="number"
                              className="form-control"
                              value={totalTax}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label className="form-label">Transport Cost</label>
                            <input
                              type="number"
                              className="form-control"
                              value={transportCost}
                              onChange={(e) => handleTransportCostChange(Number(e.target.value))}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label className="form-label">Transport Tax</label>
                            <input
                              type="number"
                              className="form-control"
                              value={transportTax}
                              onChange={(e) => handleTransportTaxChange(Number(e.target.value))}
                              min="0"
                              max="100"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 offset-md-3">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Grand Total</label>
                            <input
                              type="number"
                              className="form-control fw-bold"
                              value={grandTotal}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 mt-3">
                  <div className="mb-3">
                    <label className="form-label label_text">Remark</label>
                    <textarea
                      className="form-control rounded-0"
                      rows="3"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      maxLength={1000}
                    />
                  </div>
                </div>

                <div className="col-12 pt-3 mt-2">
                  <button 
                    type="submit" 
                    className="w-80 btn addbtn rounded-0 add_button m-2 px-4"
                    disabled={uploading}
                  >
                    Add
                  </button>
                  <button type="button" onClick={handleAdd} className="w-80 btn addbtn rounded-0 Cancel_button m-2 px-4">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMRFPopUp;