import { useState, useContext, useEffect } from "react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import toast from 'react-hot-toast';
import DeletePopUP from "../../CommonPopUp/DeletePopUp";
import UpdateServicePopup from "./PopUp/UpdateServicePopUp";
import useServices from "../../../../hooks/service/useService";
import useUpdateService from "../../../../hooks/service/useUpdateService";
import useDeleteService from "../../../../hooks/service/useDeleteService";
import { formatDate } from "../../../../utils/formatDate";
import ViewServicePopUp from "../../CommonPopUp/ViewServicePopUp";
import { UserContext } from "../../../../context/UserContext";
import ServiceDashboardCards from './ServiceDashboardCards';

export const ServiceMasterGrid = () => {
  const [isopen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isopen);
  };

  const { user } = useContext(UserContext);

  const [deletePopUpShow, setdeletePopUpShow] = useState(false);
  const [UpdatePopUpShow, setUpdatePopUpShow] = useState(false);

  const [filters, setFilters] = useState({ priority: null, status: null, serviceType: null });

  const [selectedId, setSelecteId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [detailsServicePopUp, setDetailsServicePopUp] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalServices: 0,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const itemsPerPage = 20;

  // Use hooks
  const { data, loading, error } = useServices(pagination.currentPage, itemsPerPage, filters);
  const { updateService, loading: updateLoading } = useUpdateService();
  const { deleteService, loading: deleteLoading } = useDeleteService();

  // Update state with fetched data
  useEffect(() => {
    if (data) {
      setPagination(data.pagination || {
        currentPage: 1,
        totalPages: 0,
        totalServices: 0,
        limit: itemsPerPage,
        hasNextPage: false,
        hasPrevPage: false,
      });
    }
    if (error) {
      toast.error(error);
    }
  }, [data, error]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleUpdate = (service = null) => {
    setSelectedService(service);
    setUpdatePopUpShow(!UpdatePopUpShow);
  };

  const handleUpdateSubmit = async (id, updatedData) => {
    const data = await updateService(id, updatedData);
    if (data.success) {
      setUpdatePopUpShow(false);
      handlePageChange(1); // Refresh list
      toast.success(data.message);
    }else{
      toast.error(data.error || "Failed to update service");
    }
  };

  const handelDeleteClosePopUpClick = (id) => {
    setSelecteId(id);
    setdeletePopUpShow(!deletePopUpShow);
  };

  const handelDeleteClick = async () => {
    const data = await deleteService(selectedId);
    if (data?.success) {
      setdeletePopUpShow(false);
      setPagination((prev) => ({ ...prev, currentPage: 1 })); // Refresh list
      toast.success(data?.message);
    } else {
      toast.error(data?.error);
    }
  };

  const handleChange = (filterType, value) => {
    const updatedFilters = { ...filters, [filterType]: value || null };
    setFilters(updatedFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handelDetailsPopUpClick = (service) => {
    setSelectedService(service);
    setDetailsServicePopUp(!detailsServicePopUp);
  };
  
  return (
    <>
      {(loading || updateLoading || deleteLoading) && (
        <div className="overlay">
          <span className="loader"></span>
        </div>
      )}

      <div className="container-scroller">
        <div className="row background_main_all">
          <Header toggle={toggle} isopen={isopen} />
          <div className="container-fluid page-body-wrapper">
            <Sidebar isopen={isopen} active="ServiceMasterGrid" />
            <div
              className="main-panel"
              style={{
                width: isopen ? "" : "calc(100% - 120px)",
                marginLeft: isopen ? "" : "125px",
              }}
            >
              <div className="content-wrapper ps-3 ps-md-0 pt-3">
                <div className="row px-2 py-1">
                  <div className="col-12 col-lg-4">
                    <h5 className="text-white py-2">Service Master</h5>
                  </div>
                </div>

                <ServiceDashboardCards
                  totalServiceCount={
                    data?.statusCounts?.Inprogress +
                    data?.statusCounts?.Pending +
                    data?.statusCounts?.Stuck +
                    data?.statusCounts?.Completed || 0
                  }
                  inprogressServiceCount={data?.statusCounts?.Inprogress || 0}
                  pendingServiceCount={data?.statusCounts?.Pending || 0}
                  stuckServiceCount={data?.statusCounts?.Stuck || 0}
                />

                <div className="col-12 col-lg-6 ms-auto text-end me-2">
                  <div className="row py-2">
                    <div className="col-4 col-lg-4 ms-auto">
                      <select
                        className="form-select bg_edit"
                        aria-label="Default select example"
                        name="serviceType"
                        onChange={(e) => handleChange('serviceType', e.target.value)}
                        value={filters.serviceType || ""}
                      >
                        <option value="">Select Service</option>
                        <option value="AMC">AMC</option>
                        <option value="Warranty">Warranty</option>
                        <option value="One Time">One Time</option>
                      </select>
                    </div>

                    <div className="col-4 col-lg-4 ms-auto">
                      <select
                        className="form-select bg_edit"
                        aria-label="Default select example"
                        name="status"
                        onChange={(e) => handleChange('status', e.target.value)}
                        value={filters.status || ""}
                      >
                        <option value="">Select Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Inprogress">Inprogress</option>
                        <option value="Stuck">Stuck</option>
                      </select>
                    </div>

                    <div className="col-4 col-lg-4 ms-auto">
                      <select
                        className="form-select bg_edit"
                        aria-label="Default select example"
                        name="priority"
                        onChange={(e) => handleChange('priority', e.target.value)}
                        value={filters.priority || ""}
                      >
                        <option value="">Select Priority</option>
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                      </select>
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
                            <th className="align_left_td width_tdd" style={{ width: "4rem" }} >Complaint</th>
                            <th className="align_left_td width_tdd">Client</th>
                            <th className="align_left_td width_tdd">Product</th>
                            <th className="align_left_td width_tdd">Priority</th>
                            <th>Allotment Date</th>
                            <th>Allocated to</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="broder my-4">
                          {data?.services?.length > 0 ? (
                            data.services.map((service, index) => (
                              <tr className="border my-4" key={service._id}>
                                <td>{index + 1 + (pagination.currentPage - 1) * itemsPerPage}</td>
                                <td className="align_left_td width_tdd wrap-text-of-col">{service?.ticket?.details}</td>
                                <td className="align_left_td width_tdd">{service?.ticket?.client?.custName}</td>
                                <td className="align_left_td width_tdd">{service?.ticket?.product}</td>
                                <td className="align_left_td width_tdd">{service.priority}</td>
                                <td>{formatDate(service.allotmentDate)}</td>
                                <td className='width_tdd'>{service.allotTo?.map((item, index) => item.name).join(', ')}</td>
                                <td className="font-weight-bold"style={{ color:service.status === 'Completed' ? '#28a745': service.status === 'Inprogress' ? '#0000FF' : service.status === 'Pending' ? '#FFA726' : service.status === 'Stuck' ? '#E53935': '#000'}}>
                                  {service.status}
                                </td>
                                <td>
                                  {user?.permissions?.includes('updateService') || user?.user === 'company' ?
                                    <span
                                      onClick={() => handleUpdate(service)}
                                      className="update"
                                    >
                                      <i className="mx-1 fa-solid fa-pen text-success cursor-pointer"></i>
                                    </span> : null}
                                  {user?.permissions?.includes('deleteService') || user?.user === 'company' ?
                                    <span
                                      onClick={() => handelDeleteClosePopUpClick(service._id)}
                                      className="delete"
                                    >
                                      <i className="mx-1 fa-solid fa-trash text-danger cursor-pointer"></i>
                                    </span> : null}
                                  {user?.permissions?.includes('viewService') || user?.user === 'company' ?
                                    <span
                                      onClick={() => handelDetailsPopUpClick(service)}
                                    >
                                      <i className="fa-solid fa-eye cursor-pointer text-primary mx-1"></i>
                                    </span> : null}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="9" className="text-center">
                                No data found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Pagination Button */}
                {!loading && pagination.totalPages > 1 && (
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
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
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

      {deletePopUpShow && (
        <DeletePopUP
          message={"Are you sure! Do you want to Delete ?"}
          cancelBtnCallBack={handelDeleteClosePopUpClick}
          confirmBtnCallBack={handelDeleteClick}
          heading="Delete"
        />
      )}

      {UpdatePopUpShow && (
        <UpdateServicePopup
          handleUpdate={handleUpdateSubmit}
          selectedService={selectedService}
          closePopUp={() => setUpdatePopUpShow(false)}
        />
      )}

      {detailsServicePopUp && (
        <ViewServicePopUp
          closePopUp={handelDetailsPopUpClick}
          selectedService={selectedService}
        />
      )}
    </>
  );
};