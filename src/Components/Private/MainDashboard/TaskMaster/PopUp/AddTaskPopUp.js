
import { useState } from "react";
import toast from "react-hot-toast";
import { createTask } from "../../../../../hooks/useTask";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";



const AddTaskPopUp = ({ handleAdd }) => {

    const [taskname, setTaskname] = useState("");

    const handleTaskAdd = async (event) => {
        event.preventDefault();
        
        const data = {
            name:taskname,
        };
        if (!taskname) {
            return toast.error("Please fill all fields");
        }
        await createTask(data);
        handleAdd();
    };


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
                <div className="modal-dialog modal-md">
                    <div className="modal-content p-3">
                        <div className="modal-header pt-0">
                            <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                                Create New Task
                                {/* Forward */}
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
                        <form >
                            <div className="row">
                            {/* modal_body_height */}
                                <div className="col-12">
                                    
                                        <div className="mb-3">
                                            <label
                                                for="taskname"
                                                className="form-label label_text"
                                            >
                                                Task Name <RequiredStar />
                                            </label>
                                            <input
                                                type="text"
                                                value={taskname}
                                                onChange={(e) => setTaskname(e.target.value)}
                                                className="form-control rounded-0"
                                                id="taskname"
                                                aria-describedby="emailHelp"
                                                required
                                            />
                                        </div>
                                    
                                </div>




                                <div className="row">
                                    <div className="col-12 pt-3 mt-2">
                                        <button
                                            type="submit"
                                            onClick={handleTaskAdd}
                                            className="w-80 btn addbtn rounded-0 add_button   m-2 px-4"
                                        >
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAdd}
                                            className="w-80  btn addbtn rounded-0 Cancel_button m-2 px-4"
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
            </div>
        </>
    );
};

export default AddTaskPopUp;
