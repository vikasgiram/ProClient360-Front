import React, { useState } from "react";
import { Link } from "react-router-dom";
import $ from 'jquery'
import { useTranslation } from "react-i18next";


export const AdminSidebar = ({ isopen, active, subMenu }) => {
 
    const [Open, setOpen] = useState(false)

    var body = $('body');

    const SidebarHideShow = () => {
        if ((body.hasClass('sidebar-icon-only'))) {
            body.toggleClass('sidebar-icon-only');
        }
        // else {
        //     body.toggleClass('sidebar-icon-only');
        // }
    }

    const handelOnCardClick = () => {

        body.toggleClass('sidebar-icon-only');
    }

    const { t } = useTranslation()

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
                        src="static/assets/img/nav/DACCESS.png"
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


                    <li
                        title="Dashboard"
                        className={Open || active === "AdminMainDashboard" ? " nav-item active" : "nav-item sidebar_item"}>
                        <Link to='/AdminMainDashboard' className="nav-link ">
                            <img src="static/assets/img/nav/dashboard.png" className="menu-icon" />
                            <span
                                className="menu-title"
                                style={{ display: isopen ? "" : "none" }}
                            >
                                Dashboard
                            </span>
                        </Link>
                    </li>

                    <li
                        title="Company"
                        className={Open || active === "AdminCompanyMasterGrid" ? " nav-item active" : "nav-item sidebar_item"}>
                        <Link to='/AdminCompanyMasterGrid' className="nav-link ">
                            <i class="fa-brands fa-medium  ps-3 side_icon_fs"></i>
                            <span
                                className="menu-title_m"
                                style={{ display: isopen ? "" : "none" }}
                            >
                                Company
                            </span>
                        </Link>
                    </li>

                    <li
                        title="Admin"
                        className={Open || active === "AdminmasterGrid" ? " nav-item active" : "nav-item sidebar_item"}>
                        <Link to='/AdminmasterGrid' className="nav-link ">
                            <i class="fa-solid fa-user-tie ps-3 side_icon_fs"></i>
                            <span
                                className="menu-title_m"
                                style={{ display: isopen ? "" : "none" }}
                            >
                                Admin
                            </span>
                        </Link>
                    </li>


                    {/* <li
                        className={Open || active === "ProjectMasterGrid" ? " nav-item active" : "nav-item sidebar_item"}>
                        <Link to='/ProjectMasterGrid' className="nav-link ">

                            <span
                                className="menu-title_m"
                                style={{ display: isopen ? "" : "none" }}
                            >
                                Project Master
                            </span>
                        </Link>
                    </li> */}

                    {/* 
                    <li
                        className={Open || active === "DepartmentMasterGrid" ? " nav-item active" : "nav-item sidebar_item"}>
                        <Link to='/DepartmentMasterGrid' className="nav-link ">
                            <i className="fa-brands fa-usps ps-3 side_icon_fs"></i>

                            <span
                                className="menu-title_m"
                                style={{ display: isopen ? "" : "none" }}
                            >
                                Department Master
                            </span>
                        </Link>
                    </li> */}


                    {/* <li
                        className={Open || active === "DesignationMasterGird" ? " nav-item active" : "nav-item sidebar_item"}>
                        <Link to='/DesignationMasterGird' className="nav-link ">
                            <i className="fa-brands fa-usps ps-3 side_icon_fs"></i>
                            <span
                                className="menu-title_m"
                                style={{ display: isopen ? "" : "none" }}
                            >
                                Designation Master
                            </span>
                        </Link>
                    </li> */}


                    {/* <li
                        className={Open || active === "TaskMasterGrid" ? " nav-item active" : "nav-item sidebar_item"}>
                        <Link to='/TaskMasterGrid' className="nav-link ">
                            <i className="fa-brands fa-usps ps-3 side_icon_fs"></i>

                            <span
                                className="menu-title_m"
                                style={{ display: isopen ? "" : "none" }}
                            >
                                Task Master
                            </span>
                        </Link>
                    </li> */}



                </ul>
            </nav>
        </div>
    );
}
