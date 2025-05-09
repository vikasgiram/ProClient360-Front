import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "././login.css";
import toast from "react-hot-toast";
import { changePassword, loginUser } from "../../hooks/useAuth";
import { UserContext } from "../../context/UserContext";
// import { useAuthDispatch, useAuthState } from "../../../helper/Context/context";


export const ChangePassword = () => {
    const navigation = useNavigate();


    const [confirmPass, setConfirmPass] = useState('');
    const [newPass, setNewPass]= useState('');
    const [oldPass, setOldPass] = useState("");
    const [oldPassword, setOldPassword] = useState(false);
    const [newPassword, setNewPassword] = useState(false);
    const[confirmPassword, setConfirmPassword]= useState(false);
    const[loading, setLoading] = useState(false);
    

    const handelChangePasword = async (e) =>{
        e.preventDefault();
        if(newPass ==='' || oldPass ===''){
            return toast.error("Required Field")
        }
        if(newPass !== confirmPass){
            return toast.error("New Password and Confirm Password desen't match...");
        }
        try{
            setLoading(true);
            const data=await changePassword(oldPass, newPass, confirmPass);
            if(data.error){
                return toast.error(data.error);
            }
            navigation('/');
            setLoading(true);
            toast.success(data.message);
        }catch(error){
            console.error(error);
        }
        finally{
            setLoading(false);
        }
	};
    return (
        <>
            {loading && (
                <div className="overlay">
                    <span className="loader"></span>
                </div>
            )}
            <div className="pt-5 all_bg" style={{ height: "100vh" }}>
                <div className=" mx-auto row bg-img center">
                    <div className="col-12  col-md-5  mt-md-0 col-lg-7 mx-auto    ">
                        <div className="row px-lg-2">
                            <h4 className="text-center pb-2 fw-bold login_text">Change Password</h4>

                            <div className="col-lg-9 mx-auto pt-4">

                                <form>

        
                                    <div class="input-group mb-3">
                                    <span class="input-group-text">
                                        <i class="fa-solid fa-key"></i>
                                        </span>
                                        <input
                                            placeholder="Old Password"
                                            id="password"
                                            name="password"
                                            type={oldPassword ? "text" : "password"}
                                            className="form-control"
                                            autoComplete="new-Password"
                                            value={oldPass}

                                            onChange={(e) => {
                                                setOldPass(e.target.value)
                                                // showPassEncrypt()
                                            }}
                                        />
                                        <span class="input-group-text">
                                            {" "}

                                            <i
                                                 onClick={() => setOldPassword(!oldPassword)}
                                                className={`fas ${oldPassword ? "fa-eye-slash" : "fa-eye"}`} // Change icon based on visibility
                                                style={{ cursor: "pointer" }}
                                            ></i>
                                        </span>
                                    </div>


                                    <div class="input-group mb-3">
                                        <span class="input-group-text">
                                        <i class="fa-solid fa-key"></i>
                                        </span>
                                        <input
                                            placeholder="New Password"
                                            id="password"
                                            name="password"
                                            type={newPassword ? "text" : "password"}
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
                                                 onClick={() => setNewPassword(!newPassword)}
                                                className={`fas ${newPassword ? "fa-eye-slash" : "fa-eye"}`} // Change icon based on visibility
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
                                            type={confirmPassword ? "text" : "password"}
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
                                                 onClick={() => setConfirmPassword(!confirmPassword)}
                                                className={`fas ${confirmPassword ? "fa-eye-slash" : "fa-eye"}`} // Change icon based on visibility
                                                style={{ cursor: "pointer" }}
                                            ></i>



                                        </span>
                                    </div>


                                    <span
                                        style={{ textDecoration: "none" }}
                                    // onClick={handleLogin}
                                    >
                                        <input
                                            type="submit"
                                            value="Change"
                                            onClick={handelChangePasword}
                                            
                                            className="btn btn-block btn_submit form-control fw-bold"
                                        />
                                    </span>
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
