
import { useState } from "react";
import {createAdmin} from "../../../../../hooks/useAdmin";
import toast from "react-hot-toast";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import validator from "validator";
import { isValidPassword } from "../../../../../utils/validations";


const AddAdminPoup = ({ handleAdd }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleEmployeeAdd = async (event) => {
    event.preventDefault();
    const data = {
      name,
      email,
      password,
      confirmPassword,
    };
    if(!name  || !email || !password || !confirmPassword){
      return toast.error("Please fill all fields");
    }
    if (!validator.isEmail(email)) {
      return toast.error("Enter valid Email");
    }
    if(password!==confirmPassword ){
      return toast.error("Password desen't match");
    }
    if(!isValidPassword(password)){
      return toast.error("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
    }
    await createAdmin(data);
    // console.log(data);
    
    handleAdd();
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
            <form onSubmit={handleEmployeeAdd}>
            <div className="modal-header pt-0">
              <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                Add Admin
                {/* Forward */}
              </h5>
              <button
                onClick={() => handleAdd()}
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
                      <label
                        for="name"
                        className="form-label label_text"
                      >
                        Full Name <RequiredStar />
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control rounded-0"
                        id="name"
                        aria-describedby="emailHelp"
                      />
                    </div>
                </div>

              

                <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        for="Email"
                        className="form-label label_text"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control rounded-0"
                        id="Email"
                        aria-describedby="emailHelp"
                      />
                    </div>
                </div>

               
                <div className="row">
                  <div className="col-12 col-lg-6 mt-2">
                      <div className="mb-3">
                        <label
                          for="password"
                          className="form-label label_text"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="form-control rounded-0"
                          id="password"
                          aria-describedby="emailHelp"
                        />
                      </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                      <div className="mb-3">
                        <label
                          for="ConfirmPassword"
                          className="form-label label_text"
                        >
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="form-control rounded-0"
                          id="ConfirmPassword"
                          aria-describedby="emailHelp"
                        />
                      </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 pt-3 mt-2">
                    <button
                      type="submit"
                      onClick={handleEmployeeAdd}
                      className="w-80 btn addbtn rounded-0 add_button   m-2 px-4"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="w-80  btn addbtn rounded-0 Cancel_button m-2 px-4"
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

export default AddAdminPoup;
