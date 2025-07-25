import { useState, useEffect, useCallback } from "react";
import { formatDateforupdate } from "../../../../../utils/formatDate";
import { getEmployees } from "../../../../../hooks/useEmployees";
import useUpdateService from "../../../../../hooks/service/useUpdateService"; 
import toast from "react-hot-toast";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import Select from "react-select";

const PAGE_SIZE = 10;

const UpdateServicePopup = ({ handleUpdate, selectedService, closePopUp }) => {
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState(selectedService || {});
  
  // Employee dropdown state
  const [empOptions, setEmpOptions] = useState([]);
  const [empPage, setEmpPage] = useState(1);
  const [empHasMore, setEmpHasMore] = useState(true);
  const [empLoading, setEmpLoading] = useState(false);
  const [empSearch, setEmpSearch] = useState("");
  

  

  // Use the useUpdateService hook
  const { updateService, loading: updateLoading, error: updateError } = useUpdateService();

  // Fetch employees with pagination & search
  const loadEmployees = useCallback(async (page, search) => {
    if (empLoading || !empHasMore) return;
    setEmpLoading(true);
    const data = await getEmployees(page, PAGE_SIZE, search);

    if (data.error) {
      setEmpLoading(false);
      return;
    }

    const newOpts = (data.employees || []).map(e => ({ value: e._id, label: e.name, employee: e }));
    setEmpOptions(prev => page === 1 ? newOpts : [...prev, ...newOpts]);
    setEmpHasMore(newOpts.length === PAGE_SIZE);
    setEmpLoading(false);
    setEmpPage(page + 1);
  }, [empLoading, empHasMore]);

  // Initial & search-triggered load (reset on search)
  useEffect(() => {
    setEmpPage(1);
    setEmpHasMore(true);
    setEmpOptions([]);
    loadEmployees(1, empSearch);
  }, [empSearch]);

  // Initialize selectedEmployees
  const [selectedEmployees, setSelectedEmployees] = useState(
    selectedService?.allotTo || []
  );

  // Update selectedEmployees when selectedService changes
  useEffect(() => {
    setService(selectedService || {});
    setSelectedEmployees(selectedService?.allotTo || []);
  }, [selectedService]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setService((prevService) => ({
      ...prevService,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOptions) => {
    if (selectedOptions) {
      const newEmployees = selectedOptions.map(option => option.employee);
      setSelectedEmployees(newEmployees);
      setService((prevService) => ({
        ...prevService,
        allotTo: newEmployees,
      }));
    } else {
      setSelectedEmployees([]);
      setService((prevService) => ({
        ...prevService,
        allotTo: [],
      }));
    }
  };

  const handleRemoveEmployee = (id) => {
    const updatedSelectedEmployees = selectedEmployees.filter(
      (emp) => emp._id !== id
    );
    setSelectedEmployees(updatedSelectedEmployees);
    setService((prevService) => ({
      ...prevService,
      allotTo: updatedSelectedEmployees,
    }));
  };

  const handleServiceUpdate = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      toast.loading("Updating Service...")
      const result = await updateService(service._id, service);
      toast.dismiss();
      if (result) {
        handleUpdate(service._id, service); // Call handleUpdateSubmit
        closePopUp(); // Close the popup
      }
    } catch (error) {
      toast.error(updateError || "Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = formatDateforupdate(service?.allotmentDate);

  return (
  <>
    <form onSubmit={handleServiceUpdate}>
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
            <div className="modal-header pt-0">
              <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                Update Service
              </h5>
              <button
                onClick={closePopUp}
                type="button"
                className="close px-3"
                style={{ marginLeft: "auto" }}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row modal_body_height">
                <div className="col-12 col-lg-6 mt-2">
                  <div className="mb-3">
                    <label htmlFor="serviceType" className="form-label label_text">
                      Service Type <RequiredStar />
                    </label>
                    <select
                      className="form-select rounded-0"
                      id="serviceType"
                      name="serviceType"
                      value={service.serviceType || ""}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Service Type</option>
                      <option value="AMC">AMC</option>
                      <option value="One Time">One Time</option>
                      <option value="Warranty">Warranty</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 col-lg-6 mt-2">
                  <div className="mb-3">
                    <label htmlFor="priority" className="form-label label_text">
                      Priority <RequiredStar />
                    </label>
                    <select
                      className="form-select rounded-0"
                      id="priority"
                      name="priority"
                      value={service.priority || ""}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Mid</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

  
               <div className="col-12 col-lg-6 mt-2">
                  <div className="mb-3">
                    <label htmlFor="allotmentDate" className="form-label label_text">
                      Allotment Date <RequiredStar />
                    </label>
                    <input
                      onChange={handleChange}
                      value={formattedDate || ""}
                      type="date"
                      className="form-control rounded-0"
                      id="allotmentDate"
                      name="allotmentDate"
                      // min={new Date().toISOString().split("T")[0]} 
                        min={!service?._id ? new Date().toISOString().split("T")[0] : undefined}

                      required
                    />
                  </div>
                </div>


                <div className="col-12 col-lg-6 mt-2">
                  <div className="mb-3">
                    <label htmlFor="employeeSelect" className="form-label label_text">
                      Allocated to <RequiredStar />
                    </label>
                    <Select
                      options={empOptions}
                      value={empOptions.filter(option => 
                        selectedEmployees.some(emp => emp._id === option.value)
                      )}
                      onChange={handleSelectChange}
                      onInputChange={val => setEmpSearch(val)}
                      onMenuScrollToBottom={() => loadEmployees(empPage, empSearch)}
                      isLoading={empLoading}
                      placeholder="Search and select employees..."
                      noOptionsMessage={() => empLoading ? 'Loading...' : 'No employees'}
                      closeMenuOnSelect={false}
                      isMulti={true}
                      hideSelectedOptions={false}
                    />
                  </div>
                  <div>
                    {selectedEmployees.length > 0 && (
                      <ul>
                        {selectedEmployees.map((emp) => (
                          <li key={emp._id}>
                            {emp.name}
                            <button
                              className="btn btn-outline-danger btn-sm ms-2"
                              onClick={() => handleRemoveEmployee(emp._id)}
                              type="button"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="col-12 col-lg-6 mt-2">
                  <div className="mb-3">
                    <label htmlFor="workMode" className="form-label label_text">
                      Workmode <RequiredStar />
                    </label>
                    <select
                      className="form-select rounded-0"
                      id="workMode"
                      name="workMode"
                      value={service.workMode || ""}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Workmode</option>
                      <option value="Onsite">Onsite</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 pt-3 mt-2">
                    <button
                      type="submit"
                      disabled={loading || updateLoading}
                      className="w-80 btn addbtn rounded-0 add_button m-2 px-4"
                    >
                      {loading || updateLoading ? "Submitting..." : "Update"}
                    </button>
                    <button
                      type="button"
                      onClick={closePopUp}
                      className="w-80 btn addbtn rounded-0 Cancel_button m-2 px-4"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </form>
    </>
  );
};

export default UpdateServicePopup;