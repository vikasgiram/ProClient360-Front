import { useState, useEffect } from "react";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { createService } from "../../../../../hooks/useService";
import { getEmployees } from "../../../../../hooks/useEmployees";
import toast from "react-hot-toast";
const AddServicePopup = ({ handleAddService, selectedTicketId }) => {


  const [loading, setLoading] = useState(false);
  const [serviceType, setServiceType] = useState();
  const [priority, setPriority] = useState();
  const [zone, setZone] = useState();
  const [allotmentDate, setAllotmentDate] = useState();
  const [allotTo, setAllotTo] = useState();
  const [workMode, setWorkMode] = useState();
  const [ticket, setTicket] = useState(selectedTicketId);


  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    getEmployees().then((res) => {
      setEmployees(res.employees || []);
    });
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      serviceType,
      ticket,
      priority,
      zone,
      allotmentDate,
      allotTo,
      workMode,
      ticket,
      // completionDate
    };
    if (!serviceType || !ticket || !priority || !allotmentDate || !allotTo || !workMode) {
      return toast.error("Please fill all the fields");
    }

    await createService(data);
    handleAddService();

  }

  return (
    <>

      <div className="modal fade show" style={{ display: "flex", alignItems: 'center', backgroundColor: "#00000090" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content p-3">
            <form onSubmit={handleSubmit}>
              <div className="modal-header pt-0">

                <h5 className="card-title fw-bold" id="exampleModalLongTitle">

                  Assign Service
                  {/* Forward */}
                </h5>

              </div>
              <div className="modal-body">
                <div className="row modal_body_height">

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        for="Department"
                        className="form-label label_text"
                      >
                        Service Type <RequiredStar />
                      </label>
                      <select
                        className="form-select rounded-0"
                        id=""
                        aria-label="Default select example"
                        onChange={(e) => setServiceType(e.target.value)}
                        required
                      ><option >Select Service Type</option>
                        <option value={"AMC"}>AMC</option>
                        <option value={"One Time"}>One time</option>
                        <option value={"Warranty"}>Warranty</option>
                      </select>
                    </div>
                  </div>


                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        for="Department"
                        className="form-label label_text"
                      >
                        Priority <RequiredStar />
                      </label>
                      <select
                        className="form-select rounded-0"
                        id=""
                        aria-label="Default select example"
                        onChange={(e) => setPriority(e.target.value)}
                        required
                      ><option >Select Priority</option>
                        <option value={"High"}>High</option>
                        <option value={"Medium"}>Mid</option>
                        <option value={"Low"}>Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        for="Department"
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

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="purchaseOrderDate" className="form-label label_text">
                        Allotment Date <RequiredStar />
                      </label>
                      <input
                        onChange={(e) => setAllotmentDate(e.target.value)} // Handles date input change
                        value={allotmentDate} // Prepopulate value from state
                        type="date"
                        className="form-control rounded-0"
                        id="purchaseOrderDate"
                        aria-describedby="dateHelp"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        for="Department"
                        className="form-label label_text"
                      >
                        Allocated to <RequiredStar />
                      </label>
                      <select
                        className="form-select rounded-0"
                        id=""
                        aria-label="Default select example"
                        onChange={(e) => setAllotTo(e.target.value)}
                        required
                      ><option >Select Employee</option>
                        {employees.map((emp) => (
                          <option value={emp._id}>{emp.name}</option>
                        ))}

                      </select>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label
                        for="Department"
                        className="form-label label_text"
                      >
                        Workmode <RequiredStar />
                      </label>
                      <select
                        className="form-select rounded-0"
                        id=""
                        aria-label="Default select example"
                        onChange={(e) => setWorkMode(e.target.value)}
                        required
                      ><option >Select Workmode</option>
                        <option value={"Onsite"}>Onsite</option>
                        <option value={"Remote"}>Remote</option>

                      </select>
                    </div>
                  </div>




                  <div className="row">
                    <div className="col-12 pt-3 mt-2">
                      <button
                        type="submit"
                        // onClick={handleServiceAdd}
                        disabled={loading}

                        className="w-80 btn addbtn rounded-0 add_button m-2 px-4"
                      >
                        {!loading ? "Add" : "Submitting..."}
                      </button>
                      <button
                        type="button"
                        onClick={handleAddService}
                        className="w-80  btn addbtn rounded-0 Cancel_button m-2 px-4" >
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

    </>);
}

export default AddServicePopup;