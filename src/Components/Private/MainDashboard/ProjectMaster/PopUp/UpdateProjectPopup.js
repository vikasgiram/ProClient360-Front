import { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { getCustomers } from "../../../../../hooks/useCustomer";
import { updateProject } from "../../../../../hooks/useProjects";
import { formatDateforupdate } from "../../../../../utils/formatDate";
import toast from "react-hot-toast";
import { RequiredStar } from "../../../RequiredStar/RequiredStar";
import { getAddress } from "../../../../../hooks/usePincode";

const PAGE_SIZE = 15;

const UpdateProjectPopup = ({ handleUpdate, selectedProject }) => {
    const [loading, setLoading] = useState(false);
    const [retention, setRetention] = useState(0);

    // Customer dropdown state
    const [custOptions, setCustOptions] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(
        selectedProject?.custId ? { 
            value: selectedProject.custId._id, 
            label: selectedProject.custId.custName 
        } : null
    );
    const [custPage, setCustPage] = useState(1);
    const [custHasMore, setCustHasMore] = useState(true);
    const [custLoading, setCustLoading] = useState(false);
    const [custSearch, setCustSearch] = useState("");

    const [projects, setProjects] = useState({
        ...selectedProject,
        purchaseOrderDate: selectedProject?.purchaseOrderDate,
        startDate: selectedProject?.startDate,
        endDate: selectedProject?.endDate,
        completionCertificate: selectedProject?.completionCertificate || "",
        warrantyCertificate: selectedProject?.warrantyCertificate || "",
        warrantyStartDate: selectedProject?.warrantyStartDate || "",
        warrantyMonths: selectedProject?.warrantyMonths || "",
    });

    const [address, setAddress] = useState({
        add: selectedProject?.Address?.add || "",
        city: selectedProject?.Address?.city || "",
        state: selectedProject?.Address?.state || "",
        country: selectedProject?.Address?.country || "",
        pincode: selectedProject?.Address?.pincode || "",
    });

    // Handle pincode address fetch
    useEffect(() => {
        const fetchData = async () => {
            const data = await getAddress(address.pincode);
            if (data !== "Error") {
                setAddress(data);
            }
        };
        if (address.pincode > 0)
            fetchData();
    }, [address.pincode]);

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

    // Calculate retention
    useEffect(() => {
        const retentionValue = 100 - (Number(projects.advancePay || 0) + Number(projects.payAgainstDelivery || 0) + Number(projects.payAfterCompletion || 0));
        if (retentionValue >= 0) {
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

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Handle numeric fields - removed payment terms from this handler
        if (["purchaseOrderValue", "completeLevel", "purchaseOrderNo"].includes(name)) {
            const numericValue = value.replace(/\D/g, "");
            const maxLength = {
                purchaseOrderValue: 12,
                completeLevel: 10,
                purchaseOrderNo: 10
            }[name];
            
            if (numericValue.length > maxLength) return;
            setProjects((prev) => ({ ...prev, [name]: numericValue }));
            return;
        }

        // Handle customer selection
        if (name === "custId") {
            setSelectedCustomer({ value: value, label: event.target.options[event.target.selectedIndex].text });
            setProjects((prev) => ({
                ...prev,
                custId: { _id: value },
            }));
            return;
        }

        // Handle project status change
        if (name === "projectStatus") {
            setProjects((prev) => ({
                ...prev,
                projectStatus: value,
                completeLevel: value === "Completed" ? "100" : prev.completeLevel
            }));
            return;
        }

        // Handle warranty months
        if (name === "warrantyMonths") {
            setProjects((prev) => ({ ...prev, [name]: value }));
            return;
        }

        // Handle file inputs
        if (name === "completionCertificate" || name === "warrantyCertificate") {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setProjects((prev) => ({ ...prev, [name]: reader.result }));
                };
                reader.readAsDataURL(file);
            }
            return;
        }

        // Handle all other fields
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
        setLoading(true);

        const updatedProject = {
            ...projects,
            custId: selectedCustomer?.value,
            retention: retention,
            Address: {
                ...address
            },
            // Convert warrantyMonths to number if it exists
            warrantyMonths: projects.warrantyMonths ? parseInt(projects.warrantyMonths) : 0
        }
        
        // Required field validation
        if (
            !updatedProject.name ||
            !selectedCustomer ||
            !updatedProject.purchaseOrderDate ||
            !updatedProject.purchaseOrderNo ||
            !updatedProject.purchaseOrderValue ||
            !updatedProject.category ||
            !updatedProject.startDate ||
            !updatedProject.endDate ||
            updatedProject.advancePay === "" || updatedProject.advancePay === null || updatedProject.advancePay === undefined ||
            updatedProject.payAgainstDelivery === "" || updatedProject.payAgainstDelivery === null || updatedProject.payAgainstDelivery === undefined ||
            updatedProject.payAfterCompletion === "" || updatedProject.payAfterCompletion === null || updatedProject.payAfterCompletion === undefined
        ) {
            setLoading(false);
            return toast.error("Please fill all required fields");
        }

        // Additional validation for completed projects
        if (updatedProject.projectStatus === "Completed") {
            if (!updatedProject.completionCertificate) {
                setLoading(false);
                return toast.error("Completion Certificate is required for completed projects");
            }
            // Removed warrantyCertificate validation as it's no longer required
            if (!updatedProject.warrantyStartDate) {
                setLoading(false);
                return toast.error("Warranty Start Date is required for completed projects");
            }
            if (!updatedProject.warrantyMonths) {
                setLoading(false);
                return toast.error("Warranty Duration is required for completed projects");
            }
            if (updatedProject.warrantyMonths == 0) {
                setLoading(false);
                return toast.error("Warranty Duration must be greater than 0");
            }
        }

        if (Number(updatedProject.advancePay) + Number(updatedProject.payAgainstDelivery) + Number(updatedProject.payAfterCompletion) > 100) {
            setLoading(false);
            return toast.error("Sum of Advance Payment, Pay Against Delivery, and Pay After Completion cannot exceed 100%");
        }
        if (updatedProject.startDate > updatedProject.endDate) {
            setLoading(false);
            return toast.error("Start Date cannot be greater than End Date");
        }

        try {
            toast.loading("Updating Project...");
            const data = await updateProject(updatedProject);
            toast.dismiss();
            if (data.success) {
                toast.success(data.message);
                handleUpdate();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    const viewFile = (fileType) => {
        const fileUrl = projects[fileType];
        if (!fileUrl) {
            toast.error("No file available");
            return;
        }

        if (fileUrl.startsWith('data:')) {
            // Handle base64 data
            const newWindow = window.open();
            newWindow.document.write(`
                <html>
                    <head><title>File Preview</title></head>
                    <body style="margin:0; overflow:hidden">
                        <iframe src="${fileUrl}" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>
                    </body>
                </html>
            `);
        } else {
            // Handle URL
            window.open(fileUrl, '_blank');
        }
    };

    const formattedPurchaseOrderDate = formatDateforupdate(projects?.purchaseOrderDate);
    const formattedStartDate = formatDateforupdate(projects?.startDate);
    const formattedEndDate = formatDateforupdate(projects?.endDate);
    const formattedWarrantyStartDate = formatDateforupdate(projects?.warrantyStartDate);

    return (
        <>
            <form onSubmit={handleProjectUpdate}>
                <div className="modal fade show" style={{ display: "flex", alignItems: 'center', backgroundColor: "#00000090" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content p-3">
                            <div className="modal-header pt-0">
                                <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                                    Update Project
                                </h5>
                                <button onClick={() => handleUpdate()} type="button" className="close px-3" style={{ marginLeft: "auto" }}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row modal_body_height">
                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label htmlFor="customerSearch" className="form-label label_text">
                                                Customer Name <RequiredStar />
                                            </label>
                                            <Select
                                                options={custOptions}
                                                value={selectedCustomer}
                                                onChange={opt => {
                                                    setSelectedCustomer(opt);
                                                    setProjects(prev => ({
                                                        ...prev,
                                                        custId: { _id: opt?.value, custName: opt?.label }
                                                    }));
                                                }}
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
                                        <label htmlFor="ProjectName" className="form-label label_text">Project Name <RequiredStar /></label>
                                        <textarea 
                                            type="text" 
                                            className="form-control rounded-0" 
                                            id="ProjectName" 
                                            name="name" 
                                            onChange={handleChange} 
                                            maxLength={1000} 
                                            placeholder="Update Project Name...." 
                                            value={projects.name} 
                                            aria-describedby="emailHelp"
                                        ></textarea>
                                    </div>

                                    <div className="col-12 col-lg-6 mt-2">
                                        <label htmlFor="projectStatus" className="form-label label_text">Project Status <RequiredStar /></label>
                                        <select 
                                            className="form-select rounded-0" 
                                            aria-label="Project status"
                                            name="projectStatus"
                                            onChange={handleChange}
                                            value={projects?.projectStatus}
                                        >
                                            <option value="Upcoming">Upcoming</option>
                                            <option value="Inprocess">Inprocess</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>

                                    <div className="col-12 col-lg-6 mt-2">
                                        <div className="mb-3">
                                            <label htmlFor="completeLevel" className="form-label label_text">Completion level <RequiredStar /></label>
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

                                    <div className="col-12 col-lg-6 mt-2">
                                        <div className="mb-3">
                                            <label htmlFor="purchaseOrderDate" className="form-label label_text">Purchase Order Date <RequiredStar /></label>
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

                                    <div className="col-12 col-lg-6 mt-2">
                                        <div className="mb-3">
                                            <label htmlFor="PurchaseOrderNumber" className="form-label label_text">Purchase Order Number <RequiredStar /></label>
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

                                    <div className="col-12 col-lg-6 mt-2">
                                        <div className="mb-3">
                                            <label htmlFor="PurchaseOrderValue" className="form-label label_text">Purchase Order Value (Rs/USD) <RequiredStar /></label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength="12"
                                                pattern="^\d{1,12}$"
                                                className="form-control rounded-0"
                                                name="purchaseOrderValue"
                                                id="PurchaseOrderValue"
                                                placeholder="Update Order Value...."
                                                onChange={handleChange}
                                                value={projects?.purchaseOrderValue}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-lg-6 mt-2">
                                        <div className="mb-3">
                                            <label htmlFor="category" className="form-label label_text">Category of Project <RequiredStar /></label>
                                            <select 
                                                className="form-select rounded-0" 
                                                aria-label="Project category"
                                                name="category"
                                                onChange={handleChange}
                                                value={projects?.category}
                                            >
<<<<<<< HEAD
                                                <option value="CCTV System">CCTV System</option>
                                                <option value="TA System">TA System</option>
                                                <option value="Hajeri">Hajeri</option>
                                                <option value="SmartFace">SmartFace</option>
                                                <option value="ZKBioSecurity">ZKBioSecurity</option>
=======
                                                <option selected>{projects?.category}</option>
                                                <option value="Surveillance System">Surveillance System</option>
>>>>>>> parent of 99ac05a (product field product add)
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
                                                <option value="KMS">KMS</option>
                                                <option value="VMS">VMS</option>
                                                <option value="PMS">PMS</option>
                                                <option value="Boom Barrier System">Boom Barrier System</option>
                                                <option value="Tripod System">Tripod System</option>
                                                <option value="Flap Barrier System">Flap Barrier System</option>
                                                <option value="EPBX System">EPBX System</option>
                                                <option value="CMS">CMS</option>
                                                <option value="Lift Eliviter System">Lift Eliviter System</option>
                                                <option value="AV6">AV6</option>    
                                                <option value="Walky Talky System">Walky Talky System</option>
                                                <option value="Device Management System">Device Management System</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-12 col-lg-6 mt-2">
                                        <div className="mb-3">
                                            <label htmlFor="startDate" className="form-label label_text">Project Start Date <RequiredStar /></label>
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

                                    <div className="col-12 col-lg-6 mt-2">
                                        <div className="mb-3">
                                            <label htmlFor="EndDate" className="form-label label_text">Project End Date <RequiredStar /></label>
                                            <input
                                                onChange={handleChange}
                                                value={formattedEndDate}
                                                type="date"
                                                name="endDate"
                                                className="form-control rounded-0"
                                                id="EndDate"
                                                aria-describedby="dateHelp"
                                            />
                                        </div>
                                    </div>

                                    {/* Completed Project Fields - Conditionally Rendered */}
                                    {projects?.projectStatus === "Completed" && (
                                        <div className="col-12 mt-4">
                                            <div className="row border bg-light mx-auto p-3">
                                                <div className="col-12 mb-3">
                                                    <span className="SecondaryInfo fw-bold">Project Completion Details</span>
                                                </div>

                                                <div className="col-12 col-lg-6 mt-2">
                                                    <div className="mb-3">
                                                        <label htmlFor="completionCertificate" className="form-label label_text">
                                                            Completion Come / Warranty Certificate <RequiredStar />
                                                        </label>
                                                        <input
                                                            type="file"
                                                            className="form-control rounded-0"
                                                            id="completionCertificate"
                                                            name="completionCertificate"
                                                            onChange={handleChange}
                                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                        />
                                                        {projects.completionCertificate && (
                                                            <button 
                                                                type="button" 
                                                                className="btn btn-outline-primary btn-sm mt-2"
                                                                onClick={() => viewFile('completionCertificate')}
                                                            >
                                                                View Current File
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-12 col-lg-6 mt-2">
                                                    <div className="mb-3">
                                                        <label htmlFor="warrantyCertificate" className="form-label label_text">
                                                            HandOver Document {/* Removed RequiredStar */}
                                                        </label>
                                                        <input
                                                            type="file"
                                                            className="form-control rounded-0"
                                                            id="warrantyCertificate"
                                                            name="warrantyCertificate"
                                                            onChange={handleChange}
                                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                            // Removed required attribute
                                                        />
                                                        {projects.warrantyCertificate && (
                                                            <button 
                                                                type="button" 
                                                                className="btn btn-outline-primary btn-sm mt-2"
                                                                onClick={() => viewFile('warrantyCertificate')}
                                                            >
                                                                View Current File
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-12 col-lg-6 mt-2">
                                                    <div className="mb-3">
                                                        <label htmlFor="warrantyStartDate" className="form-label label_text">
                                                            Warranty Start Date <RequiredStar />
                                                        </label>
                                                        <input
                                                            onChange={handleChange}
                                                            value={formattedWarrantyStartDate}
                                                            type="date"
                                                            name="warrantyStartDate"
                                                            className="form-control rounded-0"
                                                            id="warrantyStartDate"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-12 col-lg-6 mt-2">
                                                    <div className="mb-3">
                                                        <label htmlFor="warrantyDuration" className="form-label label_text">
                                                            Warranty Duration <RequiredStar />
                                                        </label>
                                                        <select 
                                                            className="form-select rounded-0"
                                                            name="warrantyMonths"
                                                            onChange={handleChange}
                                                            value={projects?.warrantyMonths || ""}
                                                        >
                                                            <option value="">Select Duration</option>
                                                            {Array.from({ length: 40 }, (_, i) => (i + 1) * 3).map((month) => (
                                                                <option key={month} value={month}>{month} Months</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Payment Terms Section */}
                                    <div className="col-12 mt-2">
                                        <div className="row border bg-gray mx-auto">
                                            <div className="col-10 mb-3">
                                                <span className="SecondaryInfo">Payment terms:</span>
                                            </div>

                                            <div className="col-12 col-lg-6 mt-2">
                                                <div className="mb-3">
                                                    <label htmlFor="advancePay" className="form-label label_text">Advance Payment <RequiredStar /></label>
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
                                                        disabled  // Added disabled attribute
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12 col-lg-6 mt-2">
                                                <div className="mb-3">
                                                    <label htmlFor="payAgainstDelivery" className="form-label label_text">Pay Against Delivery <RequiredStar /></label>
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
                                                        disabled  // Added disabled attribute
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12 col-lg-6 mt-2">
                                                <div className="mb-3">
                                                    <label htmlFor="payAfterCompletion" className="form-label label_text">Pay After Completion <RequiredStar /></label>
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
                                                        disabled  // Added disabled attribute
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12 col-lg-6 mt-2">
                                                <div className="mb-3">
                                                    <label htmlFor="retention" className="form-label label_text">Retention (%) <RequiredStar /></label>
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

                                    {/* Address Section */}
                                    <div className="col-12 mt-2">
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
                                                        maxLength={50}
                                                        pattern="^[a-zA-Z\s]*$"
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

                                    {/* Purchase Order Copy */}
                                    <div className="col-12 col-lg-6 mt-2">
                                        <div className="mb-3">
                                            <label htmlFor="PurchaseOrderCopy" className="form-label label_text">
                                                Purchase Order Copy <RequiredStar />
                                            </label>
                                        </div>
                                        <button type="button" className="btn btn-outline-dark" onClick={() => viewFile('POCopy')}>View</button>
                                    </div>

                                    {/* Remark */}
                                    <div className="col-12 col-lg-12 mt-2">
                                        <div className="mb-3">
                                            <label htmlFor="remark" className="form-label label_text">Remark</label>
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
                                                rows='2'
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="row">
                                        <div className="col-12 pt-3 mt-2">
                                            <button
                                                type='submit'
                                                onClick={handleProjectUpdate}
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
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default UpdateProjectPopup;