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
import { RequiredStar } from "../../../RequiredStar/RequiredStar";


const SubmitServiceWorkPopUp = ({ selectedService, handleUpdate }) => {
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

  const [workComplete, setWorkComplete] = useState('');


  const FetchPreviousActions = async () => {
    try {
      const data = await getAllServiceActions(selectedService._id);
      if (data.success)
        setPreviousActions(data.serviceActions);
      else
        toast(data.error);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    FetchPreviousActions();
  }, [selectedService._id]);


useEffect(() => {
  const fetchDataDep = async () => {
    try {
      const data = await getDepartment();
      if (data && data.departments) {
        setDepartments(data.departments);
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
      if (!selectedDepartment) return;

      const data = await getEmployee(selectedDepartment);
      if (data && data.employee) {
        const formattedData = data.employee.map((employee) => ({
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

    const actionData = {
      service: selectedService._id,
      status,
      startTime,
      endTime,
      stuckReason,
      action,
    };

    // console.log(employees);
    toast.loading("Create Service Action...")
    const data = await createServiceAction(actionData);
    // console.log(selectedService._id,data);
    toast.dismiss()
    if (data.success) {
      toast.success(data.message);
      handleUpdate();
      FetchPreviousActions();
    } else {
      toast.error(data.error);
    }
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
                  onClick={handleUpdate}
                  type="button"
                  className="close px-3"
                  style={{ marginLeft: "auto" }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              {/* <div className="modal-body"> */}
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
                    <div className="row">
                      <div className="col-sm- col-md col-lg">
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
                      <div className="col-sm- col-md col-lg">
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


                  <div className="row">
                    <div className="col-12 col-md-6 mt-2">
                      <label htmlFor="status" className="form-label label_text">
                        Status <RequiredStar />
                      </label>
                      <select
                        className="form-control rounded-0"
                        id="status"
                        onChange={(e) => setStatus(e.target.value)}
                        value={status}
                        aria-describedby="statusHelp"
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Inprogress">Inprogress</option>
                        <option value="Completed">Completed</option>
                        <option value="Stuck">Stuck</option>
                      </select>
                    </div>

                    {status === "Inprogress" && (
                      <div className="col-12 col-md-6 mt-2">
                        <label htmlFor="workComplete" className="form-label label_text">
                          Work Complete (%) <RequiredStar />
                        </label>
                        <input
                          type="number"
                          className="form-control rounded-0"
                          id="workComplete"
                          name="workComplete"
                          placeholder="eg. 50"
                          min="0"
                          max="100"
                          maxLength={3}
                          value={workComplete}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || (value.length <= 3 && Number(value) >= 0 && Number(value) <= 100)) {
                              setWorkComplete(value);
                            }
                          }} required
                        />
                      </div>
                    )}
                  </div>



                  {status === "Stuck" && (
                    <div className="col-12 mt-2 inprocess">
                      <div className="">
                        <label
                          for="stuckResion"
                          className="form-label label_text"
                        >
                          Responsible Party <RequiredStar />
                        </label>
                        <select
                          className="form-control rounded-0"
                          onChange={(e) => setResponsibleParty(e.target.value)}
                          value={responsibleParty}
                          aria-describedby="statusHelp"
                          required
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
    <div className="col-6 col-lg-6 mt-2 inprogress-field">
      <div className="mb-3">
        <label htmlFor="department" className="form-label label_text">
          Department <RequiredStar />
        </label>
        <select
          id="department"
          className="form-select rounded-0"
          onChange={(e) => setSelectedDepartment(e.target.value)}
          value={selectedDepartment}
          required
        >
          <option value="">-- Select Department Name --</option>
          {departments &&
            departments.map((department) => (
              <option key={department._id} value={department._id}>
                {department.name}
              </option>
            ))}
        </select>
      </div>
    </div>

    {/* Employee ReactSelect */}
    <div className="col-6 col-lg-6 mt-2">
      <div className="mb-3">
        <label htmlFor="employeeSelect" className="form-label label_text">
          Employee Name <RequiredStar />
        </label>
        <ReactSelect
          inputId="employeeSelect"
          options={employeeOptions}
          hideSelectedOptions={false}
          onChange={(selectedOption) => {
            const employeeId = selectedOption ? selectedOption.value : null;
            setEmployees(employeeId);
          }}
          value={employeeOptions.find(
            (option) => option.value === employees
          )}
          placeholder="Select Employee..."
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
                          Stuck Reason <RequiredStar />
                        </label>
                        <input
                          type="textarea"
                          className="form-control rounded-0"
                          id="stuckResion"
                          placeholder="Enter Stuck Reason...."
                          onChange={(e) => setStuckReason(e.target.value)}
                          value={stuckReason}
                          aria-describedby="emailHelp"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {status !== "Stuck" ? (
                    <div className="col-12 mt-2">
                      <div className="">
                        <label for="action" className="form-label label_text">
                          Action <RequiredStar />
                        </label>
                        <input
                          type="textarea"
                          className="form-control rounded-0"
                          id="action"
                          placeholder="Enter Action...."
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

                  {/* {status !== "Stuck" ? (
                    <>
                      <div className="col-9 col-lg-6 mt-2">
                        <label
                          for="StartTime"
                          className="form-label label_text"
                        >
                          Start Time  <RequiredStar />
                        </label>
                        <input
                          className="form-control rounded-0"
                          id="StartTime"
                          type="datetime-local"
                          onChange={(e) => setStartTime(e.target.value)}
                          value={startTime}
                          aria-describedby="statusHelp"
                          required
                        />
                      </div>

                      <div className="col-9 col-lg-6 mt-2">
                        <label for="EndTime" className="form-label label_text">
                          End Time <RequiredStar />
                        </label>
                        <input
                          className="form-control rounded-0"
                          id="EndTime"
                          type="datetime-local"
                          onChange={(e) => setEndTime(e.target.value)}
                          value={endTime}
                          aria-describedby="statusHelp"
                          required
                        />
                      </div>
                    </>
                  ) : (
                    ""
                  )} */}

                  {status !== "Stuck" ? (
                    <div className="row g-3 mt-2">
                      <div className="col">
                        <label htmlFor="StartTime" className="form-label label_text">
                          Start Time <RequiredStar />
                        </label>
                        <input
                          className="form-control rounded-0"
                          id="StartTime"
                          type="datetime-local"
                          onChange={(e) => setStartTime(e.target.value)}
                          value={startTime}
                          aria-describedby="statusHelp"
                          required
                        />
                      </div>

                      <div className="col">
                        <label htmlFor="EndTime" className="form-label label_text">
                          End Time <RequiredStar />
                        </label>
                        <input
                          className="form-control rounded-0"
                          id="EndTime"
                          type="datetime-local"
                          onChange={(e) => setEndTime(e.target.value)}
                          value={endTime}
                          aria-describedby="statusHelp"
                          required
                        />
                      </div>
                    </div>
                  ) : null}
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
                      No Actions Available
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

export default SubmitServiceWorkPopUp;