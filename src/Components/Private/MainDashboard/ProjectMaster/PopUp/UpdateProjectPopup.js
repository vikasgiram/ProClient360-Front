import { useState, useEffect } from "react";
import { getCustomers } from "../../../../../hooks/useCustomer";
import { updateProject } from "../../../../../hooks/useProjects";
import { formatDateforupdate } from "../../../../../utils/formatDate";
import toast from "react-hot-toast";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { getAddress } from "../../../../../hooks/usePincode";

const UpdateProjectPopup = ({ handleUpdate, selectedProject }) => {

    // console.log(selectedProject,"selectedProject");


    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");

    const [retention, setRetention] =  useState(0);

    const [projects, setProjects] = useState({
        ...selectedProject,
        purchaseOrderDate: selectedProject?.purchaseOrderDate,
        startDate: selectedProject?.startDate,
        endDate: selectedProject?.endDate

    });


    const [address, setAddress] = useState({
        add: selectedProject?.Address?.add || "",
        city: selectedProject?.Address?.city || "",
        state: selectedProject?.Address?.state || "",
        country: selectedProject?.Address?.country || "",
        pincode: selectedProject?.Address?.pincode || "",
    });

    console.log(selectedProject?.Address);

    //   console.log(selectedProject?.Address?.city,"address");
    useEffect(() => {
        const fetchData = async () => {
            const data = await getAddress(address.pincode);

            if (data !== "Error") {
                // console.log(data);
                setAddress(data);
            }
        };
        if (address.pincode > 0)
            fetchData();
    }, [address.pincode]);


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

    

useEffect(() => {
    const retentionValue = 100 - (Number(projects.advancePay || 0) + Number(projects.payAgainstDelivery || 0) + Number(projects.payAfterCompletion || 0));
    if( retentionValue >= 0) {
        setRetention(retentionValue);
        setProjects(prev => ({
            ...prev,
            retention: retentionValue
        }));
    } else {
        toast.error("The total percentage cannot exceed 100%.");
        setRetention(0);
        setProjects(prev => ({
            ...prev,
            retention: 0
        }));
    }
}, [projects.advancePay, projects.payAgainstDelivery, projects.payAfterCompletion]);


    const fetchCustomers = async () => {
        const data = await getCustomers(1, 15, searchText);
        if (data) {
            setCustomers(data.customers || []);
        }
    };



    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "purchaseOrderValue") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length > 12) return;
            setProjects((prev) => ({ ...prev, [name]: numericValue }));
            return;
        }

        if (name === "completeLevel") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length > 10) return;
            setProjects((prev) => ({ ...prev, [name]: numericValue }));
            return;
        }

        if (name === "purchaseOrderNo") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length > 10) return;
            setProjects((prev) => ({ ...prev, [name]: numericValue }));
            return;
        }

        if (name === "advancePay") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length > 3) return;
            setProjects((prev) => ({ ...prev, [name]: numericValue }));
            return;
        }

        if (name === "payAgainstDelivery") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length > 3) return;
            setProjects((prev) => ({ ...prev, [name]: numericValue }));
            return;
        }

        if (name === "payAfterCompletion") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length > 3) return;
            setProjects((prev) => ({ ...prev, [name]: numericValue }));
            return;
        }

        if (name === "custId") {
            setProjects((prev) => ({
                ...prev,
                custId: { _id: value },
            }));
            return;
        }

       if (name === "projectStatus") {
  setProjects((prev) => ({
    ...prev,
    projectStatus: value,
    completeLevel:
      value === "Completed"
        ? "100"
        : prev.completeLevel < 100
          ? prev.completeLevel
          : "",
  }));
  return;
}

        setProjects((prev) => ({ ...prev, [name]: value }));
    };




    const handleAddressChange = (e) => {
        const { name, value } = e.target;

        if (name === "city") {
            const cleanValue = value.replace(/[^a-zA-Z\s]/g, "");
            setAddress({ ...address, [name]: cleanValue });
        }
        else if (name === "state" || name === "country") {
            const cleanValue = value.replace(/[^a-zA-Z\s]/g, "");
            setAddress({ ...address, [name]: cleanValue });
        }
        else if (name === "pincode") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length > 6) return;
            setAddress({ ...address, [name]: numericValue });
        }
        else {
            setAddress({ ...address, [name]: value });
        }
    };





    const handleProjectUpdate = async (event) => {
    event.preventDefault();
    setLoading(!loading);

    const updatedProject = {
        ...projects,
        retention: retention,
        Address: {
            ...address
        },
    }
    
    if (!updatedProject.name || !updatedProject.custId || !updatedProject.purchaseOrderDate || !updatedProject.purchaseOrderNo || !updatedProject.purchaseOrderValue || !updatedProject.category || !updatedProject.startDate || !updatedProject.endDate || !updatedProject.advancePay || !updatedProject.payAgainstDelivery || !updatedProject.payAfterCompletion) {
        setLoading(false);
        console.log(updatedProject, "updateProject");
    }
    if (Number(updatedProject.advancePay) + Number(updatedProject.payAgainstDelivery) + Number(updatedProject.payAfterCompletion) > 100) {
        setLoading(false);
        return toast.error("Sum of  Advance Payment,Pay Against Delivery,and Pay After Completion cannot exceed 100%");
    }
    if (updatedProject.startDate > updatedProject.endDate) {
        setLoading(false);
        return toast.error("Start Date cannot be greater than End Date");
    }

    try {
        console.log(updatedProject,"updatedProject"); 
        toast.loading("Updating Project...")
        const data = await updateProject(updatedProject);
        toast.dismiss()
        if(data.success){
            toast.success(data.message);
            handleUpdate();
        }else{
            toast.error(data.error);
        }
    } catch (error) {
        toast.error(error);
    }
};
    const viewFile = () => {
        window.open(projects.POCopy);
    };

    //   const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //       const reader = new FileReader();
    //       reader.onloadend = () => {

    //       };
    //       reader.readAsDataURL(file);
    //     }

    //   };
    //   console.log(POCopy,"POCopy");


    //   const formatDate = (date) => date ? format(new Date(date), 'yyyy-MM-dd') : '';

    const formattedPurchaseOrderDate = formatDateforupdate(projects?.purchaseOrderDate);
    const formattedStartDate = formatDateforupdate(projects?.startDate);
    const formattedEndDate = formatDateforupdate(projects?.endDate);

    return (
        <>
            <form onSubmit={handleProjectUpdate}>
                <div className="modal fade show" style={{ display: "flex", alignItems: 'center', backgroundColor: "#00000090" }}>

                    <div className="modal-dialog modal-lg">
                        <div className="modal-content p-3">
                            <div className="modal-header pt-0">

                                <h5 className="card-title fw-bold" id="exampleModalLongTitle">

                                    Update Project
                                    {/* Forward */}
                                </h5>
                                <button onClick={() => handleUpdate()} type="button" className="close px-3" style={{ marginLeft: "auto" }}>
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

                                            {/* Search input */}
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                id="customerSearch"
                                                maxLength={40}
                                                placeholder="Type to search customer..."
                                                value={searchText}
                                                onChange={(e) => setSearchText(e.target.value)}
                                            />

                                            {/* Select dropdown */}
                                            <select
                                                className="form-select rounded-0"
                                                name="custId"
                                                value={projects?.custId?._id || ''}
                                                onChange={handleChange}
                                            >
                                                <option value={projects?.custId?._id || ''}>
                                                    {projects?.custId?.custName || 'Select Customer'}</option>
                                                {customers.map((cust) => (
                                                    <option key={cust._id} value={cust._id}>
                                                        {cust.custName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label for="ProjectName" className="form-label label_text">Project Name <RequiredStar /></label>
                                        <textarea type="text" className="form-control rounded-0" id="ProjectName" name="name" onChange={handleChange} maxLength={1000} placeholder="Update Project Name...." value={projects.name} aria-describedby="emailHelp" ></textarea>
                                    </div>
                                    <div className="col-12 col-lg-6 mt-2">
                                        <label for="ProjectName" className="form-label label_text">Project Status <RequiredStar /></label>
                                        <select className="form-select rounded-0" aria-label="Default select example"
                                            name="projectStatus"
                                            onChange={handleChange}
                                            value={projects?.projectStatus}
                                        >
                                            <option value="Upcoming">Upcoming</option>
                                            <option value="Inprocess">Inprocess</option>
                                            <option value="Completed">Completed</option>

                                        </select>
                                    </div>

                                    <div className="col-12 col-lg-6 mt-2" >
                                        <div className="mb-3">
                                            <label htmlFor="completeLevel"
                                                name="completeLevel" className="form-label label_text">Completion level <RequiredStar /></label>
                                            <input
  onChange={handleChange}
  value={projects?.completeLevel}
  name="completeLevel"
  type="text"
  placeholder="Update Completion level...."
  inputMode="numeric"
  pattern="^\d{1,10}$"
  maxLength="2"
  className="form-control rounded-0"
  id="completeLevel"
  aria-describedby="dateHelp"
  required
  disabled={projects?.projectStatus === "Completed"}
/>
                                                

                                        </div>
                                    </div>

                                    <div className="col-12 col-lg-6 mt-2" >
                                        <div className="mb-3">
                                            <label htmlFor="purchaseOrderDate"
                                                name="purchaseOrderDate" className="form-label label_text">Purchase Order Date <RequiredStar /></label>
                                            <input
                                                onChange={handleChange}
                                                value={formattedPurchaseOrderDate}
                                                name="purchaseOrderDate"
                                                type="date"
                                                className="form-control rounded-0"
                                                id="purchaseOrderDate"
                                                aria-describedby="dateHelp"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-6 mt-2" >
                                        <div className="mb-3">
                                            <label for="PurchaseOrderNumber"
                                                name="purchaseOrderNo"
                                                className="form-label label_text">Purchase Order Number <RequiredStar /></label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="^\d{1,10}$"
                                                className="form-control rounded-0"
                                                id="PurchaseOrderNumber"
                                                name="purchaseOrderNo"
                                                placeholder="Purchase Order Number...."
                                                maxLength={200}
                                                value={projects?.purchaseOrderNo}
                                                onChange={handleChange}
                                                aria-describedby="emailHelp"
                                                required
                                            />


                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-6 mt-2" >
                                        <div className="mb-3">
                                            <label for="PurchaseOrderValu" className="form-label label_text">Purchase Order Value (Rs/USD) <RequiredStar />
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength="12"
                                                pattern="^\d{1,12}$"
                                                className="form-control rounded-0"
                                                name="purchaseOrderValue"
                                                id="PurchaseOrderValu"
                                                placeholder="Update Order Value...."
                                                onChange={handleChange}
                                                value={projects?.purchaseOrderValue}
                                                required
                                            />

                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-6 mt-2" >
                                        <div className="mb-3">
                                            <label for="exampleInputEmail1" className="form-label label_text">Category of Project <RequiredStar />
                                            </label>
                                            <select className="form-select rounded-0" aria-label="Default select example"
                                                name="category"
                                                onChange={handleChange}
                                                value={projects?.category}
                                            >
                                                <option selected>{projects?.category}</option>
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
                                                <option value="CRMS">CRMS</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-6 mt-2" >
                                        <div className="mb-3">
                                            <label htmlFor="startDate" className="form-label label_text">Project Start Date <RequiredStar />
                                            </label>
                                            <input
                                                onChange={handleChange}
                                                name="startDate"
                                                value={formattedStartDate}
                                                type="date"
                                                className="form-control rounded-0"
                                                id="startDate"
                                                aria-describedby="dateHelp"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-6 mt-2" >
                                        <div className="mb-3">
                                            <label htmlFor="EndDate" className="form-label label_text">Project End Date <RequiredStar /></label>
                                            <input
                                                onChange={handleChange}
                                                value={formattedEndDate} // Make sure to handle the case where it might be undefined
                                                type="date"
                                                name="endDate"  // Add the name attribute
                                                className="form-control rounded-0"
                                                id="EndDate"  // Change the id to match the name for clarity
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

                                            <div className="col-12 col-lg-6 mt-2">
  <div className="mb-3">
    <label htmlFor="advancePay" className="form-label label_text">
      Advance Payment <RequiredStar />
    </label>
    <input
      type="text"
      inputMode="numeric"
      pattern="^\d{1,3}$"
      maxLength={3}
      className="form-control rounded-0"
      id="advancePay"
      name="advancePay"
      onChange={handleChange}
      value={projects?.advancePay}
      required
    />
  </div>
</div>

<div className="col-12 col-lg-6 mt-2">
  <div className="mb-3">
    <label htmlFor="payAgainstDelivery" className="form-label label_text">
      Pay Against Delivery <RequiredStar />
    </label>
    <input
      type="text"
      inputMode="numeric"
      pattern="^\d{1,3}$"
      maxLength={3}
      className="form-control rounded-0"
      id="payAgainstDelivery"
      name="payAgainstDelivery"
      onChange={handleChange}
      value={projects?.payAgainstDelivery}
      required
    />
  </div>
</div>

<div className="col-12 col-lg-6 mt-2">
  <div className="mb-3">
    <label htmlFor="payAfterCompletion" className="form-label label_text">
      Pay After Completion <RequiredStar />
    </label>
    <input
      type="text"
      inputMode="numeric"
      pattern="^\d{1,3}$"
      maxLength={3}
      className="form-control rounded-0"
      id="payAfterCompletion"
      name="payAfterCompletion"
      onChange={handleChange}
      value={projects?.payAfterCompletion}
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
      inputMode="numeric"
      pattern="^\d{1,3}$"
      maxLength={3}
      className="form-control rounded-0"
      id="retention"
      name="retention"
      value={retention}
      readOnly
      style={{ backgroundColor: '#f8f9fa' }}
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
                                                        inputMode="numeric"
                                                        pattern="^[1-9][0-9]{5}$"
                                                        maxLength="6"
                                                        className="form-control rounded-0"
                                                        placeholder="Pincode"
                                                        id="Pincode"
                                                        name="pincode"
                                                        onChange={handleAddressChange}
                                                        value={address.pincode}
                                                        required
                                                    />

                                                </div>
                                            </div>

                                            <div className="col-12 col-lg-6 mt-2">
                                                <div className="mb-3">
                                                    <input
                                                        type="text"
                                                        className="form-control rounded-0"
                                                        placeholder="State"
                                                        id="State"
                                                        name="state"
                                                        onChange={handleAddressChange}
                                                        value={address.state}
                                                        maxLength={50}                                                        pattern="^[a-zA-Z\s]*$"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12 col-lg-6 mt-2">
                                                <div className="mb-3">
                                                    <input
                                                        type="text"
                                                        className="form-control rounded-0"
                                                        placeholder="City"
                                                        id="city"
                                                        name="city"
                                                        maxLength={50}
                                                        pattern="^[a-zA-Z\s]{2,40}$"
                                                        onChange={handleAddressChange}
                                                        value={address.city}
                                                        required
                                                    />

                                                </div>
                                            </div>

                                            <div className="col-12 col-lg-6 mt-2">
                                                <div className="mb-3">
                                                    <input
                                                        type="text"
                                                        className="form-control rounded-0"
                                                        placeholder="Country"
                                                        id="country"
                                                        name="country"
                                                        maxLength={50}
                                                        onChange={handleAddressChange}
                                                        value={address.country}
                                                        pattern="^[a-zA-Z\s]{2,40}$"
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
                                                        onChange={handleAddressChange}
                                                        value={address.add}
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

                                        </div>
                                      <button type="button" className="btn btn-outline-dark" onClick={viewFile}>View</button>
                                    </div>
                            <div className="col-12 col-lg-12 mt-2">
  <div className="mb-3">
    <label htmlFor="remark" className="form-label label_text">
      Remark
    </label>
    <textarea
      type="text"
      className="textarea_edit col-12"
      id="remark"
      name="remark"
      onChange={handleChange}
      maxLength={1000}
      placeholder="Enter a Remark..."
      value={projects?.remark || ""}
      aria-describedby="secemailHelp"
      row='2'
    />
  </div>
</div>




                                    <div className="row">
                                        <div className="col-12 pt-3 mt-2">
                                            <button
                                                type='submit'
                                                onClick={handleProjectUpdate}
                                                disabled={loading}
                                                className="w-80 btn addbtn rounded-0 add_button   m-2 px-4" >
                                                {!loading ? "Update" : "Submitting..."}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleUpdate}
                                                className="w-80  btn addbtn rounded-0 Cancel_button m-2 px-4" >
                                                Cancel

                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

        </>);
}

export default UpdateProjectPopup;