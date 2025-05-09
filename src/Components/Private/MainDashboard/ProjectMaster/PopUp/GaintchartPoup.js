import React, { useState, useEffect } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import { ViewSwitcher } from "../../../../Helper/ViewSwitcher";

const GaintchartPoup = ({ handleDetails, selectedProject }) => {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(ViewMode.Day);
  const [tasks, setTasks] = useState([]);
  const [isChecked, setIsChecked] = useState(true);
  
  let columnWidth = 90;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  const handleTaskDelete = (task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter((t) => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On progress change Id:" + task.id);
  };

  const handleDblClick = (task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleSelect = (task, isSelected) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  // Transform the selectedProject data into tasks for the Gantt chart
  const transformProjectToTasks = (project) => {
    const projectTask = {
      id: project._id,
      name: project.name,
      start: new Date(project.startDate),
      end: new Date(project.endDate),
      progress: project.completeLevel || 0,
      type: "project",
      hideChildren: false,
    };

    const taskList = project.tasks.map((task) => ({
      id: task._id,
      name: task.taskName,
      start: new Date(task.startDate),
      end: new Date(task.endDate),
      project: project._id,
      type: "task",
      progress: task.taskLevel || 0,
    }));

    return [projectTask, ...taskList];
  };

  useEffect(() => {
    if (selectedProject) {
      const transformedTasks = transformProjectToTasks(selectedProject);
      setTasks(transformedTasks);
      setLoading(false);
    }
  }, [selectedProject]);

  return (
    <>
        {loading && (
                <div className="overlay">
                    <span className="loader"></span>
                </div>
            )}
        <div
          className="modal fade show"
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#00000090",
          }}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content p-3">
              <div className="modal-header pt-0">
                <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                  Chart for {selectedProject.name}
                </h5>
                <button
                  onClick={() => handleDetails()}
                  type="button"
                  className="close px-3"
                  style={{ marginLeft: "auto" }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12">
                    <div>
                      <ViewSwitcher
                        onViewModeChange={(viewMode) => setView(viewMode)}
                        onViewListChange={setIsChecked}
                        isChecked={isChecked}
                      />
                      <Gantt
                        tasks={tasks}
                        viewMode={view}
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    </>
  );
};

export default GaintchartPoup;
