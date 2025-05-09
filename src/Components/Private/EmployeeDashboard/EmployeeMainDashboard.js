import { useState, useEffect } from "react";
import { Sidebar } from "../MainDashboard/Sidebar/Sidebar";
import { EmployeeDasboardCards } from "./EmployeeDasboardCards";
import { AssignInproccessSection } from "./AssignInproccessSection";
import { PerFormanceChart } from "./PerFormanceChart";
import { getEmployeeDashboard } from "../../../hooks/useEmployees";
import { Header } from "../MainDashboard/Header/Header";

function EmployeeMainDashboard() {
    const [isopen, setIsOpen] = useState(false);
    const [totalProjectCount, setTotalProjectCount] = useState();
    const [completedProjectCount, setCompletedProjectCount] = useState();
    const [inproccessProjectCount, setInproccessProjectCount] = useState();

    const [assignedTasks, setAssignedTasks] = useState([]);
    const [inprocessTasks, setInproccessTasks] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getEmployeeDashboard();
                console.log("data", data);
                if (data) {
                    setTotalProjectCount(data.totalProjects);
                    setCompletedProjectCount(data.completedCount);
                    setInproccessProjectCount(data.inprocessCount);

                    setAssignedTasks(data.assignedTasks);
                    setInproccessTasks(data.inprocessTasks);
                }
            } catch (error) {
                console.error("Error fetching customers:", error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggle = () => {
        setIsOpen(!isopen);
    };

    // const [Language, setLanguage] = useState({
    //   DDL: [],
    //   ID: 0,
    //   Label: sessionStorage.getItem('LanguageChange')
    // })

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
                        // Language={Language}
                        // setLanguage={setLanguage}
                        toggle={toggle} isopen={isopen}
                    />
                    <div className="container-fluid page-body-wrapper">
                        <Sidebar isopen={isopen} active="dashboard" />
                        <div className="main-panel" style={{ width: isopen ? "" : "calc(100%  - 120px )", marginLeft: isopen ? "" : "125px" }}>
                            <div className="content-wrapper ps-3 ps-md-0">

                                <div className="row p-2   ">
                                    <div className="col-12 col-lg-6">
                                        <h5 className="text-white fw-bold py-2">
                                            Dashboard
                                        </h5>
                                    </div>

                                    <div className="col-12 col-lg-6  ms-auto text-end">
                                        <span>
                                            <img
                                                src="static/assets/img/satisfaction.png"
                                                className="customer_img"
                                                alt="logo"
                                                
                                            />
                                            <span className="Customer_fs ps-3 text-white">Avg Score |
                                                <span className="Customer_count ms-2">44%</span></span>
                                        </span>


                                    </div>

                                </div>
                                <EmployeeDasboardCards
                                    totalProjectCount={totalProjectCount}
                                    completedProjectCount={completedProjectCount}
                                    inproccessProjectCount={inproccessProjectCount} />


                                <AssignInproccessSection
                                    assignedTasks={assignedTasks}
                                    inprocessTasks={inprocessTasks}
                                />
                                <PerFormanceChart />


                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* </div> */}
        </>
    );
}

export default EmployeeMainDashboard;
