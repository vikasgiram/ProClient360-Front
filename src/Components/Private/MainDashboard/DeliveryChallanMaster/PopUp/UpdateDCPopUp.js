import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { getCustomers } from "../../../../../hooks/useCustomer";
import { getProducts } from "../../../../../hooks/useProduct";
import { updateDeliveryChallan } from "../../../../../hooks/useDC";
import axios from "axios";
import Select from "react-select";

const PAGE_SIZE = 15;

const UpdateDCPopUp = ({ handleUpdate, selectedDC, projects }) => {
  const dcDateTime = selectedDC?.dcDate ? new Date(selectedDC.dcDate) : new Date();
  const [dcDate, setDcDate] = useState(dcDateTime.toISOString().split('T')[0]);
  const [dcNumber, setDcNumber] = useState(selectedDC?.dcNumber || "");
  const [choice, setChoice] = useState(selectedDC?.choice || "");
  const [poNumber, setPoNumber] = useState(selectedDC?.poNumber || "");
  const [projectPurchaseOrderNumber, setProjectPurchaseOrderNumber] = useState(selectedDC?.projectPurchaseOrderNumber || "");
  const [transactionType, setTransactionType] = useState(selectedDC?.transactionType || "");
  const [purchaseType, setPurchaseType] = useState(selectedDC?.purchaseType || "");
  const [selectedProject, setSelectedProject] = useState(null);
  const [warehouseLocation, setWarehouseLocation] = useState(selectedDC?.warehouseLocation || "");
  const [remark, setRemark] = useState(selectedDC?.remark || "");
  const [status, setStatus] = useState(selectedDC?.status || "Pending");
  const [deliveryAddress, setDeliveryAddress] = useState(selectedDC?.deliveryAddress || "");
  const [location, setLocation] = useState(selectedDC?.location || "");
  const [attachments, setAttachments] = useState(selectedDC?.attachments || []);
  const [uploading, setUploading] = useState(false);
  
  // Customer dropdown state with pagination
  const [custOptions, setCustOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [custPage, setCustPage] = useState(1);
  const [custHasMore, setCustHasMore] = useState(true);
  const [custLoading, setCustLoading] = useState(false);
  const [custSearch, setCustSearch] = useState("");
  
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [brands, setBrands] = useState([]);
  
  const [items, setItems] = useState(selectedDC?.items || [{
    brandName: "",
    modelNo: "",
    quantity: 1,
    unit: "",
    baseUOM: ""
  }]);

  // Load customers with pagination & search
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

  // Set initial customer selection
  useEffect(() => {
    if (selectedDC?.customer?._id && custOptions.length > 0) {
      const currentCustomer = custOptions.find(c => c.value === selectedDC.customer._id);
      if (currentCustomer) {
        setSelectedCustomer(currentCustomer);
      }
    }
  }, [selectedDC, custOptions]);

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

  // Set selected project
  useEffect(() => {
    if (selectedDC?.project?._id && projects.length > 0) {
      const currentProject = projects.find(p => p.value === selectedDC.project._id);
      if (currentProject) {
        setSelectedProject(currentProject);
      }
    }
  }, [selectedDC, projects]);

  const handleAddItem = () => {
    setItems([...items, {
      brandName: "",
      modelNo: "",
      quantity: 1,
      unit: "",
      baseUOM: ""
    }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  // Updated handleItemChange function to automatically set baseUOM
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // If brand is changed, clear model and baseUOM
    if (field === 'brandName') {
      newItems[index].modelNo = "";
      newItems[index].baseUOM = "";
    }
    
    // If model is changed, find the product and set baseUOM
    if (field === 'modelNo' && value && newItems[index].brandName) {
      const product = products.find(
        p => p.brandName === newItems[index].brandName && p.model === value
      );
      if (product) {
        newItems[index].baseUOM = product.baseUOM;
        // You can also pre-fill other fields if needed
        newItems[index].unit = product.baseUOM; 
      }
    }
    
    setItems(newItems);
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      // Simple approach - just store file info without uploading
      const fileInfos = files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        // Create a temporary URL for preview
        url: URL.createObjectURL(file),
        // Store the file object for later upload
        file: file
      }));
      
      setAttachments(prev => [...prev, ...fileInfos]);
      toast.success("Files attached successfully");
    } catch (error) {
      console.error('File handling error:', error);
      toast.error("Failed to attach files: " + error.message);
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

    if (!dcDate) {
      return toast.error("Please select DC date");
    }

    if (purchaseType === "Project Purchase" && !selectedProject) {
      return toast.error("Please select a project");
    }

    if (purchaseType === "Stock" && !warehouseLocation) {
      return toast.error("Please enter warehouse location");
    }

    for (let item of items) {
      if (!item.brandName || !item.modelNo || item.quantity < 1) {
        return toast.error("Please fill all item details correctly");
      }
    }

    // Prepare delivery challan data
    const dcData = {
      _id: selectedDC._id,
      dcDate: new Date(dcDate),
      dcNumber,
      choice,
      poNumber,
      projectPurchaseOrderNumber,
      customer: selectedCustomer.value,
      transactionType,
      purchaseType,
      project: purchaseType === "Project Purchase" ? selectedProject?.value : undefined,
      warehouseLocation: purchaseType === "Stock" ? warehouseLocation : undefined,
      deliveryAddress,
      location,
      items,
      remark,
      status,
      attachments: attachments.map(att => ({
        name: att.name,
        type: att.type,
        size: att.size,
        url: att.url
      }))
    };

    toast.loading("Updating Delivery Challan...");
    
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/dc/${selectedDC._id}`, dcData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      toast.dismiss();
      
      if (response.data.success) {
        toast.success(response.data.message);
        handleUpdate();
      } else {
        toast.error(response.data.error || "Failed to update delivery challan");
      }
    } catch (error) {
      toast.dismiss();
      console.error('Submission error:', error);
      toast.error("Failed to update delivery challan: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="modal fade show" style={{ display: "flex", alignItems: "center", backgroundColor: "#00000090" }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content p-3">
          <form onSubmit={handleSubmit}>
            <div className="modal-header pt-0">
              <h5 className="card-title fw-bold">Update Delivery Challan</h5>
              <button onClick={handleUpdate} type="button" className="close px-3" style={{ marginLeft: "auto" }}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <div className="row modal_body_height">
                
                <div className="col-12 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label label_text">DC Number <RequiredStar /></label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      value={dcNumber}
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-12 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label label_text">Choice <RequiredStar /></label>
                    <select
                      className="form-select rounded-0"
                      value={choice}
                      onChange={(e) => setChoice(e.target.value)}
                      required
                    >
                      <option value="">Select Choice</option>
                      <option value="DC Delivery chalan">DC Delivery chalan</option>
                      <option value="returnable chalan">returnable chalan</option>
                      <option value="Rejected returnable chalan">Rejected returnable chalan</option>
                      <option value="scrap chalan">scrap chalan</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label label_text">PO No.</label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      placeholder="PO Number (Optional)"
                    />
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
                    <label className="form-label label_text">DC Date <RequiredStar /></label>
                    <input
                      type="date"
                      className="form-control rounded-0"
                      value={dcDate}
                      onChange={(e) => setDcDate(e.target.value)}
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
                    <label className="form-label label_text">Status <RequiredStar /></label>
                    <select
                      className="form-select rounded-0"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Returned">Returned</option>
                      <option value="Cancelled">Cancelled</option>
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
                          <th>unit</th>
                          <th>Base UOM</th>
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
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={item.baseUOM}
                                  onChange={(e) => handleItemChange(index, 'baseUOM', e.target.value)}
                                  placeholder="Base UOM"
                                  required
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
                    Update
                  </button>
                  <button type="button" onClick={handleUpdate} className="w-80 btn addbtn rounded-0 Cancel_button m-2 px-4">
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

export default UpdateDCPopUp;