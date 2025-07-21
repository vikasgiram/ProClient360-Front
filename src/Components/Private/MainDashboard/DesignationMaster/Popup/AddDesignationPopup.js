import { useState, useEffect } from "react";
import { getDepartment } from "../../../../../hooks/useDepartment";
import toast from "react-hot-toast";
import { createDesignation } from "../../../../../hooks/useDesignation";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";

const AddDesignationPopup = ({ handleAdd }) => {

  const [getDepartments, setGetDepartments] = useState([]);
  const [department, setDepartment] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [name, setName] = useState("");


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
  //   };
  // }


  // Fetch departments
  useEffect(() => {
    const fetchData = async () => {
      const data = await getDepartment();
      if (data) {
        setGetDepartments(data.departments || []);
      }
    };
    fetchData();
  }, []);



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





  // Handle role addition
  const handleDesignationAdd = async (e) => {
    e.preventDefault();
    const designationData = {
      name,
      department,
      permissions
    };

    if (!name || !department || permissions.length === 0) {
      return toast.error("Please fill all fields");
    }
    // console.log(data);
    
    toast.loading("Creating Designation...")
    const data = await createDesignation(designationData);
    toast.dismiss()
    if(data.success){
      toast.success(data.message);
      handleAdd();
    }else{
      toast.error(data.error);
    }
  };


  return (
    <>
      <div className="modal fade show" style={{ display: "flex", alignItems: 'center', backgroundColor: "#00000090", justifyContent:'center'}}>
        <div className="modal-dialog modal-lg" style={{ maxWidth: "90%", width: "1200px" }}>
          <div className="modal-content add p-3" style={{ width: "100%" }}>
            <form>
              <div className="modal-header pt-0">
                <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                  Create New Designation
                </h5>
                <button
                  onClick={() => handleAdd()}
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
                        value={name}
                        maxLength={50}
                        placeholder="Enter a Designation Name...."
                        onChange={(e) => setName(e.target.value)}
                        className="form-control rounded-0"
                        id="name"
                        aria-describedby="roleNameHelp"
                        required
                      />
                    </div>
                  </div>

                  {/* Department Selection */}
                  <div className="col-12 col-lg-6 my-3">
                    <div className="mb-3">
                      <label htmlFor="Department" className="form-label label_text">
                        Department <RequiredStar />
                      </label>
                      <select
                        className="form-select rounded-0"
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                      >
                        <option value="">Select Department</option>
                        {getDepartments.map((department) => (
                          <option key={department._id} value={department._id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
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
                          {/* <tr>
                          <td>Employee</td>
                          <td>
                            <div>

                              <label class="toggler-wrapper style-22">
                                <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('createEmployee', e.target.checked) 
                                }}
                                
                                />
                                <div class="toggler-slider" >
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>

                              
                            </div>
                          </td>
                          <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('viewEmployee', e.target.checked)}
                                }
                                />
                                 <div class="toggler-slider" >
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td>
                          <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('updateEmployee', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td> <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('deleteEmployee', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td>
                        </tr> */}


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

                          {/* <tr>
                          <td>Project</td>
                          <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('createProject', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td>
                          <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('viewProject', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td>
                          <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('updateProject', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td> <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('deleteProject', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>Task Name</td>
                          <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('createTask', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td>
                          <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('viewTask', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td>
                          <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('updateTask', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td> <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('deleteTask', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td>Task Sheet</td>
                          <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('createTaskSheet', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td>
                          <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('viewTaskSheet', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td>
                          <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('updateTaskSheet', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td> <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('deleteTaskSheet', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td>Department</td>
                          <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('createDepartment', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td>
                          <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('viewDepartment', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td>
                          <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('updateDepartment', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td> <td>
                            <div>
                              <label class="toggler-wrapper style-22">
                              <input type="checkbox"
                                onChange={(e) =>{
                                  setIsChecked(e.target.checked);
                                  handlePermissionChange('deleteDepartment', e.target.checked)}
                                }
                                />
                                <div class="toggler-slider">
                                  <div class="toggler-knob"></div>
                                </div>
                              </label>
                            </div>
                          </td>
                        </tr> */}
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