import { useState } from "react";
import { Header } from "../../Header/Header";
import { Sidebar } from "../../Sidebar/Sidebar";



export const Master = () => {
    const [isopen, setIsOpen] = useState(false);



    const toggle = () => {
        setIsOpen(!isopen);
    };
    return (
        <>
            {/* <div className="wrapper"> */}
            <div className="container-scroller">
                <Header
                    toggle={toggle} isopen={isopen} />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar isopen={isopen} active="dashboard" />
                    <div className="main-panel" style={{ width: isopen ? "" : "calc(100%  - 120px )", marginLeft: isopen ? "" : "130px" }}>
                        <div className="content-wrapper shadow p-3 rounded">

                            <div className="row">
                                <div className="col-12">
                                    <h5 className="fw-bold heading_text">Report</h5>

                                </div>

                            </div>
                            <div className="row" >
                                <div className="col-12  " >
                                    <div className="table-responsive pt-3">
                                        <table className="table table-striped table-bordered">
                                            <thead>
                                                <tr>
                                                    <th className="w-6 px-3">Sr. No.</th>
                                                    <th>Tree UID  </th>
                                                    <th>Tree Variety  </th>
                                                    <th>Tree Tree variety</th>
                                                    <th>Botanical Name </th>
                                                    <th>Family Name</th>
                                                    <th>Actions</th>
                                                </tr>

                                            </thead>
                                            <tbody>

                                                <tr>
                                                    <td className="py-1" align="center">1</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>

                                                    <td className="text-center">
                                                        <i className="fa-solid fa-pen-to-square mx-2 text-success cursor-pointer"
                                                        // onClick={() => {
                                                        //   seteditPopUpShow(true)
                                                        // }}
                                                        >

                                                        </i>

                                                        <i className="fa-solid fa-trash mx-2 text-danger fs-7 cursor-pointer"
                                                            //  onClick={() => {
                                                            //   setdeletePopUpShow(true)
                                                            // }}
                                                            title="Delete">

                                                        </i>
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
            {/* </div> */}
        </>
    );
}
