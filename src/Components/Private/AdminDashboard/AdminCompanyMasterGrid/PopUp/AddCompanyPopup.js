import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createCompany } from "../../../../../hooks/useCompany";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { getAddress } from "../../../../../hooks/usePincode";

const EyeIcon = ({ isOpen }) => (
  <span style={{ cursor: 'pointer', userSelect: 'none', padding: '0 5px' }}>
    {isOpen ? '👁️' : '👁️‍🗨️'}
  </span>
);

const AddCompanyPopup = ({ handleAdd }) => {
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [landlineNo, setLandlineNo] = useState("");
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAddress(Address.pincode);
      if (data !== "Error") {
        setAddress(data);
      }
    };
    if (Address.pincode > 0 && Address.pincode.length === 6)
      fetchData();
  }, [Address.pincode]);

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Company name is required");
      return false;
    }
    if (!admin.trim()) {
      toast.error("Admin name is required");
      return false;
    }
    if (!mobileNo || mobileNo.length !== 10) {
      toast.error("Valid mobile number is required");
      return false;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    if (!confirmPassword.trim()) {
      toast.error("Confirm password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!subDate) {
      toast.error("Subscription end date is required");
      return false;
    }
    if (!subAmount) {
      toast.error("Subscription amount is required");
      return false;
    }
    if (!GST.trim()) {
      toast.error("GST number is required");
      return false;
    }
    if (!logo) {
      toast.error("Logo is required");
      return false;
    }
    if (!Address.pincode || Address.pincode.length !== 6) {
      toast.error("Valid pincode is required");
      return false;
    }
    return true;
  };

  const handleCompanyAdd = async (event) => {
    event.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);

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

    try {
      toast.loading("Adding Company...");
      const data = await createCompany(formData);
      if(data.success) {
        toast.dismiss();
        toast.success(data.message);
        handleAdd();
      } else {
        toast.dismiss();
        toast.error(data.error);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to create company. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      const maxSize = 1 * 1024 * 1024;

      if (file.size > maxSize) {
      toast.error("File size must be less than or equal to 1MB.");
      e.target.value = ""; 
      return;
    }
      reader.onloadend = () => {
        setLogo(reader.result);
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
            <form onSubmit={handleCompanyAdd}>
              <div className="modal-header pt-0">
                <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                  Add Company
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
                      <label htmlFor="name" className="form-label label_text">
                        Company Name <RequiredStar />
                      </label>
                      <input
                        type="text"
                        maxLength={499}
                        placeholder="Enter Company Name...."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control rounded-0"
                        id="name"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="adminName" className="form-label label_text">
                        Admin Name <RequiredStar />
                      </label>
                      <input
                        type="text"
                        maxLength={50}
                        placeholder="Enter Admin Name...."
                        value={admin}
                        onChange={(e) => {
                          const onlyLettersAndSpaces = e.target.value.replace(/[^A-Za-z\s]/g, '');
                          setAdmin(onlyLettersAndSpaces);
                        }}
                        className="form-control rounded-0"
                        id="adminName"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="MobileNumber" className="form-label label_text">
                        Contact Number <RequiredStar />
                      </label>
                      <input
                        type="tel"
                        id="MobileNumber"
                        placeholder="Enter Contact Number...."
                        className="form-control rounded-0"
                        maxLength={10}
                        value={mobileNo}
                        onChange={(e) => {
                          const onlyDigits = e.target.value.replace(/\D/g, '');
                          setMobileNo(onlyDigits);
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="MobileNumber" className="form-label label_text">
                        Landline No/Support No
                      </label>
                      <input
                        type="tel"
                        id="MobileNumber"
                        placeholder="Enter Landline No/Support No..."
                        className="form-control rounded-0"
                        maxLength={13}
                        value={landlineNo}
                        onChange={(e) => {
                          const onlyDigits = e.target.value.replace(/\D/g, '');
                          setLandlineNo(onlyDigits);
                        }}
                      
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="Email" className="form-label label_text">
                        Email <RequiredStar />
                      </label>
                      <input
                        type="email"
                        maxLength={50}
                        placeholder="Enter Email...."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control rounded-0"
                        id="Email"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="Subscription" className="form-label label_text">
                        Subscription End Date <RequiredStar />
                      </label>
                      <input
                        onChange={(e) => setSubDate(e.target.value)}
                        value={subDate}
                        type="date"
                        className="form-control rounded-0"
                        id="Subscription"
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="SubscriptionAmount" className="form-label label_text">
                        Subscription Amount <RequiredStar />
                      </label>
                      <div className="input-group border mb-3">
                        <span className="input-group-text rounded-0 bg-white border-0" id="basic-addon1">
                          <span>&#8377;</span>
                        </span>
                        <input
                          type="text"
                          id="SubscriptionAmount"
                          placeholder="eg. 1000"
                          maxLength={12}
                          value={subAmount}
                          onChange={(e) => {
                            const onlyDigits = e.target.value.replace(/\D/g, '');
                            setSubAmount(onlyDigits);
                          }}
                          className="form-control rounded-0 border-0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="gstNo" className="form-label label_text">
                        GST No <RequiredStar />
                      </label>
                      <div className="input-group border mb-3">
                        <input
                          type="text"
                          id="gstNo"
                          maxLength={15}
                          placeholder="Enter GST Number...."
                          value={GST}
                          onChange={(e) => setGST(e.target.value.toUpperCase())}
                          className="form-control rounded-0 border-0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="LOGO" className="form-label label_text">
                        Logo <RequiredStar /> [Max size: 1MB]
                      </label>
                      <input
                        type="file"
                        className="form-control rounded-0"
                        id="LOGO"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 mt-2">
                    <div className="row border mt-4 bg-gray mx-auto">
                      <div className="col-12 mb-3">
                        <span className="AddressInfo">Address <RequiredStar /></span>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control rounded-0"
                            placeholder="Pincode"
                            maxLength={6}
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(/\D/g, '');
                              setAddress({
                                ...Address,
                                pincode: numericValue,
                              });
                            }}
                            value={Address.pincode}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <input
                            type="text"
                            maxLength={50}
                            className="form-control rounded-0"
                            placeholder="State"
                            onChange={(e) => {
                              const onlyLettersAndSpaces = e.target.value.replace(/[^A-Za-z\s]/g, '');
                              setAddress({ ...Address, state: onlyLettersAndSpaces });
                            }}
                            value={Address.state}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <input
                            type="text"
                            maxLength={50}
                            className="form-control rounded-0"
                            placeholder="City"
                            onChange={(e) => {
                              const onlyLettersAndSpaces = e.target.value.replace(/[^A-Za-z\s]/g, '');
                              setAddress({ ...Address, city: onlyLettersAndSpaces });
                            }}
                            value={Address.city}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <input
                            type="text"
                            maxLength={50}
                            className="form-control rounded-0"
                            placeholder="Country"
                            onChange={(e) => {
                              const onlyLettersAndSpaces = e.target.value.replace(/[^A-Za-z\s]/g, '');
                              setAddress({ ...Address, country: onlyLettersAndSpaces });
                            }}
                            value={Address.country}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-12 mt-2">
                        <div className="mb-3">
                          <textarea
                            className="textarea_edit col-12"
                            placeholder="House NO., Building Name, Road Name, Area, Colony"
                            maxLength={200}
                            onChange={(e) => setAddress({ ...Address, add: e.target.value })}
                            value={Address.add}
                            rows="2"
                            required
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 col-lg-6 mt-3">
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label label_text">
                          Password <RequiredStar />
                        </label>
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control rounded-0"
                            id="password"
                            placeholder="Password...."
                            maxLength={50}
                            minLength={6}
                            required
                          />
                          <button
                            className="btn btn-outline-secondary rounded-0"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            <EyeIcon isOpen={showPassword} />
                          </button>
                        </div>
                        <small className="text-muted">Minimum 6 characters</small>
                      </div>
                    </div>

                    <div className="col-12 col-lg-6 mt-3">
                      <div className="mb-3">
                        <label htmlFor="ConfirmPassword" className="form-label label_text">
                          Confirm Password <RequiredStar />
                        </label>
                        <div className="input-group">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`form-control rounded-0 ${confirmPassword && password !== confirmPassword ? 'is-invalid' : ''}`}
                            id="ConfirmPassword"
                            placeholder="Confirm Password...."
                            maxLength={50}
                            required
                          />
                          <button
                            className="btn btn-outline-secondary rounded-0"
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                          >
                            <EyeIcon isOpen={showConfirmPassword} />
                          </button>
                        </div>
                        {confirmPassword && password !== confirmPassword && (
                          <small className="text-danger">Passwords do not match</small>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 pt-3 mt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-80 btn addbtn rounded-0 add_button m-2 px-4"
                      >
                        {!loading ? "Add" : "Submitting..."}
                      </button>
                      <button
                        type="button"
                        onClick={handleAdd}
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

export default AddCompanyPopup;