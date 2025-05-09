export function initTasks(data) {
    const currentDate = new Date();
    const tasks = [

      {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
        name: "No Task",
        id: "ProjectSample",
        // progress: 25,
        type: "project",
        hideChildren: false,
        
      },
    ];
    return tasks;
  }
  export function getStartEndDateForProject(tasks, projectId) {
    const projectTasks = tasks.filter((t) => t.project === projectId);
    let start = projectTasks[0].start;
    let end = projectTasks[0].end;
    for (let i = 0; i < projectTasks.length; i++) {
      const task = projectTasks[i];
      if (start.getTime() > task.start.getTime()) {
        start = task.start;
      }
      if (end.getTime() < task.end.getTime()) {
        end = task.end;
      }
    }
    return [start, end];
  }