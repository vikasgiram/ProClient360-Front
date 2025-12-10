import { useState } from "react";
import { formatDate } from "../../../utils/formatDate";

const ViewMRFPopUp = ({ closePopUp, selectedMRF }) => {
  const [mrf] = useState(selectedMRF);

  return (
    <>
      <div
        className="modal fade show"
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#00000090",
        }}
      >
        <div className="modal-dialog modal_widthhh_details modal-xl">
          <div className="modal-content p-3">
            <div className="modal-header pt-0">
              <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                MRF Details
              </h5>
              <button
                onClick={() => closePopUp()}
                type="button"
                className="close px-3"
                style={{ marginLeft: "auto" }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="row modal_body_height_details">
                <div className="row">
                  <div className="col-sm- col-md col-lg">
                    <h6>
                      <p className="fw-bold">MRF Number:</p>
                      {mrf?.mrfNumber || "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">MRF Date:</p>
                      {mrf?.mrfDate ? formatDate(mrf.mrfDate) : "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Choice:</p>
                      <span className={`badge ${
                        mrf?.choice === 'MRF Material Request' ? 'bg-primary' : 
                        mrf?.choice === 'returnable MRF' ? 'bg-info' :
                        mrf?.choice === 'Rejected returnable MRF' ? 'bg-warning' : 'bg-danger'
                      }`}>
                        {mrf?.choice || "-"}
                      </span>
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">PO Number:</p>
                      {mrf?.poNumber || "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Project Purchase Order No.:</p>
                      {mrf?.projectPurchaseOrderNumber || "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Customer Name:</p>
                      {mrf?.customer?.custName || "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Transaction Type:</p>
                      <span className={`badge ${
                        mrf?.transactionType === 'B2B' ? 'bg-primary' : 
                        mrf?.transactionType === 'SEZ' ? 'bg-success' :
                        mrf?.transactionType === 'Import' ? 'bg-info' : 'bg-warning'
                      }`}>
                        {mrf?.transactionType || "-"}
                      </span>
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Purchase Type:</p>
                      <span className={`badge ${
                        mrf?.purchaseType === 'Project Purchase' ? 'bg-primary' : 'bg-secondary'
                      }`}>
                        {mrf?.purchaseType || "-"}
                      </span>
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Type:</p>
                      <span className={`badge ${
                        mrf?.type === 'supply only' ? 'bg-info' : 'bg-primary'
                      }`}>
                        {mrf?.type || "-"}
                      </span>
                    </h6>
                    {mrf?.purchaseType === "Project Purchase" && (
                      <h6>
                        <p className="fw-bold mt-3">Project Name:</p>
                        {mrf?.project?.name || "-"}
                      </h6>
                    )}
                    {mrf?.purchaseType === "Stock" && (
                      <h6>
                        <p className="fw-bold mt-3">Warehouse Location:</p>
                        {mrf?.warehouseLocation || "-"}
                      </h6>
                    )}
                    <h6>
                      <p className="fw-bold mt-3">Status:</p>
                      <span className={`badge ${
                        mrf?.status === 'Pending' ? 'bg-warning' : 
                        mrf?.status === 'Approved' ? 'bg-success' :
                        mrf?.status === 'Processed' ? 'bg-info' : 'bg-danger'
                      }`}>
                        {mrf?.status || "-"}
                      </span>
                    </h6>
                  </div>
                  <div className="col-sm- col-md col-lg">
                    <h6>
                      <p className="fw-bold">Delivery Person Name:</p>
                      {mrf?.deliveryPersonName || "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Delivery Contact No.:</p>
                      {mrf?.deliveryContactNo || "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Delivery Email:</p>
                      {mrf?.deliveryEmail || "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Delivery Address:</p>
                      {mrf?.deliveryAddress || "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Location:</p>
                      {mrf?.location || "-"}
                    </h6>
                    <p className="fw-bold mt-3">Created At:</p>
                    {mrf?.createdAt ? formatDate(mrf.createdAt) : "-"}
                    <p className="fw-bold mt-3">Updated At:</p>
                    {mrf?.updatedAt ? formatDate(mrf.updatedAt) : "-"}
                    <p className="fw-bold mt-3">Created By:</p>
                    {mrf?.createdBy?.name || "-"}
                  </div>
                </div>
                
                {mrf?.remark && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <h6 className="fw-bold">Remark:</h6>
                      <p>{mrf.remark}</p>
                    </div>
                  </div>
                )}

                {/* Items Section */}
                <div className="row mt-3">
                  <div className="col-12">
                    <h6 className="fw-bold">Items:</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Brand Name</th>
                            <th>Model No</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th>Rate</th>
                            <th>Discount (%)</th>
                            <th>Tax (%)</th>
                            <th>Total</th>
                            <th>Remark</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mrf?.items?.map((item, index) => (
                            <tr key={index}>
                              <td>{item.brandName}</td>
                              <td>{item.modelNo}</td>
                              <td>{item.quantity}</td>
                              <td>{item.unit || "-"}</td>
                              <td>{item.rate || "-"}</td>
                              <td>{item.discount || 0}%</td>
                              <td>{item.tax || 0}%</td>
                              <td>{item.total || "-"}</td>
                              <td>{item.remark || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="fw-bold">
                            <td colSpan="3" className="text-end">Total Items:</td>
                            <td>{mrf?.items?.length || 0}</td>
                            <td colSpan="5"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="row mt-3">
                  <div className="col-12">
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
                                value={mrf?.subtotal || 0}
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
                                value={mrf?.totalTax || 0}
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
                                value={mrf?.transportCost || 0}
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="mb-3">
                              <label className="form-label">Transport Tax</label>
                              <input
                                type="number"
                                className="form-control"
                                value={mrf?.transportTax || 0}
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="col-md-6 offset-md-3">
                            <div className="mb-3">
                              <label className="form-label fw-bold">Grand Total</label>
                              <input
                                type="number"
                                className="form-control fw-bold"
                                value={mrf?.grandTotal || 0}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {mrf?.attachments && mrf.attachments.length > 0 && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <h6 className="fw-bold">Attachments:</h6>
                      <div className="d-flex flex-wrap">
                        {mrf.attachments.map((attachment, index) => (
                          <div key={index} className="mb-2 me-2">
                            {attachment.dataUrl ? (
                              <a 
                                href={attachment.dataUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className={`fa-solid ${
                                  attachment.type.includes('pdf') ? 'fa-file-pdf' : 
                                  attachment.type.includes('image') ? 'fa-file-image' : 
                                  'fa-file'
                                } me-2`}></i>
                                {attachment.name || `Document ${index + 1}`}
                              </a>
                            ) : (
                              <a 
                                href={attachment.url || attachment} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className={`fa-solid ${
                                  attachment.type?.includes('pdf') ? 'fa-file-pdf' : 
                                  attachment.type?.includes('image') ? 'fa-file-image' : 
                                  'fa-file'
                                } me-2`}></i>
                                {attachment.name || `Document ${index + 1}`}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewMRFPopUp;