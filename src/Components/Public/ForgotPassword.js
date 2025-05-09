import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "././login.css";
import toast from "react-hot-toast";
import { forgetPassword } from "../../hooks/useAuth";

export const ForgotPassword = () => {
  const navigation = useNavigate();

  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);



  const handelEmailSubmit = async (e) => {
    e.preventDefault();
    if (email === "") {
      return toast.error("Email is Required...  ");
    }
    setLoading(true);
    try {
      const data = await forgetPassword(email);
      if (data.error) {
        return toast.error(data.error);
      }
      navigation('/Mailsentsuccessfully');
      setEmail('');
    } catch (error) {
      toast.error("An error occurred while sending the email.");
    } finally {
      setLoading(false); // Set loading to false after email submission is complete
    }
  }

  return (
    <>
      <div className="pt-5 all_bg" style={{ height: "100vh" }}>
        <div className=" mx-auto row bg-img center">
          <div className="col-12  col-md-5  mt-md-0 col-lg-7 mx-auto    ">
            <div className="row px-lg-2">
              <h4 className="text-center pb-2 fw-bold login_text">Forgot Password</h4>

              <div className="col-lg-9 my-lg-4 mx-auto">
                <form onSubmit={handelEmailSubmit} action="" method="post">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      <i class="fa-solid fa-envelope"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control"
                      name="email"
                      value={email}
                      placeholder="Enter Your Registered Email"
                      aria-label="Username"
                      aria-describedby="basic-addon1"

                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group  mt-3 last mb-2">
                    <span className="eye-icons"></span>
                  </div>


                  {/* <span
                    style={{ textDecoration: "none" }}
                  >
                    <input
                      type="submit"
                      value="Forgot"
                      onClick={handelEmailSubmit}
                      className="btn btn-block btn_submit form-control fw-bold"
                    />
                  </span> */}

                  <button
                    type="submit"
                    className="btn btn-block btn_submit form-control fw-bold d-flex align-items-center justify-content-center"
                    disabled={loading} // Disable the button during loading
                  >
                    {loading ? (
                      <span className="loader"
                        style={{
                          height: "5px",
                          width: "5px",
                          position: 'relative', // Make button position relative to position loader
                          margin: "10px 0px 5px -225px"
                        }}
                      ></span> // Use your existing loader styles
                    ) : (
                      "Forgot"
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
