
import { useState } from "react";
import toast from "react-hot-toast";
import { createTask } from "../../../../../hooks/useTask";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";



const AddTaskPopUp = ({ handleAdd, cancelBtnCallBack }) => {

    const [taskname, setTaskname] = useState("");

    const handleTaskAdd = async (event) => {
        event.preventDefault();
        
        const taskData = {
            name:taskname,
        };
        if (!taskname) {
            return toast.error("Please Enter Task Name");
        }
        toast.loading("Creating Task....")
        const data = await createTask(taskData);
        toast.dismiss()
        if(data.success){
            toast.success(data.message);
            handleAdd();
        }else{
            toast.error(data.error || "Failed to create task");
        }
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
                    <div className="modal-content taskbar p-3" style={{width:'160%', height:'330px', padding:'3rem', marginLeft:'-8rem'}}>
                        <div className="modal-header pt-0">
                            <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                                Create New Task
                                {/* Forward */}
                            </h5>
                            <button
                                onClick={cancelBtnCallBack}
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
                                            
                                            <textarea
                                                type="text"
                                                maxLength={200}
                                                value={taskname}
                                                onChange={(e) => setTaskname(e.target.value)}
                                                className="form-control rounded-0"
                                                id="taskname"
                                                placeholder="Enter a Task Name...."
                                                aria-describedby="emailHelp"
                                                required
                                            ></textarea>
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
                                            onClick={cancelBtnCallBack}
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