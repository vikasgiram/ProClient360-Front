import { useEffect, useState } from "react";
import {
  formatDate,
  formatDateforupdate,
} from "../../../utils/formatDate";
import { getAllServiceActions } from "../../../hooks/useServiceAction";
import toast from "react-hot-toast";

const ViewServicePopUp = ({ closePopUp, selectedService }) => {
  const [service, setService] = useState(selectedService);
  const [previousActions, setPreviousActions] = useState([]);

  // const formattedPurchaseOrderDate = formatDateforupdate(projects?.purchaseOrderDate);
  // const formattedStartDate = formatDateforupdate(projects?.startDate);

  useEffect(() => {
    const FetchPreviousActions = async () => {
      try {
        toast.loading("Loading Previous Actions...");
        const data = await getAllServiceActions(selectedService._id);
        if(data.success){
          toast.dismiss();
          setPreviousActions(data.serviceActions);
        } else {
          toast.dismiss();
          setPreviousActions([]);
          toast(data.error)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    FetchPreviousActions();
  }, [selectedService._id]);

  const formattedDate = formatDateforupdate(service?.allotmentDate);

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
                Service Details
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
                      {service?.ticket?.details || "-"}
                    </h6>
                    <h6>
                      {" "}
                      <p className="fw-bold mt-3 ">Client:</p>{" "}
                      {service?.ticket?.client?.custName}
                    </h6>
                    <h6>
                      {" "}
                      <p className="fw-bold mt-3">Product:</p>{" "}
                      {service.ticket.product}
                    </h6>
                    <h6>
                      {" "}
                      <p className="fw-bold mt-3">Zone:</p> {service.zone}
                    </h6>
                    <h6>
                      <p className="fw-bold mt-3">Service Type:</p>{" "}
                      {service.serviceType}
                    </h6>

                    {service.completionDate && <h6>
                      <p className="fw-bold mt-3">Completion Date:</p>
                      {formatDate(service.completionDate)}
                    </h6>}
                  </div>
                  <div class="col-sm- col-md col-lg">
                    <p className="fw-bold"> Allotment Date: </p>
                    {formatDateforupdate(service.allotmentDate)}
                    <p className="fw-bold mt-3"> Allocated to: </p>
                    {service.allotTo[0].name}
                    <p className="fw-bold mt-3"> Status: </p>
                    {service.status}
                    <p className="fw-bold mt-3"> Priority: </p>
                    {service.priority}
                    <p className="fw-bold mt-3"> Work Mode: </p>
                    {service.workMode}
                    <p className="fw-bold mt-3"> Created At: </p>
                    {formatDateforupdate(service.ticket.date)}
                  </div>

                  {service.status === "Stuck" ? <div class="col-12">
                    <h5>This Service is Stuck due to: <span className="text-danger text-xl-center"> {service.stuckReason}</span></h5>
                  </div> : ""}
                </div>
              </div>
              {previousActions ? (
                <>
                  <h6 className="mt-2"> Past Actions</h6>
                  <table className="table table-bordered table-responsive">
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Sr. No</th>
                        <th scope="col" className="text-start">
                          Action
                        </th>
                        <th scope="col">Action By</th>
                        <th scope="col">Start Time</th>
                        <th scope="col">End Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previousActions.map((action, index) => (
                        <tr key={action._id}>
                          <td>{index + 1}</td>
                          <td
                            className="text-start text-wrap w-100"
                            style={{
                              maxWidth: "22rem", // Sets a fixed maximum width for the column
                            }}
                          >
                            {action?.action}
                          </td>
                          <td>{action?.actionBy?.name}</td>
                          <td>{formatDate(action?.startTime)}</td>
                          <td>{formatDate(action?.endTime)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className="alert alert-warning mt-2" role="alert">
                  No Actions Available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewServicePopUp;  