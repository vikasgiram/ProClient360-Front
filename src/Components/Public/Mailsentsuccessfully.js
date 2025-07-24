import { useNavigate } from "react-router-dom";
import "././login.css";
// import { useAuthDispatch, useAuthState } from "../../../helper/Context/context";

export const Mailsentsuccessfully = () => {
    const navigation = useNavigate();





    return (
        <>
            {/* <div className="pt-3 bg-white " style={{ height: "100vh" }}>
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
                                > <i className="fa-solid fa-angle-left"></i>  Back to login page</a>

                            </div>

                        </div>
                    </div>
                </div>
            </div> */}
            

            <div className="body">
                <div class="containern">
                    <div class="check-circle">
                        <svg class="checkmarks" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                    </div>

                    <h1 class="title">Mail Sent Successfully</h1>
                    <p class="message">Your message has been delivered successfully.</p>

                    <button onClick={() => navigation('/')} class="buttonn" onclick="alert('Ready for next message!')">
                        Continue
                    </button>
                </div>
            </div>
        </>
    );
};
