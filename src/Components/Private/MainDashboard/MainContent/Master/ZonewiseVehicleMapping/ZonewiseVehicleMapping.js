import { useState } from "react";
import Select from 'react-select'
import { Header } from "../../../Header/Header";
import { Sidebar } from "../../../Sidebar/Sidebar";
import DeletePopUP from "../../../../CommonPopUp/DeletePopUp";
import ZonewiseVehicleMappingAddPopUp from "./ZonewiseVehicleMappingAddPopUp";
import { VehicleName } from "../../../../CommonLabel/VehicleName";

export const ZonewiseVehicleMapping = () => {

    const [isopen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isopen);
    };

    // delete

    const [deletePopUpShow, setdeletePopUpShow] = useState(false)

    const handelDeleteClosePopUpClick = () => {
        setdeletePopUpShow(false)
    }

    const handelDeleteClick = () => {
    }

    // add
    // const [addPopUpShow, setaddPopUpShow] = useState()
    const [addPopUpShow, setaddPopUpShow] = useState(false)
    const handleAddDepartment = () => {
        setaddPopUpShow(!addPopUpShow)
    }


    const handeladdClick = () => {

    }

    const [Language, setLanguage] = useState({
        DDL: [],
        ID: 0,
        Label: sessionStorage.getItem('LanguageChange')
    })

      // DDL

      const [DDLID, setDDLID] = useState({
        DDL: [],
        ID: 0,
        Label: "Select...",
    })

    const options = [
        { id: 1, value: 1, label: '1' },
        { id: 2, value: 2, label: '2' },
    ]
    return (
        <>
            <div className="container-scroller">
                <div className="row background_main_all">
                     <Header
                        Language={Language}
                        setLanguage={setLanguage}
                        toggle={toggle} isopen={isopen} />
                    <div className="container-fluid page-body-wrapper">
                        <Sidebar isopen={isopen} active="Master" />
                        <div className="main-panel" style={{ width: isopen ? "" : "calc(100%  - 120px )", marginLeft: isopen ? "" : "125px" }}>
                            <div className="content-wrapper ps-3 ps-md-0 pt-3">
                                <div className="row">
                                    <div className="col-12">
                                        <h5 className="text-white ps-3">{t('EncroachmentDashboard.ZoneWiseVehicleMapping')}
                                            {/* <span className="float-end add_btn">Add</span> */}
                                            <span className="add_btn  float-end cursor-pointer" onClick={() => {
                                                handleAddDepartment(true)
                                            }}
                                                title="Add">
                                                <i class="fa-solid fa-plus pe-1"></i> Add
                                            </span>
                                        </h5>
                                    </div>
                                </div>
                                <div className="row border bg-white ps-3 py-3 table_styles" >
                                    <div className="col-12 col-lg-4">
                                      <VehicleName/>
                                      <Select
                                        id='DDLID'
                                        isClearable={false}
                                        // isRtl={isRtl}
                                        isSearchable
                                        maxMenuHeight={130}
                                        value={{ value: DDLID.ID, label: DDLID.Label }}
                                        onChange={(e) => {
                                            e ?
                                                setDDLID({ ...DDLID, ID: e.value, Label: e.label })
                                                :
                                                setDDLID({ ...DDLID, ID: 0, Label: "Select..." })

                                        }}
                                        options={options}
                                    /> 
                                     </div>

                                    <div className="row" >
                                        <div className="col-12  " >
                                            <div className="table-responsive pt-3">
                                                <table className="table table-striped table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th className="w-6 text-center">{t('EncroachmentDashboard.SrNo')}</th>
                                                            <th className="text-center"> {t('EncroachmentDashboard.ZoneName')} </th>
                                                            <th className="text-center"> {t('EncroachmentDashboard.VehicleModule')} </th>
                                                            <th className="text-center"> {t('EncroachmentDashboard.VehicleName')} </th>
                                                            <th className="text-center"> {t('EncroachmentDashboard.VehicleNumber')} </th>
                                                            <th className="text-center"> {t('EncroachmentDashboard.Actions')} </th>
                                                        </tr>

                                                    </thead>
                                                    <tbody>

                                                        <tr>
                                                            <td className="py-1" align="center">1</td>
                                                            <td className="text-center"></td>
                                                            <td className="text-center"></td>
                                                            <td className="text-center"></td>
                                                            <td className="text-center"></td>
                                                            <td className="text-center">

                                                                <span className="" onClick={() => {
                                                                    handleAddDepartment()
                                                                }}
                                                                    title="Edit">
                                                                    <i className="fa-solid fa-pen-to-square mx-2 text-success cursor-pointer"></i>
                                                                </span>

                                                                <i className="fa-solid fa-trash mx-2 text-danger fs-7 cursor-pointer"
                                                                    onClick={() => {
                                                                        setdeletePopUpShow(true)
                                                                    }}
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
                </div>
            </div>
            {deletePopUpShow ?
                <DeletePopUP
                    message={"Are you sure! Do you want to Delete ?"}
                    cancelBtnCallBack={handelDeleteClosePopUpClick}
                    // confirmBtnCallBack={handelDeleteClick}
                    heading="Delete"
                /> : <></>
            }

            {addPopUpShow ?
                <ZonewiseVehicleMappingAddPopUp
                    message="Add"
                    handleAddDepartment={handleAddDepartment}
                    heading={t("EncroachmentDashboard.ZoneWiseVehicleMapping")}
                    cancelBtnCallBack={handleAddDepartment}
                /> : <></>
            }
        </>
    )
}

