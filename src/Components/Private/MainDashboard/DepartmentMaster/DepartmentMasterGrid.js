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

  const toggle = () => {
    setIsOpen(!isopen);
  };

  const handleAdd = () => {
    setAddPopUpShow(!AddPopUpShow);
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
    toast.loading("Deleting Department.....")
    const data = await deleteDepartment(selectedId);
    toast.dismiss()
    if (data) {
      handelDeleteClosePopUpClick();
      return toast.success("Department Deleted successfully...");
    }
    toast.error(data.error);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDepartment(); 
        if (data) {
          setDepartments(data.departments || []);
        }
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [AddPopUpShow, deletePopUpShow, updatePopUpShow]);

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
                    {user?.permission?.include('createDepartment') || user.user==='company'?(
                  <div className="col-12 col-lg-6 ms-auto text-end ">
                    <button onClick={handleAdd} type="button" className="btn adbtn btn-dark me-4">
                      <i className="fa-solid fa-plus"></i> Add
                    </button>
                  </div>
                    ):null}
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
                                <td>{index + 1}</td>
                                <td>{department.name}</td>  
                                <td>
                                  {user?.permission?.include('updateDepartment') || user.user==='company'?(
                                  <span onClick={() => handleUpdate(department)} className="update">
                                    <i className="fa-solid fa-pen text-success cursor-pointer me-3"></i>
                                  </span>
                                  ):null}
                                  {user?.permission?.include('deleteDepartment') || user.user==='company'?(
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