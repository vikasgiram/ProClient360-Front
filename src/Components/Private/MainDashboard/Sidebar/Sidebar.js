import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../../../../context/UserContext";



export const Sidebar = ({ isopen, active }) => {
    // const [toggleactive, settoggleactive] = useState("dashboard")
    // const [, set] = useState(false)
    const [Open, setOpen] = useState(false)

    const { user } = useContext(UserContext);



    return (
        <div
            className={
                isopen
                    ? "left-slidebar dark-shadow sidebar-block"
                    : "left-slidebar dark-shadow sidebar-none"
            }
            style={{ width: isopen ? "210px" : "97px" }}
        >
            <div className="navbar-brand-wrapper d-flex align-items-center justify-content-center">
                <span className="navbar-brand brand-logo">
                    <img
                        style={{ width: isopen ? "100%" : "100%" }}
                        src={user.logo || "/static/assets/img/nav/DACCESS.png"}
                        className="logo"
                        alt="logo"
                    />
                </span>




            </div>
            <nav
                className="sidebar  sidebar-offcanvas" id="sidebar"
                style={{ maxHeight: isopen ? "" : " calc(100vh - 150px)" }}
            >
                <ul className="nav d-block">

                    {user?.user === 'company' ? (
                        <li
                            title="Dashboard"
                            className={active === "dashboard" ? " nav-item active" : "nav-item sidebar_item"}>
                            <Link to='/MainDashboard' className="nav-link ">
                                <i className="fa-solid fa-house ps-3 side_icon_fs"></i>
                                <span
                                    className="menu-title_m"
                                    style={{ display: isopen ? "" : "none" }}
                                >
                                    Dashboard
                                </span>
                            </Link>
                        </li>
                    ) : null}





                    {user?.user === 'employee' ? (
                        <li
                            title="Dashboard"
                            className={Open || active === "dashboard" ? " nav-item active" : "nav-item sidebar_item"}>
                            <Link to='/EmployeeMainDashboard' className="nav-link ">
                                {/* <img src="static/assets/img/nav/dashboard.png" className="menu-icon" /> */}
                                <i className="fa-solid fa-house ps-3 side_icon_fs"></i>
                                <span
                                    className="menu-title_m"
                                    style={{ display: isopen ? "" : "none" }}
                                >
                                    Dashboard 
                                </span>
                            </Link>
                        </li>
                    ) : null}

                    {user?.user === 'employee' ? (
                        <>
                            <li
                                title="My Projects"
                                className={Open || active === "EmployeeTaskGrid" ? " nav-item active" : "nav-item sidebar_item"}>
                                <Link to='/EmployeeTaskGrid' className="nav-link ">
                                    <i className="fa-solid fa-bars-progress ps-3 side_icon_fs"></i>

                                    <span
                                        className="menu-title_m"
                                        style={{ display: isopen ? "" : "none" }}
                                    >
                                        My Projects
                                    </span>
                                </Link>
                            </li>
                        
                  

                    <li
                                title="My Service"
                                className={Open || active === "EmployeeMyServiceMasterGrid" ? " nav-item active" : "nav-item sidebar_item"}>
                                <Link to='/EmployeeMyServiceMasterGrid' className="nav-link ">
                                    {/* <i className="fa-solid fa-people-line ps-3 side_icon_fs"></i> */}
                                    <i className="fa-solid fa-envelope ps-3 side_icon_fs"></i>

                                    <span
                                        className="menu-title_m"
                                        style={{ display: isopen ? "" : "none" }}
                                    >
                                        My Service
                                    </span>
                                </Link>
                            </li>
                        </>

                     ): null}

                            
{/* new sales sidebar */}


                    {(user?.permissions?.includes("viewLead") || user?.user === 'company') && 
                    (!user?.permissions?.includes("viewMarketingDashboard") )  ? (
                        <li title="Sales Master"
                            className={active === "SalesMasterGrid" ? "nav-item active" : "nav-item sidebar_item"}>
                            <Link to='/SalesMasterGrid' className="nav-link ">
                                <i className="fa-solid ps-3 fa-chart-pie side_icon_fs"></i>
                                <span
                                    className="menu-title_m"
                                    style={{ display: isopen ? "" : "none" }}
                                >
                                    Sales Master
                                </span>
                            </Link>
                        </li>
                    ) : null}


                    {/* new marketing sidebar */}


                    {user?.permissions?.includes("viewMarketingDashboard") || user?.user === 'company' ? (
                        <li title="Marketing Master"
                            className={active === "MarketingMasterGrid" ? " nav-item active" : "nav-item sidebar_item"}>
                            <Link to='/MarketingMasterGrid' className="nav-link ">
                                <i className="fa-solid ps-3 fa-chart-simple side_icon_fs"></i>
                                <span
                                    className="menu-title_m"
                                    style={{ display: isopen ? "" : "none" }}
                                >
                                    Marketing Master
                                </span>
                            </Link>
                        </li>
                    ) : null}


                            

                    <li
                        title="Ticket Master"
                        className={active === "TicketMasterGrid" ? " nav-item active" : "nav-item sidebar_item"}>
                        <Link to='/TicketMasterGrid' className="nav-link ">
                            {/* <i className="fa-solid fa-circle dic_style  "></i>   */}
                            {/* <i className="fa-brands fa-usps ps-3 side_icon_fs"></i> */}
                            {/* <i className="fa-solid fa-bars-progress ps-3 side_icon_fs"></i> */}
                            <i className="fa-solid fa-ticket ps-3 side_icon_fs"></i>
                            <span
                                className="menu-title_m"
                                style={{ display: isopen ? "" : "none" }}
                            >
                                Ticket Master
                            </span>
                        </Link>
                    </li>

                    {user?.permissions?.includes("viewService") || user?.user === 'company' ? (
                        <li
                            title="Service Master"
                            className={active === "ServiceMasterGrid" ? " nav-item active" : "nav-item sidebar_item"}>
                            <Link to='/ServiceMasterGrid' className="nav-link ">

                                <i className="fa fa-address-card ps-3 side_icon_fs"></i>
                                <span
                                    className="menu-title_m"
                                    style={{ display: isopen ? "" : "none" }}
                                >
                                    Service Master
                                </span>
                            </Link>
                        </li>
                    ) : null}

                    {user?.permissions?.includes("viewEmployee") || user?.user === 'company' ? (
                        <li
                            title="Employee Master"
                            className={active === "EmployeeMasterGrid" ? " nav-item active" : "nav-item sidebar_item"}>
                            <Link to='/EmployeeMasterGrid' className="nav-link ">
                                <i className="fa-solid fa-user-group ps-3 side_icon_fs"></i>

                                <span
                                    className="menu-title_m"
                                    style={{ display: isopen ? "" : "none" }}
                                >
                                    Employee Master
                                </span>
                            </Link>
                        </li>
                    ) : null}

                    {user?.permissions?.includes("viewCustomer") || user?.user === 'company' ? (
                        <li
                            title="Customer Master"
                            className={active === "CustomerMasterGrid" ? " nav-item active" : "nav-item sidebar_item"}>
                            <Link to='/CustomerMasterGrid' className="nav-link ">
                                <i className="fa-solid fa-people-line ps-3 side_icon_fs"></i>

                                <span
                                    className="menu-title_m"
                                    style={{ display: isopen ? "" : "none" }}
                                >
                                    Customer Master
                                </span>
                            </Link>
                        </li>
                    ) : null}

                    <li
                        title="Project Master"
                        className={active === "ProjectMasterGrid" ? " nav-item active" : "nav-item sidebar_item"}>
                        <Link to='/ProjectMasterGrid' className="nav-link ">
                            <i className="fa-solid fa-list-check ps-3 side_icon_fs"></i>


                            <span
                                className="menu-title_m"
                                style={{ display: isopen ? "" : "none" }}
                            >
                                Project Master
                            </span>
                        </Link>
                    </li>

                    {user?.permissions?.includes("viewDepartment") || user?.user === 'company' ? (
                        <li title="Department Master"
                            className={active === "DepartmentMasterGrid" ? " nav-item active" : "nav-item sidebar_item"}>
                            <Link to='/DepartmentMasterGrid' className="nav-link ">
                                <i className="fa-brands fa-medium  ps-3 side_icon_fs"></i>

                                <span
                                    className="menu-title_m"
                                    style={{ display: isopen ? "" : "none" }}
                                >
                                    Department Master
                                </span>
                            </Link>
                        </li>
                    ) : null}

                    {user?.permissions?.includes("viewDesignation") || user?.user === 'company' ? (
                        <li
                            title="Designation Master"
                            className={active === "DesignationMasterGird" ? " nav-item active" : "nav-item sidebar_item"}>
                            <Link to='/DesignationMasterGird' className="nav-link ">
                                {/* <i className="fa-solid fa-circle dic_style  "></i>   */}
                                {/* <i className="fa-solid fa-asterisk ps-3 star_fs" ></i> */}
                                {/* <i className="fa-brands fa-usps ps-3 side_icon_fs"></i> */}
                                <i className="fa-solid fa-diamond ps-3 side_icon_fs"></i>
                                <span
                                    className="menu-title_m"
                                    style={{ display: isopen ? "" : "none" }}
                                >
                                    Designation Master
                                </span>
                            </Link>
                        </li>
                    ) : null}

                    {user?.permissions?.includes("viewTask") || user?.user === 'company' ? (
                        <li
                            title="Task Master"
                            className={active === "TaskMasterGrid" ? " nav-item active" : "nav-item sidebar_item"}>
                            <Link to='/TaskMasterGrid' className="nav-link ">
                                {/* <i className="fa-solid fa-circle dic_style  "></i>   */}
                                {/* <i className="fa-brands fa-usps ps-3 side_icon_fs"></i> */}
                                <i className="fa-solid fa-bars-progress ps-3 side_icon_fs"></i>
                                <span
                                    className="menu-title_m"
                                    style={{ display: isopen ? "" : "none" }}
                                >
                                    Task Master
                                </span>
                            </Link>
                        </li>
                    ) : null}

                    {user?.permissions?.includes('viewFeedback') ? (
                        <li
                            title="Feedback"
                            className={Open || active === "EmployeeFeedbackMasterGrid" ? " nav-item active" : "nav-item sidebar_item"}>
                            <Link to='/EmployeeFeedbackMasterGrid' className="nav-link ">
                                {/* <i className="fa-brands fa-usps ps-3 side_icon_fs"></i> */}
                                {/* <i className="fa-solid fa-user-group ps-3 side_icon_fs"></i> */}
                                <i className="fa-solid fa-comments ps-3 side_icon_fs"></i>

                                <span
                                    className="menu-title_m"
                                    style={{ display: isopen ? "" : "none" }}
                                >
                                    Feedback
                                </span>
                            </Link>
                        </li>
                    ) : ('')}




                    {/* <li className={Report  active === "Master" ? " nav-item active" : "nav-item sidebar_item"}>
 
 
                        <a
                            className="nav-link cursor-pointer"
                            // data-toggle="collapse"  href="#ui-basic1" aria-expanded="false" aria-controls="ui-basic1"
                            onClick={() => { setReport(!Report); setAdminReport(false); SidebarHideShow() }}
                        >
                            <img src="static/assets/img/nav/Master.png" className="menu-icon" />
 
                            <span
                                className="menu-title"
                                style={{ display: is ? "" : "none" }}
                            >
                                Master <i className=" ps-4 fa-solid fa-caret-down"></i>
                            </span>
                        </a>
 
                        <div className={Report ? "collapse show " : "collapse hide"} id="ui-basic1" style={{ height: Report ? '' : '0px' }}>
                            <ul className="nav flex-column sub-menu ">
                                <Link to='/EmployeeMasterGrid' className="nav-link ">
                                    <span style={{ display: is ? "" : "none" }} className="cursor-pointer" >
                                        <li className={subMenu === "DepartmentMaster" ? "nav-item activeli" : "nav-item"}>
                                            <span className={subMenu === "DepartmentMaster" ? "nav-link activeli" : "nav-link"}> <i className="fa-solid fa-circle dic_style ms-3 pe-2"></i>
                                            Employee Master
                                             </span>
                                        </li>
                                    </span>
                                </Link>
 
                                <Link to='/CustomerMasterGrid' className="nav-link ">
                                    <span style={{ display: is ? "" : "none" }} className="cursor-pointer" >
                                        <li className={subMenu === "RoleMaster" ? "nav-item activeli" : "nav-item"}>
                                            <span className={subMenu === "RoleMaster" ? "nav-link activeli" : "nav-link"}><i className="fa-solid fa-circle dic_style ms-3 pe-2"></i>
                                                Customer Master
                                            </span>
                                        </li>
                                    </span>
                                </Link>
 
 
                                <Link to='/ProjectMasterGrid' className="nav-link ">
                                    <span style={{ display: is ? "" : "none" }} className="cursor-pointer" >
                                        <li className={subMenu === "DesignationMaster" ? "nav-item activeli" : "nav-item"}>
                                            <span className={subMenu === "DesignationMaster" ? "nav-link activeli" : "nav-link"}><i className="fa-solid fa-circle dic_style ms-3 pe-2"></i>
                                                Project Master
                                            </span>
                                        </li>
                                    </span>
                                </Link>
 
 
                                <Link to='/DepartmentMasterGrid' className="nav-link ">
                                    <span style={{ display: is ? "" : "none" }} className="cursor-pointer" >
                                        <li className={subMenu === "DesignationMaster" ? "nav-item activeli" : "nav-item"}>
                                            <span className={subMenu === "DesignationMaster" ? "nav-link activeli" : "nav-link"}><i className="fa-solid fa-circle dic_style ms-3 pe-2"></i>
                                                Department Master
                                            </span>
                                        </li>
                                    </span>
                                </Link>
 
                                <Link to='/DesignationMasterGird' className="nav-link ">
                                    <span style={{ display: is ? "" : "none" }} className="cursor-pointer" >
                                        <li className={subMenu === "DesignationMaster" ? "nav-item activeli" : "nav-item"}>
                                            <span className={subMenu === "DesignationMaster" ? "nav-link activeli" : "nav-link"}><i className="fa-solid fa-circle dic_style ms-3 pe-2"></i>
                                                Designation Master
                                            </span>
                                        </li>
                                    </span>
                                </Link>
                                <Link to='/TaskMasterChart' className="nav-link ">
                                    <span style={{ display: is ? "" : "none" }} className="cursor-pointer" >
                                        <li className={subMenu === "EmployeeMaster" ? "nav-item activeli" : "nav-item"}>
                                            <span className={subMenu === "EmployeeMaster" ? "nav-link activeli" : "nav-link"}><i className="fa-solid fa-circle dic_style ms-3 pe-2"></i>
                                            Task Master
                                            </span>
                                        </li>
                                    </span>
                                </Link>
                            </ul>
                        </div>
                    </li> */}



                    {/* <li onClick={() => set(!)}
                        className={  active === "define_department" ? " nav-item active" : "nav-item sidebar_item"}>
                        <Link to='/Master' className="nav-link " >
                            <img src="static/assets/img/nav/report.png" className="menu-icon" />
                            <span
                                className="menu-title"
                                style={{ display: is ? "" : "none" }}
                            >
                                Report
                            </span>
                        </Link>
                    </li> */}




                </ul>
            </nav>
        </div>
    );
}