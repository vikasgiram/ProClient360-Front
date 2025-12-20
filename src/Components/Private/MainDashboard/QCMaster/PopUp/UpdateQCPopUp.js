import { useState } from "react";
import toast from "react-hot-toast";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { updateQualityInspection } from "../../../../../hooks/useQC";

const UpdateQCPopUp = ({ handleUpdate, selectedQC }) => {
  const qcDateTime = selectedQC?.qcDate ? new Date(selectedQC.qcDate) : new Date();
  const [qcDate, setQcDate] = useState(qcDateTime.toISOString().split('T')[0]);
  const [qcNumber, setQcNumber] = useState(selectedQC?.qcNumber || "");
  const [grnNumber, setGrnNumber] = useState(selectedQC?.grnNumber || "");
  const [status, setStatus] = useState(selectedQC?.status || "Pending");
  
  const [items, setItems] = useState(selectedQC?.items || [{
    brandName: "",
    modelNo: "",
    receivedQuantity: 0,
    unit: "",
    baseUOM: "",
    qcOkQuantity: 0,
    faultyQuantity: 0,
    remark: ""
  }]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Auto-calculate faulty quantity
    if (field === 'qcOkQuantity') {
      const qcOk = Number(value) || 0;
      const received = newItems[index].receivedQuantity;
      newItems[index].faultyQuantity = Math.max(0, received - qcOk);
    }
    
    // If faulty quantity changes, adjust OK quantity
    if (field === 'faultyQuantity') {
      const faulty = Number(value) || 0;
      const received = newItems[index].receivedQuantity;
      newItems[index].qcOkQuantity = Math.max(0, received - faulty);
    }
    
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate items
    for (let item of items) {
      const total = item.qcOkQuantity + item.faultyQuantity;
      if (total !== item.receivedQuantity) {
        return toast.error(`QC OK + Faulty must equal received quantity for ${item.brandName} ${item.modelNo}`);
      }
    }

    const qcData = {
      _id: selectedQC._id,
      qcDate: new Date(qcDate),
      qcNumber,
      items,
      status
    };

    toast.loading("Updating Quality Inspection...");
    const data = await updateQualityInspection(qcData);
    toast.dismiss();

    if (data.success) {
      toast.success(data.message);
      handleUpdate();
    } else {
      toast.error(data.error || "Failed to update quality inspection");
    }
  };

  return (
    <div className="modal fade show" style={{ display: "flex", alignItems: "center", backgroundColor: "#00000090" }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content p-3">
          <form onSubmit={handleSubmit}>
            <div className="modal-header pt-0">
              <h5 className="card-title fw-bold">Update Quality Inspection Report</h5>
              <button onClick={handleUpdate} type="button" className="close px-3" style={{ marginLeft: "auto" }}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <div className="row modal_body_height">
                
                <div className="col-12 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label label_text">QC Number <RequiredStar /></label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      value={qcNumber}
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-12 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label label_text">GRN Number <RequiredStar /></label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      value={grnNumber}
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-12 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label label_text">QC Date <RequiredStar /></label>
                    <input
                      type="date"
                      className="form-control rounded-0"
                      value={qcDate}
                      onChange={(e) => setQcDate(e.target.value)}
                      required
                    />
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
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 mt-3">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>Brand Name</th>
                          <th>Model no</th>
                          <th>Received Quantity<br/>(GRN QTY)</th>
                          <th>unit</th>
                          <th>Base UOM</th>
                          <th>QC OK qty</th>
                          <th>faulty qty</th>
                          <th>remark</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <input 
                                type="text" 
                                className="form-control form-control-sm" 
                                value={item.brandName} 
                                readOnly 
                              />
                            </td>
                            <td>
                              <input 
                                type="text" 
                                className="form-control form-control-sm" 
                                value={item.modelNo} 
                                readOnly 
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                className="form-control form-control-sm bg-light" 
                                value={item.receivedQuantity} 
                                readOnly 
                              />
                            </td>
                            <td>
                              <input 
                                type="text" 
                                className="form-control form-control-sm" 
                                value={item.unit} 
                                readOnly 
                              />
                            </td>
                            <td>
                              <input 
                                type="text" 
                                className="form-control form-control-sm" 
                                value={item.baseUOM} 
                                readOnly 
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm bg-success bg-opacity-10"
                                value={item.qcOkQuantity}
                                onChange={(e) => handleItemChange(index, 'qcOkQuantity', Number(e.target.value))}
                                min="0"
                                max={item.receivedQuantity}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm bg-warning bg-opacity-25"
                                value={item.faultyQuantity}
                                onChange={(e) => handleItemChange(index, 'faultyQuantity', Number(e.target.value))}
                                min="0"
                                max={item.receivedQuantity}
                              />
                            </td>
                            <td>
                              <textarea
                                className="form-control form-control-sm"
                                value={item.remark}
                                onChange={(e) => handleItemChange(index, 'remark', e.target.value)}
                                rows="1"
                                maxLength={500}
                                placeholder="Remark"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

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

export default UpdateQCPopUp;