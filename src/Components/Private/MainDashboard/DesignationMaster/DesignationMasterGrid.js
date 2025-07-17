import { useState, useContext, useEffect } from "react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import toast from 'react-hot-toast';

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
  const [selectedDepartment, setSelectedDepartment] = useState("");

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
      return toast.success("Designation Deleted successfully...");
    }
    toast.error(data.error);
  };

  const handleChange = (value) => {
    setSelectedDepartment(value);
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

  const displayData = selectedDepartment ? filteredData : designations;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllDesignations(); // Modified to fetch all without pagination
        if (data) {
          setDesignation(data.designations || []);
          setFilteredData(data.designations || []);
        }
      } catch (error) {
        console.error("Error fetching designations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [AddPopUpShow, deletePopUpShow, UpdatePopUpShow]);

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
                        <select 
                          className="form-select bg_edit" 
                          onChange={(e) => handleChange(e.target.value)} 
                          value={selectedDepartment}
                        >
                          <option value="">Select Department</option>
                          {uniqueDepartments.map((department) => (
                            <option key={department._id} value={department._id}>
                              {department.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {user?.permission?.include("createDesignation") || user.user==='company'?(
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
                          {displayData.length > 0 ? (
                            displayData.map((designation, index) => (
                              <tr className="border my-4" key={designation._id}>
                                <td>{index + 1}</td>
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