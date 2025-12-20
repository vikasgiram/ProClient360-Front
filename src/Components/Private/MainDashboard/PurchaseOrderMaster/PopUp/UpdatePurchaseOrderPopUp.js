import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { getVendors } from "../../../../../hooks/useVendor";
import { getProducts } from "../../../../../hooks/useProduct";
import { updatePurchaseOrder } from "../../../../../hooks/usePurchaseOrder";
import Select from "react-select";

const UpdatePurchaseOrderPopUp = ({ handleUpdate, selectedPO, projects }) => {
  // Parse the order date and time from the selectedPO
  const orderDateTime = selectedPO?.orderDate ? new Date(selectedPO.orderDate) : new Date();
  const [orderDate, setOrderDate] = useState(orderDateTime.toISOString().split('T')[0]);
  const [orderTime, setOrderTime] = useState(orderDateTime.toTimeString().slice(0, 5));
  
  const [orderNumber, setOrderNumber] = useState(selectedPO?.orderNumber || "");
  const [transactionType, setTransactionType] = useState(selectedPO?.transactionType || "");
  const [purchaseType, setPurchaseType] = useState(selectedPO?.purchaseType || "");
  const [selectedProject, setSelectedProject] = useState(null);
  const [warehouseLocation, setWarehouseLocation] = useState(selectedPO?.warehouseLocation || "");
  const [remark, setRemark] = useState(selectedPO?.remark || "");
  const [delivery, setDelivery] = useState(selectedPO?.delivery || "Free");
  const [advance, setAdvance] = useState(selectedPO?.paymentTerms?.advance || 0);
  const [creditPeriod, setCreditPeriod] = useState(selectedPO?.paymentTerms?.creditPeriod || 0);
  const [packagingInstructions, setPackagingInstructions] = useState(selectedPO?.packagingInstructions || "");
  const [status, setStatus] = useState(selectedPO?.status || "Pending");
  
  // New fields for transport and packaging
  const [transportCharges, setTransportCharges] = useState(selectedPO?.transportCharges || 0);
  const [packagingCharges, setPackagingCharges] = useState(selectedPO?.packagingCharges || 0);
  const [taxOnTransport, setTaxOnTransport] = useState(selectedPO?.taxOnTransport || 18);
  
  // New fields
  const [deliveryAddress, setDeliveryAddress] = useState(selectedPO?.deliveryAddress || "");
  const [location, setLocation] = useState(selectedPO?.location || "");
  const [termsDocument, setTermsDocument] = useState(null);
  
  // Vendor selection
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorSearch, setVendorSearch] = useState("");
  
  // Product related states
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [brands, setBrands] = useState([]);
  
  // Items
  const [items, setItems] = useState(selectedPO?.items || [{
    brandName: "",
    modelNo: "",
    description: "",
    unit: "",
    baseUOM: "",
    quantity: 1,
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
        
        // Set selected vendor if exists
        if (selectedPO?.vendor?._id) {
          const currentVendor = vendorOptions.find(v => v.value === selectedPO.vendor._id);
          if (currentVendor) {
            setSelectedVendor(currentVendor);
          }
        }
      }
    };
    loadVendors();
  }, [vendorSearch, selectedPO]);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts(1, 1000, productSearch);
      if (data.success) {
        setProducts(data.products);
        
        // Extract unique brands
        const uniqueBrands = [...new Set(data.products.map(p => p.brandName).filter(Boolean))];
        setBrands(uniqueBrands.map(brand => ({ value: brand, label: brand })));
      }
    };
    loadProducts();
  }, [productSearch]);

  // Set selected project
  useEffect(() => {
    if (selectedPO?.project?._id && projects.length > 0) {
      const currentProject = projects.find(p => p.value === selectedPO.project._id);
      if (currentProject) {
        setSelectedProject(currentProject);
      }
    }
  }, [selectedPO, projects]);

  // Calculate net value for an item
  const calculateNetValue = (item) => {
    const baseAmount = item.quantity * item.price;
    const discountAmount = baseAmount * (item.discountPercent / 100);
    const amountAfterDiscount = baseAmount - discountAmount;
    const taxAmount = amountAfterDiscount * (item.taxPercent / 100);
    return amountAfterDiscount + taxAmount;
  };

  // Add new item
  const handleAddItem = () => {
    setItems([...items, {
      brandName: "",
      modelNo: "",
      description: "",
      unit: "",
      baseUOM: "",
      quantity: 1,
      price: 0,
      discountPercent: 0,
      taxPercent: 0,
      netValue: 0
    }]);
  };

  // Remove item
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
        newItems[index].description = product.description || "";
        newItems[index].unit = product.baseUOM; 
      }
    }
    
    // Recalculate net value
    newItems[index].netValue = calculateNetValue(newItems[index]);
    
    setItems(newItems);
  };

  // Calculate totals
  const calculateTotals = () => {
    const totalAmount = items.reduce((sum, item) => {
      const baseAmount = item.quantity * item.price;
      const discountAmount = baseAmount * (item.discountPercent / 100);
      return sum + (baseAmount - discountAmount);
    }, 0);

    const totalTax = items.reduce((sum, item) => {
      const baseAmount = item.quantity * item.price;
      const discountAmount = baseAmount * (item.discountPercent / 100);
      const amountAfterDiscount = baseAmount - discountAmount;
      return sum + (amountAfterDiscount * (item.taxPercent / 100));
    }, 0);

    // Calculate tax on transport
    const taxOnTransportAmount = transportCharges * (taxOnTransport / 100);
    
    // Calculate grand total including transport and packaging charges
    const grandTotal = totalAmount + totalTax + transportCharges + taxOnTransportAmount + packagingCharges;

    return { 
      totalAmount, 
      totalTax: totalTax + taxOnTransportAmount, 
      grandTotal 
    };
  };

  const { totalAmount, totalTax, grandTotal } = calculateTotals();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
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

    // Validate items
    for (let item of items) {
      if (!item.brandName || !item.modelNo || item.quantity < 1 || item.price < 0) {
        return toast.error("Please fill all item details correctly");
      }
    }

    // Combine date and time
    const orderDateTime = new Date(`${orderDate}T${orderTime}`);

    const poData = {
      _id: selectedPO._id,
      vendor: selectedVendor.value,
      orderDate: orderDateTime,
      orderNumber,
      transactionType,
      purchaseType,
      project: purchaseType === "Project Purchase" ? selectedProject?.value : undefined,
      warehouseLocation: purchaseType === "Stock" ? warehouseLocation : undefined,
      // New fields
      deliveryAddress,
      location,
      items,
      totalAmount,
      totalTax,
      transportCharges,
      packagingCharges,
      taxOnTransport,
      grandTotal,
      remark,
      delivery,
      paymentTerms: {
        advance,
        creditPeriod
      },
      packagingInstructions,
      status
    };

    // Handle file upload if terms document is provided
    if (termsDocument) {
      const formData = new FormData();
      formData.append('file', termsDocument);
      formData.append('poData', JSON.stringify(poData));
      
      toast.loading("Updating Purchase Order...");
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/purchaseOrder/upload/${selectedPO._id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        const data = await response.json();
        toast.dismiss();

        if (data.success) {
          toast.success(data.message);
          handleUpdate();
        } else {
          toast.error(data.error || "Failed to update purchase order");
        }
      } catch (error) {
        toast.dismiss();
        toast.error("Failed to upload document");
      }
    } else {
      toast.loading("Updating Purchase Order...");
      const data = await updatePurchaseOrder(poData);
      toast.dismiss();

      if (data.success) {
        toast.success(data.message);
        handleUpdate();
      } else {
        toast.error(data.error || "Failed to update purchase order");
      }
    }
  };

  return (
    <div className="modal fade show" style={{ display: "flex", alignItems: "center", backgroundColor: "#00000090" }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content p-3">
          <form onSubmit={handleSubmit}>
            <div className="modal-header pt-0">
              <h5 className="card-title fw-bold">Update Purchase Order</h5>
              <button onClick={handleUpdate} type="button" className="close px-3" style={{ marginLeft: "auto" }}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <div className="row modal_body_height">
                
                {/* Vendor Selection */}
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
                      required
                    />
                  </div>
                </div>

                {/* Order Date */}
                <div className="col-12 col-lg-3">
                  <div className="mb-3">
                    <label className="form-label label_text">Order Date <RequiredStar /></label>
                    <input
                      type="date"
                      className="form-control rounded-0"
                      value={orderDate}
                      onChange={(e) => setOrderDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Order Time */}
                <div className="col-12 col-lg-3">
                  <div className="mb-3">
                    <label className="form-label label_text">Order Time <RequiredStar /></label>
                    <input
                      type="time"
                      className="form-control rounded-0"
                      value={orderTime}
                      onChange={(e) => setOrderTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Order Number */}
                <div className="col-12 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label label_text">Order Number <RequiredStar /></label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="Order Number"
                      required
                      readOnly
                    />
                  </div>
                </div>

                {/* Transaction Type */}
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

                {/* Purchase Type */}
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

                {/* Status */}
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
                      <option value="Approved">Approved</option>
                      <option value="Partially Received">Partially Received</option>
                      <option value="Received">Received</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Conditional Fields */}
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

                {/* New fields */}
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

                <div className="col-12 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label label_text">Terms & Conditions Document</label>
                    <input
                      type="file"
                      className="form-control rounded-0"
                      onChange={(e) => setTermsDocument(e.target.files[0])}
                      accept=".pdf,.doc,.docx"
                    />
                    {selectedPO?.attachments && selectedPO.attachments.length > 0 && (
                      <small className="text-muted">
                        Current document: {selectedPO.attachments[0].split('/').pop()}
                      </small>
                    )}
                  </div>
                </div>

                {/* Item Details Section */}
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
                          <th>Model No</th>
                          <th>Description</th>
                          <th>Unit</th>
                          <th>Base UOM</th>
                          <th>Quantity</th>
                          <th>Price (INR/USD)</th>
                          <th>Discount %</th>
                          <th>Tax %</th>
                          <th>Net Value</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => {
                          // Get models for the current brand
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
                                  className="react-select-container"
                                  classNamePrefix="react-select"
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
                                  className="react-select-container"
                                  classNamePrefix="react-select"
                                  isDisabled={!item.brandName}
                                  required
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  value={item.description}
                                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                  rows="1"
                                  placeholder="Item description"
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
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={item.price}
                                  onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                                  min="0"
                                  step="0.01"
                                  required
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={item.discountPercent}
                                  onChange={(e) => handleItemChange(index, 'discountPercent', Number(e.target.value))}
                                  min="0"
                                  max="100"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={item.taxPercent}
                                  onChange={(e) => handleItemChange(index, 'taxPercent', Number(e.target.value))}
                                  min="0"
                                  max="100"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={item.netValue.toFixed(2)}
                                  readOnly
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
                      <tfoot>
                        <tr>
                          <td colSpan="8" className="text-end fw-bold">Total</td>
                          <td className="fw-bold">{totalAmount.toFixed(2)}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td colSpan="8" className="text-end fw-bold">Tax Amount</td>
                          <td className="fw-bold">{totalTax.toFixed(2)}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td colSpan="8" className="text-end fw-bold">Grand Total</td>
                          <td className="fw-bold">{grandTotal.toFixed(2)}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="col-12 mt-3">
                  <h6 className="fw-bold">Additional Charges</h6>
                  
                  <div className="row">
                    <div className="col-12 col-lg-4">
                      <div className="mb-3">
                        <label className="form-label label_text">Transport Charges (Rs.)</label>
                        <input
                          type="number"
                          className="form-control rounded-0"
                          value={transportCharges}
                          onChange={(e) => setTransportCharges(Number(e.target.value))}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="col-12 col-lg-4">
                      <div className="mb-3">
                        <label className="form-label label_text">Packaging Charges (Rs.)</label>
                        <input
                          type="number"
                          className="form-control rounded-0"
                          value={packagingCharges}
                          onChange={(e) => setPackagingCharges(Number(e.target.value))}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="col-12 col-lg-4">
                      <div className="mb-3">
                        <label className="form-label label_text">Tax on Transport (%)</label>
                        <input
                          type="number"
                          className="form-control rounded-0"
                          value={taxOnTransport}
                          onChange={(e) => setTaxOnTransport(Number(e.target.value))}
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="col-12 mt-3">
                  <h6 className="fw-bold">Terms and Conditions</h6>
                  
                  <div className="row">
                    <div className="col-12 col-lg-4">
                      <div className="mb-3">
                        <label className="form-label label_text">Delivery</label>
                        <select
                          className="form-select rounded-0"
                          value={delivery}
                          onChange={(e) => setDelivery(e.target.value)}
                        >
                          <option value="Free">Free</option>
                          <option value="Chargable">Chargable</option>
                          <option value="At actual">At actual</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-12 col-lg-4">
                      <div className="mb-3">
                        <label className="form-label label_text">Payment Terms - Advance %</label>
                        <input
                          type="number"
                          className="form-control rounded-0"
                          value={advance}
                          onChange={(e) => setAdvance(Number(e.target.value))}
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>

                    <div className="col-12 col-lg-4">
                      <div className="mb-3">
                        <label className="form-label label_text">Credit Period (Days)</label>
                        <input
                          type="number"
                          className="form-control rounded-0"
                          value={creditPeriod}
                          onChange={(e) => setCreditPeriod(Number(e.target.value))}
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="mb-3">
                        <label className="form-label label_text">Packaging Instructions</label>
                        <textarea
                          className="form-control rounded-0"
                          rows="2"
                          value={packagingInstructions}
                          onChange={(e) => setPackagingInstructions(e.target.value)}
                          maxLength={500}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remark */}
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

                {/* Buttons */}
                <div className="col-12 pt-3 mt-2">
                  <button type="submit" className="w-80 btn addbtn rounded-0 add_button m-2 px-4">
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

export default UpdatePurchaseOrderPopUp;