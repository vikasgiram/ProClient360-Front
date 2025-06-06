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

  const handleCompanyAdd = async (event) => {
    event.preventDefault();
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
      const reader = new FileReader();
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
                        maxLength={40}
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
                        maxLength={40}
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
                        Mobile Number <RequiredStar />
                      </label>
                      <input
                        type="tel"
                        id="MobileNumber"
                        className="form-control rounded-0"
                        maxLength={10}
                        value={mobileNo}
                        onChange={(e) => {
                          const onlyDigits = e.target.value.replace(/\D/g, '');
                          setMobileNo(onlyDigits);
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
                        maxLength={40}
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
                        Logo <RequiredStar />
                      </label>
                      <input
                        type="file"
                        className="form-control rounded-0"
                        id="LOGO"
                        accept="image/*"
                        onChange={handleFileChange}
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
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <input
                            type="text"
                            maxLength={40}
                            className="form-control rounded-0"
                            placeholder="State"
                            onChange={(e) => {
                              const onlyLettersAndSpaces = e.target.value.replace(/[^A-Za-z\s]/g, '');
                              setAddress({ ...Address, state: onlyLettersAndSpaces });
                            }}
                            value={Address.state}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <input
                            type="text"
                            maxLength={40}
                            className="form-control rounded-0"
                            placeholder="City"
                            onChange={(e) => {
                              const onlyLettersAndSpaces = e.target.value.replace(/[^A-Za-z\s]/g, '');
                              setAddress({ ...Address, city: onlyLettersAndSpaces });
                            }}
                            value={Address.city}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <input
                            type="text"
                            maxLength={40}
                            className="form-control rounded-0"
                            placeholder="Country"
                            onChange={(e) => {
                              const onlyLettersAndSpaces = e.target.value.replace(/[^A-Za-z\s]/g, '');
                              setAddress({ ...Address, country: onlyLettersAndSpaces });
                            }}
                            value={Address.country}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-12 mt-2">
                        <div className="mb-3">
                          <textarea
                            className="textarea_edit col-12"
                            placeholder="House NO., Building Name, Road Name, Area, Colony"
                            maxLength={70}
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
                            maxLength={40}
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
                            maxLength={40}
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
                        maxLength={50}
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