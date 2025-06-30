import { useEffect, useState } from "react";
import {
  formatDate,
  formatDateforupdate,
} from "../../../utils/formatDate";
import { getAllServiceActions } from "../../../hooks/useServiceAction";

const ViewServicePopUp = ({ closePopUp, selectedService }) => {
  const [service, setService] = useState(selectedService || {});
  const [previousActions, setPreviousActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreviousActions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllServiceActions(selectedService?._id);
        setPreviousActions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching service actions:", err);
        setError("Failed to load previous actions");
        setPreviousActions([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedService?._id) {
      fetchPreviousActions();
    }
  }, [selectedService?._id]);

  const renderServiceDetail = (label, value, fallback = "-") => (
    <h6>
      <p className="fw-bold mt-3">{label}:</p> 
      {value || fallback}
    </h6>
  );

  const renderDateDetail = (label, date) => (
    <>
      <p className="fw-bold mt-3">{label}:</p>
      {date ? formatDateforupdate(date) : "-"}
    </>
  );

  return (
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
            <h5 className="card-title fw-bold">Service Details</h5>
            <button
              onClick={closePopUp}
              type="button"
              className="close px-3"
              style={{ marginLeft: "auto" }}
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="row modal_body_height_details">
              <div className="row">
                <div className="col-sm col-md col-lg">
                  {renderServiceDetail("Complaint", service?.ticket?.details)}
                  {renderServiceDetail("Client", service?.ticket?.client?.custName)}
                  {renderServiceDetail("Product", service?.ticket?.product)}
                  {renderServiceDetail("Zone", service?.zone)}
                  {renderServiceDetail("Service Type", service?.serviceType)}
                  {service?.completionDate && 
                    renderDateDetail("Completion Date", service.completionDate)}
                </div>

                <div className="col-sm col-md col-lg">
                  {renderDateDetail("Allotment Date", service?.allotmentDate)}
                  {renderServiceDetail("Allocated to", service?.allotTo?.[0]?.name)}
                  {renderServiceDetail("Status", service?.status)}
                  {renderServiceDetail("Priority", service?.priority)}
                  {renderServiceDetail("Work Mode", service?.workMode)}
                  {renderDateDetail("Created At", service?.ticket?.date)}
                </div>

                {service?.status === "Stuck" && (
                  <div className="col-12">
                    <h5>
                      This Service is Stuck due to:{" "}
                      <span className="text-danger text-xl-center">
                        {service.stuckReason || "Unknown reason"}
                      </span>
                    </h5>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <h6>Past Actions</h6>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : previousActions.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered">
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
                        <tr key={action._id || index}>
                          <td>{index + 1}</td>
                          <td className="text-start text-wrap" style={{ maxWidth: "22rem" }}>
                            {action?.action || "-"}
                          </td>
                          <td>{action?.actionBy?.name || "-"}</td>
                          <td>{action?.startTime ? formatDate(action.startTime) : "-"}</td>
                          <td>{action?.endTime ? formatDate(action.endTime) : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-warning" role="alert">
                  No Actions Available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewServicePopUp;