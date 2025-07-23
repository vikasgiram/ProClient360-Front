import React, { useState, useEffect, useCallback } from "react";
import { getDepartment } from "../../../../../hooks/useDepartment";
import toast from "react-hot-toast";
import Select from "react-select";
import { updateDesignation } from "../../../../../hooks/useDesignation";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";

const PAGE_SIZE = 10;

const UpdateDesignationPopup = ({ handleUpdate, selectedDes }) => {

  const [permissions, setPermissions] = useState([]);
  const [designation, setDesignation] = useState(selectedDes);

  // Department dropdown state
  const [deptOptions, setDeptOptions] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [deptPage, setDeptPage] = useState(1);
  const [deptHasMore, setDeptHasMore] = useState(true);
  const [deptLoading, setDeptLoading] = useState(false);
  const [deptSearch, setDeptSearch] = useState("");


    
  // const DependentCheckboxes = () => {
  //   const [checkboxes, setCheckboxes] = useState({
  //     parent: false,
  //     childA: false,
  //     childB: false,
  //   });
  
  //   // Handler for Parent checkbox
  //   const handleParentChange = () => {
  //     const newParentValue = !checkboxes.parent;
  //     setCheckboxes({
  //       parent: newParentValue,
  //       childA: newParentValue,
  //       childB: newParentValue,
  //     });
  //   };
  
  //   // Handler for individual child checkboxes
  //   const handleChildChange = (childName) => {
  //     setCheckboxes((prevState) => ({
  //       ...prevState,
  //       [childName]: !prevState[childName],
  //     }));
  //   };}
 

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

  // Set selected department when designation data is loaded
  useEffect(() => {
    if (designation?.department?._id && deptOptions.length > 0) {
      const selectedOption = deptOptions.find(opt => opt.value === designation.department._id);
      if (selectedOption) {
        setSelectedDept(selectedOption);
      }
    }
  }, [designation, deptOptions]);



  // const handlePermissionChange = (permission, isChecked) => {
  //   setPermissions(prevPermissions => {
  //     // Create a copy of the existing permissions
  //     let newPermissions = [...prevPermissions];
  
  //     if (isChecked) {
  //       // Add the permission if checked
  //       if (!newPermissions.includes(permission)) {
  //         newPermissions.push(permission);
  //       }
  
  //       // Add dependencies when permission is checked
  //       switch (permission) {
  //         case 'createEmployee':
  //         case 'updateEmployee':
  //           if (!newPermissions.includes('viewDesignation')) {
  //             newPermissions.push('viewDesignation');
  //           }
  //           if (!newPermissions.includes('viewDepartment')) {
  //             newPermissions.push('viewDepartment');
  //           }
  //           break;
  
  //         case 'createProject':
  //         case 'updateProject':
  //           if (!newPermissions.includes('viewCustomer')) {
  //             newPermissions.push('viewCustomer');
  //           }
  //           break;
  
  //         case 'createTaskSheet':
  //           if (!newPermissions.includes('viewDepartment')) {
  //             newPermissions.push('viewDepartment');
  //           }
  //           if (!newPermissions.includes('viewEmployee')) {
  //             newPermissions.push('viewEmployee');
  //           }
  //           break;
  
  //         case 'createDesignation':
  //         case 'updateDesignation':
  //           if (!newPermissions.includes('viewDepartment')) {
  //             newPermissions.push('viewDepartment');
  //           }
  //           break;
  
  //       }
  //     } else {
  //       // Remove the permission if unchecked
  //       newPermissions = newPermissions.filter(p => p !== permission);
  //       // console.log(newPermissions,"unchecked");
  
  //       switch (permission) {
  //         case 'createEmployee':
  //         case 'updateEmployee':
  //           newPermissions = newPermissions.filter(p => p !== 'viewDesignation' && p !== 'viewDepartment');
  //           break;
  
  //         case 'createProject':
  //         case 'updateProject':
  //           newPermissions = newPermissions.filter(p => p !== 'viewCustomer');
  //           break;
  
  //         case 'createTaskSheet':
  //           newPermissions = newPermissions.filter(p => p !== 'viewDepartment' && p !== 'viewEmployee');
  //           break;
  
  //         case 'createDesignation':
  //         case 'updateDesignation':
  //           newPermissions = newPermissions.filter(p => p !== 'viewDepartment');
  //           break;
  
  //       }
  //     }
  
  //     return newPermissions;
  //   });
  // };
  
  const handlePermissionChange = (permission, isChecked) => {
    setDesignation((prevDesignation) => {
      let newPermissions = [...prevDesignation.permissions];
      if (isChecked) {
        if (!newPermissions.includes(permission)) {
          newPermissions.push(permission);
        }
      } else {
        newPermissions = newPermissions.filter(p => p !== permission);
      }
      return {
        ...prevDesignation,
        permissions: newPermissions,
      };
    });
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setDesignation((prevDesignation) => ({
      ...prevDesignation,
      [name]: value,
    }));
  };

  // Handle department selection
  const handleDepartmentChange = (selectedOption) => {
    setSelectedDept(selectedOption);
    setDesignation((prevDesignation) => ({
      ...prevDesignation,
      department: selectedOption ? selectedOption.value : null,
    }));
  };

  

  // Handle role addition
  const handleUpdateDesignation = async (e) => {
    e.preventDefault();
    if(!designation.name || !designation.department){
      return toast.error("Please fill all fields");
    }
    if(designation.permissions.length === 0){
      return toast.error("Please select at least one permission");
    }
   try{
    toast.loading("Updating Designation...")
    const data = await updateDesignation(designation);
    toast.dismiss()
    if(data.success){
      toast.success(data.message);
      handleUpdate();
    }else{
      toast.error(data.error);
    }
   }catch(error){
    toast.error(error.response.data.error);
   }
  };


  return (
    <>
      <div className="modal fade show" style={{ display: "flex", alignItems: 'center', backgroundColor: "#00000090" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content p-3">
            <form onSubmit={handleUpdateDesignation}>
            <div className="modal-header pt-0">
              <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                Update Designation
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
            <div className="modal-body">

              <div className="row modal_body_height">
               
                <div className="col-12">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label label_text">
                      Designation Name <RequiredStar />
                    </label>
                    <input
                      type="text"
                      placeholder="Update Designation Name...."
                      maxLength={40}
                      value={designation.name}
                      onChange={handleInputChange}
                      className="form-control rounded-0"
                      id="name"
                      name="name"
                      required
                      aria-describedby="roleNameHelp"
                    />
                  </div>
                </div>

                {/* Department Selection */}
                <div className="col-12 col-lg-6 my-3">
                  <div className="mb-3">
                    <label htmlFor="Department" className="form-label label_text">
                      Department <RequiredStar />
                    </label>
                    <Select
                      value={selectedDept}
                      onChange={handleDepartmentChange}
                      onInputChange={(inputValue) => setDeptSearch(inputValue)}
                      options={deptOptions}
                      isLoading={deptLoading}
                      onMenuScrollToBottom={() => {
                        if (deptHasMore && !deptLoading) {
                          loadDepartments(deptPage, deptSearch);
                        }
                      }}
                      placeholder="Select Department..."
                      isClearable
                      menuPlacement="auto"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          borderRadius: '0px',
                          border: '1px solid #ced4da',
                          '&:hover': {
                            border: '1px solid #ced4da',
                          },
                        }),
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 9999,
                        }),
                      }}
                    />
                  </div>
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
                        id="permissions"
                        name="createEmployee"
                          checked={designation.permissions.includes('createEmployee')}
                          onChange={(e) => handlePermissionChange('createEmployee', e.target.checked)}
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
                        name="viewEmployee"
                        id="permissions"
                          checked={designation.permissions.includes('viewEmployee')}
                          onChange={(e) => handlePermissionChange('viewEmployee', e.target.checked)}
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
                        id="permissions"
                        name="updateEmployee"
                          checked={designation.permissions.includes('updateEmployee')}
                          onChange={(e) => handlePermissionChange('updateEmployee', e.target.checked)}
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
                        id="permissions"
                        name="deleteEmployee"
                          checked={designation.permissions.includes('deleteEmployee')}
                          onChange={(e) => handlePermissionChange('deleteEmployee', e.target.checked)}
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
                        id="permissions"
                        name="createCustomer"
                          checked={designation.permissions.includes('createCustomer')}
                          onChange={(e) => handlePermissionChange('createCustomer', e.target.checked)}
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
                        id="permissions"
                        name="viewCustomer"
                          checked={designation.permissions.includes('viewCustomer')}
                          onChange={(e) => handlePermissionChange('viewCustomer', e.target.checked)}
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
                        id="permissions"
                        name="updateCustomer"
                          checked={designation.permissions.includes('updateCustomer')}
                          onChange={(e) => handlePermissionChange('updateCustomer', e.target.checked)}
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
                        id="permissions"
                        name="deleteCustomer"
                          checked={designation.permissions.includes('deleteCustomer')}
                          onChange={(e) => handlePermissionChange('deleteCustomer', e.target.checked)}
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
                          id="permissions"
                          name="createProject"
                          checked={designation.permissions.includes('createProject')}
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
                        id="permissions"
                        name="viewProject"
                          checked={designation.permissions.includes('viewProject')}
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
                        id="permissions"
                        name="updateProject"
                          checked={designation.permissions.includes('updateProject')}
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
                        id="permissions"
                        name="deleteProject"
                          checked={designation.permissions.includes('deleteProject')}
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
                        id="permissions"
                        name="createTask"
                          checked={designation.permissions.includes('createTask')}
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
                        id="permissions"
                        name="viewTask"
                          checked={designation.permissions.includes('viewTask')}
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
                        id="permissions"
                        name="updateTask"
                          checked={designation.permissions.includes('updateTask')}
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
                        id="permissions"
                        name="deleteTask"
                          checked={designation.permissions.includes('deleteTask')}
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
                        id="permissions"
                        name="createTaskSheet"
                          checked={designation.permissions.includes('createTaskSheet')}
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
                        id="permissions"
                        name="viewTaskSheet"
                          checked={designation.permissions.includes('viewTaskSheet')}
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
                        id="permissions"
                        name="updateTaskSheet"
                          checked={designation.permissions.includes('updateTaskSheet')}
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
                        id="permissions"
                        name="deleteTaskSheet"
                          checked={designation.permissions.includes('deleteTaskSheet')}
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
                        id="permissions"
                        name="createDepartment"
                          checked={designation.permissions.includes('createDepartment')}
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
                        id="permissions"
                        name="viewDepartment"
                          checked={designation.permissions.includes('viewDepartment')}
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
                        id="permissions"
                        name="updateDepartment"
                          checked={designation.permissions.includes('updateDepartment')}
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
                        id="permissions"
                        name="deleteDepartment"
                          checked={designation.permissions.includes('deleteDepartment')}
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
                        id="permissions"
                        name="createDesignation"
                          checked={designation.permissions.includes('createDesignation')}
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
                        id="permissions"
                        name="viewDesignation"
                          checked={designation.permissions.includes('viewDesignation')}
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
                        id="permissions"
                        name="updateDesignation"
                        checked={designation.permissions.includes('updateDesignation')}
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
                        name="deleteDesignation"
                        id="permissions"
                          checked={designation.permissions.includes('deleteDesignation')}
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
                        id="permissions"
                        name="createService"
                          checked={designation.permissions.includes('createService')}
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
                        id="permissions"
                        name="viewService"
                          checked={designation.permissions.includes('viewService')}
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
                        id="permissions"
                        name="updateService"
                          checked={designation.permissions.includes('updateService')}
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
                        id="permissions"
                        name="deleteService"
                          checked={designation.permissions.includes('deleteService')}
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
  <td>Leads</td>
  <td>
    <div>
      <label className="toggler-wrapper style-22">
        <input type="checkbox"
        id="permissions"
        name="createLead"
          checked={designation.permissions.includes('createLead')}
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
        id="permissions"
        name="viewLead"
          checked={designation.permissions.includes('viewLead')}
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
        id="permissions"
        name="updateLead"
        checked={designation.permissions.includes('updateLead')}
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
        name="deleteLead"
        id="permissions"
          checked={designation.permissions.includes('deleteLead')}
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
        id="permissions"
        name="createFeedback"
          checked={designation.permissions.includes('createFeedback')}
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
        id="permissions"
        name="viewFeedback"
          checked={designation.permissions.includes('viewFeedback')}
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
        <input type="checkbox"
        id="permissions"
        name="updateFeedback"
        checked={designation.permissions.includes('updateFeedback')}
          // add the onchage
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
        <input type="checkbox"
        name="deleteFeedback"
        id="permissions"
          checked={designation.permissions.includes('deleteFeedback')}
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
        id="permissions"
        name="assignLead"
          checked={designation.permissions.includes('assignLead')}
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
        id="permissions"
        name="viewMarketingDashboard"
          checked={designation.permissions.includes('viewMarketingDashboard')}
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
        <input type="checkbox"
        id="permissions"
        name="updateFeedback"
        checked={designation.permissions.includes('updateFeedback')}

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
        <input type="checkbox"
        name="deleteFeedback"
        id="permissions"
          checked={designation.permissions.includes('deleteFeedback')}
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
                    className="w-80 btn addbtn rounded-0 add_button m-2 px-4"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdate}
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

export default UpdateDesignationPopup;