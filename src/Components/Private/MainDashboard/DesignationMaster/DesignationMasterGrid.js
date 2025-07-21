import { useState, useContext, useEffect, useCallback } from "react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import toast from 'react-hot-toast';
import Select from "react-select";

import AddDesignationPopup from "./Popup/AddDesignationPopup";
import UpdateDesignationPopup from "./Popup/UpdateDesignationPopup";
import DeletePopUP from "../../CommonPopUp/DeletePopUp";
import {
  getAllDesignations,
  deleteDesignation,
} from "../../../../hooks/useDesignation";
import { UserContext } from "../../../../context/UserContext";
import { getDepartment } from "../../../../hooks/useDepartment";

const PAGE_SIZE = 10;

export const DesignationMasterGird = () => {
  const { user } = useContext(UserContext);

  const [AddPopUpShow, setAddPopUpShow] = useState(false);
  const [deletePopUpShow, setdeletePopUpShow] = useState(false);
  const [UpdatePopUpShow, setUpdatePopUpShow] = useState(false);
  const [isopen, setIsOpen] = useState(false);

  const [selectedId, setSelecteId] = useState(null);
  const [selectedDes, setSelectedDes] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  
  // Department filter dropdown state
  const [deptFilterOptions, setDeptFilterOptions] = useState([]);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState(null);
  const [deptFilterPage, setDeptFilterPage] = useState(1);
  const [deptFilterHasMore, setDeptFilterHasMore] = useState(true);
  const [deptFilterLoading, setDeptFilterLoading] = useState(false);
  const [deptFilterSearch, setDeptFilterSearch] = useState("");
  
  const [designations, setDesignation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalDesignations: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const itemsPerPage = 10;

  const toggle = () => {
    setIsOpen(!isopen);
  };

  const handleAdd = () => {
    setAddPopUpShow(!AddPopUpShow);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handelDeleteClosePopUpClick = (id) => {
    setSelecteId(id);
    setdeletePopUpShow(!deletePopUpShow);
  };

  const handleUpdate = (designation = null) => {
    setSelectedDes(designation);
    setUpdatePopUpShow(!UpdatePopUpShow);
  };

  // Fetch departments with pagination & search for filter dropdown
  const loadDepartmentsFilter = useCallback(async (page, search) => {
    if (deptFilterLoading || !deptFilterHasMore) return;
    setDeptFilterLoading(true);
    const data = await getDepartment(page, PAGE_SIZE, search);

    if (data.error) {
      toast(data.error || 'Failed to load departments');
      setDeptFilterLoading(false);
      return;
    }

    const newOpts = (data.departments || []).map(d => ({ value: d.name, label: d.name }));
    setDeptFilterOptions(prev => page === 1 ? newOpts : [...prev, ...newOpts]);
    setDeptFilterHasMore(newOpts.length === PAGE_SIZE);
    setDeptFilterLoading(false);
    setDeptFilterPage(page + 1);
  }, [deptFilterLoading, deptFilterHasMore]);

  // Initial & search-triggered load for department filter (reset on search)
  useEffect(() => {
    setDeptFilterPage(1);
    setDeptFilterHasMore(true);
    setDeptFilterOptions([]);
    loadDepartmentsFilter(1, deptFilterSearch);
  }, [deptFilterSearch]);

  const handelDeleteClick = async () => {
    const data = await deleteDesignation(selectedId);
    if (data) {
      handelDeleteClosePopUpClick();
      setCurrentPage(1); // Reset to page 1 after deletion
      return toast.success("Designation Deleted successfully...");
    }
    toast.error(data.error);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllDesignations(currentPage, itemsPerPage, selectedDeptFilter?.value || "");
        if (data.success) {
          setDesignation(data.designations || []);
          setPagination(data.pagination || {
            currentPage: 1,
            totalPages: 0,
            totalDesignations: 0,
            limit: itemsPerPage,
            hasNextPage: false,
            hasPrevPage: false,
          });
        }
        else {
          toast(data.error || "Failed to fetch designations");
        }
      } catch (error) {
        console.error("Error fetching designations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, AddPopUpShow, deletePopUpShow, UpdatePopUpShow, selectedDeptFilter]);    

  // Pagination button rendering logic
  const maxPageButtons = 5; // Maximum number of page buttons to display
  const halfMaxButtons = Math.floor(maxPageButtons / 2);
  let startPage = Math.max(1, currentPage - halfMaxButtons);
  let endPage = Math.min(pagination.totalPages, startPage + maxPageButtons - 1);

  // Adjust startPage if endPage is at the totalPages
   if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  
  const pageButtons = [];
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(i);
  }

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
            <Sidebar isopen={isopen} active="DesignationMasterGird" />
            <div
              className="main-panel"
              style={{ width: isopen ? "" : "calc(100% - 120px)", marginLeft: isopen ? "" : "125px" }}
            >
              <div className="content-wrapper ps-3 ps-md-0 pt-3">
                <div className="row px-2 py-1">
                  <div className="col-12 col-lg-6">
                    <h5 className="text-white py-2">Designation Master</h5>
                  </div>
                  <div className="col-12 col-lg-5 ms-auto text-end">
                    <div className="row">
                      <div className="col-4 col-lg-6 ms-auto">
                        <Select
                          options={deptFilterOptions}
                          value={selectedDeptFilter}
                          onChange={opt => {
                            setSelectedDeptFilter(opt);
                            setCurrentPage(1); // Reset to page 1 when department changes
                          }}
                          onInputChange={val => setDeptFilterSearch(val)}
                          onMenuScrollToBottom={() => loadDepartmentsFilter(deptFilterPage, deptFilterSearch)}
                          isLoading={deptFilterLoading}
                          placeholder="Filter by department..."
                          noOptionsMessage={() => deptFilterLoading ? 'Loading...' : 'No departments'}
                          closeMenuOnSelect={true}
                          isClearable={true}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              backgroundColor: '#333',
                              borderColor: '#555',
                              color: '#fff',
                            }),
                            menu: (provided) => ({
                              ...provided,
                              backgroundColor: '#333',
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor: state.isFocused ? '#555' : '#333',
                              color: '#fff',
                            }),
                            singleValue: (provided) => ({
                              ...provided,
                              color: '#fff',
                            }),
                            placeholder: (provided) => ({
                              ...provided,
                              color: '#aaa',
                            }),
                          }}
                        />
                      </div>
                      {user?.permissions?.includes("createDesignation") || user.user==='company'?(
                        <div className="col-8 col-lg-2 ms-auto me-4">
                          <button onClick={handleAdd} type="button" className="btn adbtn btn-dark">
                            <i className="fa-solid fa-plus"></i> Add
                          </button>
                        </div>
                      ):null}
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
                            <th>Department Name</th>
                            <th>Designation</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="broder my-4">
                          {designations.length > 0 ? (
                            designations.map((designation, index) => (
                              <tr className="border my-4" key={designation._id}>
                                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                <td>{designation.department.name}</td>
                                <td>{designation.name}</td>
                                <td>
                                  {user?.permissions?.includes("updateDesignation") || user.user==='company'?(
                                    <span onClick={() => handleUpdate(designation)} className="update">
                                      <i className="fa-solid fa-pen text-success cursor-pointer me-3"></i>
                                    </span>
                                  ):null}
                                  {user?.permissions?.includes("deleteDesignation") || user.user==='company'?(
                                    <span onClick={() => handelDeleteClosePopUpClick(designation._id)} className="delete">
                                      <i className="mx-1 fa-solid fa-trash text-danger cursor-pointer"></i>
                                    </span>
                                  ):null}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center">
                                No data found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="pagination-container text-center my-3 sm">
                  <button
                    disabled={!pagination.hasPrevPage}
                    onClick={() => handlePageChange(1)}
                    className="btn btn-dark btn-sm me-2"
                  >
                    First
                  </button>
                  <button
                    disabled={!pagination.hasPrevPage}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="btn btn-dark btn-sm me-2"
                  >
                    Previous
                  </button>
                  {startPage > 1 && <span className="mx-2">...</span>}


                  {/* {pageButtons.map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`btn btn-dark btn-sm me-2 ${
                        currentPage === page ? "active" : ""
                      }`}
                    >
                      {page}
                    </button>
                  ))} */}


                  {pageButtons.map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`btn btn-sm me-1 ${ 
                        pagination.currentPage === page ? "btn-primary" : "btn-dark"
                      }`}
                    >
                      {page}
                    </button>
                  ))}


                  {endPage < pagination.totalPages && <span className="mx-2">...</span>}
                  <button
                    disabled={!pagination.hasNextPage}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="btn btn-dark btn-sm me-2"
                  >
                    Next
                  </button>
                  <button
                    disabled={!pagination.hasNextPage}
                    onClick={() => handlePageChange(pagination.totalPages)}
                    className="btn btn-dark btn-sm"
                  >
                    Last
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {deletePopUpShow && (
        <DeletePopUP
          message={"Are you sure! Do you want to Delete?"}
          cancelBtnCallBack={handelDeleteClosePopUpClick}
          confirmBtnCallBack={handelDeleteClick}
          heading="Delete"
        />
      )}

      {AddPopUpShow && <AddDesignationPopup handleAdd={handleAdd} />}
      {UpdatePopUpShow && (
        <UpdateDesignationPopup selectedDes={selectedDes} handleUpdate={handleUpdate} />
      )}
    </>
  );
};