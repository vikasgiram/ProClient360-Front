import { useState, useEffect } from "react";
import TaskListUpdatedPopUp from "./TaskListUpdatedPopUp";
import { getMyTaskSheet } from "../../../../../hooks/useTaskSheet";
import { formatDate } from "../../../../../utils/formatDate";

const ViewTaskPopUp = ({ handleViewTask, selectedId }) => {
  const [updateTaskPopUpShow, setUpdateTaskPopUpShow] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState({});

  const handleUpdateTask = (id) => {
    setSelectedTask(id);
    setUpdateTaskPopUpShow(!updateTaskPopUpShow);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMyTaskSheet(selectedId);
      if (data) {
        setTasks(data.task || []);
        // setLoading(false);
      }
    };

    fetchData();
  }, [updateTaskPopUpShow]);

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
        <div className="modal-dialog modal-xl modal_table_width">
          <div className="modal-content p-3">
            <form
            // onSubmit={handleEmployeeAdd}
            >
              <div className="modal-header pt-0">
                <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                  Task List
                  {/* Forward */}
                </h5>
                <button
                  onClick={() => handleViewTask()}
                  type="button"
                  className="close px-3"
                  style={{ marginLeft: "auto" }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body " >



                <div className="row bg-white p-2 m-1 border rounded modal_body_height">
                  <div className="col-12 py-2">
                    <div className="table-responsive">
                      <table
                        className="table table-striped table-class"
                        id="table-id"
                      >
                        <tr className="th_border">
                          <th>Task No.</th>
                          <th>Task Name</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                        <tbody className="broder my-4">
                          {tasks && tasks.length > 0 ? (
                            tasks.map((task, index) => (
                              <tr className="border my-4" key={task.id}>
                                <td>{index + 1}</td>
                                <td>{task.taskName.name}</td>
                                <td>{formatDate(task.startDate)}</td>
                                <td>{formatDate(task.endDate)}</td>
                                <td>{task.taskStatus}</td>
                                <td>
                                  <span
                                    onClick={
                                      () => handleUpdateTask(task)
                                    }
                                    className={`update_icon`}
                                  >
                                    <i
                                      className={`fa-solid fa-pen text-success cursor-pointer me-3 `}
                                    ></i>
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">
                                No tasks assigned
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>


                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {updateTaskPopUpShow ? (
        <TaskListUpdatedPopUp
          selectedTask={selectedTask}
          handleUpdateTask={handleUpdateTask}
        // heading="Forward"
        // cancelBtnCallBack={handleAddDepartment}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default ViewTaskPopUp;
