import { useState } from "react";
import { formatDate } from "../../../utils/formatDate";

const ViewDCPopUp = ({ closePopUp, selectedDC }) => {
  const [dc] = useState(selectedDC);

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
                Delivery Challan Details
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
                      <p className="fw-bold">DC Number:</p>
                      {dc?.dcNumber || "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">DC Date:</p>
                      {dc?.dcDate ? formatDate(dc.dcDate) : "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Choice:</p>
                      <span className={`badge ${
                        dc?.choice === 'DC Delivery chalan' ? 'bg-primary' : 
                        dc?.choice === 'returnable chalan' ? 'bg-info' :
                        dc?.choice === 'Rejected returnable chalan' ? 'bg-warning' : 'bg-danger'
                      }`}>
                        {dc?.choice || "-"}
                      </span>
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">PO Number:</p>
                      {dc?.poNumber || "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Project Purchase Order No.:</p>
                      {dc?.projectPurchaseOrderNumber || "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Customer Name:</p>
                      {dc?.customer?.custName || "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Transaction Type:</p>
                      <span className={`badge ${
                        dc?.transactionType === 'B2B' ? 'bg-primary' : 
                        dc?.transactionType === 'SEZ' ? 'bg-success' :
                        dc?.transactionType === 'Import' ? 'bg-info' : 'bg-warning'
                      }`}>
                        {dc?.transactionType || "-"}
                      </span>
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Purchase Type:</p>
                      <span className={`badge ${
                        dc?.purchaseType === 'Project Purchase' ? 'bg-primary' : 'bg-secondary'
                      }`}>
                        {dc?.purchaseType || "-"}
                      </span>
                    </h6>
                    {dc?.purchaseType === "Project Purchase" && (
                      <h6>
                        <p className="fw-bold mt-3">Project Name:</p>
                        {dc?.project?.name || "-"}
                      </h6>
                    )}
                    {dc?.purchaseType === "Stock" && (
                      <h6>
                        <p className="fw-bold mt-3">Warehouse Location:</p>
                        {dc?.warehouseLocation || "-"}
                      </h6>
                    )}
                    <h6>
                      <p className="fw-bold mt-3">Status:</p>
                      <span className={`badge ${
                        dc?.status === 'Pending' ? 'bg-warning' : 
                        dc?.status === 'Delivered' ? 'bg-success' :
                        dc?.status === 'Returned' ? 'bg-info' : 'bg-danger'
                      }`}>
                        {dc?.status || "-"}
                      </span>
                    </h6>
                  </div>
                  <div className="col-sm- col-md col-lg">
                    <h6>
                      <p className="fw-bold">Delivery Address:</p>
                      {dc?.deliveryAddress || "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Location:</p>
                      {dc?.location || "-"}
                    </h6>
                    <p className="fw-bold mt-3">Created At:</p>
                    {dc?.createdAt ? formatDate(dc.createdAt) : "-"}
                    <p className="fw-bold mt-3">Updated At:</p>
                    {dc?.updatedAt ? formatDate(dc.updatedAt) : "-"}
                    <p className="fw-bold mt-3">Created By:</p>
                    {dc?.createdBy?.name || "-"}
                  </div>
                </div>
                
                {dc?.remark && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <h6 className="fw-bold">Remark:</h6>
                      <p>{dc.remark}</p>
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
                            <th>Base UOM</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dc?.items?.map((item, index) => (
                            <tr key={index}>
                              <td>{item.brandName}</td>
                              <td>{item.modelNo}</td>
                              <td>
                                <span className="badge bg-primary">
                                  {item.quantity}
                                </span>
                              </td>
                              <td>{item.unit || "-"}</td>
                              <td>{item.baseUOM || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="fw-bold">
                            <td colSpan="2" className="text-end">Total Items:</td>
                            <td>{dc?.items?.length || 0}</td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Attachments Section */}
                {dc?.attachments && dc.attachments.length > 0 && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <h6 className="fw-bold">Attachments:</h6>
                      <div className="d-flex flex-wrap">
                        {dc.attachments.map((attachment, index) => (
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

export default ViewDCPopUp;