import { useState, useEffect, useContext } from "react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import { UserContext } from "../../../context/UserContext";
import { getAMCs } from "../../../hooks/useAMC.js";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const [isopen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isopen);
  };

  const { user } = useContext(UserContext);
  
  const [loading, setLoading] = useState(true);
  const [pendingAMCs, setPendingAMCs] = useState([]);
  const [todayFollowUps, setTodayFollowUps] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    ongoing: 0,
    won: 0,
    lost: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch pending AMCs
      const pendingData = await getAMCs(1, 5, null, null, "Pending", false);
      if (pendingData?.success) {
        setPendingAMCs(pendingData.data || []);
      }
      
      // Fetch today's follow-ups
      const followUpData = await getAMCs(1, 5, null, null, null, true);
      if (followUpData?.success) {
        setTodayFollowUps(followUpData.data || []);
      }
      
      // Fetch stats for all statuses
      const pendingCount = await getAMCs(1, 1, null, null, "Pending", false);
      const ongoingCount = await getAMCs(1, 1, null, null, "Ongoing", false);
      const wonCount = await getAMCs(1, 1, null, null, "Won", false);
      const lostCount = await getAMCs(1, 1, null, null, "Lost", false);
      
      setStats({
        total: (pendingCount.pagination?.totalRecords || 0) + 
              (ongoingCount.pagination?.totalRecords || 0) + 
              (wonCount.pagination?.totalRecords || 0) + 
              (lostCount.pagination?.totalRecords || 0),
        pending: pendingCount.pagination?.totalRecords || 0,
        ongoing: ongoingCount.pagination?.totalRecords || 0,
        won: wonCount.pagination?.totalRecords || 0,
        lost: lostCount.pagination?.totalRecords || 0
      });
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString, includeTime = false) => {
    if (!dateString) return "N/A";
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      ...(includeTime && { hour: '2-digit', minute: '2-digit' })
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

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
            <Sidebar isopen={isopen} active="Dashboard" />
            <div
              className="main-panel"
              style={{
                width: isopen ? "" : "calc(100%  - 120px )",
                marginLeft: isopen ? "" : "125px",
              }}
            >
              <div className="content-wrapper ps-3 ps-md-0 pt-3">
                <div className="row px-2 py-1">
                  <div className="col-12">
                    <h4 className="text-white py-2">Dashboard</h4>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="row mb-4">
                  <div className="col-xl-3 col-lg-3 col-md-6 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                              Total AMCs
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                              {stats.total}
                            </div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-file-contract fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-lg-3 col-md-6 mb-4">
                    <div className="card border-left-warning shadow h-100 py-2">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                              Pending
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                              {stats.pending}
                            </div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-clock fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-lg-3 col-md-6 mb-4">
                    <div className="card border-left-info shadow h-100 py-2">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                              Ongoing
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                              {stats.ongoing}
                            </div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-spinner fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-lg-3 col-md-6 mb-4">
                    <div className="card border-left-success shadow h-100 py-2">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                              Won
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                              {stats.won}
                            </div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-trophy fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  {/* Pending AMCs Table */}
                  <div className="col-lg-6 mb-4">
                    <div className="card shadow mb-4">
                      <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 className="m-0 font-weight-bold text-primary">Pending AMCs</h6>
                        <Link to="/amc-master" className="btn btn-sm btn-primary">
                          View All
                        </Link>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-bordered" width="100%" cellSpacing="0">
                            <thead>
                              <tr>
                                <th>Invoice No</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Next Follow-up</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pendingAMCs.length > 0 ? (
                                pendingAMCs.map((amc) => (
                                  <tr key={amc._id}>
                                    <td>{amc.invoiceNumber}</td>
                                    <td>{amc.customerName || '-'}</td>
                                    <td>{formatCurrency(amc.quotationAmount)}</td>
                                    <td>{formatDate(amc.nextFollowUpDate, true)}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" className="text-center">
                                    No pending AMCs found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Today's Follow-ups Table */}
                  <div className="col-lg-6 mb-4">
                    <div className="card shadow mb-4">
                      <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 className="m-0 font-weight-bold text-danger">Today's Follow-ups</h6>
                        <Link to="/amc-master" className="btn btn-sm btn-danger">
                          View All
                        </Link>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-bordered" width="100%" cellSpacing="0">
                            <thead>
                              <tr>
                                <th>Invoice No</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {todayFollowUps.length > 0 ? (
                                todayFollowUps.map((amc) => (
                                  <tr key={amc._id}>
                                    <td>{amc.invoiceNumber}</td>
                                    <td>{amc.customerName || '-'}</td>
                                    <td>
                                      <span className={`badge ${
                                        amc.status === 'Won' ? 'bg-success' : 
                                        amc.status === 'Lost' ? 'bg-danger' : 
                                        amc.status === 'Ongoing' ? 'bg-warning' : 
                                        'bg-secondary'
                                      }`}>
                                        {amc.status || 'Pending'}
                                      </span>
                                    </td>
                                    <td>{new Date(amc.nextFollowUpDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" className="text-center">
                                    No follow-ups scheduled for today
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
        </div>
      </div>
    </>
  );
};