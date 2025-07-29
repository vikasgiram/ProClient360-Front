import { useState, useContext, useEffect } from "react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import AddTaskPopUp from "./PopUp/AddTaskPopUp";
import DeletePopUP from "../../CommonPopUp/DeletePopUp";
import UpdateTaskPopUp from "./PopUp/UpdateTaskPopUp";

import { UserContext } from "../../../../context/UserContext";

import { getTask, deleteTask } from "../../../../hooks/useTask";
import toast from "react-hot-toast";


export const TaskMasterGrid = () => {


    const { user } = useContext(UserContext);

    const [isopen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isopen);
    };
 

    const [AddPopUpShow, setAddPopUpShow] = useState(false)
    const [deletePopUpShow, setdeletePopUpShow] = useState(false)
    const [selectedId, setSelecteId] = useState(null);
    const [updatePopUpShow, setUpdatePopUpShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [search, setSearch] = useState("");

    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalTasks: 0,
        limit: 20,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const itemsPerPage = 20; 

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    

    const handleAdd = () => {
        setAddPopUpShow(!AddPopUpShow)
    }

    const handleUpdate = (task = null) => {
        setSelectedTask(task);
        setUpdatePopUpShow((prevState) => !prevState);  // Toggle based on previous state
    };



    const handelDeleteClosePopUpClick = (id) => {
        setSelecteId(id);
        setdeletePopUpShow(!deletePopUpShow);
    }

    const handelDeleteClick = async () => {
        toast.loading("Deleting Task...")
        const data = await deleteTask(selectedId);
        toast.dismiss()
        if (data?.success) {
            handelDeleteClosePopUpClick();
            setCurrentPage(1); // Reset to page 1 after deletion
            toast.success(data?.message);
        }else {
            toast.error(data?.error);
        }

    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getTask(currentPage, itemsPerPage, search);
                if (data?.success) {
                    setTasks(data.task || []);
                    setPagination(data.pagination || {
                        currentPage: 1,
                        totalPages: 0,
                        totalTasks: 0,
                        limit: itemsPerPage,
                        hasNextPage: false,
                        hasPrevPage: false,
                    });
                } else {
                    toast(data?.error);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
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
    };

    const pageButtons = [];
    for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(i);
    }

    // console.log(tasks,"tasks");
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = tasks;


    return (
        <>
            {loading && (
                <div className="overlay">
                    <span className="loader"></span>
                </div>
            )}
            <div className="container-scroller">
                <div className="row background_main_all">
                    <Header
                        toggle={toggle} isopen={isopen} />
                    <div className="container-fluid page-body-wrapper">
                        <Sidebar isopen={isopen} active="TaskMasterGrid" />
                        <div className="main-panel" style={{ width: isopen ? "" : "calc(100%  - 120px )", marginLeft: isopen ? "" : "125px" }}>
                            <div className="content-wrapper ps-3 ps-md-0 pt-3">

                                <div className="row px-2 py-1   ">

                                    <div className="col-12 col-lg-4">
                                        <h5 className="text-white py-2">
                                            Task Master
                                        </h5>
                                    </div>


                                    <div className="col-12 col-lg-4 ms-auto  ">
                                        <div className="row">

                                            <div className="col-4 col--md-6 col-lg-8">
                                                <div className="form">
                                                    <i className="fa fa-search"></i>
                                                    <form onSubmit={handleOnSearchSubmit}>
                                                        <input type="text"
                                                            value={searchText}
                                                            onChange={(e) => setSearchText(e.target.value)}
                                                            className="form-control form-input bg-transparant"
                                                            placeholder="Search ..." />
                                                    </form>
                                                </div>
                                            </div>


                                                {user?.permissions?.includes('createTask') || user.user === 'company' ? (
                                            <div className="col-4 col-lg-4 ms-auto text-end ">
                                                <button
                                                    onClick={() => {
                                                        handleAdd()
                                                    }}
                                                    type="button"
                                                    className="btn adbtn btn-dark me-4"> <i className="fa-solid fa-plus"></i> Add
                                                </button>
                                            </div>
                                                ) : null}
                                        </div>
                                    </div>
                                </div>



                                <div className="row  bg-white p-2 m-1 border rounded" >
                                    <div className="col-12 py-2">

                                        <div className="table-responsive">
                                            <table className="table table-striped table-class" id="table-id">
                                               <thead>
                                                <tr className="th_border my-4">
                                                    <th>SR. NO</th>
                                                    <th className="align_left_td td_width">TASK NAME</th>
                                                    <th>ACTION</th>
                                                </tr>
                                               </thead>
                                                <tbody className="broder my-4">
                                                    {currentData && currentData.map((task, index) => (
                                                        <tr className="border my-4" key={task._id}>
                                                            <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                                            <td className="align_left_td td_width">{task.name}</td>

                                                            <td>
                                                                {user?.permissions?.includes('updateTask') || user.user === 'company' ? (
                                                                <span
                                                                    onClick={() => handleUpdate(task)}

                                                                    className="update">
                                                                    <i className="fa-solid fa-pen text-success me-3 cursor-pointer"></i>
                                                                </span>
                                                                ) : null}

                                                                {user?.permissions?.includes('deleteTask') || user.user === 'company' ? (
                                                                <span
                                                                    onClick={() => handelDeleteClosePopUpClick(task._id)}
                                                                    className="delete">
                                                                    <i className="fa-solid fa-trash text-danger cursor-pointer"></i>
                                                                </span>
                                                                ) : null}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {tasks.length === 0 && (
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


                            {/*  Pagination */}
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
            {/* )} */}


            {
                deletePopUpShow ?
                    <DeletePopUP
                        message={'if you delete this task then all the related Tasksheet will be deleted.'}
                        cancelBtnCallBack={handelDeleteClosePopUpClick}
                        confirmBtnCallBack={handelDeleteClick}
                        heading="Delete"
                    /> : <></>
            }


            {AddPopUpShow ?
                <AddTaskPopUp

                    handleAdd={handleAdd}
                // heading="Forward"
                cancelBtnCallBack={handleAdd}
                /> : <></>
            }


            {updatePopUpShow ?
                <UpdateTaskPopUp
                    selectedTask={selectedTask} 
                    handleUpdate={handleUpdate}
                // heading="Forward"
                // cancelBtnCallBack={handleAddDepartment}
                /> : <></>
            }


        </>
    )
}