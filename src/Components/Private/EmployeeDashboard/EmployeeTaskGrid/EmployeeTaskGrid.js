import { useState, useEffect } from "react";
import DeletePopUP from "../../CommonPopUp/DeletePopUp";
import ViewTaskPopUp from "./PopUp/ViewTaskPopUp";
import { getMyProjects } from "../../../../hooks/useProjects";
import { formatDate } from "../../../../utils/formatDate";
import { Header } from "../../MainDashboard/Header/Header";
import { Sidebar } from "../../MainDashboard/Sidebar/Sidebar";

import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
const APP_TOOLTIP_ID = 'employee-task-grid-tooltip';

const BeaconIndicator = ({ color = '#40A2D3', size = '14px', title = '', className = ''}) => {
  const style = {
    '--beacon-indicator-color': color,
    '--beacon-indicator-size': size,
  };

  return (
    <div
      className={`beacon-indicator-wrapper ${className}`}
      data-tooltip-id={APP_TOOLTIP_ID}
      data-tooltip-content={title}
      data-tooltip-place="bottom"
    >
      <div
        className="beacon-indicator"
        style={style}
      >
      </div>
    </div>
  );
};


const Notification = ({ title, message }) => {
    console.log(`--- NOTIFICATION ---
Title: ${title}
Message: ${message}
--------------------`);
};

const commonThStyle = {
    backgroundColor: 'transparent',
    color: 'white',
};

export const EmployeeTaskGrid = () => {
    const [isopen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isopen);
    };

    const [TaskPopUpShow, setTaskPopUpShow] = useState(false)
    const [deletePopUpShow, setdeletePopUpShow] = useState(false)
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [projects, setProjects] = useState([])
    const [filteredProjects, setFilteredProjects] = useState([])

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalProjects: 0,
        limit: 20,
        hasNextPage: false,
        hasPrevPage: false,
    });
    const itemsPerPage = 20;

    const [notifiedTomorrowProjects, setNotifiedTomorrowProjects] = useState(new Set());


    useEffect(() => {
        const styleId = 'beacon-indicator-styles';
        if (document.getElementById(styleId)) {
            return;
        }

        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = `
            .beacon-indicator-wrapper {
              display: inline-block;
              vertical-align: middle;
            }
            .beacon-indicator {
              position: relative;
              width: var(--beacon-indicator-size);
              height: var(--beacon-indicator-size);
              background-color: var(--beacon-indicator-color);
              margin: 0 auto;
              border: none;
              border-radius: 50%;
              padding: 0;
              outline: none;
              display: block;
            }
            .beacon-indicator::after {
              content: '';
              width: calc(var(--beacon-indicator-size) * 0.35);
              height: calc(var(--beacon-indicator-size) * 0.35);
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translateX(-50%) translateY(-50%);
              border-width: calc(var(--beacon-indicator-size) * 0.12);
              border-style: solid;
              border-color: var(--beacon-indicator-color);
              border-radius: 50%;
              animation: beacon-indicator-animation 1.5s infinite linear;
              animation-fill-mode: forwards;
              box-sizing: border-box;
            }
            @keyframes beacon-indicator-animation {
              0% { width: 0; height: 0; opacity: 1; }
              25% { width: calc(var(--beacon-indicator-size) * 1); height: calc(var(--beacon-indicator-size) * 1); opacity: 0.7; }
              50% { width: calc(var(--beacon-indicator-size) * 1.2); height: calc(var(--beacon-indicator-size) * 1.2); opacity: 0.5; }
              75% { width: calc(var(--beacon-indicator-size) * 2); height: calc(var(--beacon-indicator-size) * 2); opacity: 0.3; }
              100% { width: calc(var(--beacon-indicator-size) * 2.5); height: calc(var(--beacon-indicator-size) * 2.5); opacity: 0; }
            }
        `;
        document.head.appendChild(styleElement);
    }, []);

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
        setSelectedId(id);
        setTaskPopUpShow(!TaskPopUpShow)
    }

    const handelDeleteClosePopUpClick = (id = null) => {
        setSelectedId(id);
        setdeletePopUpShow(!deletePopUpShow);
    }

    const isDateAlertNeeded = (dateString, status) => {
        if (status && status.toLowerCase() === 'completed') return false;
        const today = new Date();
        const finishDate = new Date(dateString);
        if (isNaN(finishDate.getTime())) {
            console.error("isDateAlertNeeded: Invalid date string provided:", dateString);
            return false;
        }
        today.setHours(0, 0, 0, 0);
        finishDate.setHours(0, 0, 0, 0);
        if (finishDate < today) return true;
        const timeDiff = finishDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff <= 3;
    };

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
          currentlyFiltered = projects.filter(
            (project) => project.projectStatus && project.projectStatus.toLowerCase() === value.toLowerCase()
          );
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

    useEffect(() => {
        if (currentData && currentData.length > 0) {
            const newNotificationsSent = new Set(notifiedTomorrowProjects);
            let updatedNotifiedSet = false;
            currentData.forEach(project => {
                const projectStatusLower = project.projectStatus ? project.projectStatus.toLowerCase() : "";
                if (projectStatusLower === 'upcoming' || projectStatusLower === 'inprocess') {
                    const today = new Date();
                    const end = new Date(project.endDate);
                    if (isNaN(end.getTime())) {
                        console.warn(`Notification: Skipping project ${project.name} due to invalid endDate: ${project.endDate}`);
                        return;
                    }
                    today.setHours(0, 0, 0, 0);
                    end.setHours(0, 0, 0, 0);
                    const diffTime = end.getTime() - today.getTime();
                    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
                    if (diffDays === 1 && !notifiedTomorrowProjects.has(project._id)) {
                        Notification({
                            title: "Project Due Tomorrow",
                            message: `Project "${project.name}" is due tomorrow. Please complete your task.`
                        });
                        newNotificationsSent.add(project._id);
                        updatedNotifiedSet = true;
                    }
                }
            });
            if (updatedNotifiedSet) {
                setNotifiedTomorrowProjects(newNotificationsSent);
            }
        }
    }, [currentData, notifiedTomorrowProjects]);


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
                                <div className="row px-2 py-1 align-items-center">
                                    <div className="col-12 col-lg-6">
                                        <h5 className="text-white py-2">
                                            My Projects
                                        </h5>
                                    </div>
                                    <div className="col-12 col-lg-6 text-lg-end">
                                        <div className="d-inline-block me-4" style={{ maxWidth: '200px' }}>
                                            <select
                                              className="form-select bg_edit"
                                              aria-label="Filter Projects by Status"
                                              name="projectStatus"
                                              onChange={(e) => handleChange(e.target.value)}
                                            >
                                              <option value="">All Status</option>
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
                                                        <th style={commonThStyle}>Sr. No</th>
                                                        <th style={commonThStyle}>Project Name</th>
                                                        <th style={commonThStyle}>Customer Name</th>
                                                        <th style={commonThStyle}>Project Status</th>
                                                        <th style={commonThStyle}>Finish Date</th>
                                                        <th style={commonThStyle}></th>
                                                        <th style={commonThStyle}>Tasks</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="broder my-4">
                                                    {currentData && currentData.length > 0 ? (
                                                        currentData.map((project, index) => {
                                                            const projectStatusLower = project.projectStatus ? project.projectStatus.toLowerCase() : "";
                                                            const needsAlert = isDateAlertNeeded(project.endDate, projectStatusLower);

                                                            return (
                                                                <tr className="border my-4" key={project._id}>
                                                                    <td>{ index + 1 + (pagination.currentPage - 1) * itemsPerPage}</td>
                                                                    <td className="align_left_td td_width">{project.name}</td>
                                                                    <td>{project.custId?.custName || "N/A"}</td>
                                                                    <td>{project.projectStatus}</td>
                                                                    <td>
                                                                        {formatDate(project.endDate)}
                                                                    </td>
                                                                    <td>
                                                                        {needsAlert && (projectStatusLower === 'upcoming' || projectStatusLower === 'inprocess') && (() => {
                                                                            const today = new Date();
                                                                            const end = new Date(project.endDate);
                                                                            if (isNaN(end.getTime())) {
                                                                                console.warn(`Beacon: Skipping project ${project.name} due to invalid endDate: ${project.endDate}`);
                                                                                return null;
                                                                            }
                                                                            today.setHours(0, 0, 0, 0);
                                                                            end.setHours(0, 0, 0, 0);
                                                                            const diffTime = end.getTime() - today.getTime();
                                                                            const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
                                                                            let indicatorColor = '';
                                                                            let currentTitle = "";
                                                                            if (diffDays < 0) {
                                                                                indicatorColor = '#F29339';
                                                                                const daysOverdue = Math.abs(diffDays);
                                                                                currentTitle = `Overdue by ${daysOverdue} day${daysOverdue === 1 ? '' : 's'}`;
                                                                            } else if (diffDays === 0) {
                                                                                indicatorColor = 'orange';
                                                                                currentTitle = 'Due today';
                                                                            } else if (diffDays > 0 && diffDays <=3) {
                                                                                indicatorColor = '#ADD8E6';
                                                                                currentTitle = `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`;
                                                                            } else { return null; }
                                                                            return (
                                                                                <BeaconIndicator
                                                                                    color={indicatorColor}
                                                                                    className="align_left_td td_width indicate_width"
                                                                                    size="14px"
                                                                                    title={currentTitle} // 
                                                                                />
                                                                            );
                                                                        })()}
                                                                    </td>
                                                                    <td>
                                                                        <i onClick={() => { handleViewTask(project._id)}}
                                                                        className="fa-solid fa-eye Task_View_icon cursor-pointer"
                                                                        
                                                                        data-tooltip-id={APP_TOOLTIP_ID}
                                                                        data-tooltip-content="View Tasks"
                                                                        data-tooltip-place="bottom"
                                                                        >
                                                                        </i>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="7" className="text-center">
                                                                No Projects Found Matching Criteria
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Pagination and Popups  */}
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
                                                        for (let i = 1; i <= pagination.totalPages; i++) { pageNumbers.push(i); }
                                                    } else {
                                                        let startPage, endPage;
                                                        if (pagination.currentPage <= Math.ceil(maxPagesToShow / 2)) {
                                                          startPage = 1; endPage = maxPagesToShow;
                                                        } else if (pagination.currentPage + Math.floor(maxPagesToShow / 2) >= pagination.totalPages) {
                                                          startPage = pagination.totalPages - maxPagesToShow + 1; endPage = pagination.totalPages;
                                                        } else {
                                                          startPage = pagination.currentPage - Math.floor(maxPagesToShow / 2); endPage = pagination.currentPage + Math.floor(maxPagesToShow / 2);
                                                        }
                                                        startPage = Math.max(1, startPage); endPage = Math.min(pagination.totalPages, endPage);
                                                        if (startPage > 1) { pageNumbers.push(1); if (startPage > 2) { pageNumbers.push('...'); } }
                                                        for (let i = startPage; i <= endPage; i++) { pageNumbers.push(i); }
                                                        if (endPage < pagination.totalPages) { if (endPage < pagination.totalPages - 1) { pageNumbers.push('...'); } pageNumbers.push(pagination.totalPages); }
                                                    }
                                                    return pageNumbers.map((number, index) =>
                                                        typeof number === 'number' ? (
                                                        <button
                                                            key={number}
                                                            onClick={() => handlePageChange(number)}
                                                            className={`btn btn-sm me-1 ${pagination.currentPage === number ? "btn-primary" : "btn-dark"}`}
                                                            style={{ minWidth: "35px", borderRadius: "4px" }}
                                                            aria-label={`Go to page ${number}`}
                                                            aria-current={pagination.currentPage === number ? "page" : undefined
                                                        }                                            >
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
                                        
                                            </div>
                                        )}
                                        {/* {pagination.totalProjects === 0 && !loading && (
                                            <div className="text-center my-3 text-muted">No projects found.</div>
                                        )} */}
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

            <Tooltip id={APP_TOOLTIP_ID} />
        </>
    )
}