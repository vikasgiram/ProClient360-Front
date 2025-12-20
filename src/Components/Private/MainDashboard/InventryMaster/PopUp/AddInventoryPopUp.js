import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { RequiredStar } from "../../../RequiredStar/RequiredStar";

const AddInventoryPopup = ({ onAddInventory, onClose }) => {
  const [formData, setFormData] = useState({
    materialCode: '',
    hsmCode: '',
    materialName: '',
    category: 'Raw Material',
    unit: '',
    unitPrice: '',
    gstPercentage: '',
    currentStock: '',
    minStockLevel: '',
    maxStockLevel: '',
    warehouseLocation: '',
    stockLocation: '',
    description: ''
  });

  const categories = ['Raw Material', 'Finished Goods', 'Repairing Material', 'Scrap'];
  const units = ['Pcs', 'Kg', 'Ltr', 'Mtr', 'Box', 'Set', 'Pair', 'Roll', 'Sheet', 'Bag'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      materialCode,
      hsmCode,
      materialName,
      category,
      unit,
      unitPrice,
      gstPercentage,
      currentStock,
      minStockLevel
    } = formData;

    // Validation
    if (!materialCode || !hsmCode || !materialName || !category || !unit || !unitPrice || !gstPercentage || !currentStock || !minStockLevel) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate numeric fields
    if (parseFloat(unitPrice) < 0) {
      toast.error('Unit price must be greater than or equal to 0');
      return;
    }

    if (parseFloat(gstPercentage) < 0 || parseFloat(gstPercentage) > 100) {
      toast.error('GST Percentage must be between 0 and 100');
      return;
    }

    if (parseInt(currentStock) < 0) {
      toast.error('Current stock must be greater than or equal to 0');
      return;
    }

    if (parseInt(minStockLevel) < 0) {
      toast.error('Min stock level must be greater than or equal to 0');
      return;
    }

    if (formData.maxStockLevel && parseInt(formData.maxStockLevel) <= parseInt(minStockLevel)) {
      toast.error('Max stock level must be greater than min stock level');
      return;
    }

    onAddInventory(formData);
  };

  return (
    <>
      <div className="modal fade show" style={{ display: "flex", alignItems: "center", backgroundColor: "#00000090" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content p-3">
            <form onSubmit={handleSubmit}>
              <div className="modal-header pt-0">
                <h5 className="card-title fw-bold">Add Inventory Material</h5>
                <button onClick={onClose} type="button" className="btn-close" aria-label="Close" style={{ backgroundColor: 'red' }}></button>
              </div>

              <div className="modal-body" style={{ maxHeight: 'calc(80vh - 240px)', overflowY: 'auto' }}>
                <div className="row g-3">
                  
                  {/* Material Code */}
                  <div className="col-md-6">
                    <label htmlFor="materialCode" className="form-label">Material Code <RequiredStar /></label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="materialCode" 
                      name="materialCode" 
                      placeholder="Enter Material Code...." 
                      maxLength={50} 
                      value={formData.materialCode} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  {/* HSM Code */}
                  <div className="col-md-6">
                    <label htmlFor="hsmCode" className="form-label">HSM Code <RequiredStar /></label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="hsmCode" 
                      name="hsmCode" 
                      placeholder="Enter HSM Code...." 
                      maxLength={50} 
                      value={formData.hsmCode} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  {/* Material Description */}
                  <div className="col-md-6">
                    <label htmlFor="materialName" className="form-label">Material Description <RequiredStar /></label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="materialName" 
                      name="materialName" 
                      placeholder="Enter Material Description...." 
                      maxLength={100} 
                      value={formData.materialName} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  {/* Category */}
                  <div className="col-md-6">
                    <label htmlFor="category" className="form-label">Category <RequiredStar /></label>
                    <select 
                      id="category" 
                      className="form-select" 
                      name="category" 
                      value={formData.category} 
                      onChange={handleInputChange}
                      required
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  {/* Unit */}
                  <div className="col-md-6">
                    <label htmlFor="unit" className="form-label">Unit <RequiredStar /></label>
                    <select 
                      id="unit" 
                      className="form-select" 
                      name="unit" 
                      value={formData.unit} 
                      onChange={handleInputChange}
                      required
                    >
                      {units.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>

                  {/* Purchase Price */}
                  <div className="col-md-6">
                    <label htmlFor="unitPrice" className="form-label">Purchase Price (₹) <RequiredStar /></label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="unitPrice" 
                      name="unitPrice" 
                      placeholder="Enter Purchase Price...." 
                      min="0"
                      step="0.01"
                      value={formData.unitPrice} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  {/* GST Percentage */}
                  <div className="col-md-6">
                    <label htmlFor="gstPercentage" className="form-label">GST Percentage (%) <RequiredStar /></label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="gstPercentage" 
                      name="gstPercentage" 
                      placeholder="Enter GST Percentage...." 
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.gstPercentage} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  {/* Current Stock */}
                  <div className="col-md-6">
                    <label htmlFor="currentStock" className="form-label">Current Stock <RequiredStar /></label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="currentStock" 
                      name="currentStock" 
                      placeholder="Enter Current Stock...." 
                      min="0"
                      value={formData.currentStock} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  {/* Min Stock Level */}
                  <div className="col-md-6">
                    <label htmlFor="minStockLevel" className="form-label">Min Stock Level <RequiredStar /></label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="minStockLevel" 
                      name="minStockLevel" 
                      placeholder="Enter Min Stock Level...." 
                      min="0"
                      value={formData.minStockLevel} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  {/* Max Stock Level */}
                  <div className="col-md-6">
                    <label htmlFor="maxStockLevel" className="form-label">Max Stock Level</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="maxStockLevel" 
                      name="maxStockLevel" 
                      placeholder="Enter Max Stock Level...." 
                      min="0"
                      value={formData.maxStockLevel} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  {/* Warehouse Location */}
                  <div className="col-md-6">
                    <label htmlFor="warehouseLocation" className="form-label">Warehouse Location</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="warehouseLocation" 
                      name="warehouseLocation" 
                      placeholder="e.g., Warehouse A..." 
                      maxLength={100} 
                      value={formData.warehouseLocation} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  {/* Rack Location */}
                  <div className="col-md-6">
                    <label htmlFor="stockLocation" className="form-label">Rack Location</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="stockLocation" 
                      name="stockLocation" 
                      placeholder="e.g., Rack 1..." 
                      maxLength={100} 
                      value={formData.stockLocation} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  {/* Description */}
                  <div className="col-12">
                    <label htmlFor="description" className="form-label">Description / Remarks</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      placeholder="Enter material description, specifications, or remarks...."
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

export default AddInventoryPopup;