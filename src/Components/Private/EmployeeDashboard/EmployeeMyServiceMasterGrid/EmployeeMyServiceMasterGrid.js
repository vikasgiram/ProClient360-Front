import { useState, useEffect } from "react";
import { Header } from "../../MainDashboard/Header/Header";
import { Sidebar } from "../../MainDashboard/Sidebar/Sidebar";
import toast from 'react-hot-toast';
import DeletePopUP from "../../CommonPopUp/DeletePopUp";
import EmployeeEditMyservicePopUp from "./PopUp/EmployeeEditMyservicePopUp";
import ViewServicePopUp from "../../CommonPopUp/ViewServicePopUp";
// Assuming getMyService is updated for pagination/filtering
import { deleteService, getMyService } from "../../../../hooks/useService";
import { formatDate } from "../../../../utils/formatDate";

export const EmployeeMyServiceMasterGrid = () => {
    const [isopen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isopen);
    };

    // PopUp States
    const [deletePopUpShow, setdeletePopUpShow] = useState(false);
    const [UpdatePopUpShow, setUpdatePopUpShow] = useState(false);
    const [detailsServicePopUp, setDetailsServicePopUp] = useState(false);
    const [AddPopUpShow, setAddPopUpShow] = useState(false); // Keep if Add might be used


    const [selectedId, setSelecteId] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [selectedPriority, setSelectedPriority] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    // Pagination & Data State
    const [services, setServices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalServices: 0,
        limit: itemsPerPage,
        hasNextPage: false,
        hasPrevPage: false
    });

    // fetchData Function (Handles API call with pagination/filters)
    const fetchData = async (pageToFetch) => {
        try {
            setLoading(true);
            const data = await getMyService(
                pageToFetch,
                itemsPerPage,
                selectedStatus,
                selectedPriority
            );

            if (data && data.services) {
                setServices(data.services);

                if (data.pagination) {
                    const apiCurrentPage = typeof data.pagination.currentPage === 'number' ? data.pagination.currentPage : pageToFetch;
                    setPagination({
                        ...data.pagination,
                        currentPage: apiCurrentPage,
                        totalServices: data.pagination.totalServices || data.pagination.totalDocs || 0
                    });
                    if (currentPage !== apiCurrentPage) {
                        setCurrentPage(apiCurrentPage);
                    }
                } else {
                    const totalServices = data.totalServices || data.totalDocs || data.services.length;
                    const totalPages = Math.ceil(totalServices / itemsPerPage);
                    setPagination({
                        currentPage: pageToFetch,
                        totalPages: totalPages,
                        totalServices: totalServices,
                        limit: itemsPerPage,
                        hasNextPage: pageToFetch < totalPages,
                        hasPrevPage: pageToFetch > 1
                    });
                }
            } else {
                setServices([]);
                setPagination({ currentPage: pageToFetch, totalPages: 0, totalServices: 0, limit: itemsPerPage, hasNextPage: false, hasPrevPage: false });
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            toast.error("Failed to fetch services.");
            setServices([]);
            setPagination({ currentPage: pageToFetch, totalPages: 0, totalServices: 0, limit: itemsPerPage, hasNextPage: false, hasPrevPage: false });
        } finally {
            setLoading(false);
        }
    };

    // useEffect to Fetch Data on Changes
    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, AddPopUpShow, UpdatePopUpShow, deletePopUpShow, selectedStatus, selectedPriority]);

    // --- Event Handlers ---
    const handleAdd = () => setAddPopUpShow(!AddPopUpShow);
    const handleUpdate = (service = null) => {
        setSelectedService(service);
        setUpdatePopUpShow(!UpdatePopUpShow);
    };
    const handelDetailsPopUpClick = (service) => {
        setSelectedService(service);
        setDetailsServicePopUp(!detailsServicePopUp);
    };
    const handelDeleteClosePopUpClick = (id = null) => {
        setSelecteId(id);
        setdeletePopUpShow(!deletePopUpShow);
    };
    const handelDeleteClick = async () => {
        if (selectedId) {
            try {
                setLoading(true);
                await deleteService(selectedId);
                toast.success("Service deleted successfully.");
                setdeletePopUpShow(false);
                if (services.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                } else {
                    fetchData(currentPage);
                }
            } catch (error) {
                console.error("Error deleting service:", error);
                toast.error(error.message || "Failed to delete service.");
                setLoading(false);
            } finally {
                setSelecteId(null);
            }
        }
    };
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
            setCurrentPage(pageNumber);
        } else if (pageNumber < 1) {
            setCurrentPage(1);
        } else if (pageNumber > pagination.totalPages) {
            setCurrentPage(pagination.totalPages);
        }
    };
    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
        setCurrentPage(1);
    };
    const handlePriorityChange = (e) => {
        setSelectedPriority(e.target.value);
        setCurrentPage(1);
    };

    // --- Pagination Button Logic ---
    const maxPageButtons = 5;
    const halfMaxButtons = Math.floor(maxPageButtons / 2);
    let startPage = Math.max(1, pagination.currentPage - halfMaxButtons);
    let endPage = Math.min(pagination.totalPages, startPage + maxPageButtons - 1);
    if (pagination.totalPages > maxPageButtons && endPage - startPage + 1 < maxPageButtons) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    if (pagination.totalPages <= maxPageButtons){
        startPage = 1;
        endPage = pagination.totalPages;
    } else if (startPage === 1 && endPage - startPage + 1 < maxPageButtons) {
         endPage = Math.min(pagination.totalPages, startPage + maxPageButtons - 1);
    }
    const pageButtons = [];
    for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(i);
    }

    return (
        <>
            {loading && ( <div className="overlay"> <span className="loader"></span> </div> )}

            <div className="container-scroller">
                <div className="row background_main_all">
                    <Header toggle={toggle} isopen={isopen} />
                    <div className="container-fluid page-body-wrapper">
                        <Sidebar isopen={isopen} active="EmployeeMyServiceMasterGrid" />
                        <div className="main-panel" style={{ width: isopen ? "" : "calc(100%  - 120px )", marginLeft: isopen ? "" : "125px" }}>
                            <div className="content-wrapper ps-3 ps-md-0 pt-3">
                                {/* Header & Filters */}
                                <div className="row px-2 py-1 align-items-center">
                                     <div className="col-12 col-lg-4">
                                        <h5 className="text-white py-2 mb-0">My Service Master</h5>
                                    </div>
                                    <div className="col-12 col-lg-8">
                                        <div className="row g-2 justify-content-end align-items-center">
                                            {/* Status Filter */}
                                            <div className="col-md-4 col-lg-3">
                                                <select className="form-select bg_edit" aria-label="Select Status" value={selectedStatus} onChange={handleStatusChange}>
                                                    <option value="">All Status</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="InProgress">In Progress</option>
                                                    <option value="Stuck">Stuck</option>
                                                </select>
                                            </div>
                                            {/* Priority Filter */}
                                            <div className="col-md-4 col-lg-3">
                                                <select className="form-select bg_edit" aria-label="Select Priority" value={selectedPriority} onChange={handlePriorityChange}>
                                                    <option value="">All Priority</option>
                                                    <option value="High">High</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Low">Low</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Table Section */}
                                <div className="row bg-white p-2 m-1 border rounded">
                                    <div className="col-12 py-2">
                                        <div className="table-responsive">
                                            <table className="table table-striped table-class" id="table-id" style={{ width: "100%" }}>
                                                <thead>
                                                    <tr className="th_border">
                                                        <th>Sr. No</th>
                                                        <th className="align_left_td td_width">Complaint</th>
                                                        <th className="align_left_td">Client</th>
                                                        <th>Product</th>
                                                        <th>Priority</th>
                                                        <th>Allotment Date</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="broder my-4">
                                                    {services && services.length > 0 ? (
                                                        services.map((service, index) => (
                                                            <tr className="border my-4" key={service._id}>
                                                                <td>{index + 1 + (pagination.currentPage - 1) * itemsPerPage}</td>
                                                                <td className="align_left_td width_tdd" style={{ width: "20%" }}>{service.ticket?.details || 'N/A'}</td>
                                                                <td className="align_left_td">{service.ticket?.client?.custName || 'N/A'}</td>
                                                                <td>{service.ticket?.product || 'N/A'}</td>
                                                                <td>{service.priority || 'N/A'}</td>
                                                                <td>{formatDate(service.allotmentDate)}</td>
                                                                <td className={ service.status === 'Completed' ? 'text-success' : service.status === 'InProgress' ? 'text-primary' : service.status === 'Stuck' ? 'text-danger' : service.status === 'Pending' ? 'text-warning' : '' }>{service.status || 'N/A'}</td>
                                                                <td>
                                                                    <span onClick={() => handleUpdate(service)} className="update me-2" style={{cursor: 'pointer'}} title="Edit Service"><i className="fa-solid fa-pen text-success"></i></span>
                                                                    <span onClick={() => handelDetailsPopUpClick(service)} className="view" style={{cursor: 'pointer'}} title="View Details"><i className="fa-solid fa-eye text-primary"></i></span>
                                                                    {/* Delete action is removed as per previous context, uncomment if needed */}
                                                                    {/* <span onClick={() => handelDeleteClosePopUpClick(service._id)} className="delete ms-2" style={{ cursor: 'pointer' }} title="Delete Service"><i className="fa-solid fa-trash text-danger"></i></span> */}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="8" className="text-center">{loading ? 'Loading...' : 'No services found matching your criteria.'}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* --- CORRECTED Pagination UI --- */}
                                {pagination.totalPages > 1 && (
                                    <div className="pagination-container text-center my-3">
                                        {/* First Button */}
                                        <button disabled={!pagination.hasPrevPage} onClick={() => handlePageChange(1)} className="btn btn-dark btn-sm me-2" aria-label="First Page" title="First Page">First</button>
                                        {/* Previous Button */}
                                        <button disabled={!pagination.hasPrevPage} onClick={() => handlePageChange(pagination.currentPage - 1)} className="btn btn-dark btn-sm me-2" aria-label="Previous Page" title="Previous Page">Previous</button>
                                        {/* Ellipsis at the start */}
                                        {startPage > 1 && <span className="mx-2">...</span>}
                                        {/* Page Number Buttons */}
                                        {pageButtons.map((page) => (
                                            <button key={page} onClick={() => handlePageChange(page)} className={`btn btn-sm me-1 ${ pagination.currentPage === page ? "btn-primary" : "btn-dark" }`} aria-label={`Go to page ${page}`} aria-current={pagination.currentPage === page ? "page" : undefined}>{page}</button>
                                        ))}
                                        {/* Ellipsis at the end */}
                                        {endPage < pagination.totalPages && <span className="mx-2">...</span>}
                                        {/* Next Button */}
                                        <button disabled={!pagination.hasNextPage} onClick={() => handlePageChange(pagination.currentPage + 1)} className="btn btn-dark btn-sm ms-1 me-2" aria-label="Next Page" title="Next Page">Next</button>
                                        {/* Last Button */}
                                        <button disabled={!pagination.hasNextPage} onClick={() => handlePageChange(pagination.totalPages)} className="btn btn-dark btn-sm" aria-label="Last Page" title="Last Page">Last</button>
                                    </div>
                                )}
                                {/* --- End Pagination UI --- */}

                            </div> {/* End content-wrapper */}
                        </div> {/* End main-panel */}
                    </div> {/* End page-body-wrapper */}
                </div> {/* End row background_main_all */}
            </div> {/* End container-scroller */}

            {/* Popups */}
            {deletePopUpShow && (<DeletePopUP message={"Are you sure! Do you want to Delete this Service?"} cancelBtnCallBack={() => handelDeleteClosePopUpClick()} confirmBtnCallBack={handelDeleteClick} heading="Delete Service"/>)}
            {/* Add Popup - Uncomment if needed */}
            {/* {AddPopUpShow && (<AddServicePopup handleAdd={handleAdd} onSuccess={() => fetchData(1)} />)} */}
            {UpdatePopUpShow && selectedService && (<EmployeeEditMyservicePopUp selectedService={selectedService} handleUpdate={handleUpdate} onSuccess={() => fetchData(currentPage)} />)}
            {detailsServicePopUp && selectedService && (<ViewServicePopUp selectedService={selectedService} closePopUp={handelDetailsPopUpClick} />)}
        </>
    );
};