import { useState, useContext, useEffect } from "react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import toast from 'react-hot-toast';
import AddLeadMaster from "./PopUp/AddLeadMaster";
import {  formatDateforTaskUpdate } from "../../../../utils/formatDate";
import SalesDashboardCards from './SalesDashboardCards';
import { UserContext } from "../../../../context/UserContext";

import DeletePopUP from "../../CommonPopUp/DeletePopUp";
import ViewSalesLeadPopUp from "../../CommonPopUp/ViewSalesLeadPopUp";
import UpdateSalesPopUp from "./PopUp/UpdateSalesPopUp";
import useMyLeads from "../../../../hooks/leads/useMyLeads";
import useSubmitEnquiry from "../../../../hooks/leads/useSubmitEnquiry";
import useCreateLead from "../../../../hooks/leads/useCreateLead";

export const SalesMasterGrid = () => {
  const [isopen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isopen);
  };

  const [addpop, setIsAddModalVisible] = useState(false);
  const [UpdatePopUpShow, setUpdatePopUpShow] = useState(false);
  const [showLeadPopUp, setShowLeadPopUp] = useState(false);
  
  const [selectedLead, setSelectedLead] = useState(null); 
  const [activeSource, setActiveSource] = useState(null);

  const [deletePopUpShow, setDeletePopUpShow] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const { user } = useContext(UserContext);
  const [filters, setFilters] = useState({ status: null, date: null, source: null });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalServices: 0,
    limit: 20,
    hasNextPage: true,
    hasPrevPage: false,
  });
  const itemsPerPage = 20;

  const { data, loading, error, refetch } = useMyLeads(pagination.currentPage, itemsPerPage, filters);
  const {submitEnquiry} = useSubmitEnquiry();
  const { createLead } = useCreateLead();

  const calculateTodayCount = () => {
  
    if (data?.leadCounts?.todayCount !== undefined) {
      return data.leadCounts.todayCount;
    }
    

    if (!data?.leads || data.leads.length === 0) return 0;
    
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0]; 
    
    return data.leads.filter(lead => {
      const leadDate = new Date(lead.createdAt);
      const leadDateString = leadDate.toISOString().split('T')[0];
      return leadDateString === todayDateString;
    }).length;
  };

  const actualTodayCount = calculateTodayCount();

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
  
  const handleDelete = (leadId) => {
    setSelectedLeadId(leadId);
    setDeletePopUpShow(true);
  };
  
  const handleDeleteConfirm = async () => {
    if(!selectedLeadId) return;
    try {
      console.log("Deleting lead with ID:", selectedLeadId);
      toast.success("Lead deleted successfully!");
      setDeletePopUpShow(false);
      setSelectedLeadId(null);
      refetch(); 
    } catch (error) {
      toast.error("Failed to delete lead");
    }
  };

  const handleBgColor = (status) => {
    switch (status) {
      case "Won":
        return "badge bg-success text-white";
      case "Ongoing":
        return "badge bg-primary text-white";
      case "Pending":
        return "badge bg-warning text-dark";
      case "Lost":
        return "badge bg-danger text-white";
      case "today":
        return "badge bg-warning text-white";    
      default:
        return "badge bg-secondary";
    }
  }

  const handleUpdateSubmit = async (id, enquiryData) => {
    try {
      if (enquiryData) {
        await submitEnquiry(id, enquiryData);
        refetch();
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to Submit Enquiry");
    }
  };

  const handleDetailsPopUpClick = (lead) => {
    setSelectedLead(lead);
    setShowLeadPopUp(true);
  };

  const handleChange = (filterType, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterType]: value || null }));
    console.log("Filters updated:", { ...filters, [filterType]: value || null });
    handlePageChange(1);
  };

  const handleOpenAddModal = () => setIsAddModalVisible(true);
  const handleCloseAddModal = () => setIsAddModalVisible(false);

  const handleAddLeadSubmit = async (leadData) => {
    toast.loading("Adding lead...");
    const data = await createLead(leadData);
    console.log("Lead Data:", data);
    if (data?.success) {
      toast.dismiss();
      toast.success(data?.message || "Lead added successfully!");
      handleCloseAddModal();
      refetch();
    }else{
      toast.dismiss();
      toast.error(data?.error || "Failed to add lead");
    }
  };


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
            <Sidebar isopen={isopen} active="SalesMasterGrid" />
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
                            <h5 className="text-white py-2">Sales Master</h5>
                        </div>
                      {user?.permissions?.includes("createLead") || user?.user === 'company' ? (
                        <div className="col- col-lg-2 ms-auto text-end me-5">
                            <button onClick={handleOpenAddModal} type="button" className="btn adbtn btn-dark">
                                <i className="fa-solid fa-plus"></i> Add
                            </button>
                        </div>
                      ) : null}
                    </div>

                    <SalesDashboardCards
                        allLeadsCount={data?.leadCounts?.allLeadsCount || 0}
                        ongogingCount={data?.leadCounts?.ongogingCount || 0}
                        winCount={data?.leadCounts?.winCount || 0}
                        pendingCount={data?.leadCounts?.pendingCount || 0}
                        lostCount={data?.leadCounts?.lostCount || 0}
                        todayCount={data?.leadCounts?.todaysFollowUpCount} 
                    /> 

                <div className="row align-items-center p-2 m-1">
                  <div className="col-12 col-lg-6"></div>
                  <div className="col-12 col-lg-6 ms-auto text-end">
                    <div className="row g-2">
                      <div className="col">
                        <input
                          type="date"
                          className="form-control bg_edit"
                          name="date"
                          onChange={(e) => handleChange('date', e.target.value)}
                          value={filters.date || ""}
                        />
                      </div>

                      <div className="col">
                        <select
                          className="form-select bg_edit"
                          name="source"
                          onChange={(e) => handleChange('source', e.target.value)}
                          value={filters.source || ""}
                        >
                          <option value="">Sources....</option>
                          <option value="Direct">Direct</option>
                          <option value="IndiaMart">IndiaMart</option>
                          <option value="TradeIndia">TradeIndia</option>
                          <option value="Facebook">Facebook</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Google">Google</option>
                        </select>
                      </div>

                      <div className="col">
                        <select
                          className="form-select bg_edit"
                          name="status"
                          onChange={(e) => handleChange('status', e.target.value)}
                          value={filters.status || ""}
                        >
                          <option value="">Status....</option>
                          <option value="Won">Won</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Pending">Pending</option>
                          <option value="Lost">Lost</option>
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
                                        <th>Sources</th>
                                        <th>Contact Name</th>
                                        <th>Company Name</th>
                                        <th>Product</th>
                                        <th>Email</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className="broder my-4">
                                  {data?.leads?.length > 0 ? (
                                    data.leads.map((lead, index) => (
                                    <tr key={lead._id}>
                                        <td>{index + 1 + (pagination.currentPage - 1) * itemsPerPage}</td>
                                        <td>{lead.SOURCE}</td>
                                        <td>{lead.SENDER_NAME||"Not available."}</td>
                                        <td>{lead.SENDER_COMPANY||"Not available."}</td>
                                        <td>{lead.QUERY_PRODUCT_NAME||"Not available."}</td>
                                        <td>{lead.SENDER_EMAIL||"Not available."}</td>
                                        <td>{formatDateforTaskUpdate(lead.nextFollowUpDate || lead.createdAt)}</td>
                                        <td>
                                            <span className={handleBgColor(lead.STATUS)}>{lead.STATUS}</span>
                                        </td>
                                        <td>
                                            {/* Edit Button */}
                                            {(user?.permissions?.includes('updateLead') || user?.user === 'company')  &&
                                                <span onClick={() => handleUpdate(lead)} title="Action Lead">
                                                    <i className="mx-1 fa-solid fa-pen text-success cursor-pointer"></i>
                                                </span>
                                            }

                                            {( lead.SOURCE==='Direct' &&( user?.permissions?.includes('deleteLead') || user?.user === 'company')) &&
                                              <span onClick={() => handleDelete(lead._id)} title="Delete Lead">
                                                   <i className="fa-solid fa-trash text-danger cursor-pointer"></i>
                                              </span>
                                            }

                                             {/* View Button */}
                                            {/* <span onClick={() => handleDetailsPopUpClick(lead)} title="View Details">
                                                <i className="fa-solid fa-eye cursor-pointer text-primary mx-1"></i>
                                            </span> */}
                                        </td>
                                    </tr>
                                    ))) : (
                                      <tr>
                                        <td colSpan="9" className="text-center">
                                          No More Leads.
                                        </td>
                                      </tr>
                                    )}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>

                  {/* add Pagination button */}
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

      {addpop && (
        <AddLeadMaster onAddLead={handleAddLeadSubmit} onClose={handleCloseAddModal} />
      )}

      {UpdatePopUpShow && selectedLead && (
        <UpdateSalesPopUp
          selectedLead={selectedLead}
          onUpdate={handleUpdateSubmit}
          isCompany={user.user === 'company'}
          onClose={() => {
            setUpdatePopUpShow(false);
            setSelectedLead(null);
          }}
        />
      )}

      {deletePopUpShow && (
        <DeletePopUP
          message={"Are you sure you want to delete this lead?"}
          heading={"Delete Lead"}
          cancelBtnCallBack={() => setDeletePopUpShow(false)}
          confirmBtnCallBack={handleDeleteConfirm}
        />
      )}

      {showLeadPopUp && selectedLead && (
          <ViewSalesLeadPopUp
              closePopUp={() => {
                setShowLeadPopUp(false);
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