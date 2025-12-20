import { useState } from "react";
import { formatDate } from "../../../utils/formatDate";

const ViewGRNPopUp = ({ closePopUp, selectedGRN }) => {
  const [grn] = useState(selectedGRN);

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
                GRN (Goods Receipt Note) Details
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
                      <p className="fw-bold ">GRN Number:</p>
                      {grn?.grnNumber || "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3 ">GRN Date:</p>
                      {grn?.grnDate ? formatDate(grn.grnDate) : "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Choice:</p>
                      <span className={`badge ${
                        grn?.choice === 'Against PO' ? 'bg-primary' : 'bg-secondary'
                      }`}>
                        {grn?.choice || "-"}
                      </span>
                    </h6>
                    {grn?.choice === 'Against PO' && (
                      <h6>
                        <p className="fw-bold mt-3">PO Number:</p>
                        {grn?.purchaseOrder?.orderNumber || "-"}
                      </h6>
                    )}
                    <h6>
                      <p className="fw-bold mt-3">Vendor Name:</p>
                      {grn?.vendor?.vendorName || "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Transaction Type:</p>
                      <span className={`badge ${
                        grn?.transactionType === 'B2B' ? 'bg-primary' : 
                        grn?.transactionType === 'SEZ' ? 'bg-success' :
                        grn?.transactionType === 'Import' ? 'bg-info' : 'bg-warning'
                      }`}>
                        {grn?.transactionType || "-"}
                      </span>
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Purchase Type:</p>
                      <span className={`badge ${
                        grn?.purchaseType === 'Project Purchase' ? 'bg-primary' : 'bg-secondary'
                      }`}>
                        {grn?.purchaseType || "-"}
                      </span>
                    </h6>
                    {grn?.purchaseType === "Project Purchase" && (
                      <h6>
                        <p className="fw-bold mt-3">Project Name:</p>
                        {grn?.project?.name || "-"}
                      </h6>
                    )}
                    {grn?.purchaseType === "Stock" && (
                      <h6>
                        <p className="fw-bold mt-3">Warehouse Location:</p>
                        {grn?.warehouseLocation || "-"}
                      </h6>
                    )}
                    <h6>
                      <p className="fw-bold mt-3">Status:</p>
                      <span className={`badge ${
                        grn?.status === 'Pending' ? 'bg-warning' : 
                        grn?.status === 'Completed' ? 'bg-success' : 'bg-danger'
                      }`}>
                        {grn?.status || "-"}
                      </span>
                    </h6>
                  </div>
                  <div className="col-sm- col-md col-lg">
                    <h6>
                      <p className="fw-bold">Delivery Address:</p>
                      {grn?.deliveryAddress || "-"}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Location:</p>
                      {grn?.location || "-"}
                    </h6>
                    <p className="fw-bold mt-3">Created At:</p>
                    {grn?.createdAt ? formatDate(grn.createdAt) : "-"}
                    <p className="fw-bold mt-3">Updated At:</p>
                    {grn?.updatedAt ? formatDate(grn.updatedAt) : "-"}
                    <p className="fw-bold mt-3">Created By:</p>
                    {grn?.createdBy?.name || "-"}
                  </div>
                </div>
                
                {grn?.remark && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <h6 className="fw-bold">Remark:</h6>
                      <p>{grn.remark}</p>
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
                            <th>Description</th>
                            <th>Unit</th>
                            <th>Ordered Quantity</th>
                            <th>Received Quantity</th>
                            <th>Price</th>
                            <th>Discount %</th>
                            <th>Tax %</th>
                            <th>Net Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grn?.items?.map((item, index) => (
                            <tr key={index}>
                              <td>{item.brandName}</td>
                              <td>{item.modelNo}</td>
                              <td>{item.description || "-"}</td>
                              <td>{item.unit || "-"}</td>
                              <td>{item.orderedQuantity}</td>
                              <td>
                                <span className="badge bg-success">
                                  {item.receivedQuantity}
                                </span>
                              </td>
                              <td>₹{item.price.toFixed(2)}</td>
                              <td>{item.discountPercent}%</td>
                              <td>{item.taxPercent}%</td>
                              <td>₹{item.netValue.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="11" className="text-end fw-bold">Grand Total:</td>
                            <td className="fw-bold">
                              ₹{grn?.items?.reduce((sum, item) => sum + item.netValue, 0).toFixed(2) || "0.00"}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                {grn?.attachments && grn.attachments.length > 0 && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <h6 className="fw-bold">Documents:</h6>
                      {grn.attachments.map((attachment, index) => (
                        <div key={index} className="mb-2">
                          <a 
                            href={`${process.env.REACT_APP_API_URL}${attachment.path}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className={`fa-solid ${
                              attachment.type && attachment.type.includes('pdf') ? 'fa-file-pdf' : 
                              attachment.type && attachment.type.includes('image') ? 'fa-file-image' : 
                              'fa-file'
                            } me-2`}></i>
                            {attachment.name || `Document ${index + 1}`}
                          </a>
                        </div>
                      ))}
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

export default ViewGRNPopUp;