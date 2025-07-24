import { useState, useEffect } from "react";
import { Header } from "../../MainDashboard/Header/Header";
import { Sidebar } from "../../MainDashboard/Sidebar/Sidebar";
import toast from 'react-hot-toast';
import DeletePopUP from "../../CommonPopUp/DeletePopUp";
import SubmitServiceWorkPopUp from "./PopUp/SubmitServiceWorkPopUp";
import ViewServicePopUp from "../../CommonPopUp/ViewServicePopUp";
import useMyServices from "../../../../hooks/service/useMyService";
import useDeleteService from "../../../../hooks/service/useDeleteService";
import { formatDate } from "../../../../utils/formatDate";
import { getMyService } from "../../../../hooks/useService";

export const EmployeeMyServiceMasterGrid = () => {
  const [isopen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isopen);
  };

  // Popup States
  const [deletePopUpShow, setDeletePopUpShow] = useState(false);
  const [updatePopUpShow, setUpdatePopUpShow] = useState(false);
  const [detailsServicePopUp, setDetailsServicePopUp] = useState(false);

  const [loading, setLoading] = useState(true);

  const [services, setServices] = useState([]);

  // Filter State
  const [filters, setFilters] = useState({
    serviceType: null,
    status: null,
    priority: null,
  });

  // Pagination & Data State
  const [selectedId, setSelecteId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalServices: 0,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const itemsPerPage = 20;

  const { deleteService, loading: deleteLoading } = useDeleteService();

  // Update Pagination and Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data= await getMyService();

      setLoading(false);
      if (data.success) {
        setServices(data.services || []);
        setPagination(
          data.pagination || {
            currentPage: 1,
            totalPages: 0,
            totalServices: 0,
            limit: itemsPerPage,
            hasNextPage: false,
            hasPrevPage: false,
          }
        );
      }
      else{
        toast(data.error || "Failed to fetch services");
      }
    }
  
    fetchData();
  }, [ updatePopUpShow, deletePopUpShow]);

  // Event Handlers
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleUpdate = (service = null) => {
    setSelectedService(service);
    setUpdatePopUpShow(!updatePopUpShow);
  };

  const handleDetailsPopUpClick = (service) => {
    setSelectedService(service);
    setDetailsServicePopUp(!detailsServicePopUp);
  };

  const handleDeleteClosePopUpClick = (id = null) => {
    setSelecteId(id);
    setDeletePopUpShow(!deletePopUpShow);
  };

  const handleDeleteClick = async () => {
    if (selectedId) {
      try {
        toast.loading("Deleting Service...")
        const result = await deleteService(selectedId);
        toast.dismiss()
        if (result) {
          toast.success("Service deleted successfully.");
          setDeletePopUpShow(false);
          setPagination((prev) => ({
            ...prev,
            currentPage: prev.currentPage > 1 && services?.length === 1 ? prev.currentPage - 1 : prev.currentPage,
          }));
        }
      } catch (err) {
        toast.error(err.message || "Failed to delete service.");
      }
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value || null,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };


  // Pagination Buttons
  const maxPageButtons = 5;
  const pageButtons = [];
  let startPage = Math.max(1, pagination.currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(pagination.totalPages, startPage + maxPageButtons - 1);
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(i);
  }

  return (
    <>
      {(loading ) && (
        <div className="overlay">
          <span className="loader"></span>
        </div>
      )}

      <div className="container-scroller">
        <div className="row background_main_all">
          <Header toggle={toggle} isopen={isopen} />
          <div className="container-fluid page-body-wrapper">
            <Sidebar isopen={isopen} active="EmployeeMyServiceMasterGrid" />
            <div
              className="main-panel"
              style={{
                width: isopen ? "" : "calc(100% - 120px)",
                marginLeft: isopen ? "" : "125px",
              }}
            >
              <div className="content-wrapper ps-3 ps-md-0 pt-3">
                <div className="row px-2 py-1 align-items-center">
                  <div className="col-12 col-lg-4">
                    <h5 className="text-white py-2 mb-0">My Service Master</h5>
                  </div>

                  <div className="col-12 col-lg-8">
                    
                    <div className="row g-2 justify-content-end align-items-center">
                      <div className="col-md-3 col-lg-3">
                        <select
                          className="form-select bg_edit"
                          name="serviceType"
                          value={filters.serviceType || ""}
                          onChange={(e) => handleFilterChange("serviceType", e.target.value)}
                        >
                          <option value="">All Service Types</option>
                          <option value="AMC">AMC</option>
                          <option value="Warranty">Warranty</option>
                          <option value="One Time">One Time</option>
                        </select>
                      </div>
                      <div className="col-md-3 col-lg-3">
                        <select
                          className="form-select bg_edit"
                          name="status"
                          value={filters.status || ""}
                          onChange={(e) => handleFilterChange("status", e.target.value)}
                        >
                          <option value="">All Status</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="Inprogress">Inprogress</option>
                          <option value="Stuck">Stuck</option>
                        </select>
                      </div>
                      <div className="col-md-3 col-lg-3">
                        <select
                          className="form-select bg_edit"
                          name="priority"
                          value={filters.priority || ""}
                          onChange={(e) => handleFilterChange("priority", e.target.value)}
                        >
                          <option value="">All Priority</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row bg-white p-2 m-1 border rounded">
                  <div className="col-12 py-2">
                    <div className="table-responsive">
                      <table
                        className="table table-striped table-class"
                        id="table-id"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr className="th_border">
                            <th>Sr. No</th>
                            <th className="align_left_td td_width">Complaint</th>
                            <th className="align_left_td td_width">Client</th>
                            <th>Product</th>
                            <th>Priority</th>
                            <th>Allotment Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="broder my-4">
                          {services?.length > 0 ? (
                            services.map((service, index) => (
                              <tr className="border my-4" key={service._id}>
                                <td>
                                  {index + 1 + (pagination.currentPage - 1) * itemsPerPage}
                                </td>
                                <td
                                  className="align_left_td width_tdd"
                                  style={{ width: "20%" }}
                                >
                                  {service.ticket?.details || "N/A"}
                                </td>
                                <td className="align_left_td">
                                  {service.ticket?.client?.custName || "N/A"}
                                </td>
                                <td>{service.ticket?.product || "N/A"}</td>
                                <td>{service.priority || "N/A"}</td>
                                <td>{formatDate(service.allotmentDate)}</td>
                                <td
                                  className={
                                    service.status === "Completed"
                                      ? "text-success"
                                      : service.status === "Inprogress"
                                      ? "text-primary"
                                      : service.status === "Stuck"
                                      ? "text-danger"
                                      : service.status === "Pending"
                                      ? "text-warning"
                                      : ""
                                  }
                                >
                                  {service.status || "N/A"}
                                </td>
                                <td>
                                  <span
                                    onClick={() => handleUpdate(service)}
                                    className="update me-2"
                                    style={{ cursor: "pointer" }}
                                    title="Edit Service"
                                  >
                                    <i className="fa-solid fa-pen text-success"></i>
                                  </span>
                                  <span
                                    onClick={() => handleDetailsPopUpClick(service)}
                                    className="view"
                                    style={{ cursor: "pointer" }}
                                    title="View Details"
                                  >
                                    <i className="fa-solid fa-eye text-primary"></i>
                                  </span>
                                  {/* Uncomment if delete is needed */}
                                  {/* <span
                                    onClick={() => handleDeleteClosePopUpClick(service._id)}
                                    className="delete ms-2"
                                    style={{ cursor: "pointer" }}
                                    title="Delete Service"
                                  >
                                    <i className="fa-solid fa-trash text-danger"></i>
                                  </span> */}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="text-center">
                                {loading ? "Loading..." : "No services found matching your criteria."}
                              </td>
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
          message={"Are you sure! Do you want to Delete this Service?"}
          cancelBtnCallBack={() => handleDeleteClosePopUpClick()}
          confirmBtnCallBack={handleDeleteClick}
          heading="Service Deletion"
        />
      )}
      {updatePopUpShow && selectedService && (
        <SubmitServiceWorkPopUp
          selectedService={selectedService}
          handleUpdate={handleUpdate}
          onSuccess={() => setPagination((prev) => ({ ...prev }))}
        />
      )}
      {detailsServicePopUp && selectedService && (
        <ViewServicePopUp
          selectedService={selectedService}
          closePopUp={() => handleDetailsPopUpClick(null)}
        />
      )}
    </>
  );
};

export default EmployeeMyServiceMasterGrid;