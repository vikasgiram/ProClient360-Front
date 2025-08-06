import { formatDate } from "../../../utils/formatDate";

export const AssignInproccessSection = ({
  assignedTasks,
  inprocessTasks,
}) => {
  function getTaskColorIndicator(startDate, endDate, completionPercentage) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; 

    const expectedCompletionPerDay = 100 / totalDays;

    const today = new Date();
    const daysPassed = Math.ceil((today - start) / (1000 * 60 * 60 * 24));

    let indicator;
    if (completionPercentage >= expectedCompletionPerDay * daysPassed) {
      indicator = "bg-success"; 
    } else if (daysPassed > totalDays) {
      indicator = "bg-danger"; 
    } else if (completionPercentage < expectedCompletionPerDay * daysPassed) {
      indicator = "bg-warning"; 
    } else {
      indicator = "bg-success"; 
    }

    return indicator;
  }
  return (
    <>
      <div className="row   p-lg-2 m-1 ">
    
        {/* ========= Assigned Tasks ========== */}

        <div className="col-12 col-lg-5 mb-4 mb-lg-0  rounded ">
          <div className="row bg-white rounded p-lg-3 ">
            <h6 className="mb-0 fw-bold text-success mb-3">Assigned Tasks</h6>
            <div className="col-12">
              <div className="shadow_custom ">
                <div
                  className="table-responsive"
                  style={{ maxHeight: "300px", overflow: "auto" }}
                >
                  <table className="table align-items-center table-flush">
                    <thead
                      className="thead-light"
                      style={{ position: "sticky", top: 0, zIndex: 1 }}
                    >
                      <tr>
                        <th className="text-center">Task Name</th>
                        <th className="text-center">Start Date</th>
                        <th className="text-center">Expected End Date</th>
                        <th className="text-center">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {assignedTasks.length === 0 ? (
                        <tr className="text-center">
                          <td colSpan="4">No New Assigned Tasks...</td>
                        </tr>
                      ) : (
                        assignedTasks.map((task) => (
                          <tr className="text-center" key={task._id}>
                            <th className="text-center">
                              <div className="media align-items-center">
                                <div className="media-body">
                                  <span className="mb-0 text-sm w-40 text-wrap">
                                    {task.taskName.name}
                                  </span>
                                </div>
                              </div>
                            </th>
                            <td>{formatDate(task.startDate)}</td>
                            <td>{formatDate(task.endDate)}</td>
                            <td>
                              <span className="badge badge-dot mr-4 text-dark">
                                <i className="bg-primary"></i>
                              </span>
                              Assigned
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

  
        {/* ========= Inprocess Tasks ========= */}

        <div className="col-12 col-lg-7  mx-auto  rounded ">
          <div className="row  bg-white ms-md-1 rounded p-lg-3">
            <h6 className="mb-0 fw-bold mb-3 text-warning-dark">
              Inprocess Tasks
            </h6>
            <div className="col-12">
              <div className="shadow_custom">
                <div
                  className="table-responsive"
                  style={{ maxHeight: "300px", overflow: "auto" }}
                >
                  <table className="table align-items-center table-flush">
        
                    <thead
                      className="thead-light"
                      style={{ position: "sticky", top: 0, zIndex: 1 }}
                    >
                      <tr>
                        <th className="text-center">task Name</th>
                        <th className="text-center">Start Date</th>
                        <th className="text-center">Expected End Date</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Completion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inprocessTasks.length === 0 ? (
                        <tr className="text-center">
                          <td colSpan="5">No tasks in progress</td>
                        </tr>
                      ) : (
                        inprocessTasks.map((task) => (
                          <tr className="text-center" key={task._id}>
                            <th className="text-center">
                              <div className="media align-items-center">
                                <div className="media-body">
                                  <span className="mb-0 text-sm">
                                    {task.taskName.name}
                                  </span>
                                </div>
                              </div>
                            </th>
                            <td>{formatDate(task.startDate)}</td>
                            <td>{formatDate(task.endDate)}</td>
                            <td>
                              <span className="badge badge-dot mr-4 text-dark">
                                <i
                                  className={getTaskColorIndicator(
                                    task.startDate,
                                    task.endDate,
                                    task.taskLevel
                                  )}
                                ></i>
                              </span>
                              {task.taskStatus}
                            </td>
                            <td className="text-center">
                              <div className="d-flex align-items-center">
                                <span className="text_a">
                                  {task.taskLevel}%
                                </span>
                                <div className="m-auto">
                                  <span className="progress">
                                    <div
                                      className="progress-bar bg-warning"
                                      role="progressbar"
                                      aria-valuenow={task.taskLevel}
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                      style={{
                                        width: `${task.taskLevel}%`,
                                      }}
                                    ></div>
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};