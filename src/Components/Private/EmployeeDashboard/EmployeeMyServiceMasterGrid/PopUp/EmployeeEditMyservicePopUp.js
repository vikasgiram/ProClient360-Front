import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { default as ReactSelect } from "react-select";

import {
  formatDate,
  formatDateforupdate,
} from "../../../../../utils/formatDate";
import {
  createServiceAction,
  getAllServiceActions,
} from "../../../../../hooks/useServiceAction";
import { getEmployee } from "../../../../../hooks/useEmployees";
import { getDepartment } from "../../../../../hooks/useDepartment";
import { sendNotification } from "../../../../../hooks/useNotification";

const EmployeeEditMyservicePopUp = ({ selectedService, handleUpdate }) => {
  const [status, setStatus] = useState("");
  const [action, setAction] = useState("");
  const [stuckReason, setStuckReason] = useState("");
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [previousActions, setPreviousActions] = useState([]);

  const [responsibleParty, setResponsibleParty] = useState("");
  const [departments, setDepartments] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [employees, setEmployees] = useState();
  const [employeeOptions, setEmployeeOptions] = useState([]);

  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const FetchPreviousActions = async () => {
      try {
        const data = await getAllServiceActions(selectedService._id);
        setPreviousActions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    FetchPreviousActions();
  }, [selectedService._id]);

  useEffect(() => {
    const fetchDataDep = async () => {
      try {
        const data = await getDepartment();
        // console.log(data, "department");

        if (data) {
          setDepartments(data.departments || []);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataDep();
  }, []);

  useEffect(() => {
    const fetchDataEmp = async () => {
      try {
        // console.log("department Id:" + department);
        if (!selectedDepartment) {
          return;
        }
        const data = await getEmployee(selectedDepartment);
        if (data) {
          const formattedData = data.map((employee) => ({
            value: employee._id,
            label: employee.name,
          }));

          setEmployeeOptions(formattedData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataEmp();
  }, [selectedDepartment]);

  const handleSendNotification = async () => {
    const notificationData = {
      message: stuckReason,
      userIds: employees,
    };

    await sendNotification(notificationData);
  };

  const handleMyService = async (event) => {
    event.preventDefault();

    if (status === "") {
      return toast.error("Please select status");
    }
    if (status === "Stuck") {
      if (responsibleParty === "") {
        return toast.error("Please select Responsible Party");
      }
      if (stuckReason === "") {
        return toast.error("Please enter Stuck Reason");
      }
      if (responsibleParty === "Company") {
        if (selectedDepartment === "") {
          return toast.error("Please select Department");
        }
        if (employees.length === 0) {
          return toast.error("Please select Employee");
        }

        handleSendNotification();
        handleUpdate();
        return;
      }
    }
    if (startTime === "" || startTime === "") {
      return toast.error("Please select Date and Time");
    }
    if (action === "") {
      return toast.error("Please enter Action");
    }

    const data = {
      service: selectedService._id,
      status,
      startTime,
      endTime,
      stuckReason,
      action,
    };

    // console.log(employees);
    await createServiceAction(data);
    // console.log(selectedService._id,data);
    handleUpdate();
  };

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
        <div className="modal-dialog modal-lg">
          <div className="modal-content p-3">
            <form onSubmit={handleMyService}>
              <div className="modal-header pt-0">
                <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                  Work Submit
                  {/* Forward */}
                </h5>
                <button
                  onClick={() => handleUpdate()}
                  type="button"
                  className="close px-3"
                  style={{ marginLeft: "auto" }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row modal_body_height">
                  <div className="col-12 mt-2">
                    <div className="text-end">
                      <div
                        className="btn btn-sm btn-light"
                        onClick={(e) => setShowInfo(!showInfo)}
                      >
                        {showInfo ? "Hide Info" : "Show Info"}
                      </div>
                    </div>
                    {showInfo && (
                      <div class="row">
                        <div class="col-sm- col-md col-lg">
                          <h6>
                            <p className="fw-bold ">Complaint:</p>{" "}
                            {selectedService?.ticket?.details || "-"}
                          </h6>
                          <h6>
                            <p className="fw-bold mt-3 ">Client:</p>{" "}
                            {selectedService?.ticket?.client?.custName}
                          </h6>
                          <h6>
                            <p className="fw-bold mt-3">Product:</p>{" "}
                            {selectedService.ticket.product}
                          </h6>
                          <h6>
                            <p className="fw-bold mt-3">Zone:</p>{" "}
                            {selectedService.zone}
                          </h6>
                          <h6>
                            <p className="fw-bold mt-3">Service Type:</p>{" "}
                            {selectedService.serviceType}
                          </h6>
                        </div>
                        <div class="col-sm- col-md col-lg">
                          <p className="fw-bold"> Allotment Date: </p>
                          {formatDateforupdate(selectedService.allotmentDate)}
                          <p className="fw-bold mt-3"> Allocated to: </p>
                          {selectedService.allotTo[0].name}
                          <p className="fw-bold mt-3"> Status: </p>
                          {selectedService.status}
                          <p className="fw-bold mt-3"> Priority: </p>
                          {selectedService.priority}
                          <p className="fw-bold mt-3"> Work Mode: </p>
                          {selectedService.workMode}
                          <p className="fw-bold mt-3"> Created At: </p>
                          {formatDateforupdate(selectedService.ticket.date)}
                        </div>
                      </div>
                    )}
                    <div className="col-12 col-lg-6 mt-2">
                      <label for="GSTNumber" className="form-label label_text">
                        Status
                      </label>
                      <select
                        className="form-control rounded-0"
                        id="GSTNumber"
                        onChange={(e) => setStatus(e.target.value)}
                        value={status}
                        aria-describedby="statusHelp"
                      >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Inprogress">Inprogress</option>
                        <option value="Completed">Completed</option>
                        <option value="Stuck">Stuck</option>
                      </select>
                    </div>
                  </div>

                  {status === "Stuck" && (
                    <div className="col-12 col-lg-6 mt-2">
                      <div className="">
                        <label
                          for="stuckResion"
                          className="form-label label_text"
                        >
                          Responsible Party
                        </label>
                        <select
                          className="form-control rounded-0"
                          onChange={(e) => setResponsibleParty(e.target.value)}
                          value={responsibleParty}
                          aria-describedby="statusHelp"
                        >
                          <option value="">Select Responsible Party</option>
                          <option value="Company">Company</option>
                          <option value="Contractor">Contractor</option>
                          <option value="Client">Client</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {responsibleParty === "Company" && (
                    <div className="row">
                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <label
                            htmlFor="taskName"
                            className="form-label label_text"
                          >
                            Department
                          </label>
                          <select
                            className="form-select rounded-0"
                            aria-label="Default select example"
                            onChange={(e) =>
                              setSelectedDepartment(e.target.value)
                            }
                            value={selectedDepartment}
                          >
                            <option value="">
                              -- Select Department Name --
                            </option>
                            {departments &&
                              departments.map((department) => (
                                <option value={department._id}>
                                  {department.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>

                      <div className="col-12 col-lg-6">
                        <div className="mb-3">
                          <label
                            for="ProjectName"
                            className="form-label label_text"
                          >
                            Employee Name
                          </label>
                          <ReactSelect
                            options={employeeOptions} // Employee options (e.g., from API)
                            hideSelectedOptions={false} // Show selected options in the dropdown
                            onChange={(selectedOption) => {
                              // Check if an option is selected and set the employee ID
                              const employeeId = selectedOption
                                ? selectedOption.value
                                : null;
                              setEmployees(employeeId); 
                            }}
                            value={employeeOptions.find(
                              (option) => option.value === employees
                            )} // Keep selected value synced
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {status === "Stuck" && (
                    <div className="col-12 mt-2">
                      <div className="">
                        <label
                          for="stuckResion"
                          className="form-label label_text"
                        >
                          Stuck Reason
                        </label>
                        <input
                          type="textarea"
                          className="form-control rounded-0"
                          id="stuckResion"
                          onChange={(e) => setStuckReason(e.target.value)}
                          value={stuckReason}
                          aria-describedby="emailHelp"
                        />
                      </div>
                    </div>
                  )}

                  {status !== "Stuck" ? (
                    <div className="col-12 mt-2">
                      <div className="">
                        <label for="action" className="form-label label_text">
                          Action
                        </label>
                        <input
                          type="textarea"
                          className="form-control rounded-0"
                          id="action"
                          value={action}
                          onChange={(e) => setAction(e.target.value)}
                          aria-describedby="nameHelp"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {status !== "Stuck" ? (
                    <>
                      <div className="col-12 col-lg-6 mt-2">
                        <label
                          for="StartTime"
                          className="form-label label_text"
                        >
                          Start Time
                        </label>
                        <input
                          className="form-control rounded-0"
                          id="StartTime"
                          type="datetime-local"
                          onChange={(e) => setStartTime(e.target.value)}
                          value={startTime}
                          aria-describedby="statusHelp"
                        />
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <label for="EndTime" className="form-label label_text">
                          End Time
                        </label>
                        <input
                          className="form-control rounded-0"
                          id="EndTime"
                          type="datetime-local"
                          onChange={(e) => setEndTime(e.target.value)}
                          value={endTime}
                          aria-describedby="statusHelp"
                        />
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  <div className="row">
                    <div className="col-12 pt-3 mt-2">
                      <button
                        type="submit"
                        onClick={handleMyService}
                        className="w-80 btn addbtn rounded-0 add_button   m-2 px-4"
                      >
                        Submit Work
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdate}
                        className="w-80  btn addbtn rounded-0 Cancel_button m-2 px-4"
                      >
                        Cancel
                      </button>
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
                      No remarks available.
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeEditMyservicePopUp;
