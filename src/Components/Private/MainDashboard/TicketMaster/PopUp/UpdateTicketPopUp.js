import { useState, useEffect } from "react";
import { updateTicket } from "../../../../../hooks/useTicket";
import { getCustomers } from "../../../../../hooks/useCustomer";

import toast from "react-hot-toast";

import { RequiredStar } from "../../../RequiredStar/RequiredStar";

const UpdateEmployeePopUp = ({ handleUpdate, selectedTicket }) => {
  const [ticket, setTicket] = useState(selectedTicket);
  const [customers, setCustomers] = useState();
  const [searchText, setSearchText] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "client") {
      // Set the client object with only the _id
      setTicket((prevTicket) => ({
        ...prevTicket,
        client: {
          _id: value, // Set the _id of the selected client
        },
      }));
    } else {
      setTicket((prevTicket) => ({
        ...prevTicket,
        [name]: value,
        Address: {
          ...prevTicket.Address,
          [name]: value
        }
      }));
    }
  };
  // console.log(ticket,"ds");

  const handleEmpUpdate = async (event) => {
    event.preventDefault();
    if (
      !ticket.details ||
      !ticket.product ||
      !ticket.client ||
      !ticket.contactPerson ||
      !ticket.contactNumber ||
      !ticket.source
    ) {
      return toast.error("Please fill all fields");
    }
    if (/[a-zA-Z]/.test(ticket.contactNumber)) {
      return toast.error("Phone number should not contain alphabets");
    }
    try {
      toast.loading("Updating Ticket...")
      const data = await updateTicket(ticket._id, ticket);
      toast.dismiss()
      if(data?.success){
        toast.success(data.message);
        handleUpdate();
      }else{
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchText.trim() !== "" && searchText.length > 2) {
        fetchCustomers(searchText);
      } else {
        setCustomers([]); // empty when no input
      }
    }, 500); // debounce API call by 500ms

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const fetchCustomers = async () => {
    const data = await getCustomers(1, 15, searchText);
    // console.log(data);
    if (data) {
      setCustomers(data.customers || []);
      // console.log(employees,"data from useState");
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
            <form onSubmit={handleEmpUpdate}>
              <div className="modal-header pt-0">
                <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                  Update ticket
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
                  {/* <div className="col-12">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label label_text">
                        Full Name <RequiredStar />
                      </label>
                      <input
                        name="name"
                        type="text"
                        value={ticket.name}
                        onChange={handleChange}
                        className="form-control rounded-0"
                        id="name"
                        required
                      />
                    </div>
                  </div> */}

                  <div className="col-12">
                    <div className="mb-3">
                      <label
                        htmlFor="custName"
                        className="form-label label_text"
                      >
                        Client Name <RequiredStar />
                      </label>
                      {/* <input
                        type="text"
                        name="custName"
                        value={ticket.client.custName}
                        onChange={handleChange}
                        className="form-control rounded-0"
                        id="custName"
                        required
                      /> */}
                      <input
                        type="text"
                        className="form-control mb-2"
                        id="customerSearch"
                        placeholder="Type to search customer..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        required
                      />

                      <select
  className="form-select rounded-0"
  id="custName"
  name="client"
  aria-label="Default select example"
  onChange={handleChange}
  value={ticket?.client?._id || ""}
  required
>
  <option value="" hidden>
    {ticket?.client?.custName
      ? ticket.client.custName
      : "Select Client"}
  </option>
  {customers &&
    customers.map((cust) => (
      <option key={cust._id} value={cust._id}>
        {cust.custName}
      </option>
    ))}
</select>
                    </div>
                  </div>
                  <div className="col-12  mt-2">
                    <div className="row border mt-4 bg-gray mx-auto">
                      <div className="col-12 mb-3">
                        <span className="AddressInfo">
                          Address <RequiredStar />
                        </span>
                      </div>

                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="\d{6}"
                            maxLength={6}
                            className="form-control rounded-0"
                            placeholder="Pincode"
                            id="pincode"
                            name="pincode"
                            value={ticket?.Address?.pincode || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,6}$/.test(value)) {
                                handleChange(e);
                              }
                            }}
                            aria-describedby="emailHelp"
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
                            name="state"
                            id="state"
                            onChange={handleChange}
                            value={ticket?.Address?.state}
                            aria-describedby="emailHelp"
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
                            name="city"
                            id="city"
                            onChange={handleChange}
                            value={ticket?.Address?.city}
                            aria-describedby="emailHelp"
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
                            id="country"
                            name="country"
                            onChange={handleChange}
                            value={ticket?.Address?.country}
                            aria-describedby="emailHelp"
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-12 mt-2">
                        <div className="mb-3">
                          <textarea
                            className="textarea_edit col-12"
                            id="add"
                            name="add"
                            maxLength={500}
                            placeholder="House NO., Building Name, Road Name, Area, Colony"
                            onChange={handleChange}
                            value={ticket?.Address?.add}
                            rows="2"
                            required
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="mb-3">
                      <label for="details" className="form-label label_text">
                        Complaint Details <RequiredStar />
                      </label>
                      <textarea
                        type="text"
                        name="details"
                        maxLength={500}
                        placeholder="Update a Complaint Details...."
                        value={ticket?.details}
                        onChange={handleChange}
                        className="form-control rounded-0"
                        id="details"
                        aria-describedby="emailHelp"
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="mb-3">
                      <label for="product" className="form-label label_text">
                        Product <RequiredStar />
                      </label>
                      <select
                        className="form-select rounded-0"
                        id="product"
                        name="product"
                        aria-label="Default select example"
                        onChange={handleChange}
                        required
                      >
                        <option hidden>{ticket?.product}</option>
                        <option value={"Surveillance System"}>
                          Surveillance System
                        </option>
                        <option value={"Access Control System"}>
                          Access Control System
                        </option>
                        <option value={"Turnkey Project"}>
                          Turnkey Project
                        </option>
                        <option value={"Alleviz"}>Alleviz</option>
                        <option value={"CafeLive"}>CafeLive</option>
                        <option value={"WorksJoy"}>WorksJoy</option>
                        <option value={"WorksJoy Blu"}>WorksJoy Blu</option>
                        <option value={"Fire Alarm System"}>
                          Fire Alarm System
                        </option>
                        <option value={"Fire Hydrant System"}>
                          Fire Hydrant System
                        </option>
                        <option value={"IDS"}>IDS</option>
                        <option value={"AI Face Machines"}>
                          AI Face Machines
                        </option>
                        <option value={"Entrance Automation"}>
                          Entrance Automation
                        </option>
                        <option value={"Guard Tour System"}>
                          Guard Tour System
                        </option>
                        <option value={"Home Automation"}>
                          Home Automation
                        </option>
                        <option value={"IP PA and Communication System"}>
                          IP PA and Communication System
                        </option>
                        <option value="CRM">CRM</option>
                        <option value="KMS">KMS</option>
                        <option value="VMS">VMS</option>
                        <option value="PMS">PMS</option>
                        <option value="Boom Barrier System">Boom Barrier System</option> 
                        <option value="Tripod System">Tripod System</option>
                        <option value="Flap Barrier System">Flap Barriers System</option>
                        <option value="EPBX System">EPBX System</option>
                        <option value="CMS">CMS</option>
                        <option value="Lift Eliviter System">Lift Eliiter System</option>
                        <option value="AV6">AV6</option>
                        <option value="Walky Talky System">Walky Talky System</option>
                        <option value="Device Management System">Device Management System</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        for="contactPerson"
                        className="form-label label_text"
                      >
                        Contact Person name <RequiredStar />
                      </label>
                      <input
                        type="text"
                        maxLength={50}
                        value={ticket?.contactPerson}
                        onChange={handleChange}
                        className="form-control rounded-0"
                        id="contactPerson"
                        name="contactPerson"
                        aria-describedby="emailHelp"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        for="contactPersonEmail"
                        className="form-label label_text"
                      >
                        Contact Person Email <RequiredStar />
                      </label>
                      <input
                        type="text"
                        maxLength={50}
                        value={ticket?.contactPersonEmail}
                        onChange={handleChange}
                        className="form-control rounded-0"
                        id="contactPersonEmail"
                        aria-describedby="emailHelp"
                        name="contactPersonEmail"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        for="contactNumber"
                        className="form-label label_text"
                      >
                        Contact Person no <RequiredStar />
                      </label>
                      <input
                        type="tel"
                        pattern="[0-9]{10}"
                        maxLength="10"
                        value={ticket?.contactNumber}
                        onChange={handleChange}
                        className="form-control rounded-0"
                        id="contactNumber"
                        name="contactNumber"
                        aria-describedby="emailHelp"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label for="source" className="form-label label_text">
                        Complaint Source <RequiredStar />
                      </label>
                      <select
                        className="form-select rounded-0"
                        id="source"
                        name="source"
                        aria-label="Default select example"
                        onChange={handleChange}
                        required
                      >
                        <option hidden>{ticket?.source}</option>
                        <option value={"Email"}>Email</option>
                        <option value={"Call"}>Call</option>
                        <option value={"WhatsApp"}>WhatsApp</option>
                        <option value={"SMS"}>SMS</option>
                        <option value={"Direct"}>Direct</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 pt-3 mt-2">
                      <button
                        type="submit"
                        onClick={handleEmpUpdate}
                        className="w-80 btn addbtn rounded-0 add_button m-2 px-4"
                      >
                        Update
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

export default UpdateEmployeePopUp;
