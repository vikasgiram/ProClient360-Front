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
    const [filteredData, setFilteredData] = useState([]);


    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const itemsPerPage = 10; 

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
        toast.loading("Deleting Task.....")
        const data = await deleteTask(selectedId);
        toast.dismiss()
        if (data) {
            handelDeleteClosePopUpClick();
        }

    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const allTasks = await getTask();
                if (allTasks) {
                    setTasks(allTasks.task);
                    setFilteredData(allTasks.task);
                    setLoading(false);
                }
            } catch (error) {
                console.log(error)
                setLoading(false);
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [AddPopUpShow, deletePopUpShow, updatePopUpShow]);

    // console.log(tasks,"tasks");

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Total pages
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);


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
                                                    <input type="text"
                                                        value={searchText}
                                                        onChange={(e) => {
                                                            const newSearchText = e.target.value;
                                                            setSearchText(newSearchText);

                                                            // Filter tasks as the search text changes
                                                            const filtered = tasks.filter((task) =>
                                                                task.name.toLowerCase().includes(newSearchText.toLowerCase())
                                                            );
                                                            setFilteredData(filtered);
                                                        }}
                                                        className="form-control form-input bg-transparant"
                                                        placeholder="Search ..." />
                                                </div>
                                            </div>


                                                {user?.permission?.includes('createTask') || user.user === 'company' ? (
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
                                                            <td>{ index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                                            <td className="align_left_td td_width">{task.name}</td>

                                                            <td>
                                                                {user?.permission?.includes('updateTask') || user.user === 'company' ? (
                                                                <span
                                                                    onClick={() => handleUpdate(task)}

                                                                    className="update">
                                                                    <i className="fa-solid fa-pen text-success me-3 cursor-pointer"></i>
                                                                </span>
                                                                ) : null}

                                                                {user?.permission?.includes('deleteTask') || user.user === 'company' ? (
                                                                <span
                                                                    onClick={() => handelDeleteClosePopUpClick(task._id)}
                                                                    className="delete">
                                                                    <i className="fa-solid fa-trash text-danger cursor-pointer"></i>
                                                                </span>
                                                                ) : null}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {filteredData.length === 0 && (<p>No data found</p>)}
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                </div>


                            {/*  Full Pagination */}
                            {!loading && totalPages > 1 && ( 
                                    <div className="pagination-container text-center my-3">
                                        {/* First button */}
                                        <button
                                            onClick={() => handlePageChange(1)}
                                            disabled={currentPage <= 1}
                                            className="btn btn-dark btn-sm me-1"
                                            style={{ borderRadius: "4px" }}
                                            aria-label="First Page"
                                        >
                                            First
                                        </button>

                                        {/* Previous button */}
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage <= 1}
                                            className="btn btn-dark btn-sm me-1"
                                            style={{ borderRadius: "4px" }}
                                            aria-label="Previous Page"
                                        >
                                            Previous
                                        </button>

                                        {/* Page numbers 5 */}
                                        {(() => {
                                            const pageNumbers = [];
                                            const maxPagesToShow = 5;

                                            if (totalPages <= maxPagesToShow) {
                                                // Case 1: Total pages is 5 or less - show all
                                                for (let i = 1; i <= totalPages; i++) {
                                                    pageNumbers.push(i);
                                                }
                                            } else {
                                                // Case 2: Total pages is more than 5
                                                let startPage, endPage;
                                                if (currentPage <= 3) {
                                                    // Near the beginning: 1, 2, 3, 4, 5
                                                    startPage = 1;
                                                    endPage = maxPagesToShow;
                                                } else if (currentPage >= totalPages - 2) {
                                                    // Near the end: last 5 pages
                                                    startPage = totalPages - maxPagesToShow + 1;
                                                    endPage = totalPages;
                                                } else {
                                                    // In the middle: current +/- 2
                                                    startPage = currentPage - 2;
                                                    endPage = currentPage + 2;
                                                }
                                                // Ensure start/end are within bounds (redundant check for safety)
                                                startPage = Math.max(1, startPage);
                                                endPage = Math.min(totalPages, endPage);

                                                for (let i = startPage; i <= endPage; i++) {
                                                    pageNumbers.push(i);
                                                }
                                            }

                                            // Render the calculated page number buttons
                                            return pageNumbers.map((number) => (
                                                <button
                                                    key={number}
                                                    onClick={() => handlePageChange(number)}
                                                    className={`btn btn-sm me-1 ${
                                                        currentPage === number ? "btn-primary" : "btn-dark"
                                                    }`}
                                                    style={{ minWidth: "35px", borderRadius: "4px" }}
                                                    aria-label={`Go to page ${number}`}
                                                    aria-current={currentPage === number ? 'page' : undefined}
                                                >
                                                    {number}
                                                </button>
                                            ));
                                        })()}

                                        {/* Next button */}
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage >= totalPages}
                                            className="btn btn-dark btn-sm me-1"
                                            style={{ borderRadius: "4px" }}
                                            aria-label="Next Page"
                                        >
                                            Next
                                        </button>

                                        {/* Last button */}
                                        <button
                                            onClick={() => handlePageChange(totalPages)}
                                            disabled={currentPage >= totalPages}
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