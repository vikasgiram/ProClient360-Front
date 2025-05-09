import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getCustomers } from "../../../../../hooks/useCustomer";
import { createProject } from "../../../../../hooks/useProjects";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { getAddress } from "../../../../../hooks/usePincode";

const AddProjectPopup = ({ handleAdd }) => {

  const [custId, setCustId] = useState('');
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [purchaseOrderNo, setPurchaseOrderNo] = useState("");
  const [purchaseOrderDate, setPurchaseOrderDate] = useState("");
  const [purchaseOrderValue, setPurchaseOrderValue] = useState("");
  const [endDate, setEndDate] = useState("");
  const [advancePay, setAdvancePayment] = useState("");
  const [payAgainstDelivery, setPayAgainstDelivery] = useState("");
  const [payAfterCompletion, setPayAfterCompletion] = useState("");
  const [remark, setRemark] = useState("");
  const [category, setCategory] = useState('');
  const [POCopy, setPOCopy] = useState("");
  const [loading, setLoading] = useState(false);


  const [Address, setAddress] = useState({
    pincode: "",
    state: "",
    city: "",
    add: "",
    country: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAddress(Address.pincode);

      if (data !== "Error") {
        console.log(data);
        setAddress(data);
      }
    };
    if(Address.pincode > 0)
      fetchData();
  }, [Address.pincode]);



  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCustomers();
      // console.log(data);
      if (data) {
        setCustomers(data.customers || []);
        // console.log(employees,"data from useState");
      }
    };

    fetchData();
  }, []);


  const handleProjectAdd = async (event) => {
    event.preventDefault();
    setLoading(!loading);
    const formData = new FormData();
    formData.append('POCopy', POCopy);

    if (!custId || !name || !purchaseOrderDate || !purchaseOrderNo || !purchaseOrderValue || !category || !startDate || !endDate || !advancePay || !payAgainstDelivery || !payAfterCompletion || !remark
      || !Address.pincode ||
      !Address.state ||
      !Address.city ||
      !Address.add ||
      !Address.country
    ) {
      setLoading(false);
      return toast.error("Please fill all fields");
    }

    else if (Number(advancePay) + Number(payAgainstDelivery) + Number(payAfterCompletion) > 100) {
      setLoading(false);
      return toast.error("Total percentage should be less than 100%");
    }
    if(purchaseOrderValue <= 0){
      setLoading(false);
      return toast.error("Purchase order value should be greater than 0");
    }
    if(advancePay <= 0 || payAgainstDelivery <= 0 || payAfterCompletion <= 0){
      setLoading(false);
      return toast.error("Percentage should be greater than 0");
    }
    if(Address.pincode.length !== 6 || Address.pincode < 0){
      return toast.error("Enter valid Pincode");
    }
    if (!POCopy){
      setLoading(false);
      return toast.error("Please upload POCopy");
    }
    if(startDate>endDate){
      setLoading(false);
      return toast.error("Start date should be less than end date");
    }

    formData.append('custId', custId);
    formData.append('name', name);
    formData.append('purchaseOrderDate', purchaseOrderDate);
    formData.append('purchaseOrderNo', purchaseOrderNo);
    formData.append('purchaseOrderValue', purchaseOrderValue);
    formData.append('category', category);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('advancePay', advancePay);
    formData.append('payAgainstDelivery', payAgainstDelivery);
    formData.append('payAfterCompletion', payAfterCompletion);
    formData.append('remark', remark);
    formData.append('Address', JSON.stringify(Address));
    formData.append('POCopy', POCopy);

    await createProject(formData);
    // console.log(data);
    

    handleAdd();
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {

      if (file.size > 2 * 1024 * 1024) {
        return toast.error("File must be less than 2MB");
        
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPOCopy(reader.result);

      };
      reader.readAsDataURL(file);
    }
  };
  // console.log(loading)

  return (
    <>
     
      <div className="modal fade show" style={{ display: "flex", alignItems: 'center', backgroundColor: "#00000090" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content p-3">
            <form onSubmit={handleProjectAdd}>
              <div className="modal-header pt-0">

                <h5 className="card-title fw-bold" id="exampleModalLongTitle">

                  Create New Project
                  {/* Forward */}
                </h5>
                <button onClick={() => { handleAdd() }} type="button" className="close px-3" style={{ marginLeft: "auto" }}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row modal_body_height">
                  <div className="col-12" >


                    <div className="mb-3">
                      <label htmlFor="exampleInputEmail1" className="form-label label_text">Customer Name <RequiredStar /></label>
                      <select className="form-select rounded-0" aria-label="Default select example"
                        value={custId} // this sets the current selected value
                        onChange={(e) => {

                          setCustId(e.target.value);
                          // console.log("Selected customer ID:", customerId);
                        }}
                      >
                        <option value="" >-- Select Customer Name --</option>
                        {customers && customers.map((cust) => (
                          <option key={cust._id} value={cust._id}>{cust.custName}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  <div className="mb-3">
                    <label for="ProjectName" className="form-label label_text">Project Name <RequiredStar /></label>
                    <input type="text" className="form-control rounded-0" id="ProjectName" onChange={(e) => setName(e.target.value)} value={name} aria-describedby="emailHelp" />
                  </div>


                  <div className="col-12 col-lg-6 mt-2">
                    <div className="mb-3">
                      <label htmlFor="purchaseOrderDate" className="form-label label_text">
                        Purchase Order Date <RequiredStar />
                      </label>
                      <input
                        onChange={(e) => setPurchaseOrderDate(e.target.value)} // Handles date input change
                        value={purchaseOrderDate} // Prepopulate value from state
                        type="date"
                        className="form-control rounded-0"
                        id="purchaseOrderDate"
                        aria-describedby="dateHelp"
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2" >

                    <div className="mb-3">
                      <label for="purchaseOrderNo" className="form-label label_text">Purchase Order Number <RequiredStar /></label>
                      <input type="text" className="form-control rounded-0" id="purchaseOrderNo"
                        onChange={(e) => setPurchaseOrderNo(e.target.value)}
                        value={purchaseOrderNo} aria-describedby="emailHelp" />
                    </div>

                  </div>
                  <div className="col-12 col-lg-6 mt-2" >
                    <div className="mb-3">
                      <label for="purchaseOrderValue" className="form-label label_text">Purchase Order Value (Rs) <RequiredStar />
                      </label>
                      <input type="number" className="form-control rounded-0" id="purchaseOrderValue"
                        onChange={(e) => setPurchaseOrderValue(e.target.value)}
                        value={purchaseOrderValue} aria-describedby="emailHelp" />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2" >

                    <div className="mb-3">
                      <label htmlFor="CategoryofProject" className="form-label label_text">Category of Project <RequiredStar /></label>
                      <select
                        className="form-select rounded-0"
                        aria-label="Default select example"
                        value={category} // binding the selected value to state
                        onChange={(e) => {

                          setCategory(e.target.value);

                        }}
                      >
                        <option value="" selected>-- Select Category Name --</option>
                        <option value="Surveillance System">Surveillance System</option>
                        <option value="Access Control System">Access Control System</option>
                        <option value="Turnkey Project">Turnkey Project</option>
                        <option value="Alleviz">Alleviz</option>
                        <option value="CafeLive">CafeLive</option>
                        <option value="WorksJoy">WorksJoy</option>
                        <option value="WorksJoy Blu">WorksJoy Blu</option>
                        <option value="Fire Alarm System">Fire Alarm System</option>
                        <option value="Fire Hydrant System">Fire Hydrant System</option>
                        <option value="IDS">IDS</option>
                        <option value="AI Face Machines">AI Face Machines</option>
                        <option value="Entrance Automation">Entrance Automation</option>
                        <option value="Guard Tour System">Guard Tour System</option>
                        <option value="Home Automation">Home Automation</option>
                        <option value="IP PA and Communication System">IP PA and Communication System</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6 mt-2" >
                    <div className="mb-3">
                      <label htmlFor="ProjectStartDate" className="form-label label_text">Project Start Date <RequiredStar />
                      </label>
                      <input
                        onChange={(e) => setStartDate(e.target.value)}
                        value={startDate}
                        type="date"
                        className="form-control rounded-0"
                        id="ProjectStartDate"
                        aria-describedby="dateHelp"
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2" >
                    <div className="mb-3">
                      <label htmlFor="ProjectEndDate" className="form-label label_text">Project End Date <RequiredStar />
                      </label>
                      <input
                        onChange={(e) => setEndDate(e.target.value)}
                        value={endDate}
                        type="date"
                        className="form-control rounded-0"
                        id="ProjectEndDate"
                        aria-describedby="dateHelp"
                      />
                    </div>
                  </div>
                  <div className="col-12  mt-2" >

                    <div className="row border bg-gray mx-auto">
                      <div className="col-10 mb-3">
                        <span className="SecondaryInfo">
                          Payment terms:

                        </span>
                      </div>

                      <div className="col-12 col-lg-6 mt-2" >

                        <div className="mb-3">
                          <label for="AdvancePayment" className="form-label label_text">     Advance Payment <RequiredStar />
                          </label>
                          <input type="number" className="form-control rounded-0" id="AdvancePayment"
                            onChange={(e) => setAdvancePayment(e.target.value)} value={advancePay} aria-describedby="mobileNoHelp" />
                        </div>
                      </div>
                      <div className="col-12 col-lg-6 mt-2" >
                        <div className="mb-3">
                          <label for="PayAgainstDelivery" className="form-label label_text">          Pay Against Delivery <RequiredStar />

                          </label>
                          <input type="number" className="form-control rounded-0" id="PayAgainstDelivery" onChange={(e) => setPayAgainstDelivery(e.target.value)} value={payAgainstDelivery} aria-describedby="mobileNoHelp" />
                        </div>
                      </div>

                      <div className="col-12 col-lg-6 mt-2" >
                        <div className="mb-3">
                          <label for="PayAfterCompletion" className="form-label label_text">     Pay After Completion <RequiredStar />
                          </label>
                          <input type="number" className="form-control rounded-0" id="PayAfterCompletion" onChange={(e) => setPayAfterCompletion(e.target.value)} value={payAfterCompletion} aria-describedby="secemailHelp" />
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
                            type="number"
                            className="form-control rounded-0"
                            placeholder="Pincode"
                            id="exampleInputEmail1"
                            name="pincode"
                            min={0}
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
                            name="state"
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
                            name="city"
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
                            name="country"
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
                            name="add"
                            placeholder="House NO., Building Name, Road Name, Area, Colony"
                            onChange={(e) => setAddress({ ...Address, add: e.target.value })}
                            value={Address.add}
                            rows="2"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>




                  <div className="col-12 col-lg-6 mt-2" >

                    <div className="mb-3">
                      <label for="PurchaseOrderCopy" className="form-label label_text">     Purchase Order Copy <RequiredStar />

                      </label>
                      <input type="file" className="form-control rounded-0" id="PurchaseOrderCopy" aria-describedby="secemailHelp"
                        accept=".pdf"
                        onChange={handleFileChange} files={POCopy}
                      />
                    </div>



                  </div>

                  <div className="col-12 col-lg-6 mt-2" >

                    <div className="mb-3">
                      <label for="remark" className="form-label label_text">     remark
                      </label>
                      <input type="text" className="form-control rounded-0" id="remark" onChange={(e) => setRemark(e.target.value)} value={remark} aria-describedby="secemailHelp" />
                    </div>


                  </div>






                  <div className="row">
                    <div className="col-12 pt-3 mt-2">
                      <button
                        type="submit"
                        onClick={handleProjectAdd}
                        disabled={loading}
                        
                        className="w-80 btn addbtn rounded-0 add_button m-2 px-4"
                      >
                        {!loading ? "Add" : "Submitting..."}
                      </button>
                      <button
                        type="button"
                        onClick={handleAdd}
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

export default AddProjectPopup;