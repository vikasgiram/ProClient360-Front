import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import toast from "react-hot-toast";

import "././login.css";
import { resetPassword } from "../../hooks/useAuth";

export const ForgotPasswordConfirm = () => {
    const navigation = useNavigate();


    const [confirmPass, setConfirmPass] = useState('');
    const [newPass, setNewPass]= useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { id, token } = useParams();

    const handelChangePasword = async (e) =>{
        e.preventDefault();
        setLoading(true);
        if(newPass !== confirmPass){
            return toast.error("New Password and Confirm Password desen't match...");
        }
        try {
            await resetPassword(id, token, newPass, confirmPass);
            setConfirmPass('');
            setNewPass('');
            navigation('/');
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while resetting the password.");
        } finally {
            setLoading(false); // Stop loading
        }
    };



    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <div className="pt-5 all_bg" style={{ height: "100vh" }}>
                <div className=" mx-auto row bg-img center">
                    <div className="col-12  col-md-5  mt-md-0 col-lg-7 mx-auto    ">
                        <div className="row px-lg-2">
                            <h4 className="text-center pb-2 fw-bold login_text">Forgot Password</h4>

                            <div className="col-lg-9 mx-auto pt-4">

                            <form onSubmit={handelChangePasword} action="" method="post">
                                    <div class="input-group mb-3">
                                        <span class="input-group-text">
                                        <i class="fa-solid fa-key"></i>
                                        </span>
                                        <input
                                            placeholder="New Password"
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            autoComplete="new-Password"
                                            value={newPass}



                                

                                            onChange={(e) => {
                                                setNewPass(e.target.value)
                                                // showPassEncrypt()
                                            }}
                                        />
                                        <span class="input-group-text">
                                            {" "}

                                            <i
                                                onClick={toggleShowPassword}
                                                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} // Change icon based on visibility
                                                style={{ cursor: "pointer" }}
                                            ></i>



                                        </span>
                                    </div>


                                    <div class="input-group mb-3">
                                        <span class="input-group-text">
                                            <i class="fa-solid fa-lock"></i>
                                        </span>
                                        <input
                                            placeholder="confirm Password"
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            autoComplete="new-Password"
                                            value={confirmPass}

                                            onChange={(e) => {
                                                setConfirmPass(e.target.value)
                                                // showPassEncrypt()
                                            }}
                                        />
                                        <span class="input-group-text">
                                            {" "}

                                            <i
                                                onClick={toggleShowPassword}
                                                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} // Change icon based on visibility
                                                style={{ cursor: "pointer" }}
                                            ></i>



                                        </span>
                                    </div>


                                    {/* <span
                                        style={{ textDecoration: "none" }}
                                    // onClick={handleLogin}
                                    >
                                        <input
                                            type="submit"
                                            value="Change"
                                            onClick={handelChangePasword}
                                            className="btn btn-block btn_submit form-control fw-bold"
                                        />
                                    </span> */}

<button
                    type="submit"
                    className="btn btn-block btn_submit form-control fw-bold d-flex align-items-center justify-content-center"
                    disabled={loading} 
                  >
                    {loading ? (
                      <span className="loader"
                              style={{
                                height:"5px",
                                width:"5px",
                                position: 'relative', 
                               margin: "10px 0px 5px -225px"
                              }}
                      ></span> // Use your existing loader styles
                    ) : (
                      "Change"
                    )}
                  </button>
                                </form>

                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-7 col-lg-5 px-5  mx-auto   d-none d-lg-block"></div>
                </div>
            </div>
        </>
    );
};
