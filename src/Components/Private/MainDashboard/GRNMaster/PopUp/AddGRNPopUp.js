import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { getVendors } from "../../../../../hooks/useVendor";
import { getProducts } from "../../../../../hooks/useProduct";
import { getPurchaseOrders } from "../../../../../hooks/usePurchaseOrder";
import { createGRN } from "../../../../../hooks/useGRN";
import axios from "axios";
import Select from "react-select";

const AddGRNPopUp = ({ handleAdd, projects }) => {
  const [grnDate, setGrnDate] = useState(new Date().toISOString().split('T')[0]);
  const [choice, setChoice] = useState("");
  const [selectedPO, setSelectedPO] = useState(null);
  const [transactionType, setTransactionType] = useState("");
  const [purchaseType, setPurchaseType] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [warehouseLocation, setWarehouseLocation] = useState("");
  const [remark, setRemark] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [location, setLocation] = useState("");
  const [termsDocument, setTermsDocument] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorSearch, setVendorSearch] = useState("");
  
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [poSearch, setPoSearch] = useState("");
  
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  
  const [items, setItems] = useState([{
    brandName: "",
    modelNo: "",
    description: "",
    unit: "",
    baseUOM: "",
    orderedQuantity: 0,
    receivedQuantity: 0,
    price: 0,
    discountPercent: 0,
    taxPercent: 0,
    netValue: 0
  }]);

  // Load vendors
  useEffect(() => {
    const loadVendors = async () => {
      const data = await getVendors(1, 100, vendorSearch);
      if (data.success) {
        const vendorOptions = data.vendors.map(v => ({
          value: v._id,
          label: `${v.vendorName} - ${v.email}`
        }));
        setVendors(vendorOptions);
      }
    };
    loadVendors();
  }, [vendorSearch]);

  // Load purchase orders
  useEffect(() => {
    const loadPurchaseOrders = async () => {
      const data = await getPurchaseOrders(1, 100, poSearch);
      if (data.success) {
        const poOptions = data.purchaseOrders.map(po => ({
          value: po._id,
          label: `${po.orderNumber} - ${po.vendor?.vendorName}`,
          po: po
        }));
        setPurchaseOrders(poOptions);
      }
    };
    if (choice === "Against PO") {
      loadPurchaseOrders();
    }
  }, [poSearch, choice]);

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
    if (choice === "Direct Material") {
      loadProducts();
    }
  }, [productSearch, choice]);

  // Handle PO Selection
  const handlePOChange = (selected) => {
    setSelectedPO(selected);
    if (selected && selected.po) {
      const po = selected.po;
      setSelectedVendor(vendors.find(v => v.value === po.vendor._id));
      setTransactionType(po.transactionType);
      setPurchaseType(po.purchaseType);
      setDeliveryAddress(po.deliveryAddress || "");
      setLocation(po.location || "");
      setWarehouseLocation(po.warehouseLocation || "");
      
      if (po.project) {
        setSelectedProject(projects.find(p => p.value === po.project._id));
      }
      
      // Map PO items to GRN items
      const grnItems = po.items.map(item => ({
        brandName: item.brandName,
        modelNo: item.modelNo,
        description: item.description || "",
        unit: item.unit,
        baseUOM: item.baseUOM || "",
        orderedQuantity: item.quantity,
        receivedQuantity: item.quantity,
        price: item.price,
        discountPercent: item.discountPercent,
        taxPercent: item.taxPercent,
        netValue: calculateNetValue({
          receivedQuantity: item.quantity,
          price: item.price,
          discountPercent: item.discountPercent,
          taxPercent: item.taxPercent
        })
      }));
      setItems(grnItems);
    }
  };

  const calculateNetValue = (item) => {
    const baseAmount = item.receivedQuantity * item.price;
    const discountAmount = baseAmount * (item.discountPercent / 100);
    const amountAfterDiscount = baseAmount - discountAmount;
    const taxAmount = amountAfterDiscount * (item.taxPercent / 100);
    return amountAfterDiscount + taxAmount;
  };

  const handleAddItem = () => {
    setItems([...items, {
      brandName: "",
      modelNo: "",
      description: "",
      unit: "",
      baseUOM: "",
      orderedQuantity: 0,
      receivedQuantity: 0,
      price: 0,
      discountPercent: 0,
      taxPercent: 0,
      netValue: 0
    }]);
    setModels([]);
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
    
    // If brand is changed, update models list and clear model and baseUOM
    if (field === 'brandName') {
      if (value) {
        const brandProducts = products.filter(p => p.brandName === value);
        const uniqueModels = [...new Set(brandProducts.map(p => p.model).filter(Boolean))];
        setModels(uniqueModels.map(model => ({ value: model, label: model })));
      } else {
        setModels([]);
      }
      // Clear model and baseUOM when brand changes
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
        newItems[index].description = product.description || "";
        newItems[index].unit = product.baseUOM; // Set unit to baseUOM by default
      }
    }
    
    newItems[index].netValue = calculateNetValue(newItems[index]);
    setItems(newItems);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (file.size > maxSize) {
        toast.error("File size exceeds 5MB limit");
        return;
      }
      
      setTermsDocument(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!choice) {
      return toast.error("Please select choice (Against PO or Direct Material)");
    }

    if (choice === "Against PO" && !selectedPO) {
      return toast.error("Please select a purchase order");
    }

    if (!selectedVendor) {
      return toast.error("Please select a vendor");
    }

    if (!transactionType || !purchaseType) {
      return toast.error("Please fill all required fields");
    }

    if (purchaseType === "Project Purchase" && !selectedProject) {
      return toast.error("Please select a project");
    }

    if (purchaseType === "Stock" && !warehouseLocation) {
      return toast.error("Please enter warehouse location");
    }

    for (let item of items) {
      if (!item.brandName || !item.modelNo || item.receivedQuantity < 0) {
        return toast.error("Please fill all item details correctly");
      }
    }

    const grnData = {
      grnDate: new Date(grnDate),
      choice,
      purchaseOrder: choice === "Against PO" ? selectedPO.value : undefined,
      vendor: selectedVendor.value,
      transactionType,
      purchaseType,
      project: purchaseType === "Project Purchase" ? selectedProject?.value : undefined,
      warehouseLocation: purchaseType === "Stock" ? warehouseLocation : undefined,
      deliveryAddress,
      location,
      items,
      remark,
    };

    if (termsDocument) {
      const formData = new FormData();
      formData.append('file', termsDocument);
      formData.append('grnData', JSON.stringify(grnData));
      
      setUploading(true);
      toast.loading("Creating GRN...");
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/grn/with-document`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        toast.dismiss();
        const data = response.data;

        if (data.success) {
          toast.success(data.message);
          handleAdd();
        } else {
          toast.error(data.error || "Failed to create GRN");
        }
      } catch (error) {
        toast.dismiss();
        console.error('Upload error:', error);
        if (error.response) {
          // Server responded with error status
          toast.error(`Server error: ${error.response.status} - ${error.response.data.error || error.response.data.message}`);
        } else if (error.request) {
          // Request made but no response received
          toast.error('Network error: No response from server. Please check your connection.');
        } else {
          // Error in request setup
          toast.error('Request error: ' + error.message);
        }
      } finally {
        setUploading(false);
      }
    } else {
      toast.loading("Creating GRN...");
      const data = await createGRN(grnData);
      toast.dismiss();

      if (data.success) {
        toast.success(data.message);
        handleAdd();
      } else {
        toast.error(data.error || "Failed to create GRN");
      }
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal fade show" style={{ display: "flex", alignItems: "center", backgroundColor: "#00000090" }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content p-3">
          <form onSubmit={handleSubmit}>
            <div className="modal-header pt-0">
              <h5 className="card-title fw-bold">Create New GRN (Goods Receipt Note)</h5>
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
                      <option value="Against PO">Against PO</option>
                      <option value="Direct Material">Direct Material</option>
                    </select>
                  </div>
                </div>

                {choice === "Against PO" && (
                  <div className="col-12 col-lg-6">
                    <div className="mb-3">
                      <label className="form-label label_text">PO No. <RequiredStar /></label>
                      <Select
                        value={selectedPO}
                        onChange={handlePOChange}
                        onInputChange={setPoSearch}
                        options={purchaseOrders}
                        placeholder="Select Purchase Order..."
                        isClearable
                        className="react-select-container"
                        classNamePrefix="react-select"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="col-12 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label label_text">GRN Date <RequiredStar /></label>
                    <input
                      type="date"
                      className="form-control rounded-0"
                      value={grnDate}
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        const currentDate = new Date();
                        currentDate.setHours(0, 0, 0, 0);
                        
                        if (selectedDate <= currentDate) {
                          setGrnDate(e.target.value);
                        } else {
                          setGrnDate(today);
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
                    <label className="form-label label_text">Vendor Name <RequiredStar /></label>
                    <Select
                      value={selectedVendor}
                      onChange={setSelectedVendor}
                      onInputChange={setVendorSearch}
                      options={vendors}
                      placeholder="Select Vendor..."
                      isClearable
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isDisabled={choice === "Against PO"}
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
                      disabled={choice === "Against PO"}
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
                      disabled={choice === "Against PO"}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Project Purchase">Project Purchase</option>
                      <option value="Stock">Stock</option>
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
                        isDisabled={choice === "Against PO"}
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
                        disabled={choice === "Against PO"}
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
                      disabled={choice === "Against PO"}
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
                      disabled={choice === "Against PO"}
                    />
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label label_text">Document</label>
                    <input
                      type="file"
                      className="form-control rounded-0"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                    {termsDocument && (
                      <small className="text-success d-block mt-1">
                        Selected file: {termsDocument.name}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-12 mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold">Item Details</h6>
                    {choice === "Direct Material" && (
                      <button type="button" className="btn btn-sm btn-primary" onClick={handleAddItem}>
                        <i className="fa fa-plus"></i> Add Item
                      </button>
                    )}
                  </div>

                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Brand Name</th>
                          <th>Model No</th>
                          <th>unit</th>
                          <th>Ordered Qty</th>
                          <th>Received Qty</th>
                          <th>Remark</th>
                          {choice === "Direct Material" && <th>Action</th>}
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
                                {choice === "Against PO" ? (
                                  <input type="text" className="form-control form-control-sm" value={item.brandName} readOnly />
                                ) : (
                                  <Select
                                    value={brands.find(b => b.value === item.brandName) || null}
                                    onChange={(selected) => handleItemChange(index, 'brandName', selected ? selected.value : "")}
                                    options={brands}
                                    placeholder="Select Brand..."
                                    isClearable
                                    required
                                  />
                                )}
                              </td>
                              <td>
                                {choice === "Against PO" ? (
                                  <input type="text" className="form-control form-control-sm" value={item.modelNo} readOnly />
                                ) : (
                                  <Select
                                    value={modelOptions.find(m => m.value === item.modelNo) || null}
                                    onChange={(selected) => handleItemChange(index, 'modelNo', selected ? selected.value : "")}
                                    options={modelOptions}
                                    placeholder="Select Model..."
                                    isClearable
                                    isDisabled={!item.brandName}
                                    required
                                  />
                                )}
                              </td>
                              
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={item.baseUOM}
                                  onChange={(e) => handleItemChange(index, 'baseUOM', e.target.value)}
                                  placeholder="Base UOM"
                                  disabled={choice === "Against PO"}
                                  required
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={item.orderedQuantity}
                                  onChange={(e) => handleItemChange(index, 'orderedQuantity', Number(e.target.value))}
                                  min="0"
                                  disabled={choice === "Against PO"}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={item.receivedQuantity}
                                  onChange={(e) => handleItemChange(index, 'receivedQuantity', Number(e.target.value))}
                                  min="0"
                                  required
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  value={item.description}
                                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                  rows="1"
                                  disabled={choice === "Against PO"}
                                />
                              </td>
                              {choice === "Direct Material" && (
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
                              )}
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

export default AddGRNPopUp;