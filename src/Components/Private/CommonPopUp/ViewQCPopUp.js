import { useState } from "react";
import { formatDate } from "../../../utils/formatDate";

const ViewQCPopUp = ({ closePopUp, selectedQC }) => {
  const [qc] = useState(selectedQC);

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
                Quality Inspection Report Details
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
                  <div className="col-sm-6 col-md-6 col-lg-6">
                    <h6>
                      <p className="fw-bold">GRN No.:</p>
                      {qc?.grnNumber || "-"}
                    </h6>
                  </div>
                  <div className="col-sm-6 col-md-6 col-lg-6">
                    <h6>
                      <p className="fw-bold">QC Date:</p>
                      {qc?.qcDate ? formatDate(qc.qcDate) : "-"}
                    </h6>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-12">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Brand Name</th>
                            <th>Model no</th>
                            <th>GRN QTY</th>
                            <th>unit</th>
                            <th>QC OK qty.</th>
                            <th>faulty qty (QC not ok)</th>
                            <th>remark</th>
                          </tr>
                        </thead>
                        <tbody>
                          {qc?.items?.map((item, index) => (
                            <tr key={index}>
                              <td>{item.brandName}</td>
                              <td>{item.modelNo}</td>
                              <td>{item.receivedQuantity}</td>
                              <td>{item.unit || "-"}</td>
                              <td>
                                <span className="badge bg-success">
                                  {item.qcOkQuantity}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${item.faultyQuantity > 0 ? 'bg-danger' : 'bg-secondary'}`}>
                                  {item.faultyQuantity}
                                </span>
                              </td>
                              <td>{item.remark || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="fw-bold table-light">
                            <td colSpan="2" className="text-end">Total:</td>
                            <td>{qc?.items?.reduce((sum, item) => sum + item.receivedQuantity, 0) || 0}</td>
                            <td></td>
                            <td className="text-success">
                              {qc?.items?.reduce((sum, item) => sum + item.qcOkQuantity, 0) || 0}
                            </td>
                            <td className="text-danger">
                              {qc?.items?.reduce((sum, item) => sum + item.faultyQuantity, 0) || 0}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewQCPopUp;