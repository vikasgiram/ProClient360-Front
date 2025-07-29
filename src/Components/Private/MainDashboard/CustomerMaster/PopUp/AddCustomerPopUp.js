import { useState, useEffect } from "react";
import validator from "validator";
import toast from "react-hot-toast";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { getAddress } from "../../../../../hooks/usePincode";
import { createCustomer } from "../../../../../hooks/useCustomer";

const AddCustomerPopUp = ({ handleAdd }) => {
  const [custName, setCustName] = useState("");
  const [phoneNumber1, setPhoneNumber1] = useState("");
  const [email, setEmail] = useState("");
  const [customerContactPersonName2, setCustomerContactPersonName2] =
    useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const [GSTNo, setGSTNo] = useState("");
  const [customerContactPersonName1, setCustomerContactPersonName1] =
    useState("");

  const [zone, setZone] = useState();
  const [billingAddress, setBillingAddress] = useState({
    pincode: "",
    state: "",
    city: "",
    add: "",
    country: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAddress(billingAddress.pincode);

      if (data !== "Error") {
        setBillingAddress(prevAddress => ({
          ...prevAddress,
          state: data.state,
          city: data.city,
          country: data.country
        }));
      }
    };
    if (billingAddress.pincode >= 6)
      fetchData();
  }, [billingAddress.pincode]);


  const handleCustomerAdd = async (event) => {
    event.preventDefault();

    const customerData = {
      custName,
      phoneNumber1,
      email,
      customerContactPersonName2,
      customerContactPersonName1,
      phoneNumber2,
      billingAddress,
      zone,
      GSTNo,
    };

    if (
      !custName ||
      !phoneNumber1 ||
      !email ||
      !billingAddress.pincode ||
      !billingAddress.state ||
      !billingAddress.city ||
      !billingAddress.add ||
      !zone
    ) {
      return toast.error("Please fill all fields");
    }
    if (!validator.isEmail(email)) {
      return toast.error("Enter valid Email");
    }
    if (billingAddress.pincode.length !== 6 || billingAddress.pincode < 0) {
      return toast.error("Enter valid Pincode");
    }
    if (GSTNo && GSTNo.length !== 15) {
      return toast.error("GST should be 15 characters long");
    }
    if (!validator.isMobilePhone(phoneNumber1, 'any', { strictMode: false }) || phoneNumber2
      && !validator.isMobilePhone(phoneNumber2, 'any', { strictMode: false })) {
      return toast.error("Please enter valid 10-digit phone numbers.");
    }
    toast.loading("Creating Customer.....")
    const data = await createCustomer(customerData);
    toast.dismiss()
    if(data.success){
      toast.success(data.message);
      handleAdd();
    }else{
      toast.error(data.error || "Failed to create customer");
    }
  };

  // create a seperate function

  const handleCustNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
      setCustName(value);
    }
  };

  const handleContactPersonName1Change = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setCustomerContactPersonName1(value);
    }
  };

  const handleContactPersonName2Change = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setCustomerContactPersonName2(value);
    }
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setBillingAddress({ ...billingAddress, state: value });
    }
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setBillingAddress({ ...billingAddress, city: value });
    }
  };


  const handleGSTChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z0-9]*$/.test(value) && value.length <= 15) {
      setGSTNo(value);
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
            <form onSubmit={handleCustomerAdd}>
              <div className="modal-header pt-0">
                <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                  Create New Customer
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
                    <div className="">
                      <label htmlFor="FullName" className="form-label label_text">
                        Full Name <RequiredStar />
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-0"
                        id="FullName"
                        maxLength={300}
                        value={custName}
                        onChange={handleCustNameChange}
                        aria-describedby="nameHelp"
                        placeholder="Enter a Full Name...."
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 mt-3">
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label label_text">
                        Email <RequiredStar />
                      </label>
                      <input
                        type="email"
                        maxLength={50}
                        className="form-control rounded-0"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-describedby="emailHelp"
                        placeholder="Enter a Email...."
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12  mt-2">
                    <div className="row border bg-gray mx-auto">
                      <div className="col-10 mb-3">
                        <span className="SecondaryInfo">Secondary Info</span>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <label
                            htmlFor="SecondaryPersonName"
                            className="form-label label_text"
                          >
                            Contact Person Name 1 <RequiredStar />
                          </label>
                          <input
                            type="text"
                            maxLength={50}
                            className="form-control rounded-0"
                            id="SecondaryPersonName"
                            value={customerContactPersonName1}
                            onChange={handleContactPersonName1Change}
                            aria-describedby="emailHelp"
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <label htmlFor="SecondaryPersonName2" className="form-label label_text">
                            Contact Person Name 2
                          </label>
                          <input
                            type="text"
                            className="form-control rounded-0"
                            id="SecondaryPersonName2"
                            maxLength={50}
                            value={customerContactPersonName2}
                            onChange={handleContactPersonName2Change}
                            aria-describedby="emailHelp"
                          />
                        </div>
                      </div>


                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <label
                            htmlFor="MobileNumber"
                            className="form-label label_text"
                          >
                            Contact Person No 1 <RequiredStar />
                          </label>
                          <input
                            type="tel"
                            pattern="[0-9]{10}"
                            className="form-control rounded-0"
                            id="MobileNumber"
                            value={phoneNumber1}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setPhoneNumber1(value);
                            }}
                            aria-describedby="mobileNoHelp"
                            maxLength={10}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <label
                            htmlFor="mobileNo"
                            className="form-label label_text"
                          >
                            Contact Person No. 2
                          </label>
                          <input
                            type="tel"
                            pattern="[0-9]{10}"
                            maxLength={10}
                            className="form-control rounded-0"
                            id="mobileNo"
                            value={phoneNumber2}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setPhoneNumber2(value);
                            }}
                            aria-describedby="MobileNoHelp"
                            required
                          />
                        </div>
                      </div>
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
                            type="text"
                            className="form-control rounded-0"
                            placeholder="Pincode"
                            id="exampleInputEmail1"
                            maxLength={6}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,6}$/.test(value)) {
                                setBillingAddress({
                                  ...billingAddress,
                                  pincode: value,
                                });
                              }
                            }}
                            value={billingAddress.pincode}
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
                            maxLength={50}
                            id="exampleInputEmail1"
                            onChange={handleStateChange}
                            value={billingAddress.state}
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
                            maxLength={50}
                            value={billingAddress.city}
                            onChange={handleCityChange}
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
                            maxLength={50}
                            id="exampleInputEmail1"
                            onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                            value={billingAddress.country}
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
                            maxLength={500}
                            placeholder="House NO., Building Name, Road Name, Area, Colony"
                            onChange={(e) => setBillingAddress({ ...billingAddress, add: e.target.value })}
                            value={billingAddress.add}
                            rows="2"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="col-12  mt-2">
                  <div className="row border mt-4 bg-gray mx-auto">
                    <div className="col-12 mb-4">
                      <div className="row">
                        <div className="col-12 col-lg-4">
                          <span className="AddressInfo">Delivery Address</span>
                        </div>

                        <div className="col-12 col-lg-4 mt-4 mt-lg-0">
                          <span className=" ms-lg-4 AddressInfo">
                            <input
                              type="checkbox"
                              className="me-3 bg-white"
                              id=""
                              name=""
                              value=""
                              checked={sameAsAbove}
                              onChange={handleCheckboxChange}
                            />
                            Same as above
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-lg-6 mt-2">
                      <form>
                        <div className="mb-3">
                          <input
                            type="number"
                            className="form-control rounded-0"
                            placeholder="Pincode"
                            id="exampleInputEmail1"
                            onChange={(e) => setBillingAddress({ ...deliveryAddress, pincode: e.target.value })}
                            value={deliveryAddress.pincode}
                            aria-describedby="emailHelp"
                          />
                        </div>
                      </form>
                    </div>

                    <div className="col-12 col-lg-6 mt-2">
                      <form>
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control rounded-0"
                            placeholder="State"
                            id="exampleInputEmail1"
                            onChange={(e) => setBillingAddress({ ...deliveryAddress, state: e.target.value })}
                            value={deliveryAddress.state}
                            aria-describedby="emailHelp"
                          />
                        </div>
                      </form>
                    </div>

                    <div className="col-12 col-lg-6 mt-2">
                      <form>
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control rounded-0"
                            placeholder="City"
                            id="exampleInputEmail1"
                            onChange={(e) => setBillingAddress({ ...deliveryAddress, city: e.target.value })}
                            value={deliveryAddress.city}
                            aria-describedby="emailHelp"
                          />
                        </div>
                      </form>
                    </div>

                    <div className="col-12 col-lg-6 mt-2">
                      <form>
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control rounded-0"
                            placeholder="Contry"
                            id="exampleInputEmail1"
                            onChange={(e) => setBillingAddress({ ...deliveryAddress, country: e.target.value })}
                            value={deliveryAddress.country}
                            aria-describedby="emailHelp"
                          />
                        </div>
                      </form>
                    </div>

                    <div className="col-12 col-lg-12 mt-2">
                      <form>
                        <div className="mb-3">
                          <textarea
                            className="textarea_edit col-12"
                            id=""
                            name=""
                            placeholder="House NO., Building Name, Road Name, Area, Colony"
                            onChange={(e) => setBillingAddress({ ...deliveryAddress, add: e.target.value })}
                            value={billingAddress.add}
                            rows="2"
                          ></textarea>
                        </div>
                      </form>
                    </div>
                  </div>
                </div> */}

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="">
                      <label htmlFor="GSTNumber" className="form-label label_text">
                        GST Number
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-0 text-uppercase"
                        id="GSTNumber"
                        maxLength={15}
                        onChange={handleGSTChange}
                        value={GSTNo}
                        aria-describedby="emailHelp"
                      />
                    </div>
                  </div>


                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        htmlFor="Department"
                        className="form-label label_text"
                      >
                        Zone <RequiredStar />
                      </label>
                      <select
                        className="form-select rounded-0"
                        id=""
                        aria-label="Default select example"
                        onChange={(e) => setZone(e.target.value)}
                        required
                      ><option >Select Zone</option>
                        <option value={"South"}>South</option>
                        <option value={"North"}>North</option>
                        <option value={"East"}>East</option>
                        <option value={"West"}>West</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 pt-3 mt-2">
                      <button
                        type="submit"
                        onClick={handleCustomerAdd}
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

export default AddCustomerPopUp;
