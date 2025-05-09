import { useState, useContext, useEffect } from "react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import { toast } from "react-toastify";

import AddDesignationPopup from "./Popup/AddDesignationPopup";
import UpdateDesignationPopup from "./Popup/UpdateDesignationPopup";
import DeletePopUP from "../../CommonPopUp/DeletePopUp";
import {
  getAllDesignations,
  deleteDesignation,
} from "../../../../hooks/useDesignation";
import { UserContext } from "../../../../context/UserContext";

export const DesignationMasterGird = () => {

  const { user } = useContext(UserContext);

  const [AddPopUpShow, setAddPopUpShow] = useState(false);
  const [deletePopUpShow, setdeletePopUpShow] = useState(false);
  const [UpdatePopUpShow, setUpdatePopUpShow] = useState(false);
  const [isopen, setIsOpen] = useState(false);

  const [selectedId, setSelecteId] = useState(null);
  const [selectedDes, setSelectedDes] = useState(null);

  const [designations, setDesignation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalDesignations: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const itemsPerPage = 10;

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const toggle = () => {
    setIsOpen(!isopen);
  };

  const handleAdd = () => {
    setAddPopUpShow(!AddPopUpShow);
  };

  const handelDeleteClosePopUpClick = (id) => {
    setSelecteId(id);
    setdeletePopUpShow(!deletePopUpShow);
  };

  const handleUpdate = (designation = null) => {
    setSelectedDes(designation);
    setUpdatePopUpShow(!UpdatePopUpShow);
  };

  const handelDeleteClick = async () => {
    const data = await deleteDesignation(selectedId);
    if (data) {
      handelDeleteClosePopUpClick();
      return toast.success("Designation Deleted sucessfully...");
    }
    toast.error(data.error);
  };

  const handleChange = (value) => {
    if (value) {
      const filtered = designations.filter((designation) => designation.department._id === value);
      setFilteredData(filtered);
    } else {
      setFilteredData(designations);
    }
  };

  const uniqueDepartments = designations.reduce((acc, designation) => {
    const departmentId = designation.department._id;
    if (!acc.some((dept) => dept._id === departmentId)) {
      acc.push(designation.department);
    }
    return acc;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllDesignations(pagination.currentPage, itemsPerPage);
        if (data) {
          setDesignation(data.designations || []);
          setFilteredData(data.designations || []);
          setPagination(data.pagination || {
            currentPage: 1,
            totalPages: 0,
            totalDesignations: 0,
            limit: itemsPerPage,
            hasNextPage: false,
            hasPrevPage: false,
          });
        }
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pagination.currentPage, AddPopUpShow, deletePopUpShow, UpdatePopUpShow]);

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
              style={{ width: isopen ? "" : "calc(100%  - 120px )", marginLeft: isopen ? "" : "125px" }}
            >
              <div className="content-wrapper ps-3 ps-md-0 pt-3">
                <div className="row px-2 py-1">
                  <div className="col-12 col-lg-6">
                    <h5 className="text-white py-2">Designation Master</h5>
                  </div>
                  <div className="col-12 col-lg-5 ms-auto text-end">
                    <div className="row">
                      <div className="col-4 col-lg-6 ms-auto">
                        <select className="form-select bg_edit" onChange={(e) => handleChange(e.target.value)}>
                          <option value="">Select Department</option>
                          {uniqueDepartments.map((department) => (
                            <option key={department._id} value={department._id}>
                              {department.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-8 col-lg-2 ms-auto me-4">
                        {user?.permission?.include("createDesignation") || user.user==='company'?(
                        <button onClick={handleAdd} type="button" className="btn adbtn btn-dark ">
                          <i className="fa-solid fa-plus"></i> Add
                        </button>
                        ):null}
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
                            <th>Department Name</th>
                            <th>Designation</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="broder my-4">
                          {filteredData.length > 0 ? (
                            filteredData.map((designation, index) => (
                              <tr className="border my-4" key={designation._id}>
                                <td>{index + 1 + (pagination.currentPage - 1) * itemsPerPage}</td>
                                <td>{designation.department.name}</td>
                                <td>{designation.name}</td>
                                <td>
                                  {user?.permission?.include("updateDesignation") || user.user==='company'?(
                                  <span onClick={() => handleUpdate(designation)} className="update">
                                    <i className="fa-solid fa-pen text-success cursor-pointer me-3"></i>
                                  </span>
                                  ):null}
                                  {user?.permission?.include("deleteDesignation") || user.user==='company'?(
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

                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={index}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`btn btn-sm me-1 ${
                            pagination.currentPage === pageNumber ? "btn-primary" : "btn-dark"
                          }`}
                          style={{ minWidth: "35px", borderRadius: "4px" }}
                          aria-label={`Go to page ${pageNumber}`}
                          aria-current={pagination.currentPage === pageNumber ? "page" : undefined}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

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

      {AddPopUpShow && <AddDesignationPopup handleAdd={handleAdd} />}
      {UpdatePopUpShow && (
        <UpdateDesignationPopup selectedDes={selectedDes} handleUpdate={handleUpdate} />
      )}
    </>
  );
};
