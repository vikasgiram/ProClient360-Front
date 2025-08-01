import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Select from "react-select";
import { getCustomers } from "../../../../../hooks/useCustomer";
import { createProject } from "../../../../../hooks/useProjects";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { getAddress } from "../../../../../hooks/usePincode";

const PAGE_SIZE = 15;

const AddProjectPopup = ({ handleAdd }) => {

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [purchaseOrderNo, setPurchaseOrderNo] = useState("");
  const [purchaseOrderDate, setPurchaseOrderDate] = useState("");
  const [purchaseOrderValue, setPurchaseOrderValue] = useState("");
  const [endDate, setEndDate] = useState("");
  const [advancePay, setAdvancePayment] = useState(0);
  const [payAgainstDelivery, setPayAgainstDelivery] = useState(0);
  const [payAfterCompletion, setPayAfterCompletion] = useState(0);
  const [remark, setRemark] = useState("");
  const [category, setCategory] = useState('');
  const [POCopy, setPOCopy] = useState("");
  const [loading, setLoading] = useState(false);

  const [retention, setRetention] = useState(0);

  // Customer dropdown state
  const [custOptions, setCustOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [custPage, setCustPage] = useState(1);
  const [custHasMore, setCustHasMore] = useState(true);
  const [custLoading, setCustLoading] = useState(false);
  const [custSearch, setCustSearch] = useState("");

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
    if (Address.pincode > 0)
      fetchData();
  }, [Address.pincode]);

  // Fetch customers with pagination & search
  const loadCustomers = useCallback(async (page, search) => {
    if (custLoading || !custHasMore) return;
    setCustLoading(true);
    const data = await getCustomers(page, PAGE_SIZE, search);

    if (data.error) {
      toast.error(data.error || 'Failed to load customers');
      setCustLoading(false);
      return;
    }

    const newOpts = (data.customers || []).map(c => ({ value: c._id, label: c.custName }));
    setCustOptions(prev => page === 1 ? newOpts : [...prev, ...newOpts]);
    setCustHasMore(newOpts.length === PAGE_SIZE);
    setCustLoading(false);
    setCustPage(page + 1);
  }, [custLoading, custHasMore]);

  // Initial & search-triggered load (reset on search)
  useEffect(() => {
    setCustPage(1);
    setCustHasMore(true);
    setCustOptions([]);
    loadCustomers(1, custSearch);
  }, [custSearch]);


  const handleProjectAdd = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    if (Number(advancePay) + Number(payAgainstDelivery) + Number(payAfterCompletion) > 100) {
      return toast.error("The total percentage cannot exceed 100%.");
    }

    if (purchaseOrderValue <= 0) {
      return toast.error("Purchase order value should be greater than 0");
    }

    if (Address.pincode.length !== 6 || Address.pincode < 0) {
      return toast.error("Enter valid Pincode");
    }
    if(!Address.add || !Address.city || !Address.state || !Address.country) {
      return toast.error("Please fill all address fields");
    }
    if (!POCopy) {
      return toast.error("Please upload POCopy");
    }
    if (startDate > endDate) {
      return toast.error("Start date should be less than end date");
    }

    formData.append('custId', selectedCustomer.value);
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
    formData.append('retention', retention);

    setLoading(true);
    toast.loading("Creating Project...")
    const data = await createProject(formData);
    toast.dismiss()
    if (data.success) {
      setLoading(false);
      toast.success(data.message);
      handleAdd();
    }
    else {
      setLoading(false);
      toast.error(data.error);
    }
  };

  useEffect(() => {
    const retentionValue = 100 - (Number(advancePay) + Number(payAgainstDelivery) + Number(payAfterCompletion));
    if( retentionValue >= 0) {
      setRetention(retentionValue);
    }else{
      toast.error("The total percentage cannot exceed 100%.");
      setRetention(0);
    }
  },[advancePay, payAgainstDelivery, payAfterCompletion]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {

      if (file.size > 2 * 1024 * 1024) {
        setPOCopy();
        e.target.value = ""; 
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
                      <label htmlFor="customerSearch" className="form-label label_text">
                        Customer Name <RequiredStar />
                      </label>
                      <Select
                        options={custOptions}
                        value={selectedCustomer}
                        onChange={opt => setSelectedCustomer(opt)}
                        onInputChange={val => setCustSearch(val)}
                        onMenuScrollToBottom={() => loadCustomers(custPage, custSearch)}
                        isLoading={custLoading}
                        placeholder="Search and select customer..."
                        noOptionsMessage={() => custLoading ? 'Loading...' : 'No customers'}
                        closeMenuOnSelect={true}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label for="ProjectName" className="form-label label_text">Project Name <RequiredStar /></label>
                    <textarea type="text" className="form-control rounded-0" id="ProjectName" maxLength={1000} placeholder="Enter a Project Name..." onChange={(e) => setName(e.target.value)} value={name} aria-describedby="emailHelp" required ></textarea>
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
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 col-lg-6 mt-2" >
                    <div className="mb-3">
                      <label for="purchaseOrderNo" className="form-label label_text">Purchase Order Number <RequiredStar /></label>
                      <input type="text" className="form-control rounded-0" maxLength={200} id="purchaseOrderNo"
                        onChange={(e) => setPurchaseOrderNo(e.target.value)}
                        value={purchaseOrderNo} aria-describedby="emailHelp" required />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2" >
                    <div className="mb-3">
                      <label for="purchaseOrderValue" className="form-label label_text">     Purchase Order Value (Rs) <RequiredStar /> [Without GST]
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        className="form-control rounded-0"
                        id="purchaseOrderValue"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value)) {
                            setPurchaseOrderValue(value);
                          }
                        }}
                        value={purchaseOrderValue}
                        aria-describedby="mobileNoHelp"
                        required
                      />
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
                        <option value="CRM">CRM</option>
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
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2" >
                    <div className="mb-3">
                      <label htmlFor="ProjectEndDate" className="form-label label_text">Project End Date <RequiredStar /> [Expected]
                      </label>
                      <input
                        onChange={(e) => setEndDate(e.target.value)}
                        value={endDate}
                        type="date"
                        className="form-control rounded-0"
                        id="ProjectEndDate"
                        aria-describedby="dateHelp"
                        required
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
                          <label for="AdvancePayment" className="form-label label_text">     Advance Payment (%) <RequiredStar />
                          </label>
                          <input
                            type="text"
                            className="form-control rounded-0"
                            id="AdvancePayment"
                            maxLength="3"
                            pattern="[0-9]*"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*\.?\d*$/.test(value)) {
                                setAdvancePayment(value);
                              }
                            }}
                            value={advancePay}
                            aria-describedby="mobileNoHelp"
                            required
                          />
                        </div>
                      </div>


                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <label htmlFor="PayAgainstDelivery" className="form-label label_text">
                            Pay Against Delivery (%) <RequiredStar />
                          </label>
                          <input
                            type="text"
                            className="form-control rounded-0"
                            id="PayAgainstDelivery"
                            inputMode="decimal"
                            maxLength="3"
                            pattern="[0-9]*"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*\.?\d{0,2}$/.test(value)) {
                                setPayAgainstDelivery(value);
                              }
                            }}
                            value={payAgainstDelivery}
                            aria-describedby="mobileNoHelp"
                            required
                          />
                        </div>
                      </div>


                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <label htmlFor="PayAfterCompletion" className="form-label label_text">
                            Pay After Completion (%) <RequiredStar />
                          </label>
                          <input
                            type="text"

                            className="form-control rounded-0"
                            id="PayAfterCompletion"
                            inputMode="decimal"
                            maxLength="3"
                            pattern="[0-9]*"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*\.?\d{0,2}$/.test(value)) {
                                setPayAfterCompletion(value);
                              }
                            }}
                            value={payAfterCompletion}
                            aria-describedby="secemailHelp"
                            required
                          />
                        </div>
                      </div>


                      <div className="col-12 col-lg-6 mt-2">
                        <div className="mb-3">
                          <label htmlFor="retention" className="form-label label_text">
                            Retention (%) <RequiredStar />
                          </label>
                          <input
                            type="text"

                            className="form-control rounded-0"
                            id="retention"
                            inputMode="decimal"
                            maxLength="3"
                            pattern="[0-9]*"
                            value={retention}
                            aria-describedby="secemailHelp"
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
                            id="pincode"
                            name="pincode"
                            maxLength="6"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,6}$/.test(value)) {
                                setAddress({ ...Address, pincode: value });
                              }
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
                            id="exampleInputEmail1"
                            name="state"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^[A-Za-z\s]*$/.test(value)) {
                                setAddress({ ...Address, state: value });
                              }
                            }}
                            value={Address.state}
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
                            id="exampleInputEmail1"
                            name="city"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^[A-Za-z\s]*$/.test(value)) {
                                setAddress({ ...Address, city: value });
                              }
                            }}
                            value={Address.city}
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
                            id="exampleInputEmail1"
                            name="country"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^[A-Za-z\s]*$/.test(value)) {
                                setAddress({ ...Address, country: value });
                              }
                            }}
                            value={Address.country}
                            aria-describedby="emailHelp"
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-lg-12 mt-2">
                        <div className="mb-3">
                          <textarea
                            className="textarea_edit col-12"
                            id=""
                            maxLength={500}
                            name="add"
                            placeholder="House NO., Building Name, Road Name, Area, Colony"
                            onChange={(e) => setAddress({ ...Address, add: e.target.value })}
                            value={Address.add}
                            rows="2"
                            required
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mt-2" >

                    <div className="mb-3">
                      <label for="PurchaseOrderCopy" className="form-label label_text">Purchase Order Copy <RequiredStar />[PDF only, max 2MB]

                      </label>
                      <input type="file" className="form-control rounded-0" id="PurchaseOrderCopy" aria-describedby="secemailHelp"
                        accept=".pdf"
                        onChange={handleFileChange} files={POCopy}
                        required
                      />
                    </div>



                  </div>

                   <div className="col-12 col-lg-12 mt-2">
                        <div className="mb-3">
                          <textarea
                            className="textarea_edit col-12"
                            id="remark"
                            maxLength={1000}
                            name="remark"
                            placeholder="Enter a Remark..."
                            onChange={(e) => setRemark(e.target.value)} value={remark}
                            rows="2"
                          ></textarea>
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