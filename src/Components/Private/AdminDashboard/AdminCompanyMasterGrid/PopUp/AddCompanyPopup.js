
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createCompany } from "../../../../../hooks/useCompany";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { getAddress } from "../../../../../hooks/usePincode";
import validator from "validator";
import { isValidPassword, isValidPincode } from "../../../../../utils/validations";



const AddCompanyPopup = ({ handleAdd }) => {

  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [admin, setAdmin] = useState("");
  const [subDate, setSubDate] = useState("");
  const [subAmount, setSubAmount] = useState("");
  const [logo, setLogo] = useState("");
  const [GST, setGST] = useState("");
  const [loading, setLoading] = useState(false);
  const [Address, setAddress] = useState({
    pincode: "",
    state: "",
    city: "",
    country: "",
    add: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAddress(Address.pincode);

      if (data !== "Error") {
        // console.log(data);
        setAddress(data);
      }
    };
    if (Address.pincode > 0 && Address.pincode.length ===6)
      fetchData();
  }, [Address.pincode]);


  const handleCompanyAdd = async (event) => {
    event.preventDefault();
    setLoading(!loading);
    if (!name || !mobileNo || !email || !password || !confirmPassword || !subDate || !subAmount || !admin || !GST || !Address || !logo) {
      setLoading(false);
      return toast.error("Please fill all required fields");
    }
    if (!name || !validator.isEmail(email)) {
      setLoading(false);
      return toast.error("Enter valid Email");
    }
    if(subDate > new Date().toISOString().split("T")[0]){
      setLoading(false);
      return toast.error("Subscription date must be in the future");
    }
    if(subAmount < 0){
      return toast.error("Subscription Amount can't be negative");
    }
    if(isValidPincode(Address.pincode) === false){
      setLoading(false);
      return toast.error("Enter valid Pincode");
    }
    if (password !== confirmPassword) {
      setLoading(false);
      return toast.error("Password desen't match");
    }
    if(!isValidPassword(password)){
      setLoading(false);
      return toast.error("Password must contain at least 8 characters, including uppercase, lowercase letters and numbers");


    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('admin', admin);
    formData.append('mobileNo', mobileNo);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    formData.append('subDate', subDate);
    formData.append('subAmount', subAmount);
    formData.append('GST', GST);
    formData.append('Address', JSON.stringify(Address));
    formData.append('logo', logo);
    // console.log(logo);
    await createCompany(formData);
    // console.log(Address);
    handleAdd();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {

      if (file.size > 2 * 1024 * 1024) {
        return toast.error("Logo must be less than 2MB");
        
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        // The result is a Base64 string
        setLogo(reader.result);
        // console.log(logo);

      };
      reader.readAsDataURL(file);
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
            <form>
              <div className="modal-header pt-0">
                <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                  Add Company
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
                        Company Name <RequiredStar />
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control rounded-0"
                        id="name"
                        aria-describedby="emailHelp"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        for="name"
                        className="form-label label_text"
                      >
                        Admin Name <RequiredStar />
                      </label>
                      <input
                        type="text"
                        value={admin}
                        onChange={(e) => setAdmin(e.target.value)}
                        className="form-control rounded-0"
                        id="name"
                        aria-describedby="emailHelp"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        for="MobileNumber"
                        className="form-label label_text"
                      >
                        Mobile Number <RequiredStar />
                      </label>
                      <input
                        type="tel"
                        pattern="[0-9]{10}"
                        min={0}
                        max={9999999999}
                        value={mobileNo}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value <= 9999999999) {
                            setMobileNo(value);
                          }
                        }}
                        className="form-control rounded-0"
                        id="MobileNumber"
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
                        Email <RequiredStar />
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control rounded-0"
                        id="Email"
                        aria-describedby="emailHelp"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2" >
                    <div className="mb-3">
                      <label htmlFor="Subscription" className="form-label label_text">Subscription End Date  <RequiredStar />
                      </label>
                      <input
                        onChange={(e) => setSubDate(e.target.value)}
                        value={subDate}
                        type="date"
                        className="form-control rounded-0"
                        id="Subscription"
                        aria-describedby="dateHelp"
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />

                    </div>
                  </div>

                  {/* <div className="col-12 col-lg-6 mt-2" >
                    <div className="mb-3">
                      <label htmlFor="ProjectEndDate" className="form-label label_text">Project End Date
                      </label>
                      <input
                        // onChange={(e) => setEndDate(e.target.value)}
                        // value={endDate}
                        type="date"
                        className="form-control rounded-0"
                        id="ProjectEndDate"
                        aria-describedby="dateHelp"
                      />
                    </div>
                </div> */}

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        for="SubscriptionAmount"
                        className="form-label label_text"
                      >
                        Subscription Amount <RequiredStar />
                      </label>
                      <div className="input-group border mb-3">
                        <span
                          className="input-group-text rounded-0 bg-white border-0"
                          id="basic-addon1"
                        >
                          <span>&#8377;</span>
                        </span>
                        <input
                          type="number"
                          id="SubscriptionAmount"
                          min="0"
                          value={subAmount}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Reject negative values
                            if (value >= 0 || value === '') {
                              setSubAmount(value);
                            }
                          }}
                          className="form-control rounded-0 border-0"
                          aria-label="Username"
                          aria-describedby="basic-addon1"
                          required
                        />
                      </div>{" "}
                    </div>
                  </div>



                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        for="gstNo"
                        className="form-label label_text"
                      >
                        GST No <RequiredStar />
                      </label>
                      <div className="input-group border mb-3">

                        <input
                          type="text"
                          id="gstNo"
                          value={GST}
                          onChange={(e) => setGST(e.target.value)}
                          className="form-control rounded-0 border-0"
                          aria-label="Username"
                          aria-describedby="basic-addon1"
                          required
                        />
                      </div>{" "}
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2" >

                    <div className="mb-3">
                      <label for="LOGO" className="form-label label_text">     Logo <RequiredStar />

                      </label>
                      <input type="file" className="form-control rounded-0" id="LOGO" aria-describedby="secemailHelp"
                        accept="image/*"
                        onChange={handleFileChange} files={logo}
                      />
                      {/* {logo && (
        <div>
          <h3>Preview:</h3>
          <img src={logo} alt="Uploaded Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
        </div>
      )} */}
                    </div>

                  </div>

                  <div className="col-12  mt-2">
                    <div className="row border mt-4 bg-gray mx-auto">
                      <div className="col-12 mb-3">
                        <span className="AddressInfo">Address <RequiredStar /></span>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <input
                            type="number"
                            className="form-control rounded-0"
                            placeholder="Pincode"
                            id="exampleInputEmail1"
                            min="0"
                            onChange={(e) =>
                              setAddress({
                                ...Address,
                                pincode: e.target.value,
                              })
                            }
                            value={Address.pincode}
                            aria-describedby="emailHelp"
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control rounded-0"
                            placeholder="State"
                            id="exampleInputEmail1"
                            onChange={(e) => setAddress({ ...Address, state: e.target.value })}
                            value={Address.state}
                            aria-describedby="emailHelp"
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control rounded-0"
                            placeholder="City"
                            id="exampleInputEmail1"
                            onChange={(e) => setAddress({ ...Address, city: e.target.value })}
                            value={Address.city}
                            aria-describedby="emailHelp"
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control rounded-0"
                            placeholder="Country"
                            id="exampleInputEmail1"
                            onChange={(e) => setAddress({ ...Address, country: e.target.value })}
                            value={Address.country}
                            aria-describedby="emailHelp"
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-12 mt-2">
                        <div className="mb-3">
                          <textarea
                            className="textarea_edit col-12"
                            id=""
                            name=""
                            placeholder="House NO., Building Name, Road Name, Area, Colony"
                            onChange={(e) => setAddress({ ...Address, add: e.target.value })}
                            value={Address.add}
                            rows="2"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 col-lg-6 mt-3">
                      <div className="mb-3">
                        <label
                          for="password"
                          className="form-label label_text"
                        >
                          Password <RequiredStar />
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

                    <div className="col-12 col-lg-6 mt-3">
                      <div className="mb-3">
                        <label
                          for="ConfirmPassword"
                          className="form-label label_text"
                        >
                          Confirm Password <RequiredStar />
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
                        onClick={handleCompanyAdd}
                        disabled={loading}
                        className="w-80 btn addbtn rounded-0 add_button   m-2 px-4"
                      >
                        {!loading ? "Add" : "Submitting..."}
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

export default AddCompanyPopup;
