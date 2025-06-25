import { useState } from "react";
import toast from "react-hot-toast";
import { updateDepartment } from "../../../../../hooks/useDepartment";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
const UpdateDepartmentPopup = ({ handleUpdate, selectedDep }) => {

    const [department, setDepartment] = useState(selectedDep);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setDepartment((prevDepartment) => ({
            ...prevDepartment,
            [name]: value
        }));
    }

    const handleProjectUpdate = async (event) => {
        event.preventDefault();
        if(!department.name ){
            return toast.error("Please Enter department Name");
        }
        try {
            const data = await updateDepartment(department);
            if(data.success){
                toast.success(data.message);
                handleUpdate();
            }else{
                toast.error(data.error || "Failed to update department");
            }
            
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <>
            <div className="modal fade show" style={{ display: "flex", alignItems: 'center', backgroundColor: "#00000090" }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content p-3">
                        <form onSubmit={handleProjectUpdate}>
                            <div className="modal-header pt-0">

                                <h5 className="card-title fw-bold" id="exampleModalLongTitle">

                                    Update Department 
                                    {/* Forward */}
                                </h5>
                                <button onClick={() => handleUpdate()} type="button"  className="close px-3" style={{ marginLeft: "auto" }}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row ">
                                    {/* modal_body_height */}
                                    <div className="col-12" >



                                        <div className="mb-3">
                                            <label for="name" className="form-label label_text">     Department Name <RequiredStar />
                                            </label>
                                            <input type="text" className="form-control rounded-0" id="name" placeholder="Enter a Update Department Name...." maxLength={40} name="name" onChange={handleInputChange} value={department.name} aria-describedby="secemailHelp" />
                                        </div>


                                    </div>

                                    <div className="row">
                                        <div className="col-12 pt-3 mt-2">
                                            <button
                                                type='submit'
                                                // onClick={handleProjectUpdate}
                                                className="w-80 btn addbtn rounded-0 add_button   m-2 px-4" >
                                                Update
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleUpdate}
                                                className="w-80  btn addbtn rounded-0 Cancel_button m-2 px-4" >
                                                Cancel

                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>);
}

export default UpdateDepartmentPopup;