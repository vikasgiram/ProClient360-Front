import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { updateCompany } from "../../../../../hooks/useCompany";
import { formatDateforupdateSubcription } from "../../../../../utils/formatDate";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { getAddress } from "../../../../../hooks/usePincode";
import { isValidCompanyName, isValidGSTINumber, isValidName, isValidPincode, notPastDate } from "../../../../../utils/validations";

const UpdatedCompanyPopup = ({ handleUpdate, selectedCompany }) => {
  const [company, setCompany] = useState({
    ...selectedCompany,
  });
  // console.log(selectedCompany.subDate,"subDate");

  const [Address, setAddress] = useState(company.Address || {
    add: "",
    pincode: "",
    state: "",
    city: "",
    country: "",
  });

  const [subDate, setSubDate] = useState(formatDateforupdateSubcription(company.subDate));
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...Address, [name]: value });
  };



  useEffect(() => {
    const fetchData = async () => {
      const data = await getAddress(Address.pincode);

      if (data !== "Error") {
        console.log(data);
        setAddress(data);
      }
    };
    if (Address.pincode.length === 6)
      fetchData();
  }, [Address.pincode]);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setCompany((prevCompany) => ({ ...prevCompany, [name]: value }));

    if (name === "subDate") {
      setSubDate(value);
    }
  };


  const handleCompanyUpdate = async (event) => {
    event.preventDefault();
    setLoading(!loading);
    const updatedCompany = {
      ...company,
      Address,
      subDate
    }

    if (updatedCompany.name === "") {
      setLoading(false);
      return toast.error("Company Name can't be empty or Invalid");
    }
    if (updatedCompany.admin === "") {
      setLoading(false);
      return toast.error("Admin Name can't be empty or Invalid");
    }
    if (updatedCompany.subDate === "") {
      setLoading(false);
      return toast.error("Subscription End Date can't be empty");
    }
    if (updatedCompany?.Address?.add === "") {
      setLoading(false);
      return toast.error("Address can't be empty or Invalid");
    }
    if (updatedCompany?.pincode?.length == 6) {
      setLoading(false);
      return toast.error("Invalid Pincode");
    }
    if (updatedCompany.Address.state === "") {
      setLoading(false);
      return toast.error("State can't be empty");
    }
    if (updatedCompany.city === "") {
      setLoading(false);
      return toast.error("City can't be empty");
    }
    if (updatedCompany.country === "") {
      setLoading(false);
      return toast.error("Country can't be empty");
    }
    if (!isValidGSTINumber(updatedCompany.GST)) {
      console.log("GST No", updatedCompany.GST);
      setLoading(false);
      return toast.error("GST No can't be empty or Invalid");
    }
    if (updatedCompany.subAmount < 0) {
      setLoading(false);
      return toast.error("Subscription Amount can't be negative");
    }
    try {
      // console.log(updatedCompany);
      toast.loading("Updating Company...");
      const data = await updateCompany(updatedCompany);
      if(data.success) {
        toast.dismiss();
        toast.success("Company Updated Successfully");
        handleUpdate();
      } else {
        toast.dismiss();
        toast.error("Failed to Update Company");
      }
      setLoading(false);
    } catch (error) {
      toast.error(error.massage);
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
                  Update Company
                </h5>
                <button
                  onClick={() => handleUpdate()}
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
                        Full Name <RequiredStar />
                      </label>
                      <input
                        name="name"
                        type="text"
                        placeholder="Update Full Name...."
                        maxLength={40}
                        value={company.name}
                        onChange={handleChange}
                        className="form-control rounded-0"
                        id="name"
                        required
                      />
                    </div>
                  </div>


                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="admin" className="form-label label_text">
                        Admin Name <RequiredStar />
                      </label>
                      <input
                        type="text"
                        name="admin"
                        placeholder="Update Admin Name...."
                        maxLength={40}
                        value={company.admin}
                        onChange={handleChange}
                        className="form-control rounded-0"
                        id="admin"
                        aria-describedby="emailHelp"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      {/* <label htmlFor="subDate" className="form-label label_text">Subscription  End Date
                      </label>
                      <input
                        onChange={handleChange}
                        value={subDate}
                        name="subDate"
                        type="date"
                        className="form-control rounded-0"
                        id="subDate"
                        aria-describedby="dateHelp"
                      /> */}
                      <label htmlFor="subDate"
                        name="subDate" className="form-label label_text">Subscription End Date <RequiredStar /></label>
                      <input
                        onChange={handleChange}
                        value={subDate}
                        name="subDate"
                        type="date"
                        className="form-control rounded-0"
                        id="subDate"
                        aria-describedby="dateHelp"
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label for="subAmount" className="form-label label_text">
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
                          id="subAmount"
                          name="subAmount"
                          placeholder="eg.1000"
                          value={company.subAmount}
                          onChange={handleChange}
                          className="form-control rounded-0 border-0"
                          aria-label="Username"
                          aria-describedby="basic-addon1"
                          min={0}
                          required
                        />
                      </div>{" "}
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label for="GST" className="form-label label_text">
                        GST No <RequiredStar />
                      </label>
                      <div className="input-group border mb-3">
                        <input
                          type="text"
                          id="GST"
                          name="GST"
                          maxLength={15}
                          placeholder="Update GST Number...."
                          value={company.GST}
                          onChange={handleChange}
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
                      <label for="LOGO" className="form-label label_text">
                        Logo
                      </label>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">

                      {company.logo &&
                        <img
                          src={company.logo}
                          alt="Company Logo"
                          className="img-fluid rounded" // Bootstrap classes for styling
                          style={{ maxWidth: '200px', maxHeight: '100px' }} // Optional: restrict size
                        />
                      }
                    </div>
                  </div>


                  <div className="col-12  mt-2">
                    <div className="row border mt-4 bg-gray mx-auto">
                      <div className="col-12 mb-3">
                        <span for="AddressInfo" className="AddressInfo">
                          Address <RequiredStar />
                        </span>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3" for="pincode">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            className="form-control rounded-0"
                            placeholder="Pincode"
                            name="pincode"
                            id="pincode"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,6}$/.test(value)) {
                                handleAddressChange(e);
                              }
                            }}
                            value={Address.pincode}
                            aria-describedby="pincodeHelp"
                          />

                        </div>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control rounded-0"
                            placeholder="State"
                            name="state"
                            id="exampleInputEmail1"
                            // onChange={(e) => setAddress({ ...Address, state: e.target.value })}
                            onChange={handleAddressChange}
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
                            name="city"
                            id="exampleInputEmail1"
                            onChange={handleAddressChange}
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
                            name="country"
                            id="exampleInputEmail1"
                            onChange={handleAddressChange}
                            value={Address.country}
                            aria-describedby="emailHelp"
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-12 mt-2">
                        <div className="mb-3">
                          <textarea
                            className="textarea_edit col-12"
                            id="add"
                            name="add"
                            onChange={handleAddressChange}
                            value={Address.add}
                            rows="2"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 pt-3 mt-2">
                      <button
                        type="submit"
                        onClick={handleCompanyUpdate}
                        disabled={loading}
                        className="w-80 btn addbtn rounded-0 add_button m-2 px-4"
                      >
                        {!loading ? "Update" : "Submitting..."}
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdate}
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

export default UpdatedCompanyPopup;
