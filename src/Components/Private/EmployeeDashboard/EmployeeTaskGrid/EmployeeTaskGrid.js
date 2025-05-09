import { useState, useEffect } from "react";
import DeletePopUP from "../../CommonPopUp/DeletePopUp";
import ViewTaskPopUp from "./PopUp/ViewTaskPopUp";
import { getMyProjects } from "../../../../hooks/useProjects";
import { formatDate } from "../../../../utils/formatDate";
import { Header } from "../../MainDashboard/Header/Header";
import { Sidebar } from "../../MainDashboard/Sidebar/Sidebar";

export const EmployeeTaskGrid = () => {
    const [isopen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isopen);
    };

    const [TaskPopUpShow, setTaskPopUpShow] = useState(false)
    const [deletePopUpShow, setdeletePopUpShow] = useState(false)
    const [selectedId, setSelecteId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [projects, setProjects] = useState([])
    const [filteredProjects, setFilteredProjects] = useState([])

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalProjects: 0,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false,
    });
    const itemsPerPage = 10;

    const handlePageChange = (page) => {
       if (page >= 1 && page <= pagination.totalPages) {
          setPagination((prev) => ({
              ...prev,
              currentPage: page,
              hasNextPage: page < prev.totalPages,
              hasPrevPage: page > 1,
          }));
       }
    };

    const handleViewTask = (id) => {
        setSelecteId(id);
        setTaskPopUpShow(!TaskPopUpShow)
    }

    const handelDeleteClosePopUpClick = (id = null) => {
        setSelecteId(id);
        setdeletePopUpShow(!deletePopUpShow);
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getMyProjects();
                const fetchedProjects = data?.projects || [];
                setProjects(fetchedProjects);
                setFilteredProjects(fetchedProjects);

                const totalFetchedProjects = fetchedProjects.length;
                const calculatedTotalPages = Math.ceil(totalFetchedProjects / itemsPerPage);
                const initialPage = 1;

                setPagination({
                    currentPage: initialPage,
                    totalPages: calculatedTotalPages,
                    totalProjects: totalFetchedProjects,
                    limit: itemsPerPage,
                    hasNextPage: initialPage < calculatedTotalPages,
                    hasPrevPage: initialPage > 1,
                });

            } catch (error) {
                console.error("Error fetching projects:", error);
                setProjects([]);
                setFilteredProjects([]);
                setPagination({ currentPage: 1, totalPages: 0, totalProjects: 0, limit: itemsPerPage, hasNextPage: false, hasPrevPage: false });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const handleChange = (value) => {
        let currentlyFiltered = [];
        if (value) {
          currentlyFiltered = projects.filter((project) => project.projectStatus === value);
        } else {
          currentlyFiltered = projects;
        }
        setFilteredProjects(currentlyFiltered);

        const newTotalPages = Math.ceil(currentlyFiltered.length / itemsPerPage);
        const newCurrentPage = 1;

        setPagination(prev => ({
            ...prev,
            currentPage: newCurrentPage,
            totalPages: newTotalPages,
            totalProjects: currentlyFiltered.length,
            hasNextPage: newCurrentPage < newTotalPages,
            hasPrevPage: newCurrentPage > 1,
        }));
      };


      const indexOfLastItem = pagination.currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentData = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);


    return (
        <>
            {loading && (
                <div className="overlay">
                    <span className="loader"></span>
                </div>
            )}
            <div className="container-scroller">
                <div className="row background_main_all">
                    <Header
                        toggle={toggle} isopen={isopen} />
                    <div className="container-fluid page-body-wrapper">
                        <Sidebar isopen={isopen} active="EmployeeTaskGrid" />
                        <div className="main-panel" style={{ width: isopen ? "" : "calc(100%  - 120px )", marginLeft: isopen ? "" : "125px" }}>
                            <div className="content-wrapper ps-3 ps-md-0 pt-3">
                                <div className="row px-2 py-1">
                                    <div className="col-12 col-lg-6">
                                        <h5 className="text-white py-2">
                                            My Projects
                                        </h5>
                                    </div>
                                    <div className="col-12 col-lg-6 text-lg-end">
                                        <div className="d-inline-block" style={{ maxWidth: '200px' }}>
                                            <select
                                              className="form-select bg_edit"
                                              aria-label="Filter Projects by Status"
                                              name="projectStatus"
                                              onChange={(e) => handleChange(e.target.value)}
                                            >
                                              <option value="">All Statuses</option>
                                              <option value="upcoming">Upcoming</option>
                                              <option value="inprocess">Inprocess</option>
                                              <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="row bg-white p-2 m-1 border rounded" >
                                    <div className="col-12 py-2">
                                        <div className="table-responsive">
                                            <table className="table table-striped table-class" id="table-id">
                                                <thead>
                                                    <tr className="th_border" >
                                                        <th>Sr. No</th>
                                                        <th>Project Name</th>
                                                        <th>Customer Name</th>
                                                        <th>Project Status</th>
                                                        <th>Finish Date</th>
                                                        <th>Tasks</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="broder my-4">
                                                    {currentData && currentData.length > 0 ? (
                                                        currentData.map((project, index) => (
                                                            <tr className="border my-4" key={project._id}>
                                                                <td>{ index + 1 + (pagination.currentPage - 1) * itemsPerPage}</td>
                                                                <td>{project.name}</td>
                                                                <td>{project.custId?.custName || "N/A"}</td>
                                                                <td>{project.projectStatus}</td>
                                                                <td>{formatDate(project.endDate)}</td>
                                                                <td>
                                                                    <i onClick={() => { handleViewTask(project._id)}}
                                                                    className="fa-solid fa-eye Task_View_icon cursor-pointer"
                                                                    title="View Tasks">
                                                                    </i>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="6" className="text-center">
                                                                No Projects Found Matching Criteria
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {!loading && (
                                    <>
                                        {pagination.totalPages > 1 && (
                                            <div className="pagination-container text-center my-3">
                                                <button
                                                    onClick={() => handlePageChange(1)}
                                                    disabled={!pagination.hasPrevPage}
                                                    className="btn btn-dark btn-sm me-1"
                                                    style={{ borderRadius: "4px" }}
                                                    aria-label="First Page"
                                                >
                                                    First
                                                </button>

                                                <button
                                                    disabled={!pagination.hasPrevPage}
                                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                                    className="btn btn-dark btn-sm me-1"
                                                    style={{ borderRadius: "4px" }}
                                                    aria-label="Previous Page"
                                                >
                                                    Previous
                                                </button>

                                                {(() => {
                                                    const pageNumbers = [];
                                                    const maxPagesToShow = 5;

                                                    if (pagination.totalPages <= maxPagesToShow) {
                                                        for (let i = 1; i <= pagination.totalPages; i++) {
                                                            pageNumbers.push(i);
                                                        }
                                                    } else {
                                                        let startPage, endPage;
                                                        if (pagination.currentPage <= Math.ceil(maxPagesToShow / 2)) {
                                                          startPage = 1;
                                                          endPage = maxPagesToShow;
                                                        } else if (pagination.currentPage + Math.floor(maxPagesToShow / 2) >= pagination.totalPages) {
                                                          startPage = pagination.totalPages - maxPagesToShow + 1;
                                                          endPage = pagination.totalPages;
                                                        } else {
                                                          startPage = pagination.currentPage - Math.floor(maxPagesToShow / 2);
                                                          endPage = pagination.currentPage + Math.floor(maxPagesToShow / 2);
                                                        }
                                                        startPage = Math.max(1, startPage);
                                                        endPage = Math.min(pagination.totalPages, endPage);

                                                        if (startPage > 1) {
                                                          pageNumbers.push(1);
                                                          if (startPage > 2) {
                                                            pageNumbers.push('...');
                                                          }
                                                        }
                                                        for (let i = startPage; i <= endPage; i++) {
                                                          pageNumbers.push(i);
                                                        }
                                                        if (endPage < pagination.totalPages) {
                                                          if (endPage < pagination.totalPages - 1) {
                                                            pageNumbers.push('...');
                                                          }
                                                          pageNumbers.push(pagination.totalPages);
                                                        }
                                                    }

                                                    return pageNumbers.map((number, index) =>
                                                        typeof number === 'number' ? (
                                                        <button
                                                            key={number}
                                                            onClick={() => handlePageChange(number)}
                                                            className={`btn btn-sm me-1 ${
                                                            pagination.currentPage === number ? "btn-primary" : "btn-dark"
                                                            }`}
                                                            style={{ minWidth: "35px", borderRadius: "4px" }}
                                                            aria-label={`Go to page ${number}`}
                                                            aria-current={pagination.currentPage === number ? "page" : undefined}
                                                        >
                                                            {number}
                                                        </button>
                                                        ) : (
                                                        <span key={`ellipsis-${index}`} className="btn btn-sm btn-disabled me-1" style={{ minWidth: "35px", borderRadius: "4px", border: "1px solid #6c757d", cursor: "default" }}>
                                                            {number}
                                                        </span>
                                                        )
                                                    );
                                                })()}

                                                <button
                                                    disabled={!pagination.hasNextPage}
                                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                                    className="btn btn-dark btn-sm me-1"
                                                    style={{ borderRadius: "4px" }}
                                                    aria-label="Next Page"
                                                >
                                                    Next
                                                </button>

                                                <button
                                                    onClick={() => handlePageChange(pagination.totalPages)}
                                                    disabled={!pagination.hasNextPage}
                                                    className="btn btn-dark btn-sm"
                                                    style={{ borderRadius: "4px" }}
                                                    aria-label="Last Page"
                                                >
                                                    Last
                                                </button>
                                                <span className="ms-3 text-muted" style={{fontSize: '0.9em'}}>
                                                    Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalProjects} items)
                                                </span>
                                            </div>
                                        )}

                                        {pagination.totalProjects === 0 && (
                                            <div className="text-center my-3 text-muted">No projects found.</div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {deletePopUpShow && (
                    <DeletePopUP
                        message={"Are you sure! Do you want to Delete ?"}
                        cancelBtnCallBack={handelDeleteClosePopUpClick}
                        heading="Delete Confirmation"
                    />
            )}
            {TaskPopUpShow && (
                <ViewTaskPopUp
                    message="Task Details"
                    selectedId= {selectedId}
                    handleViewTask={handleViewTask}
                />
            )}
        </>
    )
}