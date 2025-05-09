import { useState, useEffect } from "react";
import { AdminHeader } from "../AdminHeader";
import { AdminSidebar } from "../AdminSidebar";
import DeletePopUP from "../../CommonPopUp/DeletePopUp";
import AddCompanyPopup from "./PopUp/AddCompanyPopup";
import UpdatedCompanyPopup from "./PopUp/UpdatedCompanyPopup";
import { getCompany, deleteCompany } from "../../../../hooks/useCompany";
import { formatDate } from "../../../../utils/formatDate";

export const AdminCompanyMasterGrid = () => {
    const [isopen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isopen);
    };
    const [AddPopUpShow, setAddPopUpShow] = useState(false);
    const [deletePopUpShow, setdeletePopUpShow] = useState(false);
    const [updatePopUpShow, setUpdatePopUpShow] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelecteId] = useState(null);
    const [searchText, setSearchText] = useState("");

    const [companies, setCompanies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalCompanies: 0,
        limit: itemsPerPage,
        hasNextPage: false,
        hasPrevPage: false
    });

    const fetchData = async (pageToFetch) => {
        try {
            setLoading(true);
            const data = await getCompany(pageToFetch, itemsPerPage, searchText);

            if (data && data.companies) {
                setCompanies(data.companies);

                if (data.pagination) {
                    const apiCurrentPage = typeof data.pagination.currentPage === 'number' ? data.pagination.currentPage : pageToFetch;
                    setPagination({
                        ...data.pagination,
                        currentPage: apiCurrentPage,
                        totalCompanies: data.pagination.totalCompanies || data.pagination.totalDocs || 0
                    });

                    if (currentPage !== apiCurrentPage) {
                        setCurrentPage(apiCurrentPage);
                    }
                } else {
                    const totalCompanies = data.totalCompanies || data.totalDocs || data.companies.length;
                    const totalPages = Math.ceil(totalCompanies / itemsPerPage);
                    setPagination({
                        currentPage: pageToFetch,
                        totalPages: totalPages,
                        totalCompanies: totalCompanies,
                        limit: itemsPerPage,
                        hasNextPage: pageToFetch < totalPages,
                        hasPrevPage: pageToFetch > 1
                    });
                }
            } else {
                setCompanies([]);
                setPagination({
                    currentPage: pageToFetch,
                    totalPages: 0,
                    totalCompanies: 0,
                    limit: itemsPerPage,
                    hasNextPage: false,
                    hasPrevPage: false
                });
            }
        } catch (error) {
            console.error("Error fetching companies:", error);
            setCompanies([]);
            setPagination({
                currentPage: pageToFetch,
                totalPages: 0,
                totalCompanies: 0,
                limit: itemsPerPage,
                hasNextPage: false,
                hasPrevPage: false
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, AddPopUpShow, deletePopUpShow, updatePopUpShow, searchText]);

    const handleAdd = () => {
        setAddPopUpShow(!AddPopUpShow);
    };

    const handleUpdate = (company = null) => {
        setSelectedCompany(company);
        setUpdatePopUpShow(!updatePopUpShow);
    };

    const handelDeleteClosePopUpClick = (id = null) => {
        setSelecteId(id);
        setdeletePopUpShow(!deletePopUpShow);
    };

    const handelDeleteClick = async () => {
        if (selectedId) {
            try {
                setLoading(true);
                await deleteCompany(selectedId);
                setdeletePopUpShow(false);

                if (companies.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                } else {
                    fetchData(currentPage);
                }
            } catch (error) {
                console.error("Error deleting company:", error);
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
                    <AdminHeader toggle={toggle} isopen={isopen} />
                    <div className="container-fluid page-body-wrapper">
                        <AdminSidebar isopen={isopen} active="AdminCompanyMasterGrid" />
                        <div
                            className="main-panel"
                            style={{
                                width: isopen ? "" : "calc(100%  - 120px )",
                                marginLeft: isopen ? "" : "125px",
                            }}
                        >
                            <div className="content-wrapper ps-3 ps-md-0 pt-3">
                                <div className="row px-2 py-1 align-items-center">
                                     <div className="col-12 col-lg-6">
                                        <h5 className="text-white py-2 mb-0">Company Master</h5>
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <div className="row g-2 align-items-center justify-content-end">
                                            <div className="col-sm-8 col-md-6">
                                                <div className="form position-relative">
                                                    <i className="fa fa-search position-absolute" style={{ top: '10px', left: '10px', color: '#aaa' }}></i>
                                                    <input
                                                        type="text"
                                                        value={searchText}
                                                        onChange={(e) => {
                                                            setSearchText(e.target.value);
                                                            setCurrentPage(1);
                                                        }}
                                                        className="form-control form-input bg-transparant ps-4"
                                                        placeholder="Search Companies..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-4 col-md-auto text-end me-4">
                                                <button
                                                    onClick={handleAdd}
                                                    type="button"
                                                    className="btn adbtn btn-dark w-100">
                                                    <i className="fa-solid fa-plus me-1"></i> Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row bg-white p-2 m-1 border rounded">
                                    <div className="col-12 py-2">
                                        <div className="table-responsive">
                                            <table className="table table-striped table-class" id="table-id">
                                                 <thead>
                                                    <tr className="th_border">
                                                        <th>Sr. No</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Admin</th>
                                                        <th>Created Date</th>
                                                        <th>Subscription End Date</th>
                                                        <th>Status</th>
                                                        <th>Subscription Amount</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="broder my-4">
                                                    {companies && companies.length > 0 ? (
                                                        companies.map((company, index) => (
                                                            <tr className="border my-4" key={company._id}>
                                                                <td>{index + 1 + (pagination.currentPage - 1) * itemsPerPage}</td>
                                                                <td>{company.name || 'N/A'}</td>
                                                                <td>{company.email || 'N/A'}</td>
                                                                <td>{company.admin || 'N/A'}</td>
                                                                <td>{formatDate(company.createdAt)}</td>
                                                                <td>{formatDate(company.subDate)}</td>
                                                                <td>
                                                                    {new Date(company.subDate).getTime() >= Date.now()
                                                                        ? "Active"
                                                                        : "Inactive"}
                                                                </td>
                                                                <td>{company.subAmount || 'N/A'}</td>
                                                                <td>
                                                                    <span
                                                                        onClick={() => handleUpdate(company)}
                                                                        className="update me-3" style={{ cursor: 'pointer' }} title="Edit Company">
                                                                        <i className="fa-solid fa-pen text-success"></i>
                                                                    </span>
                                                                    <span
                                                                        onClick={() => handelDeleteClosePopUpClick(company._id)}
                                                                        className="delete" style={{ cursor: 'pointer' }} title="Delete Company">
                                                                        <i className="fa-solid fa-trash text-danger"></i>
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="9" className="text-center">{loading ? 'Loading...' : 'No companies found.'}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {pagination.totalPages > 1 && (
                                    <div className="pagination-container text-center my-3">
                                        <button
                                            disabled={!pagination.hasPrevPage}
                                            onClick={() => handlePageChange(1)}
                                            className="btn btn-dark btn-sm me-2"
                                            aria-label="First Page"
                                            title="First Page"
                                        >
                                            First
                                        </button>
                                        <button
                                            disabled={!pagination.hasPrevPage}
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            className="btn btn-dark btn-sm me-2"
                                            aria-label="Previous Page"
                                            title="Previous Page"
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
                                                aria-label={`Go to page ${page}`}
                                                aria-current={pagination.currentPage === page ? "page" : undefined}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        {endPage < pagination.totalPages && <span className="mx-2">...</span>}

                                        <button
                                            disabled={!pagination.hasNextPage}
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            className="btn btn-dark btn-sm ms-1 me-2"
                                            aria-label="Next Page"
                                            title="Next Page"
                                        >
                                            Next
                                        </button>
                                        <button
                                            disabled={!pagination.hasNextPage}
                                            onClick={() => handlePageChange(pagination.totalPages)}
                                            className="btn btn-dark btn-sm"
                                            aria-label="Last Page"
                                            title="Last Page"
                                        >
                                            Last
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {deletePopUpShow && (
                <DeletePopUP
                    message={"Are you sure! Do you want to Delete this Company?"}
                    cancelBtnCallBack={() => handelDeleteClosePopUpClick()}
                    confirmBtnCallBack={handelDeleteClick}
                    heading="Delete Company"
                />
            )}

            {AddPopUpShow && (
                <AddCompanyPopup
                    handleAdd={handleAdd}
                    onSuccess={() => fetchData(1)}
                />
            )}

            {updatePopUpShow && selectedCompany && (
                <UpdatedCompanyPopup
                    selectedCompany={selectedCompany}
                    handleUpdate={handleUpdate}
                    onSuccess={() => fetchData(currentPage)}
                />
            )}
        </>
    );
};