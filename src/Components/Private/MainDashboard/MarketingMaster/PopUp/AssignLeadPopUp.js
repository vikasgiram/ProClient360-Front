import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { default as ReactSelect } from "react-select";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { getDepartment } from "../../../../../hooks/useDepartment";
import { getEmployee } from "../../../../../hooks/useEmployees";
import { sendNotification } from "../../../../../hooks/useNotification";

const AssignMarketingLeadPopUp = ({ selectedLead, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    feasibility: '',
    notFeasibleReason: '',
    feasibleReason: '', 
  });

  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [assignedEmployee, setAssignedEmployee] = useState(null);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDataDep = async () => {
      try {
        const data = await getDepartment();
        setDepartments(data?.departments || []);
        console.log('Departments:', data?.departments || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataDep();
  }, []);

  useEffect(() => {
    const fetchDataEmp = async () => {
      setAssignedEmployee(null);
      setEmployeeOptions([]);
      
      if (!selectedDepartment) return;
      
      setLoading(true);
      try {
        const data = await getEmployee(selectedDepartment);
        console.log('Raw employee data:', data);
        
        let employeeArray = [];
        
        if (Array.isArray(data)) {
          employeeArray = data;
        } else if (data && Array.isArray(data.employee)) {
          employeeArray = data.employee;
        } else if (data && Array.isArray(data.employees)) {
          employeeArray = data.employees;
        } else if (data && Array.isArray(data.data)) {
          employeeArray = data.data;
        } else {
          console.log('Unexpected data structure:', data);
          toast.error('No employees found for this department');
          return;
        }
        
        if (employeeArray.length > 0) {
          const formattedData = employeeArray.map((employee) => ({
            value: employee._id,
            label: employee.name,
            employeeData: employee,
          }));
          setEmployeeOptions(formattedData);
          console.log('Formatted employee options:', formattedData);
        } else {
          console.log('No employees found in the array');
          toast.info('No employees found for this department');
        }
      } catch (error) {
        console.log('Error fetching employees:', error);
        toast.error('Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDataEmp();
  }, [selectedDepartment]);

  useEffect(() => {
    console.log('Employee options updated:', employeeOptions);
  }, [employeeOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'feasibility') {
      setFormData({
        feasibility: value,
        notFeasibleReason: '',
        feasibleReason: '',
      });
      setSelectedDepartment("");
      setAssignedEmployee(null);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.feasibility) return toast.error('Please select a Feasibility option.');

    if (formData.feasibility === 'feasible') {
      if (!selectedDepartment) return toast.error("Please select a Department to assign.");
      if (!assignedEmployee) return toast.error("Please select an Employee to assign.");
    }

    if (formData.feasibility === 'not-feasible') {
      if (!formData.notFeasibleReason) return toast.error('Please enter the reason in Remarks.');
    }

    const actionData = {};

    actionData.feasibility = formData.feasibility;

    if(actionData.feasibility === 'feasible') {
      actionData.assignedTo = assignedEmployee;
      actionData.feasibleReason = formData.feasibleReason;
    } else if(actionData.feasibility === 'not-feasible') {
      actionData.remark = formData.notFeasibleReason;
    }

    onUpdate(selectedLead._id, actionData);
    onClose();
  };

  return (
    <div className="modal fade show" style={{ display: "flex", alignItems: "center", backgroundColor: "#00000090" }}>
      <div className="modal-dialog modal-lg" style={{ width: "800px", maxWidth: "800px" }}>
        <div className="modal-content p-3">
          <form onSubmit={handleSubmit}>
            <div className="modal-header pt-0">
              <h5 className="card-title fw-bold">Assign Lead</h5>
              <button type="button" onClick={onClose} className="btn-close" aria-label="Close"></button>
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-12 mb-2 mt-2">
                  <label className="form-label fw-bold">Feasibility <RequiredStar /></label>
                  <div className="d-flex gap-4">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="feasibility" id="feasible" value="feasible" 
                      onChange={handleChange} checked={formData.feasibility === 'feasible'} />
                      <label className="form-check-label" htmlFor="feasible">Feasible & Assign</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="feasibility" id="notFeasible" value="not-feasible" 
                      onChange={handleChange} checked={formData.feasibility === 'not-feasible'} />
                      <label className="form-check-label" htmlFor="notFeasible">Not Feasible</label>
                    </div>
                  </div>
                </div>

                <div className="col-12 mt-2" style={{ minHeight: "180px" }}>
                  <div className={formData.feasibility === 'feasible' ? 'row' : 'd-none'}>
                    <div className="col-12 col-lg-6 mt-2">
                      <label htmlFor="department" className="form-label label_text">Assign to Department <RequiredStar /></label>
                      <select id="department" className="form-select rounded-0" onChange={(e) => setSelectedDepartment(e.target.value)} value={selectedDepartment}>
                        <option value="">-- Select Department --</option>
                        {departments?.map((department) => (
                          <option key={department._id} value={department._id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-lg-6 mt-2">
                      <label htmlFor="employee" className="form-label label_text">Assign to Employee <RequiredStar /></label>
                      <ReactSelect
                        id="employee"
                        options={employeeOptions}
                        isClearable
                        isLoading={loading}
                        onChange={(opt) => setAssignedEmployee(opt ? opt.value : null)}
                        value={employeeOptions.find(opt => opt.value === assignedEmployee)}
                        placeholder={loading ? "Loading employees..." : "-- Select Employee --"}
                        noOptionsMessage={() => selectedDepartment ? "No employees found" : "Select a department first"}
                      />
                    </div>
                    
                    <div className="col-12 mt-3">
                      <label htmlFor="feasibleReason" className="form-label fw-bold">Remarks</label>
                      <textarea
                        className="form-control rounded-0"
                        id="feasibleReason"
                        name="feasibleReason"
                        rows="2"
                        placeholder="Enter any optional remarks..."
                        value={formData.feasibleReason}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>

                  <div className={formData.feasibility === 'not-feasible' ? 'row' : 'd-none'}>
                    <div className="col-12 mt-3">
                      <label htmlFor="notFeasibleReason" className="form-label fw-bold">Remarks <RequiredStar /></label>
                      <textarea
                        className="form-control rounded-0"
                        id="notFeasibleReason"
                        name="notFeasibleReason"
                        rows="4"
                        placeholder="Enter the detailed reason for non-feasibility..."
                        value={formData.notFeasibleReason}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>  

            <div className="modal-footer border-0 justify-content-start">
              <button type="submit" className="btn addbtn rounded-0 add_button px-4">Submit</button>
              <button type="button" onClick={onClose} className="btn addbtn rounded-0 Cancel_button px-4">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignMarketingLeadPopUp;