import { useState,useContext, useEffect } from "react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import toast from 'react-hot-toast';
import DeletePopUP from "../../CommonPopUp/DeletePopUp";
import AddProjectPopup from "./PopUp/AddProjectPopup";
import UpdateProjectPopup from "./PopUp/UpdateProjectPopup";
import DownloadPopup from "./PopUp/DownloadProjectPopup";
import { getProjects, deleteProject } from "../../../../hooks/useProjects";
import { formatDate } from "../../../../utils/formatDate";
import GaintchartPoup from "./PopUp/GaintchartPoup";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";


export const ProjectMasterGrid = () => {
  const navigate = useNavigate();

  const [isopen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isopen);
  };

  const { user } = useContext(UserContext);

  const [AddPopUpShow, setAddPopUpShow] = useState(false);
  const [deletePopUpShow, setdeletePopUpShow] = useState(false);
  const [UpdatePopUpShow, setUpdatePopUpShow] = useState(false);
  const [DetailsPopUpShow, setDetailsPopUpShow] = useState(false);
  const [DownloadPopUpShow, setDownloadPopUpShow] = useState(false);

  const [selectedId, setSelecteId] = useState(null);
  const [project, setProject] = useState([]);

    const [filters, setFilters] = useState({ status: null});
  

  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalProjects: 0,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const itemsPerPage = 20;

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleAdd = () => {
    setAddPopUpShow(!AddPopUpShow);
  };

  const handleUpdate = (projects = null) => {
    setSelectedProject(projects);
    setUpdatePopUpShow(!UpdatePopUpShow);
  };

  const handleDetails = (project) => {
    setSelectedProject(project);
    setDetailsPopUpShow(!DetailsPopUpShow);
  };

  const handelDeleteClosePopUpClick = (id) => {
    setSelecteId(id);
    setdeletePopUpShow(!deletePopUpShow);
  };

  const handleDownloads = () => {
    setDownloadPopUpShow(!DownloadPopUpShow);
  };

  const handleChange = (filterType, value) => {
    const updatedFilters = { ...filters, [filterType]: value || null };
    setFilters(updatedFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };


  const handelDeleteClick = async () => {
    const data = await deleteProject(selectedId);
    if (data) {
      handelDeleteClosePopUpClick();
      return toast.success("Project Deleted successfully...");
    }
    toast.error(data.error);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProjects(pagination.currentPage, itemsPerPage, filters);
        if (data) {
          setProject(data.projects || []);
          setPagination(data.pagination || {
            currentPage: 1,
            totalPages: 0,
            totalProjects: 0,
            limit: itemsPerPage,
            hasNextPage: false,
            hasPrevPage: false,
          });
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.currentPage, AddPopUpShow, UpdatePopUpShow, deletePopUpShow, filters]);

  return (
    <>
      {loading && (
        <div className="overlay">
          <span className="loader"></span>
        </div>
      )}

      <div className="container-scroller">
        <div className="row background_main_all">
          <Header toggle={toggle} isopen={isopen} />
          <div className="container-fluid page-body-wrapper">
            <Sidebar isopen={isopen} active="ProjectMasterGrid" />
            <div
              className="main-panel"
              style={{
                width: isopen ? "" : "calc(100%  - 120px )",
                marginLeft: isopen ? "" : "125px",
              }}
            >
              <div className="content-wrapper ps-3 ps-md-0 pt-3">
                <div className="row px-2 py-1">
                  <div className="col-12 col-lg-4">
                    <h5 className="text-white py-2">Project Master</h5>
                  </div>

                  <div className="col-12 col-lg-6 ms-auto text-end">
                    <div className="row">
                      <div className="col-8 col-lg-4 ms-auto">
                        <select
                          className="form-select bg_edit"
                          aria-label="Default select example"
                          name="projectStatus"
                          onChange={(e) => handleChange('status',e.target.value)}
                        >
                          <option value=""> Project Status</option>
                          <option value="Upcoming">Upcoming</option>
                          <option value="Inprocess">Inprocess</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      {user?.permissions?.includes("createProject") || user?.user==='company' ? (
                      <div className="col-4 col-lg-4 ms-auto">
                          <button
                            onClick={handleAdd}
                            type="button"
                            className="btn adbtn btn-dark me-4"
                          >
                            <i className="fa-solid fa-plus"></i> Add
                          </button>
                      </div>
                      ) : null }
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
                            <th className="align_left_td td_width">Name</th>
                            <th>Customer Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Assign</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="broder my-4">
                          {project.length > 0 ? (
                            project.map((project, index) => (
                              <tr className="border my-4" key={project._id}>
                                <td>{index + 1 + (pagination.currentPage - 1) * itemsPerPage}</td>
                                <td className="align_left_td td_width text-wrap">{project.name}</td>
                                <td>{project.custId?.custName || "N/A"}</td>
                                <td>{formatDate(project.startDate)}</td>
                                <td>{formatDate(project.endDate)}</td>
                                <td>{project.projectStatus}</td>
                                <td>
                                  {user?.permissions?.includes("viewTaskSheet") || user?.user==='company'?(
                                  <i
                                    onClick={() => {
                                      navigate(`/project/${project._id}`);
                                    }}
                                    className="fa-solid fa-share cursor-pointer"
                                  ></i>
                                  ):null}
                                </td>
                                <td>
                                {user?.permissions?.includes("updateProject") || user?.user==='company'?(
                                  <span onClick={() => handleUpdate(project)} className="update">
                                    <i className="mx-1 fa-solid fa-pen text-success cursor-pointer"></i>
                                  </span>
                                  ):null}
                                  {user?.permissions?.includes("deleteProject") || user?.user==='company'?(
                                  <span onClick={() => handelDeleteClosePopUpClick(project._id)} className="delete">
                                    <i className="mx-1 fa-solid fa-trash text-danger cursor-pointer"></i>
                                  </span>
                                  ):null}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="text-center">
                                No data found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {!loading && pagination.totalPages > 1 && (
                  <div className="pagination-container text-center my-3 sm">
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
                        if (pagination.currentPage <= 3) {
                          startPage = 1;
                          endPage = maxPagesToShow;
                        } else if (pagination.currentPage >= pagination.totalPages - 2) {
                          startPage = pagination.totalPages - maxPagesToShow + 1;
                          endPage = pagination.totalPages;
                        } else {
                          startPage = pagination.currentPage - 2;
                          endPage = pagination.currentPage + 2;
                        }
                        startPage = Math.max(1, startPage);
                        endPage = Math.min(pagination.totalPages, endPage);

                        for (let i = startPage; i <= endPage; i++) {
                          pageNumbers.push(i);
                        }
                      }

                      return pageNumbers.map((number) => (
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
                      ));
                    })()}

                    <button
                      disabled={!pagination.hasNextPage}
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      className="btn btn-dark btn-sm me-1"
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {deletePopUpShow ? (
        <DeletePopUP
          message={"Are you sure! Do you want to Delete ?"}
          cancelBtnCallBack={handelDeleteClosePopUpClick}
          confirmBtnCallBack={handelDeleteClick}
          heading="Delete"
        />
      ) : (
        <></>
      )}
      {AddPopUpShow ? (
        <AddProjectPopup message="Create New Employee" handleAdd={handleAdd} />
      ) : (
        <></>
      )}
      {UpdatePopUpShow ? (
        <UpdateProjectPopup selectedProject={selectedProject} handleUpdate={handleUpdate} />
      ) : (
        <></>
      )}
      {DetailsPopUpShow ? (
        <GaintchartPoup selectedProject={selectedProject} handleDetails={handleDetails} />
      ) : (
        <></>
      )}
      {DownloadPopUpShow ? (
        <DownloadPopup handleDownloads={handleDownloads} />
      ) : (
        <></>
      )}
    </>
  );
};

