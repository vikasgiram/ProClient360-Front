import { useState } from "react";
import { DesignationName } from "../../../../CommonLabel/DesignationName";
import Select from 'react-select'
import { EmployeeName } from "../../../../CommonLabel/EmployeeName";
import { Gender } from "../../../../CommonLabel/Gender";
import { MobileNumber } from "../../../../CommonLabel/MobileNumber";
import { JoiningDate } from "../../../../CommonLabel/JoiningDate";
import { EmailID } from "../../../../CommonLabel/EmailID";

const EmployeeMasterAddPopUp = ({ cancelBtnCallBack, confirmBtnCallBack, deleteRecord, message, heading }) => {
   

    const [DDLID, setDDLID] = useState({
        DDL: [],
        ID: 0,
        Label: "Select...",
    })

    const options = [
        { id: 1, value: 1, label: '1' },
        { id: 2, value: 2, label: '2' },
    ]
    // console.log(DDLID, "DDLID");
    return (<>
        <div className="modal fade show" style={{ display: "flex", alignItems: 'center', backgroundColor: "#00000090" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content p-3">
                    <div className="modal-header pt-0">

                        <h5 className="card-title fw-bold" id="exampleModalLongTitle">{heading}</h5>
                        <button onClick={() => cancelBtnCallBack()} type="button" className="close" style={{ marginLeft: "auto" }}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="row " >
                                <div class="col-12 col-lg-6 pt-3">
                                    <DesignationName />
                                    <input type="text" 
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                    
                                     name="email" 
                                     className="form-control"
                                      id="email" required />
                                </div>

                                <div class="col-12 col-lg-6 pt-3">
                                    <EmployeeName />
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

                                <div class="col-12 col-lg-6 pt-3">
                                    <Gender />
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
                                <div class="col-12 col-lg-6 pt-3">
                                    <MobileNumber />
                                    <input type="text" placeholder="" name="email" className="form-control" id="email" required />
                                </div>
                                <div class="col-12 col-lg-6 pt-3">
                                    <EmailID />
                                    <input type="text" placeholder="" name="email" className="form-control" id="email" required />
                                </div>
                                <div class="col-12 col-lg-6 pt-3">
                                    <JoiningDate />
                                    <input type="date" placeholder="" name="email" className="form-control" id="email" required />
                                </div>

                            </div>

                            <div className="row">
                                <div className="col-12 pt-3">
                                    <button
                                        type='button'
                                        onClick={() => confirmBtnCallBack(deleteRecord)}
                                        className="w-80 btn addbtn btn-success btn-brand btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u m-2 px-4" data-ktwizard-type="action-next">
                                        <i class="fa-solid fa-floppy-disk pe-1"></i> Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelBtnCallBack}
                                        className="w-80  btn addbtn btn-danger btn-brand btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u m-2 px-4" data-ktwizard-type="action-next">
                                        <i class="fa-solid fa-xmark pe-1"></i> Cancel

                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>);
}

export default EmployeeMasterAddPopUp;