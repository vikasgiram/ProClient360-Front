import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";


export const UserProfile = () => {

    const { user } = useContext(UserContext);

    const navigate = useNavigate()
    return (
        <>
            <div className="row profilebody  h-100 d-flex flex-column justify-content-center">
                <div className="col-11 col-lg-8  mx-auto ">
{/* 
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
                    </div> */}


                        <div className="row justify-content-center">
                            <div className="col-12">
                                <div className="profile-container">
                                    <div className="row g-0">
                                        {/* <!-- Profile Sidebar --> */}
                                        <div className="col-12 col-lg-4">
                                            <div className="profile-sidebar p-4  text-center h-100 d-flex flex-column justify-content-center ">
                                                <div className=" d-inline-block mb-4">
                                                    <img src={user.profilePic}
                                                        alt="Profile Picture"
                                                        className="profile-img rounded-circle text-center mx-auto object-fit-cover" />
                                                    {/* <div className="status-indicator"></div> */}
                                                </div>

                                                <h2 className="h3 fw-bold mb-2">{user.name}</h2>
                                                <p className="mb-1 opacity-75">{user.designation}</p>
                                                <p className="small opacity-50 mb-4">{user.department}</p>

                                            
                                            </div>
                                        </div>

                                        {/* <!-- Profile Information --> */}
                                        <div className="col-12 col-lg-8">
                                            <div className="p-4 p-lg-5">

                                                {/* <!-- Section Header --> */}
                                                <div className="border-bottom pb-4 mb-4">
                                                    <h3 className="section-title">Profile Information</h3>
                                                    <p className="section-subtitle mb-0">Manage your account details and preferences</p>
                                                </div>

                                                {/* <!-- Information Rows --> */}
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="info-row">
                                                            <div className="row align-items-center">
                                                                <div className="col-sm-4">
                                                                    <div className="info-label">
                                                                        <i className="fas fa-user umik-primary me-2"></i>
                                                                        Full Name
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-8">
                                                                    <div className="info-value">{user.name}</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="info-row">
                                                            <div className="row align-items-center">
                                                                <div className="col-sm-4">
                                                                    <div className="info-label">
                                                                        <i className="fas fa-envelope umik-primary me-2"></i>
                                                                        Email
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-8">
                                                                    <div className="info-value">{user.email}</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="info-row">
                                                            <div className="row align-items-center">
                                                                <div className="col-sm-4">
                                                                    <div className="info-label">
                                                                        <i className="fas fa-phone umik-primary me-2"></i>
                                                                        Mobile
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-8">
                                                                    <div className="info-value">{user.mobileNo}</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="info-row">
                                                            <div className="row align-items-center">
                                                                <div className="col-sm-4">
                                                                    <div className="info-label">
                                                                        <i className="fas fa-map-marker-alt umik-primary me-2"></i>
                                                                        Address
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-8">
                                                                    <div className="info-value"> Bay Area, San Francisco, CA</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                           
                                            </div>
                                        </div>
                                    </div>

                                    {/* <!-- Back Button Section --> */}
                                    <div className="back-section p-4">
                                        <button  onClick={() => navigate('/EmployeeMainDashboard')} className="animated-button">
                                            <i className="fas fa-angle-left me-2"></i>
                                            Back to Dashboard
                                        </button>
                                    </div>
                                </div>
                            </div>
                    </div>

                </div>

            </div>
        </>
    )
}