import { useState, useEffect } from "react";
import { createEmployee } from "../../../../../hooks/useEmployees";
import toast from "react-hot-toast";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import {createTicket} from "../../../../../hooks/useTicket"
import {getCustomers} from "../../../../../hooks/useCustomer";



const AddTicketPopup = ({ handleAdd }) => {
  const [client, setClient] = useState("");
  const [details,setDetails]=useState("");
  const [product,setProduct]=useState("");
  const [contactPerson,setContactPerson]=useState("");
  const [contactNumber,setContactNumber]=useState("");
  const [source,setSource]=useState("");
  const [customers,setCustomer]=useState();
  const [loading,setLoading]=useState(false);
  const [Address, setAddress] = useState({
    add:"",
    city:"",
    country:"",
    pincode:"",
    state:""
  })

  const handleEmployeeAdd = async (event) => {
    event.preventDefault();
    const data = {
      client,
      details,
      product,
      contactPerson,
      contactNumber,
      source,
      Address,
    };
    if (!client || !details || !product || !contactPerson || !contactNumber || !source || !Address) {
      return toast.error("Please fill all fields");
    }
    if(contactNumber.length !== 10){
       return toast.error("Please Enter Valid Contact Number");
      }
    if(/[a-zA-Z]/.test(contactNumber)){
      return toast.error("Phone number should not contain alphabets");
    }
    await createTicket(data);
    handleAdd();
    console.log(data);
  };
  
  
  const fetchCusetomer=async ()=>{
    const data=await getCustomers();
    setCustomer(data.customers);
  }

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
                  Create New Ticket
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
                      <label
                        for="clientName"
                        className="form-label label_text"
                      >
                        Client Name <RequiredStar />
                      </label>
                      {/* <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="form-control rounded-0"
                        id="clientName"
                        aria-describedby="emailHelp"
                        required
                      /> */}
                      <select
                        className="form-select rounded-0"
                        id=""
                        aria-label="Default select example"
                        onChange={(e) => setClient(e.target.value)}
                        onClick={fetchCusetomer}
                        required
                      ><option >Select Client</option>
                        {customers && customers.map((cust)=>
                          <option value={cust._id}>{cust.custName}</option>
                        )}
                      </select>
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

                  <div className="col-12">
                    <div className="mb-3">
                      <label
                        for="clientName"
                        className="form-label label_text"
                      >
                        Complaint Details <RequiredStar />
                      </label>
                      <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="form-control rounded-0"
                        id="name"
                        aria-describedby="emailHelp"
                        required
                        ></textarea>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="mb-3">
                      <label
                        for="clientName"
                        className="form-label label_text"
                      >
                        Product <RequiredStar />
                      </label>
                      <select
                        className="form-select rounded-0"
                        id=""
                        aria-label="Default select example"
                        onChange={(e) => setProduct(e.target.value)}
                        required
                      ><option >Select Product</option>
                        <option value={"Surveillance System"}>Surveillance System</option>
                        <option value={"Access Control System"}>Access Control System</option>
                        <option value={"Turnkey Project"}>Turnkey Project</option>
                        <option value={"Alleviz"}>Alleviz</option>
                        <option value={"CafeLive"}>CafeLive</option>
                        <option value={"WorksJoy"}>WorksJoy</option>
                        <option value={"WorksJoy Blu"}>WorksJoy Blu</option>
                        <option value={"Fire Alarm System"}>Fire Alarm System</option>
                        <option value={"Fire Hydrant System"}>Fire Hydrant System</option>
                        <option value={"IDS"}>IDS</option>
                        <option value={"AI Face Machines"}>AI Face Machines</option>
                        <option value={"Entrance Automation"}>Entrance Automation</option>
                        <option value={"Guard Tour System"}>Guard Tour System</option>
                        <option value={"Home Automation"}>Home Automation</option>
                        <option value={"IP PA and Communication System"}>IP PA and Communication System</option>
                      </select>
                    </div>
                  </div>


                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        for="Department"
                        className="form-label label_text"
                      >
                        Contact Person name <RequiredStar />
                      </label>
                      <input
                        type="text"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
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
                        for="Designation"
                        className="form-label label_text"
                      >
                        Contact Person no <RequiredStar />
                      </label>
                      <input
                        type="number"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
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
                        for="Department"
                        className="form-label label_text"
                      >
                        Complaint Source <RequiredStar />
                      </label>
                      <select
                        className="form-select rounded-0"
                        id=""
                        aria-label="Default select example"
                        onChange={(e) => setSource(e.target.value)}
                        required
                      ><option >Select Source</option>
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

export default AddTicketPopup;
