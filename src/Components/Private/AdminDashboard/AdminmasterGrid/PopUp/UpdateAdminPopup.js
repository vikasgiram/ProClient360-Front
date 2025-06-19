import { useState } from "react";
import toast from "react-hot-toast";
import { updateAdmin } from "../../../../../hooks/useAdmin";
import { isValidEmail } from "../../../../../utils/validations";

const UpdateAdminPopup = ({ handleUpdate, selectedAdmin }) => {
    const [admin, setAdmin] = useState(selectedAdmin);


    // Handle changes in the form fields
    const handleChange = (event) => {
        const { name, value } = event.target;
        setAdmin((prevAdmin) => ({ ...prevAdmin, [name]: value }));

    
    };
    // console.log(admin);
    
     
    const handleAdminUpdate = async (event) => {

        event.preventDefault();
        try {

            if(admin.name === "" || admin.email === ""){
                return toast.error("Please fill all fields");
            }
            if(!isValidEmail(admin.email)){
                return toast.error("Enter valid Email");
            }
            await updateAdmin(admin);
            handleUpdate();
        } catch (error) {
            toast.error(error);
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
                <div className="modal-dialog modal-lg">
                    <div className="modal-content p-3">
                        <form onSubmit={handleAdminUpdate}>
                            <div className="modal-header pt-0">
                                <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                                    Update Admin
                                </h5>
                                <button
                                    onClick={() => handleUpdate()}
                                    type="button"
                                    className="close px-3"
                                    style={{ marginLeft: "auto" }}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row modal_body_height">
                                    <div className="col-12 col-lg-6 mt-2">
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label label_text">
                                                Full Name
                                            </label>
                                            <input
                                                name="name"
                                                type="text"
                                                maxLength={40}
                                                placeholder="Update Full Name...."
                                                value={admin.name}
                                                onChange={handleChange}
                                                className="form-control rounded-0"
                                                id="name"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-lg-6 mt-2">
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label label_text">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                maxLength={40}
                                                placeholder="Update Email...."
                                                value={admin.email}
                                                onChange={handleChange}
                                                className="form-control rounded-0"
                                                id="email"
                                            />
                                        </div>
                                    </div>

                                    
                                    <div className="row">
                                        <div className="col-12 pt-3 mt-2">
                                            <button
                                                type="submit"
                                                onClick={handleAdminUpdate}
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
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateAdminPopup;
