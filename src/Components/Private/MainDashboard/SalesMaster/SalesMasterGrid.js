import { useState, useContext, useEffect } from "react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import toast from 'react-hot-toast';
import useServices from "../../../../hooks/service/useService";
import AddLeadMaster from "./PopUp/AddLeadMaster";
import { formatDate } from "../../../../utils/formatDate";
import SalesDashboardCards from './SalesDashboardCards';
import { UserContext } from "../../../../context/UserContext";

import DeletePopUP from "../../CommonPopUp/DeletePopUp";
import ViewServicePopUp from "../../CommonPopUp/ViewServicePopUp";
import ViewSalesLeadPopUp from "../../CommonPopUp/ViewSalesLeadPopUp";
import UpdateSalesPopUp from "./PopUp/UpdateSalesPopUp";

export const SalesMasterGrid = () => {
  const [isopen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isopen);
  };

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [UpdatePopUpShow, setUpdatePopUpShow] = useState(false);
  const [detailsServicePopUp, setDetailsServicePopUp] = useState(false);
  
  const [selectedLead, setSelectedLead] = useState(null); 
  const [activeSource, setActiveSource] = useState(null);

  const [deletePopUpShow, setDeletePopUpShow] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const { user } = useContext(UserContext);
  const [filters, setFilters] = useState({ priority: null, status: null, serviceType: null, source: null });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalServices: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const itemsPerPage = 10;

  const { data, loading, error, updateService } = useServices(pagination.currentPage, itemsPerPage, filters);

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

    } catch (error) {
      toast.error("Failed to delete lead");
    }
  };

  const handleUpdateSubmit = async (id, updatedData) => {
    try {
      if (updateService) {
        const result = await updateService(id, updatedData);
        if (result) {
          toast.success("Lead updated successfully!");
          setUpdatePopUpShow(false);
          setSelectedLead(null);
        }
      } else {
        console.log("Updating lead:", id, updatedData);
        toast.success("Lead updated successfully!");
        setUpdatePopUpShow(false);
        setSelectedLead(null);
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
    handlePageChange(1);
  };

  const handleOpenAddModal = () => setIsAddModalVisible(true);
  const handleCloseAddModal = () => setIsAddModalVisible(false);

  const handleAddLeadSubmit = async (leadData) => {
    console.log("New Lead to be created:", leadData);
    toast.success("Lead added successfully!");
    handleCloseAddModal();
  };

  // static data 
  const sampleLead = {
      _id: 'static-id-123',
      name: 'Nilkanth p',
      company: 'Daccess Security Systems Pvt Ltd',
      product: 'Surveillance System',
      products: 'Surveillance System',
      email: 'nilkanth@gmail.com',
      contact: '+91-9876543210',
      date: new Date(),
      sources: 'IndiaMart',
      status: 'ongoing',
      value: '50000',
      address: {
        pincode: '411001',
        state: 'Maharashtra',
        city: 'Pune',
        country: 'India',
        add: '123 Tech Park, Hinjewadi'
      }
  };

  return (
    <>
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
                        <div className="col- col-lg-2 ms-auto text-end me-5">
                            {user?.permissions?.includes("addLeadMaster") || user?.user === 'company' ? (
                            <button onClick={handleOpenAddModal} type="button" className="btn adbtn btn-dark">
                                <i className="fa-solid fa-plus"></i> Add
                            </button>
                            ) : ""}
                        </div>
                    </div>

                    <SalesDashboardCards
                        totalSalesCount={(data?.statusCounts?.ongoing || 0) + (data?.statusCounts?.PendingfollowUp || 0) + (data?.statusCounts?.notFisible || 0) + (data?.statusCounts?.Win || 0) + (data?.statusCounts?.Lost || 0)}
                        allEnquiriesServiceCount={data?.statusCounts?.allEnquiries || 0}
                        ongoingServiceCount={data?.statusCounts?.ongoing || 0}
                        pendingFollowUpServiceCount={data?.statusCounts?.PendingfollowUp || 0}
                        notFisibleServiceCount={data?.statusCounts?.notFisible || 0}
                        winServiceCount={data?.statusCounts?.Win || 0}
                        lostServiceCount={data?.statusCounts?.Lost || 0}
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
                          name="status"
                          onChange={(e) => handleChange('status', e.target.value)}
                          value={filters.status || ""}
                        >
                          <option value="">Sources....</option>
                          <option value="Direct">Direct</option>
                          <option value="allEnquiries">IndiaMart</option>
                          <option value="Win">TradeIndia</option>
                          <option value="notFisible">Facebook</option>
                          <option value="Ongoing">LinkedIn</option>
                          <option value="Pending">Email</option>
                          <option value="Lost">Google</option>
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
                          <option value="Win">Win</option>
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
                                        <th>Contact Name</th>
                                        <th>Company Name</th>
                                        <th>Product</th>
                                        <th>Email</th>
                                        <th>Date</th>
                                        <th>Sources</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className="broder my-4">
                                    <tr>
                                        <td>1</td>
                                        <td>{sampleLead.name}</td>
                                        <td>{sampleLead.company}</td>
                                        <td>{sampleLead.product}</td>
                                        <td>{sampleLead.email}</td>
                                        <td>{formatDate(sampleLead.date)}</td>
                                        <td>{sampleLead.sources}</td>
                                        <td>
                                            <span className="badge bg-warning text-dark">{sampleLead.status}</span>
                                        </td>
                                        <td>
                                            
                                            {/* Edit Button */}
                                            {(user?.permissions?.includes('updateLeadMaster') || user?.user === 'company') &&
                                                <span onClick={() => handleUpdate(sampleLead)} title="Edit Lead">
                                                    <i className="mx-1 fa-solid fa-pen text-success cursor-pointer"></i>
                                                </span>
                                            }

                                             {/* View Button */}
                                            <span onClick={() => handleDetailsPopUpClick(sampleLead)} title="View Details">
                                                <i className="fa-solid fa-eye cursor-pointer text-primary mx-1"></i>
                                            </span>
                                        
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {isAddModalVisible && (
        <AddLeadMaster onAddLead={handleAddLeadSubmit} onClose={handleCloseAddModal} />
      )}


      {UpdatePopUpShow && selectedLead && (
        <UpdateSalesPopUp
          selectedLead={selectedLead}
          onUpdate={handleUpdateSubmit}
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


      {detailsServicePopUp && selectedLead && (
          <ViewServicePopUp
              closePopUp={() => {
                setDetailsServicePopUp(false);
                setSelectedLead(null);
              }}
              selectedService={selectedLead}
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