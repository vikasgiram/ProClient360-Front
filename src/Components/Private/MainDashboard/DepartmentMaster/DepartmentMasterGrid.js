import { useState, useContext, useEffect } from "react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import toast from 'react-hot-toast';

import { getDepartment, deleteDepartment } from "../../../../hooks/useDepartment";
import AddDepartmentPopup from "./PopUp/AddDepartmentPopup";
import UpdateDepartmentPopup from "./PopUp/UpdateDepartmentPopup";
import DeletePopUP from "../../CommonPopUp/DeletePopUp";
import { UserContext } from "../../../../context/UserContext";

export const DepartmentMasterGrid = () => {
  const { user } = useContext(UserContext);

  const [AddPopUpShow, setAddPopUpShow] = useState(false);
  const [updatePopUpShow, setUpdatePopUpShow] = useState(false);
  const [deletePopUpShow, setdeletePopUpShow] = useState(false);
  const [isopen, setIsOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedId, setSelecteId] = useState(null);
  const [selectedDep, setSelectedDep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalDepartments: 0,
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

  const handleUpdate = (department = null) => {
    setSelectedDep(department);
    setUpdatePopUpShow(!updatePopUpShow);
  };

  const handelDeleteClosePopUpClick = (id) => {
    setSelecteId(id);
    setdeletePopUpShow(!deletePopUpShow);
  };

  const handelDeleteClick = async () => {
    const data = await deleteDepartment(selectedId);
    if (data) {
      handelDeleteClosePopUpClick();
      setCurrentPage(1); // Reset to page 1 after deletion
      return toast.success("Department Deleted successfully...");
    }
    toast.error(data.error);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDepartment(currentPage, itemsPerPage, search); 
        if (data.success) {
          setDepartments(data.departments || []);
          setPagination(data.pagination || {
            currentPage: 1,
            totalPages: 0,
            totalDepartments: 0,
            limit: itemsPerPage,
            hasNextPage: false,
            hasPrevPage: false,
          });
        } else {
          toast.error(data.error || "Failed to fetch departments");
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, AddPopUpShow, deletePopUpShow, updatePopUpShow, search]);

  // Pagination button rendering logic
  const maxPageButtons = 5; // Maximum number of page buttons to display
  const halfMaxButtons = Math.floor(maxPageButtons / 2);
  let startPage = Math.max(1, currentPage - halfMaxButtons);
  let endPage = Math.min(pagination.totalPages, startPage + maxPageButtons - 1);

  // Adjust startPage if endPage is at the totalPages
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  const handleOnSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Search text:", searchText);
    setSearch(searchText);
    setCurrentPage(1); // Reset to page 1 when searching
  };

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
            <Sidebar isopen={isopen} active="DepartmentMasterGrid" />
            <div
              className="main-panel"
              style={{
                width: isopen ? "" : "calc(100% - 120px)",
                marginLeft: isopen ? "" : "125px",
              }}
            >
              <div className="content-wrapper ps-3 ps-md-0 pt-3">
                <div className="row px-2 py-1">
                  <div className="col-12 col-lg-6">
                    <h5 className="text-white py-2">Department Master</h5>
                  </div>
                  <div className="col-12 col-lg-5 ms-auto">
                    <div className="row">
                      <div className="col-8 col-lg-6 ms-auto text-end">
                        <div className="form">
                          <i className="fa fa-search"></i>
                          <form onSubmit={handleOnSearchSubmit}>
                          <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="form-control form-input bg-transparant"
                            placeholder="Search ..."
                          />
                          </form>
                        </div>
                      </div>
                      {user?.permissions?.includes('createDepartment') || user.user==='company' ? ( 
                      <div className="col- col-lg-2 ms-auto text-end me-4">
                          <div className="col-12 col-lg-12  ms-auto text-end">
                            <button
                              onClick={handleAdd}
                              type="button"
                              className="btn adbtn btn-dark"
                            >
                              {" "}
                              <i className="fa-solid fa-plus"></i> Add
                            </button>
                          </div>
                      </div>
                        ) : (
                          null
                        )}
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
                            <th>Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="broder my-4">
                          {departments.length > 0 ? (
                            departments.map((department, index) => (
                              <tr className="border my-4" key={department._id}>
                                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                <td>{department.name}</td>  
                                <td>
                                  {user?.permissions?.includes('updateDepartment') || user.user==='company'?(
                                  <span onClick={() => handleUpdate(department)} className="update">
                                    <i className="fa-solid fa-pen text-success cursor-pointer me-3"></i>
                                  </span>
                                  ):null}
                                  {user?.permissions?.includes('deleteDepartment') || user.user==='company'?(
                                  <span onClick={() => handelDeleteClosePopUpClick(department._id)} className="delete">
                                    <i className="mx-1 fa-solid fa-trash text-danger cursor-pointer"></i>
                                  </span>
                                  ):null}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" className="text-center">
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

      {updatePopUpShow ? (
        <UpdateDepartmentPopup selectedDep={selectedDep} handleUpdate={handleUpdate} />
      ) : null}

      {AddPopUpShow && <AddDepartmentPopup message="Create New Employee" handleAdd={handleAdd} />}
    </>
  );
};