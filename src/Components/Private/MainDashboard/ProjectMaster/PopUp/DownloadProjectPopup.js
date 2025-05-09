import { useState } from "react";
import toast from "react-hot-toast";
import { exportProject } from "../../../../../hooks/useProjects";

const DownloadPopup = ({ handleDownloads }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState();
  const [status, setStatus] = useState();

  const handleDownloadClick = async() => {
    
    if(!startDate){
      return toast.error("Start Date is Required field...");
    }
    await exportProject(startDate, endDate, status);


    handleDownloads();
  };


  return (
    <>
      <div className="modal fade show" style={{ display: "flex", alignItems: 'center', backgroundColor: "#00000090" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content p-4" style={{ height:"450px", width:"600px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title">Download Report</h5>
              <br /> <br /> <br /> 
              <button onClick={() => handleDownloads()} type="button" className="close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="d-flex flex-column align-items-center">
              <div className="form-group col-10 mb-3">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group col-10 mb-3">
                <label>End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group col-10 mb-4">
                <label>Project Status:</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="inprocess">Inprocess</option>
                  <option value="completed">Complete</option>
                </select>
              </div>

              <button onClick={handleDownloadClick} type="button" className="btn btn-dark">
                <i className="fa-solid fa-download"></i> Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadPopup;
