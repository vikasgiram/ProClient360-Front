import { useState } from "react";
import { formatDateforupdate } from "../../../../../utils/formatDate";

const ViewFeedbackPopUp = ({ closePopUp, selectedFeedback }) => {
  const [Feedback, setService] = useState(selectedFeedback);
  console.log("Feedback", Feedback);

  // const formattedPurchaseOrderDate = formatDateforupdate(projects?.purchaseOrderDate);
  // const formattedStartDate = formatDateforupdate(projects?.startDate);
  const hasRemarks =
  selectedFeedback &&
  selectedFeedback.remarks &&
  selectedFeedback.remarks.length > 0;
  const formattedDate = formatDateforupdate(Feedback?.allotmentDate);
  const formattedDate1 = formatDateforupdate(Feedback?.actualCompletionDate);

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
                Feedback Details
                {/* Forward */}
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
                <div class="row">
                  <div class="col-sm- col-md col-lg">
                    <h6>
                      {" "}
                      <p className="fw-bold ">Complaint:</p>{" "}
                      {Feedback?.ticket?.details || "-" }
                    </h6>
                    <h6>
                      {" "}
                      <p className="fw-bold mt-3 ">Client:</p>{" "}
                      {Feedback?.ticket?.client?.custName}
                    </h6>
                    <h6>
                      {" "}
                      <p className="fw-bold mt-3">Product:</p>{" "}
                      {Feedback.ticket.product}
                    </h6>
                    <h6>
                      {" "}
                      <p className="fw-bold mt-3">Zone:</p> {Feedback.zone}
                    </h6>
                    <h6>
                      {" "}
                      <p className="fw-bold mt-3">Feedback Type:</p>{" "}
                      {Feedback.serviceType}
                      <p className="fw-bold mt-3"> Actual Completion Date: </p>
                    {formatDateforupdate(Feedback.actualCompletionDate)}
                    </h6>
                  </div>
                  <div class="col-sm- col-md col-lg">
                    <p className="fw-bold"> Allotment Date: </p>
                    {formatDateforupdate(Feedback.allotmentDate)}
                    <p className="fw-bold mt-3"> Allocated to: </p>
                    {Feedback.allotTo[0].name || Feedback.allotTo[1].name}
                    <p className="fw-bold mt-3"> Status: </p>
                    {Feedback.status}
                    <p className="fw-bold mt-3"> Priority: </p>
                    {Feedback.priority}
                    <p className="fw-bold mt-3"> Work Mode: </p>
                    {Feedback.workMode}
                    <p className="fw-bold mt-3"> Created At: </p>
                    {formatDateforupdate(Feedback.ticket.date)}
                    <p className="fw-bold mt-3"> Completion Date: </p>
                    {formatDateforupdate(Feedback.completionDate)}
                    
                  </div>
                </div>
              </div>
              {hasRemarks ? (<>
                    <h6 className="mt-3"> Past Actions</h6>
                    <table className="table table-bordered">
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">Sr. No</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedFeedback.remarks.map((remark, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{remark}</td>{" "}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </>
                  ) : (
                    <div className="alert alert-warning" role="alert">
                      No remarks available.
                    </div>
                  ) }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewFeedbackPopUp;
