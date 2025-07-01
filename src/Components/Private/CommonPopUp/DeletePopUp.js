
const DeletePopUP = ({ cancelBtnCallBack,confirmBtnCallBack}) => {


    return (<>
        <div className="modal fade show" style={{ display: "flex", alignItems: 'center', backgroundColor: "#00000055" }}>
            <div className="modal-dialog dialog_width" role="document" >
                <div className="modal-content p-3">
                    <div className="modal-header pt-0">

                        <h5 className="card-title fw-bold" id="exampleModalLongTitle">Delete</h5>
                        <button onClick={() => cancelBtnCallBack()} type="button" className="close" style={{ marginLeft: "auto" }}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    
                    <div className="modal-body mx-4">

                        <div className="row">

                            <div className="col-12 justify-content-center my-4">
                                <h6 className="fw-bold">Are you sure! Do you want to Delete ?</h6>
                            </div>
                            <div className="col-12  d-flex justify-content-center">
                                <div className="form-group w-80 d-flex justify-content-between">
                                    <hr />
                                    <button

                                        type='button'
                                        onClick={() => confirmBtnCallBack()}
                                        className="w-80 btn addbtn btn-success btn-brand btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u m-2 px-4" data-ktwizard-type="action-next">
                                        <i className="fa-solid fa-check pe-2"></i> Yes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelBtnCallBack}
                                        className="w-80  btn addbtn btn-danger btn-brand btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u m-2 px-4" data-ktwizard-type="action-next">
                                        <i className="fa-solid fa-xmark pe-2"></i> No
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

export default DeletePopUP;