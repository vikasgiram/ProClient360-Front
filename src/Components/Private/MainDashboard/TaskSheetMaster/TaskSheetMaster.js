import React, { useEffect, useState, useCallback } from "react";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import { ViewMode, Gantt } from "gantt-task-react";
import { initTasks } from "../../../Helper/GanttChartHelper";
import "gantt-task-react/dist/index.css";
import { ViewSwitcher } from "../../../Helper/ViewSwitcher";
import { default as ReactSelect } from "react-select";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskSheet, createTaskSheet, deleteTaskSheet } from "../../../../hooks/useTaskSheet";
import toast from "react-hot-toast";
import { getTask } from "../../../../hooks/useTask";
import { getEmployees } from "../../../../hooks/useEmployees";
// Removed department import
import AddTaskPopUp from "../TaskMaster/PopUp/AddTaskPopUp";
import { getAllActions } from "../../../../hooks/useAction";
import { formatDateforEditAction } from "../../../../utils/formatDate";
import { RequiredStar } from "../../RequiredStar/RequiredStar";


const PAGE_SIZE = 10;

export const TaskSheetMaster = () => {
  
  const navigate = useNavigate();


  /**
   * Component for displaying a Gantt chart of a project's tasks.
   *
   * The component fetches the project data from the server and transforms it
   * into a format that can be used by the Gantt component. It also provides
   * functionality for adding new tasks to the project.
   *
   * @returns {JSX.Element} The component.
   */
  const [isopen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isopen);
  };

  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const [view, setView] = React.useState(ViewMode.Day);
  const [tasks, setTasks] = React.useState(initTasks());
  const [isChecked, setIsChecked] = React.useState(true);

  const [employees, setEmployees] = useState([]);
  // Removed duplicate employeeOptions declaration
  const [taskName, setTaskName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remark, setRemark] = useState("");
  const [taskDropDown, setTaskDropDown] = useState([]);
  
  // Employee dropdown state
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeePage, setEmployeePage] = useState(1);
  const [employeeHasMore, setEmployeeHasMore] = useState(true);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  
  const [projectName, setProjectName] = useState("");
  const [renderPage, setRenderPage] = useState(false);
  const [taskAddPopUpShow, setTaskAddPopUpShow] = useState(false);
  const [forTask, setForTask] = useState();
  const [showAction, setShowAction] = useState(false);



  // Fetch employees with pagination & search
  const loadEmployees = useCallback(async (page = 1, search = "") => {
    setEmployeeLoading(true);
    try {
      const data = await getEmployees(page, PAGE_SIZE, search);
      if (data && data.employees) {
        const newOpts = data.employees.map(emp => ({ value: emp._id, label: emp.name }));
        setEmployeeOptions(prev => page === 1 ? newOpts : [...prev, ...newOpts]);
        setEmployeeHasMore(newOpts.length === PAGE_SIZE);
      }
    } catch (error) {
      toast.error("Failed to load employees");
    }
    setEmployeeLoading(false);
  }, []);

  useEffect(() => {
    setEmployeePage(1);
    setEmployeeHasMore(true);
    setEmployeeOptions([]);
    loadEmployees(1, employeeSearch);
  }, [employeeSearch]);

  let columnWidth = 90;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  const handleAdd = async (event) => {
    event.preventDefault();
    await handleTaskAdd();
  };
  const handleTaskSelection = (value) => {
    if (value === "AddNewTask") {
      setTaskAddPopUpShow(!taskAddPopUpShow);
      
    } else {
      setTaskName(value); // Update task name for selected task
    }
    // setTaskAddPopUpShow(!taskAddPopUpShow);
  };
 const handleTaskCancel =()=>{

  setTaskAddPopUpShow(!taskAddPopUpShow);
 }
  const forActionShow = async (id) => {
    const data = await getAllActions(id);
    setForTask(data?.actions);
    setShowAction(true);
  }

  const handleTaskDelete = (task) => {
    confirmAlert({
      title: 'Confirm to Delete',
      message: `Are you sure to delete ` + task.name + ` ?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await deleteTaskSheet(task.id);
            setTasks(tasks.filter((t) => t.id !== task.id));
          }
        },
        {
          label: 'No',
          onClick: () => {
            return
          }
        }
      ]
    });
  };
  const handleProgressChange = async (task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    // console.log("On progress change Id:" + task.id);
  };
  const handleDblClick = (task) => {
    // alert("On Double Click event Id:" + task.type);
    if(task.type==='task')
    forActionShow(task.id);
  };

  const handleSelect = (task, isSelected) => {
    // console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };
  const handleExpanderClick = (task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    // console.log("On expander click Id:" + task.id);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTaskSheet(id);
        // console.log(response);

        setProjectName(response.task[0].project);

        const transformedTasks = transformProjectToTasks(response); // Transform the data

        setTasks(transformedTasks);
        // console.log("Transformed tasks: ", response);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };
    fetchData();
  }, [id, renderPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTask();
        if (data) {
          setTaskDropDown(data.task || []);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [taskAddPopUpShow]);
  // console.log(taskName,"task n ");

  // Removed department-based employee fetch

  const transformProjectToTasks = (projectData) => {
    // Extract project information from the task array
    const project = projectData.task[0].project;
    // Create a project task entry

    const projectTask = {
      id: project._id,
      name: project.name,
      start: new Date(project.startDate),
      end: new Date(project.endDate),
      progress: project.completeLevel || 0, // Set default to 0 if undefined
      type: "project",
      hideChildren: false,
    };

    // Map the tasks within the project
    const taskList = projectData.task.map((task) => ({
      id: task._id,
      name: task.taskName.name, // Access taskName object
      start: new Date(task.startDate),
      end: new Date(task.endDate),
      project: project._id, // Associate with project ID
      type: "task",
      progress: task.taskLevel || 0, // Set default to 0 if undefined
    }));

    // console.log("Task list"+taskList);
    // Return an array containing the project task followed by its task list
    return [projectTask, ...taskList];
  };


  const handleTaskAdd = async (event) => {
    // event.preventDefault();
    const employeeIds = selectedEmployees.map(emp => emp.value);
    const data = {
      project: id,
      employees: employeeIds,
      taskName,
      startDate,
      endDate,
      remark,
    };
    if (!selectedEmployees.length || !taskName || !startDate || !endDate ) {
      return toast.error("Please fill all fields");
    }

    
    if(startDate>endDate){
      return toast.error("Start date should be less than end date");
    }

    await createTaskSheet(data);
    setRenderPage(!renderPage);
    toast.success("Task added successfully");
    clearForm();
  };

  const clearForm = () => {
    setTaskName("");
    setStartDate("");
    setEndDate("");
    setRemark("");
    setSelectedEmployees([]);
  };

  return (
    <>
      {loading && (
        <div className="overlay">
          <span className="loader"></span>
        </div>
      )}
      <div className="container-scroller">
        <div className="row background_main_all">
          <form onSubmit={handleAdd}>
            <Header toggle={toggle} isopen={isopen} />
            <div className="container-fluid page-body-wrapper">
              <Sidebar isopen={isopen} active="TaskSheetMaster" id={id} style={{ width: isopen ? "" : "calc(100%  - 120px )", marginLeft: isopen ? "" : "125px" }} />

              <div
                className="main-panel"
                style={{
                  width: isopen ? "" : "calc(100%  - 120px )",
                  marginLeft: isopen ? "" : "125px",
                }}
              >
                <div className="content-wrapper ps-3 ps-md-0 pt-3">

               <div className="col-12 col-lg-12 mx-auto mb-4 mb-lg-0 pt-4 ">
                  <button className="btn btn-outline-light d-flex align-items-center" onClick={() => navigate('/ProjectMasterGrid')}>             
                  <i className="fa-solid text-light fa-angle-left me-2"></i>  Back 
                   </button>
                </div>

                  <div className="row px-2 py-1   ">
                    <div className="col-12 col-lg-6">
                      <h5 className="text-white py-2">

                        <span className="fw-light">Project Name : </span> {projectName && projectName.name + " - " + projectName?.custId?.custName}
                      </h5>
                    </div>
                  </div>

                  <div className="row  bg-white p-2 m-1 border rounded">
                    <div className="col-12 col-md-6 col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="taskName"
                          className="form-label label_text"
                        >
                          Task Name <RequiredStar/>
                        </label>
                        <select
                          className="form-select rounded-0"
                          aria-label="Default select example"
                          onChange={(e) => handleTaskSelection(e.target.value)}
                          value={taskName}
                          required
                        >
                          <option value="">-- Select Task Name --</option>
                          {taskDropDown &&
                            taskDropDown.map((task) => (
                              <option key={task._id} value={task._id}>{task.name}</option>
                            ))}
                          <option value="AddNewTask" >-- Add New Task --</option>
                        </select>
                        {/* <button
                          onClick={() => {
                            handleAddTaskName();
                          }}
                          type="button"
                          className="btn adbtn btn-success px-4 me-sm-4 mx-auto"
                        >
                          {" "}
                          <i className="fa-solid fa-plus" 
                        
                          ></i> Add Task
                        </button> */}
                      </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-3">
                      <div className="mb-3">
                        <label
                          for="startDate"
                          className="form-label label_text"
                        >
                          Start Date <RequiredStar/>
                        </label>
                        <input
                          type="date"
                          className="form-control rounded-0"
                          id="startDate"
                          onChange={(e) => setStartDate(e.target.value)}
                          value={startDate}
                          aria-describedby="emailHelp"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-3">
                      <div className="mb-3">
                        <label for="endDate" className="form-label label_text">
                          End Date <RequiredStar/>
                        </label>
                        <input
                          type="date"
                          className="form-control rounded-0"
                          id="endDate"
                          onChange={(e) => setEndDate(e.target.value)}
                          value={endDate}
                          aria-describedby="emailHelp"
                          required
                        />
                      </div>
                    </div>

                    {/* Removed Department Dropdown */}


                    <div className="col-12 col-md-6 col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="employeeSelect"
                          className="form-label label_text"
                        >
                          Employee Name <RequiredStar/>
                        </label>
                        <Select
                          id="employeeSelect"
                          options={employeeOptions}
                          value={selectedEmployees}
                          isMulti
                          onChange={opts => setSelectedEmployees(opts || [])}
                          onInputChange={val => {
                            setEmployeeSearch(val);
                            setEmployeePage(1);
                          }}
                          onMenuScrollToBottom={() => {
                            if (employeeHasMore) {
                              const nextPage = employeePage + 1;
                              setEmployeePage(nextPage);
                              loadEmployees(nextPage, employeeSearch);
                            }
                          }}
                          placeholder="Search and select employees..."
                          isClearable
                          isLoading={employeeLoading}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              borderRadius: 0,
                              borderColor: '#ced4da',
                              fontSize: '16px',
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#f8f9fa' : 'white',
                              color: state.isSelected ? 'white' : '#212529',
                            }),
                          }}
                          noOptionsMessage={() => employeeLoading ? 'Loading...' : 'No employees'}
                          closeMenuOnSelect={false}
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-3">
                      <div className="mb-3">
                        <label
                          for="ProjectName"
                          className="form-label label_text"
                        >
                          Remark
                        </label>
                        <textarea
                          onChange={(e) => setRemark(e.target.value)}
                          value={remark}
                          className="textarea_edit col-12"
                          id=""
                          name=""
                          placeholder=""
                          rows="1"
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-12 col-lg-3  pt-3 mt-3 ">
                      <button
                        
                        type="submit"
                        className="btn adbtn btn-success px-4 me-lg-4 mx-auto"
                      >
                      
                        <i className="fa-solid fa-plus"></i> Add
                      </button>
                      <button
                        onClick={() => {
                          clearForm();
                        }}
                        type="button"
                        className="btn adbtn btn-danger  px-4 mx-auto"
                      >
               
                        <i className="fa-solid fa-xmark"></i> Clear
                      </button>
                    </div>

                    <div className="col-12 py-2 div_scroll">
                      <div>
                        <ViewSwitcher
                          onViewModeChange={(viewMode) => setView(viewMode)}
                          onViewListChange={setIsChecked}
                          isChecked={isChecked}
                        />
                        <Gantt
                          tasks={tasks}
                          viewMode={view}
                          // onDateChange={handleTaskChange}
                          onDelete={handleTaskDelete}
                          onProgressChange={handleProgressChange}
                          onDoubleClick={handleDblClick}
                          onSelect={handleSelect}
                          onExpanderClick={handleExpanderClick}
                          listCellWidth={isChecked ? "155px" : ""}
                          columnWidth={columnWidth}
                          barBackgroundColor="blue"
                          rowHeight={40}
                          fontSize={12}
                        />
                        {taskAddPopUpShow ? (
                          <AddTaskPopUp
                            handleAdd={handleTaskSelection}
                          // heading="Forward"
                          cancelBtnCallBack={handleTaskCancel}
                          />
                        ) : (
                          <></>
                        )}
                        {/* <h3>Gantt With Limited Height</h3>
                                            <Gantt
                                                tasks={tasks}
                                                viewMode={view}
                                                onDateChange={handleTaskChange}
                                                onDelete={handleTaskDelete}
                                                onProgressChange={handleProgressChange}
                                                onDoubleClick={handleDblClick}
                                                onSelect={handleSelect}
                                                onExpanderClick={handleExpanderClick}
                                                listCellWidth={isChecked ? "155px" : ""}
                                                ganttHeight={300}
                                                columnWidth={columnWidth}
                                            /> */}
                      </div>
                    </div>

                    {showAction ? (<div className="col-12 col-lg-12  mx-auto  rounded ">

                      <div className="row  bg-white ms-lg-1 pt-5 rounded p-lg-3">


                        <div className="col-12 col-lg-6">
                          <h6 className="mb-0 fw-bold mb-3 text-warning-dark">Task Name </h6>
                        </div>


                        <div className="col-12 col-lg-6 text-end">
                          <span
                            onClick={() => setShowAction(false)}
                            type="button"
                            className="close  px-3"
                          // style={{ marginLeft: "1150px" }}
                          >
                            <span aria-hidden="true">&times;</span>
                          </span>
                        </div>


                        <div className="col-12">
                          <div className="shadow_custom ">
                            <div className="table-responsive">
                              <table className="table align-items-center table-flush">
                                <thead className="thead-light">
                                  <tr>
                                    <th className="text-center">Action</th>
                                    <th className="text-center">Action By</th>
                                    <th className="text-center">Start Time </th>
                                    <th className="text-center">End Time</th>
                                    <th className="text-center">Completion</th>
                                  </tr>
                                </thead>

                                {forTask && forTask.length !== 0 ? (


                                  <tbody>
                                    {forTask && forTask.map((action) => (
                                      <tr className="text-center" >
                                        <td>{action.action}</td>
                                        <td>{action.actionBy.name}</td>
                                        <td>{formatDateforEditAction(action.startTime)}</td>
                                        <td>{formatDateforEditAction(action.endTime)}</td>
                                        <td className="text-center">
                              <div className="d-flex align-items-center"
                                style={{ justifyContent: "center" }}
                              >
                              {action.complated}%
                                  <span className="progress"
                                        style={{ marginLeft: "10px" }}
                                  >
                                    <div
                                      className="progress-bar bg-warning"
                                      role="progressbar"
                                      aria-valuenow={action.complated}
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                      style={{
                                        width: `${action.complated}%`,
                                      }}
                                    ></div>
                                  </span>
                                
                              </div>
                            </td>
                                      </tr>
                                    ))}

                                  </tbody>
                                ) : (<h6 style={{ marginLeft: "450px" }}>No Action performed....</h6>)}
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>) : (<></>)}


                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};