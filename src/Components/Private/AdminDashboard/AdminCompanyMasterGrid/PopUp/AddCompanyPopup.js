import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createCompany } from "../../../../../hooks/useCompany";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { getAddress } from "../../../../../hooks/usePincode";
import validator from "validator";
import { isValidPassword, isValidPincode } from "../../../../../utils/validations";

const EyeIcon = ({ isOpen }) => (
  <span style={{ cursor: 'pointer', userSelect: 'none', padding: '0 5px' }}>
    {isOpen ? '👁️' : '👁️‍🗨️'}
  </span>
);

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation state for each field
  const [errors, setErrors] = useState({
    name: "",
    admin: "",
    mobileNo: "",
    email: "",
    subDate: "",
    subAmount: "",
    GST: "",
    logo: ""
  });

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

  // Real-time validation functions
  const validateCompanyName = (value) => {
    if (!value.trim()) {
      return "Company name is required";
    }
    if (value.trim().length < 2) {
      return "Company name must be at least 2 characters";
    }
    if (value.trim().length > 50) {
      return "Company name cannot exceed 50 characters";
    }
    return "";
  };

  const validateAdminName = (value) => {
    if (!value.trim()) {
      return "Admin name is required";
    }
    if (/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/.test(value.trim())) {
      return "Admin name should contain only letters and spaces";
    }
    if (value.trim().length < 2) {
      return "Admin name must be at least 2 characters";
    }
    return "";
  };

  const validateMobileNumber = (value) => {
    if (!value) {
      return "Mobile number is required";
    }
    const mobileStr = value.toString();
    if (!/^\d{10}$/.test(mobileStr)) {
      return "Mobile number must be exactly 10 digits";
    }
    if (mobileStr[0] < '1') {
      return "Mobile number should start with 1 to 9";
    }
    return "";
  };

  const validateEmail = (value) => {
    if (!value.trim()) {
      return "Email is required";
    }
    if (!validator.isEmail(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validateSubDate = (value) => {
    if (!value) {
      return "Subscription end date is required";
    }
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate <= today) {
      return "Subscription date must be in the future";
    }
    return "";
  };

  const validateSubAmount = (value) => {
    if (!value) {
      return "Subscription amount is required";
    }
    const amount = parseFloat(value);
    if (isNaN(amount) || amount < 0) {
      return "Subscription amount must be a positive number";
    }
    if (amount === 0) {
      return "Subscription amount cannot be zero";
    }
    return "";
  };

  const validateGST = (value) => {
    if (!value.trim()) {
      return "GST number is required";
    }
    // Basic GST validation pattern (15 characters)
    const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstPattern.test(value.trim())) {
      return "Please enter a valid GST number (e.g., 22AAAAA0000A1Z5)";
    }
    return "";
  };

  const validateLogo = (file) => {
    if (!file) {
      return "Company logo is required";
    }
    return "";
  };

  // Handle field changes with validation
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setErrors(prev => ({ ...prev, name: validateCompanyName(value) }));
  };

  const handleAdminChange = (e) => {
    const value = e.target.value;
    setAdmin(value);
    setErrors(prev => ({ ...prev, admin: validateAdminName(value) }));
  };

  const handleMobileChange = (e) => {
    const value = Number(e.target.value);
    if (value <= 9999999999) {
      setMobileNo(value);
      setErrors(prev => ({ ...prev, mobileNo: validateMobileNumber(value) }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors(prev => ({ ...prev, email: validateEmail(value) }));
  };

  const handleSubDateChange = (e) => {
    const value = e.target.value;
    setSubDate(value);
    setErrors(prev => ({ ...prev, subDate: validateSubDate(value) }));
  };

  const handleSubAmountChange = (e) => {
    const value = e.target.value;
    if (value >= 0 || value === '') {
      setSubAmount(value);
      setErrors(prev => ({ ...prev, subAmount: validateSubAmount(value) }));
    }
  };

  const handleGSTChange = (e) => {
    const value = e.target.value.toUpperCase();
    setGST(value);
    setErrors(prev => ({ ...prev, GST: validateGST(value) }));
  };

  const handleCompanyAdd = async (event) => {
    event.preventDefault();
    
    // Validate all fields before submission
    const nameError = validateCompanyName(name);
    const adminError = validateAdminName(admin);
    const mobileError = validateMobileNumber(mobileNo);
    const emailError = validateEmail(email);
    const subDateError = validateSubDate(subDate);
    const subAmountError = validateSubAmount(subAmount);
    const gstError = validateGST(GST);
    const logoError = validateLogo(logo);

    setErrors({
      name: nameError,
      admin: adminError,
      mobileNo: mobileError,
      email: emailError,
      subDate: subDateError,
      subAmount: subAmountError,
      GST: gstError,
      logo: logoError
    });

    // Check if there are any errors
    if (nameError || adminError || mobileError || emailError || subDateError || subAmountError || gstError || logoError) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    setLoading(true);

    // Additional validation for password fields
    if (!password || !confirmPassword) {
      setLoading(false);
      return toast.error("Please fill all required fields");
    }

    if (password !== confirmPassword) {
      setLoading(false);
      return toast.error("Password doesn't match");
    }

    if (!isValidPassword(password)) {
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

    try {
      await createCompany(formData);
      handleAdd();
    } catch (error) {
      setLoading(false);
      toast.error("Failed to create company. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: "Logo must be less than 2MB" }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        setErrors(prev => ({ ...prev, logo: "" }));
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
                        value={name}
                        onChange={handleNameChange}
                        className={`form-control rounded-0 ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        required
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                  </div>
                  
                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="adminName" className="form-label label_text">
                        Admin Name <RequiredStar />
                      </label>
                      <input
                        type="text"
                        value={admin}
                        onChange={handleAdminChange}
                        className={`form-control rounded-0 ${errors.admin ? 'is-invalid' : ''}`}
                        id="adminName"
                        required
                      />
                      {errors.admin && <div className="invalid-feedback">{errors.admin}</div>}
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="MobileNumber" className="form-label label_text">
                        Mobile Number <RequiredStar />
                      </label>
                      <input
                        type="tel"
                        pattern="[0-9]{10}"
                        min={0}
                        max={9999999999}
                        value={mobileNo}
                        onChange={handleMobileChange}
                        className={`form-control rounded-0 ${errors.mobileNo ? 'is-invalid' : ''}`}
                        id="MobileNumber"
                      />
                      {errors.mobileNo && <div className="invalid-feedback">{errors.mobileNo}</div>}
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="Email" className="form-label label_text">
                        Email <RequiredStar />
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        className={`form-control rounded-0 ${errors.email ? 'is-invalid' : ''}`}
                        id="Email"
                        required
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="Subscription" className="form-label label_text">
                        Subscription End Date <RequiredStar />
                      </label>
                      <input
                        onChange={handleSubDateChange}
                        value={subDate}
                        type="date"
                        className={`form-control rounded-0 ${errors.subDate ? 'is-invalid' : ''}`}
                        id="Subscription"
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                      {errors.subDate && <div className="invalid-feedback">{errors.subDate}</div>}
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="SubscriptionAmount" className="form-label label_text">
                        Subscription Amount <RequiredStar />
                      </label>
                      <div className={`input-group border mb-3 ${errors.subAmount ? 'is-invalid' : ''}`}>
                        <span className="input-group-text rounded-0 bg-white border-0" id="basic-addon1">
                          <span>&#8377;</span>
                        </span>
                        <input
                          type="number"
                          id="SubscriptionAmount"
                          min="0"
                          value={subAmount}
                          onChange={handleSubAmountChange}
                          className="form-control rounded-0 border-0"
                          required
                        />
                      </div>
                      {errors.subAmount && <div className="invalid-feedback d-block">{errors.subAmount}</div>}
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
                          value={GST}
                          onChange={handleGSTChange}
                          className={`form-control rounded-0 border-0 ${errors.GST ? 'is-invalid' : ''}`}
                          placeholder="22AAAAA0000A1Z5"
                          required
                        />
                      </div>
                      {errors.GST && <div className="invalid-feedback d-block">{errors.GST}</div>}
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="LOGO" className="form-label label_text">
                        Logo <RequiredStar />
                      </label>
                      <input
                        type="file"
                        className={`form-control rounded-0 ${errors.logo ? 'is-invalid' : ''}`}
                        id="LOGO"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {errors.logo && <div className="invalid-feedback">{errors.logo}</div>}
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
                            type="number"
                            className="form-control rounded-0"
                            placeholder="Pincode"
                            min="0"
                            onChange={(e) =>
                              setAddress({
                                ...Address,
                                pincode: e.target.value,
                              })
                            }
                            value={Address.pincode}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control rounded-0"
                            placeholder="State"
                            onChange={(e) => setAddress({ ...Address, state: e.target.value })}
                            value={Address.state}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control rounded-0"
                            placeholder="City"
                            onChange={(e) => setAddress({ ...Address, city: e.target.value })}
                            value={Address.city}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control rounded-0"
                            placeholder="Country"
                            onChange={(e) => setAddress({ ...Address, country: e.target.value })}
                            value={Address.country}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-12 mt-2">
                        <div className="mb-3">
                          <textarea
                            className="textarea_edit col-12"
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
                            className="form-control rounded-0"
                            id="ConfirmPassword"
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
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 pt-3 mt-2">
                      <button
                        type="submit"
                        onClick={handleCompanyAdd}
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