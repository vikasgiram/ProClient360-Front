import { useState, useEffect } from "react";
import { Header } from "../../MainDashboard/Header/Header";
import { Sidebar } from "../../MainDashboard/Sidebar/Sidebar";
import toast from 'react-hot-toast';
import EmployeeUpdateFeedbackPopUp from "./PopUp/EmployeeUpdateFeedbackPopUp";
import ViewFeedbackPopUp from "./PopUp/ViewFeedbackPopUp";
import { getRemaningFeedback } from "../../../../hooks/useFeedback";
import { formatDate } from "../../../../utils/formatDate";

export const EmployeeFeedbackMasterGrid = () => {
    const [isopen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isopen);
    };

    const [detailsServicePopUp, setDetailsServicePopUp] = useState(false);
    const [UpdatePopUpShow, setUpdatePopUpShow] = useState(false);

    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [search, setSearch] = useState("");

    const [feedbacks, setFeedbacks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalFeedbacks: 0,
        limit: itemsPerPage,
        hasNextPage: false,
        hasPrevPage: false
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getRemaningFeedback(currentPage, itemsPerPage, search);

            if(data.success){
                setFeedbacks(data.services);
                setPagination({
                    currentPage: data.currentPage,
                    totalPages: data.totalPages,
                    totalFeedbacks: data.totalRecords,
                    limit: data.limit,
                    hasNextPage: data.hasNextPage,
                    hasPrevPage: data.hasPrevPage
                });
            } else {
                toast(data.error || "Failed to fetch feedback.");
                setFeedbacks([]);
                setPagination({ currentPage, totalPages: 0, totalFeedbacks: 0, limit: itemsPerPage, hasNextPage: false, hasPrevPage: false });
            }
            
        } catch (error) {
            console.error("Error fetching feedback:", error);
            toast.error("Failed to fetch feedback.");
            setFeedbacks([]);
            setPagination({ currentPage, totalPages: 0, totalFeedbacks: 0, limit: itemsPerPage, hasNextPage: false, hasPrevPage: false });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, UpdatePopUpShow, search]);

    const handleViewFeedback = (feedback) => {
        setSelectedFeedback(feedback);
        setDetailsServicePopUp(!detailsServicePopUp);
    };

    const handleUpdate = (feedback) => {
        setSelectedFeedback(feedback);
        setUpdatePopUpShow(!UpdatePopUpShow);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleOnSearchSubmit = (event) => {
        event.preventDefault();
        console.log("Search text:", searchText);
        setSearch(searchText);
        setCurrentPage(1);
    };

    // Pagination button rendering logic
    const maxPageButtons = 5; // Maximum number of page buttons to display
    const halfMaxButtons = Math.floor(maxPageButtons / 2);
    let startPage = Math.max(1, currentPage - halfMaxButtons);
    let endPage = Math.min(pagination.totalPages, startPage + maxPageButtons - 1);

    // Adjust startPage if endPage is at the totalPages
    if (endPage - startPage + 1 < maxPageButtons) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    const pageButtons = [];
    for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(i);
    }

    return (
        <>
            {loading && (
                <div className="overlay"> <span className="loader"></span> </div>
            )}

            <div className="container-scroller">
                <div className="row background_main_all">
                    <Header toggle={toggle} isopen={isopen} />
                    <div className="container-fluid page-body-wrapper">
                        <Sidebar isopen={isopen} active="EmployeeFeedbackMasterGrid" />
                        <div className="main-panel" style={{ width: isopen ? "" : "calc(100%  - 120px )", marginLeft: isopen ? "" : "125px" }}>
                            <div className="content-wrapper ps-3 ps-md-0 pt-3">
                                <div className="row px-2 py-1 align-items-center">
                                    <div className="col-12 col-lg-6">
                                        <h5 className="text-white py-2 mb-0">Feedback</h5>
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <div className="row g-2 justify-content-end align-items-center">
                                            <div className="col-sm-8 col-md-7 col-lg-6">
                                                <div className="form">
                                                    <i className="fa fa-search"></i>
                                                    <form onSubmit={handleOnSearchSubmit}>
                                                        <input
                                                            type="text"
                                                            value={searchText}
                                                            onChange={(e) => setSearchText(e.target.value)}
                                                            className="form-control form-input bg-transparant"
                                                            placeholder="Search Client, Person, Product..."
                                                        />
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row bg-white p-2 m-1 border rounded">
                                    <div className="col-12 py-2">
                                        <div className="table-responsive ">
                                            <table className="table table-striped table-class" id="table-id">
                                                <thead>
                                                    <tr className="th_border" >
                                                        <th>Sr. No</th>
                                                        <th className="align_left_td">Client Name</th>
                                                        <th className="align_left_td">Contact Person</th>
                                                        <th className="align_left_td">Contact No</th>
                                                        <th className="align_left_td">Product</th>
                                                        <th>Allotment Date</th>
                                                        <th>Completion Date</th>
                                                        <th>Assigned to</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="broder my-4">
                                                    {feedbacks && feedbacks.length > 0 ? (
                                                        feedbacks.map((feedback, index) => (
                                                            <tr className="border my-4" key={feedback._id}>
                                                                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                                                <td className="align_left_td">{feedback.ticket?.client?.custName || 'N/A'}</td>
                                                                <td className="align_left_td">{feedback.ticket?.contactPerson || 'N/A'}</td>
                                                                <td className="align_left_td">{feedback.ticket?.contactNumber || 'N/A'}</td>
                                                                <td className="align_left_td">{feedback.ticket?.product || 'N/A'}</td>
                                                                <td>{formatDate(feedback.allotmentDate)}</td>
                                                                <td>{formatDate(feedback.completionDate)}</td>
                                                                <td>{feedback.allotTo?.map(person => person.name).join(', ') || 'N/A'}</td>
                                                                <td>
                                                                    <span onClick={() => handleUpdate(feedback)} className="update me-2" style={{cursor: 'pointer'}} title="Update Feedback">
                                                                        <i class="fa-solid fa-star text-warning"></i>
                                                                    </span>
                                                                    <span onClick={() => handleViewFeedback(feedback)} className="view" style={{cursor: 'pointer'}} title="View Feedback">
                                                                        <i className="fa-solid fa-eye text-primary"></i>
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="9" className="text-center">{loading ? 'Loading...' : 'No feedback found matching your criteria.'}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="pagination-container text-center my-3 sm">
                                    <button
                                        disabled={!pagination.hasPrevPage}
                                        onClick={() => handlePageChange(1)}
                                        className="btn btn-dark btn-sm me-2"
                                    >
                                        First
                                    </button>
                                    <button
                                        disabled={!pagination.hasPrevPage}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        className="btn btn-dark btn-sm me-2"
                                    >
                                        Previous
                                    </button>
                                    {startPage > 1 && <span className="mx-2">...</span>}

                                    {pageButtons.map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`btn btn-sm me-1 ${ 
                                                pagination.currentPage === page ? "btn-primary" : "btn-dark"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    {endPage < pagination.totalPages && <span className="mx-2">...</span>}
                                    <button
                                        disabled={!pagination.hasNextPage}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        className="btn btn-dark btn-sm me-2"
                                    >
                                        Next
                                    </button>
                                    <button
                                        disabled={!pagination.hasNextPage}
                                        onClick={() => handlePageChange(pagination.totalPages)}
                                        className="btn btn-dark btn-sm"
                                    >
                                        Last
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {UpdatePopUpShow && selectedFeedback && (
                <EmployeeUpdateFeedbackPopUp
                    selectedFeedback={selectedFeedback}
                    handleUpdate={handleUpdate}
                    onSuccess={() => fetchData()}
                />
            )}
            {detailsServicePopUp && selectedFeedback && (
                <ViewFeedbackPopUp
                    selectedFeedback={selectedFeedback}
                    closePopUp={handleViewFeedback}
                />
            )}
        </>
    );
};