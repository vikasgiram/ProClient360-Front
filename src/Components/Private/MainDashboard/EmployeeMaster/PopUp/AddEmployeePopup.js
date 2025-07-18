import { useState, useEffect, useCallback } from "react";
import validator from "validator";
import Select from "react-select";
import { getDepartment } from "../../../../../hooks/useDepartment";
import { createEmployee } from "../../../../../hooks/useEmployees";
import toast from "react-hot-toast";
import { getDesignation } from "../../../../../hooks/useDesignation";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";

const PAGE_SIZE = 10;

const EyeIcon = ({ isOpen }) => (
  <span style={{ cursor: 'pointer', userSelect: 'none', padding: '0 5px' }}>
    {isOpen ? '👁️' : '👁️‍🗨️'}
  </span>
);

const AddEmployeePopup = ({ handleAdd }) => {


  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Department dropdown state
  const [deptOptions, setDeptOptions] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [deptPage, setDeptPage] = useState(1);
  const [deptHasMore, setDeptHasMore] = useState(true);
  const [deptLoading, setDeptLoading] = useState(false);
  const [deptSearch, setDeptSearch] = useState("");

  const [designations, setDesignations] = useState([]);

  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [hourlyRate, setHourlyRate] = useState();
  const [designation, setDesignation] = useState('');
  const [gender, setGender] = useState('');


  // Fetch departments with pagination & search
  const loadDepartments = useCallback(async (page, search) => {
    if (deptLoading || !deptHasMore) return;
    setDeptLoading(true);
    const data = await getDepartment(page, PAGE_SIZE, search);

    if (data.error) {
      toast.error(data.error || 'Failed to load departments');
      setDeptLoading(false);
      return;
    }

    const newOpts = (data.departments || []).map(d => ({ value: d._id, label: d.name }));
    setDeptOptions(prev => page === 1 ? newOpts : [...prev, ...newOpts]);
    setDeptHasMore(newOpts.length === PAGE_SIZE);
    setDeptLoading(false);
    setDeptPage(page + 1);
  }, [deptLoading, deptHasMore]);

  // Initial & search-triggered load (reset on search)
  useEffect(() => {
    setDeptPage(1);
    setDeptHasMore(true);
    setDeptOptions([]);
    loadDepartments(1, deptSearch);
  }, [deptSearch]);

  useEffect(() => {
    if (selectedDept) {
      const fetchDesignations = async () => {

        const data = await getDesignation(selectedDept.value);

        if (data) {
          setDesignations(data.designations || []);

        }
      };

      fetchDesignations();
    } else {
      // Clear designations when no department is selected
      setDesignations([]);
      setDesignation('');
    }
  }, [selectedDept]);

  const handleEmployeeAdd = async (event) => {
    event.preventDefault();
    const employeeData = {
      name,
      mobileNo,
      email,
      hourlyRate,
      password,
      confirmPassword,
      department: selectedDept?.value,
      designation,
      gender
    };
    if (!name || !mobileNo || !email || !hourlyRate || !password || !confirmPassword || !selectedDept?.value || !designation || !gender) {
      return toast.error("Please fill all fields");
    }
    if (password !== confirmPassword) {
      return toast.error("Password doesn't match");
    }
    if (!validator.isStrongPassword(password)) {
      return toast.error("Password should contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.");
    }
    if (/[a-zA-Z]/.test(mobileNo)) {
      return toast.error("Phone number should not contain alphabets");
    }
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(mobileNo)) {
      return toast.error("Phone number must only contain digits (0-9).");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return toast.error("Enter valid Email");
    }
    if (!/^[A-Za-zÀ-ÿ]+([ '-][A-Za-zÀ-ÿ]+)*$/.test(name)) {
      return toast.error("Name should only contain alphabets and spaces");
    }
    if (!/^\d*\.?\d+$/.test(hourlyRate) || parseFloat(hourlyRate) <= 0) {
      return toast.error("Hourly Rate should be a number greater than 0");
    }
    const data = await createEmployee(employeeData);
    if (data.success) {
      toast.success(data.message);
      handleAdd();
    } else {
      toast.error(data.error || 'Employee not created.');
    }
  };


  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setName(value);
    }
  };

  const handleHourlyRateChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setHourlyRate(value);
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
        <div className="modal-dialog addemp" style={{maxWidth:"1000px"}}>
          <div className="modal-content p-3">
            <form onSubmit={handleEmployeeAdd}>
              <div className="modal-header pt-0">
                <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                  Create New Employee
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

                  <div className="col-12">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label label_text">
                        Full Name <RequiredStar />
                      </label>
                      <input
                        type="text"
                        maxLength={30}
                        value={name}
                        onChange={handleNameChange}
                        className="form-control rounded-0 uppercase-inputs"
                        id="name"
                        placeholder="Enter a Full Name...."
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
                        placeholder="Enter a Mobile Number...."
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                        className="form-control rounded-0"
                        id="MobileNumber"
                        aria-describedby="emailHelp"
                        maxlength="10"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        for="Gender"
                        className="form-label label_text"
                      >
                        Gender <RequiredStar />
                      </label>
                      <select
                        className="form-select rounded-0"
                        id="Department"
                        aria-label="Default select example"
                        onChange={(e) => setGender(e.target.value)}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>

                      </select>
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
                        maxLength={40}
                        placeholder="Enter a Email...."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control rounded-0"
                        id="Email"
                        aria-describedby="emailHelp"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        for="Department"
                        className="form-label label_text"
                      >
                        Department <RequiredStar />
                      </label>
                      <Select
                        options={deptOptions}
                        value={selectedDept}
                        onChange={opt => setSelectedDept(opt)}
                        onInputChange={val => setDeptSearch(val)}
                        onMenuScrollToBottom={() => loadDepartments(deptPage, deptSearch)}
                        isLoading={deptLoading}
                        placeholder="Search and select department..."
                        noOptionsMessage={() => deptLoading ? 'Loading...' : 'No departments'}
                        closeMenuOnSelect={true}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        for="Designation"
                        className="form-label label_text"
                      >
                        Designation <RequiredStar />
                      </label>
                      <select
                        className="form-select rounded-0"
                        aria-label="Default select example"
                        id="Designation"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)} //S
                        required
                      >
                        <option>Select Role</option>
                        {designations &&
                          designations.map((designation) => (
                            <option key={designation._id} value={designation._id}>{designation.name}</option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="HourlyRate" className="form-label label_text">
                        Hourly Rate <RequiredStar />
                      </label>
                      <div className="input-group border mb-3">
                        <span
                          className="input-group-text rounded-0 bg-white border-0"
                          id="basic-addon1"
                        >
                          <i className="fa-solid fa-indian-rupee-sign"></i>
                        </span>
                        <input
                          type="text"
                          maxLength={10}
                          id="HourlyRate"
                          value={hourlyRate}
                          onChange={handleHourlyRateChange}
                          className="form-control rounded-0 border-0"
                          placeholder="eg. 100.0"
                          aria-label="HourlyRate"
                          aria-describedby="basic-addon1"
                          required
                        />
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
                            placeholder="Confirm Password...."
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



                  {/* <div className="row">
                    <div className="col-12 col-lg-6 mt-2">
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
                          maxLength={40}
                          placeholder="Password...."
                          aria-describedby="emailHelp"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12 col-lg-6 mt-2">
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
                          maxLength={40}
                          placeholder="Confirm Password...."
                          aria-describedby="emailHelp"
                          required
                        />
                      </div>
                    </div>
                  </div> */}

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

export default AddEmployeePopup;
