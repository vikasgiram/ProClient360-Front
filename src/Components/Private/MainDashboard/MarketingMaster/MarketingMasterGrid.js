import { useState, useContext, useEffect, act } from "react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import toast from 'react-hot-toast'

import MarketingDashboardCards from './MarketingDashboardCards';
import { UserContext } from "../../../../context/UserContext";

import ViewSalesLeadPopUp from "../../CommonPopUp/ViewSalesLeadPopUp";
import useLeads from "../../../../hooks/leads/useLeads";
import AssignMarketingLeadPopUp from "./PopUp/AssignLeadPopUp";
import useAssignLead from "../../../../hooks/leads/useAssignLead";
import { formatDate } from "../../../../utils/formatDate";


export const MarketingMasterGrid = () => {
  const [isopen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isopen);
  };

  // const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const [UpdatePopUpShow, setUpdatePopUpShow] = useState(false);

  const [detailsServicePopUp, setDetailsServicePopUp] = useState(false);

  const [selectedLead, setSelectedLead] = useState(null);

  const { user } = useContext(UserContext);
  const [filters, setFilters] = useState({ date: null, source: null });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalServices: 0,
    limit: 10,
    hasNextPage: true,
    hasPrevPage: false,
  });
  const itemsPerPage = 10;

  const { data, loading, error, refetch } = useLeads(pagination.currentPage, itemsPerPage, filters);
  const {assignLead } = useAssignLead();
  

  useEffect(() => {
    if (data) {
      setPagination(prev => ({ ...prev, ...data.pagination }));
    }
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [data, error]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  };

  const handleUpdate = (lead = null) => {
    setSelectedLead(lead);
    setUpdatePopUpShow(true);
  };



  const handleUpdateSubmit = async (id, actionData) => {
    try {
      if (actionData) {
        console.log("Updating lead with ID:", id, "and data:", actionData);
        await assignLead(id, actionData);
        refetch();
      } 
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update lead");
    }
  };

  const handleDetailsPopUpClick = (lead) => {
    setSelectedLead(lead);
    setDetailsServicePopUp(true);
  };

  const handleChange = (filterType, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterType]: value || null }));
    console.log(filterType, value)
    handlePageChange(1);
  };

  // const handleOpenAddModal = () => setIsAddModalVisible(true);

  // const handleCloseAddModal = () => setIsAddModalVisible(false);

  // const handleAddLeadSubmit = async (leadData) => {
  //   console.log("New Lead to be created:", leadData);
  //   toast.success("Lead added successfully!");
  //   handleCloseAddModal();
  // };


  return (
    <>
      <div className="container-scroller">
        <div className="row background_main_all">
          <Header toggle={toggle} isopen={isopen} />
          <div className="container-fluid page-body-wrapper">
            <Sidebar isopen={isopen} active="MarketingMasterGrid" />
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
                    <h5 className="text-white py-2">Marketing Master</h5>
                  </div>

                </div>

                <MarketingDashboardCards
                  allLeads={data?.allLeadsCount || 0}
                  feasibleLeads={data?.feasibleCount || 0}
                  notFeasibleLeads={data?.notFeasibleCount || 0}
                />

                <div className="row align-items-center p-2 m-1">
                  <div className="col-12 col-lg-4  ms-auto text-end">
                    <div className="row ms-auto">
                      <div className="col-12 col-lg-6 mt-4">
                        <input
                          type="date"
                          className="form-control bg_edit"
                          name="date"
                          onChange={(e) => handleChange('date', e.target.value)}
                          value={filters.date || ""}
                        />
                      </div>

                      <div className="col-12 col-lg-6 mt-4">
                        <select
                          className="form-select bg_edit"
                          name="source"
                          onChange={(e) => handleChange('source', e.target.value)}
                          value={filters.source || ""}
                        >
                          <option value="">Sources....</option>
                          <option value="IndiaMart">IndiaMart</option>
                          <option value="TradeIndia">TradeIndia</option>
                          <option value="Facebook">Facebook</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Email">Email</option>
                          <option value="Google">Google</option>
                          <option value="Direct">Direct</option>
                        </select>
                      </div>


                    </div>
                  </div>
                </div>


                <div className="row align-items-center p-2 m-1">
                </div>

                <div className="row bg-white p-2 m-1 border rounded">
                  <div className="col-12 py-2">
                    <div className="table-responsive">
                      <table className="table table-striped table-class" id="table-id">
                        <thead>
                          <tr className="th_border">
                            <th>Sr.No</th>
                            <th>Contact Name</th>
                            <th>Company Name</th>
                            <th>Product</th>
                            <th>Email</th>
                            <th>Date</th>
                            <th>Sources</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="broder my-4">
                          {data?.leads?.length > 0 ? (
                            data.leads.map((lead, index) => (
                              <tr >
                                <td>{(pagination.currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td>{lead?.SENDER_NAME}</td>
                                <td>{lead?.SENDER_COMPANY}</td>
                                <td>{lead?.QUERY_PRODUCT_NAME}</td>
                                <td>{lead?.SENDER_EMAIL}</td>
                                <td>{formatDate(lead?.createdAt)}</td>
                                <td>{lead?.SOURCE}</td>
                                {/* <td>{leads.STATUS}</td> */}
                                <td>

                                  {/* Edit Button */}
                                  {(user?.permissions?.includes('assignLead')) &&
                                    <span onClick={() => handleUpdate(lead)} title="Edit Lead">
                                      <i className="mx-1 fa-solid fa-share cursor-pointer"></i>
                                    </span>
                                  }
                                  {/* {(user?.permissions?.includes('deleteLead') || user?.user === 'company' && lead.SOURCE==='Direct' ) &&
                                              <span onClick={() => handleDelete(lead._id)} title="Delete Lead">
                                                  <i className="fa-solid fa-trash text-danger cursor-pointer"></i>
                                              </span>
                                            } */}

                                  {/* View Button */}
                                  <span onClick={() => handleDetailsPopUpClick(lead)} title="View Details">
                                    <i className="fa-solid fa-eye cursor-pointer text-primary mx-1"></i>
                                  </span>

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


               {/* add pagination Pagination */}

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



      {UpdatePopUpShow && selectedLead && (
        <AssignMarketingLeadPopUp
          selectedLead={selectedLead}
          onUpdate={handleUpdateSubmit}
          onClose={() => {
            setUpdatePopUpShow(false);
            setSelectedLead(null);
          }}
        />
      )}


      {detailsServicePopUp && selectedLead && (
        <ViewSalesLeadPopUp
          closePopUp={() => {
            setDetailsServicePopUp(false);
            setSelectedLead(null);
          }}
          selectedLead={selectedLead}
        />
      )}

      {loading && (
        <div className="overlay">
          <span className="loader"></span>
        </div>
      )}
    </>
  );
};