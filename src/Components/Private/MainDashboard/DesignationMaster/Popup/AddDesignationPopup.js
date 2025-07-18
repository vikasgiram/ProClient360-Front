import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Select from "react-select";
import { getDepartment } from "../../../../../hooks/useDepartment";
import { createDesignation } from "../../../../../hooks/useDesignation";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";

const PAGE_SIZE = 10;

const AddDesignationPopup = ({ handleAdd }) => {
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState([]);

  // Department dropdown state
  const [deptOptions, setDeptOptions] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [deptPage, setDeptPage] = useState(1);
  const [deptHasMore, setDeptHasMore] = useState(true);
  const [deptLoading, setDeptLoading] = useState(false);
  const [deptSearch, setDeptSearch] = useState("");

  // Fetch departments with pagination & search
  const loadDepartments = useCallback(async (page, search) => {
    if (deptLoading || !deptHasMore) return;
    setDeptLoading(true);
    const data = await getDepartment(page, PAGE_SIZE, search);

    if (data.error) {
      toast.error(data.error || 'Failed to load departments');
      setDeptLoading(false);
      return;
    }

    const newOpts = (data.departments || []).map(d => ({ value: d._id, label: d.name }));
    setDeptOptions(prev => page === 1 ? newOpts : [...prev, ...newOpts]);
    setDeptHasMore(newOpts.length === PAGE_SIZE);
    setDeptLoading(false);
    setDeptPage(page + 1);
  }, [deptLoading, deptHasMore]);

  // Initial & search-triggered load (reset on search)
  useEffect(() => {
    setDeptPage(1);
    setDeptHasMore(true);
    setDeptOptions([]);
    loadDepartments(1, deptSearch);
  }, [deptSearch]);



  const handlePermissionChange = (permission, isChecked) => {
    setPermissions(prevPermissions => {
      // Create a copy of the existing permissions
      let newPermissions = [...prevPermissions];

      if (isChecked) {
        // Add the permission if checked
        if (!newPermissions.includes(permission)) {
          newPermissions.push(permission);
        }

        // Add dependencies when permission is checked
        switch (permission) {
          case 'createEmployee':
          case 'updateEmployee':
            if (!newPermissions.includes('viewDesignation')) {
              newPermissions.push('viewDesignation');
            }
            if (!newPermissions.includes('viewDepartment')) {
              newPermissions.push('viewDepartment');
            }
            break;

          case 'createProject':
          case 'updateProject':
            if (!newPermissions.includes('viewCustomer')) {
              newPermissions.push('viewCustomer');
            }
            break;

          case 'createTaskSheet':
            if (!newPermissions.includes('viewDepartment')) {
              newPermissions.push('viewDepartment');
            }
            if (!newPermissions.includes('viewEmployee')) {
              newPermissions.push('viewEmployee');
            }
            break;

          case 'createDesignation':
          case 'updateDesignation':
            if (!newPermissions.includes('viewDepartment')) {
              newPermissions.push('viewDepartment');
            }
            break;

        }
      } else {
        // Remove the permission if unchecked
        newPermissions = newPermissions.filter(p => p !== permission);
        // console.log(newPermissions,"unchecked");

        switch (permission) {
          case 'createEmployee':
          case 'updateEmployee':
            newPermissions = newPermissions.filter(p => p !== 'viewDesignation' && p !== 'viewDepartment');
            break;

          case 'createProject':
          case 'updateProject':
            newPermissions = newPermissions.filter(p => p !== 'viewCustomer');
            break;

          case 'createTaskSheet':
            newPermissions = newPermissions.filter(p => p !== 'viewDepartment' && p !== 'viewEmployee');
            break;

          case 'createDesignation':
          case 'updateDesignation':
            newPermissions = newPermissions.filter(p => p !== 'viewDepartment');
            break;

        }
      }

      return newPermissions;
    });
  };





  // Handle form submission
  const handleDesignationAdd = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      department: selectedDept?.value,
      permissions
    };

    if (!payload.name || !payload.department || permissions.length === 0) {
      return toast.error("Please fill all fields");
    }

    const res = await createDesignation(payload);
    if (res.success) {
      toast.success(res.message);
      handleAdd();
    } else {
      toast.error(res.error || 'Failed to create');
    }
  };

  return (
    <>
    <div className="modal fade show" style={{ display: "flex", alignItems: 'center', backgroundColor: "#00000090" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-3">
          <form onSubmit={handleDesignationAdd}>
            <div className="modal-header pt-0">
              <h5 className="card-title fw-bold">Create New Designation</h5>
              <button type="button" className="close px-3 " style={{ marginLeft: "auto" }} onClick={handleAdd}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row modal_body_height">
                <div className="col-12 mb-3">
                  <label htmlFor="name" className="form-label label_text">
                    Designation Name <RequiredStar />
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={50}
                    placeholder="Enter a Designation Name..."
                    className="form-control rounded-0"
                    required
                  />
                </div>

                <div className="col-12 col-lg-6 mb-3">
                  <label className="form-label label_text">
                    Department <RequiredStar />
                  </label>
                  <Select
                    options={deptOptions}
                    value={selectedDept}
                    onChange={opt => setSelectedDept(opt)}
                    onInputChange={val => setDeptSearch(val)}
                    onMenuScrollToBottom={() => loadDepartments(deptPage, deptSearch)}
                    isLoading={deptLoading}
                    placeholder="Search and select department..."
                    noOptionsMessage={() => deptLoading ? 'Loading...' : 'No departments'}
                    // keep menu open on select if needed:
                    closeMenuOnSelect={true}
                  />
                </div>
                  <div className="col-10 col-lg-12">

                    <label htmlFor="permissions" className="form-label label_text">
                      Permissions
                    </label>

                    <div className="table-responsive">
                      <table className="table table-striped table-class" id="table-id">

                        <tr className="th_border" >
                          <th >Form Level Details</th>
                          <th >Add</th>
                          <th >View</th>
                          <th>Update</th>
                          <th >Delete</th>
                        </tr>
                        <tbody>
                          <tr>
                            <td>Employee</td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('createEmployee')}
                                    onChange={(e) => {
                                      handlePermissionChange('createEmployee', e.target.checked);
                                    }}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('viewEmployee')}
                                    onChange={(e) => {
                                      handlePermissionChange('viewEmployee', e.target.checked);
                                    }}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('updateEmployee')}
                                    onChange={(e) => {
                                      handlePermissionChange('updateEmployee', e.target.checked);
                                    }}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('deleteEmployee')}
                                    onChange={(e) => {
                                      handlePermissionChange('deleteEmployee', e.target.checked);
                                    }}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td>Customer</td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('createCustomer')}
                                    onChange={(e) => {
                                      handlePermissionChange('createCustomer', e.target.checked);
                                    }}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('viewCustomer')}
                                    onChange={(e) => {
                                      handlePermissionChange('viewCustomer', e.target.checked);
                                    }}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('updateCustomer')}
                                    onChange={(e) => {
                                      handlePermissionChange('updateCustomer', e.target.checked);
                                    }}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('deleteCustomer')}
                                    onChange={(e) => {
                                      handlePermissionChange('deleteCustomer', e.target.checked);
                                    }}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td>Project</td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('createProject')}
                                    onChange={(e) => handlePermissionChange('createProject', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('viewProject')}
                                    onChange={(e) => handlePermissionChange('viewProject', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('updateProject')}
                                    onChange={(e) => handlePermissionChange('updateProject', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('deleteProject')}
                                    onChange={(e) => handlePermissionChange('deleteProject', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>Task Name</td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('createTask')}
                                    onChange={(e) => handlePermissionChange('createTask', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('viewTask')}
                                    onChange={(e) => handlePermissionChange('viewTask', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('updateTask')}
                                    onChange={(e) => handlePermissionChange('updateTask', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('deleteTask')}
                                    onChange={(e) => handlePermissionChange('deleteTask', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>Task Sheet</td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('createTaskSheet')}
                                    onChange={(e) => handlePermissionChange('createTaskSheet', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('viewTaskSheet')}
                                    onChange={(e) => handlePermissionChange('viewTaskSheet', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('updateTaskSheet')}
                                    onChange={(e) => handlePermissionChange('updateTaskSheet', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('deleteTaskSheet')}
                                    onChange={(e) => handlePermissionChange('deleteTaskSheet', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>Department</td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('createDepartment')}
                                    onChange={(e) => handlePermissionChange('createDepartment', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('viewDepartment')}
                                    onChange={(e) => handlePermissionChange('viewDepartment', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('updateDepartment')}
                                    onChange={(e) => handlePermissionChange('updateDepartment', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('deleteDepartment')}
                                    onChange={(e) => handlePermissionChange('deleteDepartment', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>Designation</td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('createDesignation')}
                                    onChange={(e) => handlePermissionChange('createDesignation', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('viewDesignation')}
                                    onChange={(e) => handlePermissionChange('viewDesignation', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('updateDesignation')}
                                    onChange={(e) => handlePermissionChange('updateDesignation', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('deleteDesignation')}
                                    onChange={(e) => handlePermissionChange('deleteDesignation', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td>Service</td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('createService')}
                                    onChange={(e) => handlePermissionChange('createService', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('viewService')}
                                    onChange={(e) => handlePermissionChange('viewService', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('updateService')}
                                    onChange={(e) => handlePermissionChange('updateService', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('deleteService')}
                                    onChange={(e) => handlePermissionChange('deleteService', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td>Lead</td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('createLead')}
                                    onChange={(e) => handlePermissionChange('createLead', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('viewLead')}
                                    onChange={(e) => handlePermissionChange('viewLead', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('updateLead')}
                                    onChange={(e) => handlePermissionChange('updateLead', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('deleteLead')}
                                    onChange={(e) => handlePermissionChange('deleteLead', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                          </tr>


                          <tr>
                            <td>Feedback</td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('createFeedback')}
                                    onChange={(e) => handlePermissionChange('createFeedback', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('viewFeedback')}
                                    onChange={(e) => handlePermissionChange('viewFeedback', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-23">
                                  <input type="checkbox" disabled
                                    checked={permissions.includes('updateFeedback')}
                                    onChange={(e) => handlePermissionChange('updateFeedback', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-23">
                                  <input type="checkbox" disabled
                                    checked={permissions.includes('deleteFeedback')}
                                    onChange={(e) => handlePermissionChange('deleteFeedback', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td>Marketing</td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('assignLead')}
                                    onChange={(e) => handlePermissionChange('assignLead', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-22">
                                  <input type="checkbox"
                                    checked={permissions.includes('viewMarketingDashboard')}
                                    onChange={(e) => handlePermissionChange('viewMarketingDashboard', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-23">
                                  <input type="checkbox" disabled
                                    checked={permissions.includes('updateFeedback')}
                                    onChange={(e) => handlePermissionChange('updateFeedback', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div>
                                <label className="toggler-wrapper style-23">
                                  <input type="checkbox" disabled
                                    checked={permissions.includes('deleteFeedback')}
                                    onChange={(e) => handlePermissionChange('deleteFeedback', e.target.checked)}
                                  />
                                  <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                  </div>
                                </label>
                              </div>
                            </td>
                          </tr>




                        </tbody>
                      </table>
                    </div>
                  </div>


                  <div className="col-12 pt-3 mt-2">
                    <button
                      type="submit"
                      onClick={handleDesignationAdd}
                      className="w-80 btn addbtn rounded-0 add_button m-2 px-4"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="w-80 btn addbtn rounded-0 Cancel_button m-2 px-4"
                    >
                      Cancel
                    </button>
                  </div>

                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      </>
  );
};

export default AddDesignationPopup;