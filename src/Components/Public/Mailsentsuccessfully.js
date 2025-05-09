import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "././login.css";
import toast from "react-hot-toast";
import { changePassword, loginUser } from "../../hooks/useAuth";
import { UserContext } from "../../context/UserContext";
// import { useAuthDispatch, useAuthState } from "../../../helper/Context/context";

export const Mailsentsuccessfully = () => {
    const navigation = useNavigate();





    return (
        <>
            <div className="pt-3 bg-white " style={{ height: "100vh" }}>
                <div className=" mx-auto row  center">
                    <div className="col-12  col-md-5  mt-md-0 col-lg-7 mx-auto    ">
                        <div className="row shadow p-lg-5 rounded px-lg-2">
                            <img
                                src="static/assets/img/Login/message.gif"
                                className="mail_sent_size text-center mx-auto"
                                alt="logo"
                            />
                            
                            <h4 className="text-center pb-2 fw-bold login_text">Mail sent successfully!</h4>

                            <div className="col-12 col-lg-10 border mx-auto text-lg-center pt-4">

                                <p className="fs-6">We have just sent an email with a link to reset your password.</p>

                            </div>

                            <div className="col-12 col-lg-10 mx-auto mb-4 mb-lg-0 pt-4">

                                <a href=""
                                    onClick={() => navigation('/')}
                                > <i class="fa-solid fa-angle-left"></i>  Back to login page</a>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
