import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";


export const UserProfile = () => {

    const { user } = useContext(UserContext);

    const navigate = useNavigate()
    return (
        <>
            <div className="row bg_user_img">
                <div className="col-12  mx-auto center-flex">

                    <div className="row bg-white rounded center-block border">

                        <div className="col-12 col-lg-4 py-4 rounded border bg-white mx-auto">
                            <div className="card-body">
                                <div className="d-flex flex-column align-items-center text-center">
                                    <img src={user.profilePic} alt="Admin" className="rounded-circle" width="150" />
                                    <div className="mt-3">
                                        <h4>{user.name}</h4>
                                        <p className="text-secondary mb-1">{user.designation}</p>
                                        <p className="text-muted font-size-sm">{user.department}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-7 mt-2 mt-lg-0 border rounded bg-white mx-auto">
                            <div className=" my-3 p-lg-4">
                                <div className="card-body ">
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Full Name</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {user.name}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Email</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {user.email}
                                        </div>
                                    </div>
                                    <hr />

                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Mobile</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {user.mobileNo}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Address</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            Bay Area, San Francisco, CA
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/EmployeeMainDashboard')}
                            className="animated-button mt-3 col-lg-2 ms-auto mx-3"> <i className="fa-solid fa-angle-left"></i> Back</button>
                    </div>

                </div>

            </div>
        </>
    )
}