import { useState, useEffect } from "react";
import { Header } from "../../MainDashboard/Header/Header";
import { Sidebar } from "../../MainDashboard/Sidebar/Sidebar";
import { toast } from "react-toastify";
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

    const [feedbacks, setFeedbacks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalFeedbacks: 0,
        limit: itemsPerPage,
        hasNextPage: false,
        hasPrevPage: false
    });

    const fetchData = async (pageToFetch) => {
        try {
            setLoading(true);
            const data = await getRemaningFeedback(
                pageToFetch,
                itemsPerPage,
                searchText
            );

            if (data && data.feedbacks) {
                setFeedbacks(data.feedbacks);

                if (data.pagination) {
                    const apiCurrentPage = typeof data.pagination.currentPage === 'number' ? data.pagination.currentPage : pageToFetch;
                    setPagination({
                        ...data.pagination,
                        currentPage: apiCurrentPage,
                        totalFeedbacks: data.pagination.totalFeedbacks || data.pagination.totalDocs || 0
                    });
                    if (currentPage !== apiCurrentPage) {
                        setCurrentPage(apiCurrentPage);
                    }
                } else {
                    const totalFeedbacks = data.totalFeedbacks || data.totalDocs || data.feedbacks.length;
                    const totalPages = Math.ceil(totalFeedbacks / itemsPerPage);
                    setPagination({
                        currentPage: pageToFetch,
                        totalPages: totalPages,
                        totalFeedbacks: totalFeedbacks,
                        limit: itemsPerPage,
                        hasNextPage: pageToFetch < totalPages,
                        hasPrevPage: pageToFetch > 1
                    });
                }
            } else {
                setFeedbacks([]);
                setPagination({ currentPage: pageToFetch, totalPages: 0, totalFeedbacks: 0, limit: itemsPerPage, hasNextPage: false, hasPrevPage: false });
            }
        } catch (error) {
            console.error("Error fetching feedback:", error);
            toast.error("Failed to fetch feedback.");
            setFeedbacks([]);
            setPagination({ currentPage: pageToFetch, totalPages: 0, totalFeedbacks: 0, limit: itemsPerPage, hasNextPage: false, hasPrevPage: false });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, UpdatePopUpShow, searchText]);

    const handleViewFeedback = (feedback) => {
        setSelectedFeedback(feedback);
        setDetailsServicePopUp(!detailsServicePopUp);
    };

    const handleUpdate = (feedback) => {
        setSelectedFeedback(feedback);
        setUpdatePopUpShow(!UpdatePopUpShow);
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

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setCurrentPage(1);
    };

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
                                        <h5 className="text-white py-2 mb-0">Feedback Master</h5>
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <div className="row g-2 justify-content-end align-items-center">
                                            <div className="col-sm-8 col-md-7 col-lg-6">
                                                <div className="form position-relative">
                                                    <i className="fa fa-search position-absolute" style={{ top: '10px', left: '10px', color: '#aaa' }}></i>
                                                    <input
                                                        type="text"
                                                        value={searchText}
                                                        onChange={handleSearchChange}
                                                        className="form-control form-input bg-transparant ps-4"
                                                        placeholder="Search Client, Person, Product..."
                                                    />
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
                                                        <th className="align_left_td">Client</th>
                                                        <th className="align_left_td">Contact Person</th>
                                                        <th className="align_left_td">Contact No</th>
                                                        <th className="align_left_td">Product</th>
                                                        <th>Allotment Date</th>
                                                        <th>Completion Date</th>
                                                        <th>Alloted to</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="broder my-4">
                                                    {feedbacks && feedbacks.length > 0 ? (
                                                        feedbacks.map((feedback, index) => (
                                                            <tr className="border my-4" key={feedback._id}>
                                                                <td>{index + 1 + (pagination.currentPage - 1) * itemsPerPage}</td>
                                                                <td className="align_left_td">{feedback.ticket?.client?.custName || 'N/A'}</td>
                                                                <td className="align_left_td">{feedback.ticket?.contactPerson || 'N/A'}</td>
                                                                <td className="align_left_td">{feedback.ticket?.contactNumber || 'N/A'}</td>
                                                                <td className="align_left_td">{feedback.ticket?.product || 'N/A'}</td>
                                                                <td>{formatDate(feedback.allotmentDate)}</td>
                                                                <td>{formatDate(feedback.completionDate)}</td>
                                                                <td>{feedback.allotTo?.map(person => person.name).join(', ') || 'N/A'}</td>
                                                                <td>
                                                                    <span onClick={() => handleUpdate(feedback)} className="update me-2" style={{cursor: 'pointer'}} title="Update Feedback">
                                                                        <i className="fa-solid fa-pen text-success"></i>
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

                                {pagination.totalPages > 1 && (
                                    <div className="pagination-container text-center my-3">
                                        <button disabled={!pagination.hasPrevPage} onClick={() => handlePageChange(1)} className="btn btn-dark btn-sm me-2" aria-label="First Page" title="First Page">First</button>
                                        <button disabled={!pagination.hasPrevPage} onClick={() => handlePageChange(pagination.currentPage - 1)} className="btn btn-dark btn-sm me-2" aria-label="Previous Page" title="Previous Page">Previous</button>
                                        {startPage > 1 && <span className="mx-2">...</span>}
                                        {pageButtons.map((page) => (
                                            <button key={page} onClick={() => handlePageChange(page)} className={`btn btn-sm me-1 ${ pagination.currentPage === page ? "btn-primary" : "btn-dark" }`} aria-label={`Go to page ${page}`} aria-current={pagination.currentPage === page ? "page" : undefined}>{page}</button>
                                        ))}
                                        {endPage < pagination.totalPages && <span className="mx-2">...</span>}
                                        <button disabled={!pagination.hasNextPage} onClick={() => handlePageChange(pagination.currentPage + 1)} className="btn btn-dark btn-sm ms-1 me-2" aria-label="Next Page" title="Next Page">Next</button>
                                        <button disabled={!pagination.hasNextPage} onClick={() => handlePageChange(pagination.totalPages)} className="btn btn-dark btn-sm" aria-label="Last Page" title="Last Page">Last</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {UpdatePopUpShow && selectedFeedback && (
                <EmployeeUpdateFeedbackPopUp
                    selectedFeedback={selectedFeedback}
                    handleUpdate={handleUpdate}
                    onSuccess={() => fetchData(currentPage)}
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