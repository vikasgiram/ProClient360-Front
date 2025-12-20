import {
    BrowserRouter as Router,
    Route,
    Routes,
} from "react-router-dom";
import { useContext } from "react";

import MainDashboard from "./Components/Private/MainDashboard/MainDashboard";
import { LogIn } from "./Components/Public/Login";
import { EmployeeMasterGrid } from "./Components/Private/MainDashboard/EmployeeMaster/EmployeeMasterGrid";
import { CustomerMasterGrid } from "./Components/Private/MainDashboard/CustomerMaster/CustomerMasterGrid";
import { ProjectMasterGrid } from "./Components/Private/MainDashboard/ProjectMaster/ProjectMasterGrid";
import { TaskMasterGrid } from "./Components/Private/MainDashboard/TaskMaster/TaskMasterGrid";
import { DepartmentMasterGrid } from "./Components/Private/MainDashboard/DepartmentMaster/DepartmentMasterGrid";
import { DesignationMasterGird } from "./Components/Private/MainDashboard/DesignationMaster/DesignationMasterGrid";
import { TaskSheetMaster } from "./Components/Private/MainDashboard/TaskSheetMaster/TaskSheetMaster";
import { ForgotPassword } from "./Components/Public/ForgotPassword";
import { Mailsentsuccessfully } from "./Components/Public/Mailsentsuccessfully";
import AdminMainDashboard from "./Components/Private/AdminDashboard/AdminMainDashboard";
import EmployeeMainDashboard from "./Components/Private/EmployeeDashboard/EmployeeMainDashboard";
import { EmployeeTaskGrid } from "./Components/Private/EmployeeDashboard/EmployeeTaskGrid/EmployeeTaskGrid";

import { UserContext } from "./context/UserContext";
import { AdminmasterGrid } from "./Components/Private/AdminDashboard/AdminmasterGrid/AdminmasterGrid";
import { AdminCompanyMasterGrid } from "./Components/Private/AdminDashboard/AdminCompanyMasterGrid/AdminCompanyMasterGrid";
import { UserProfile } from "./Components/Private/MainDashboard/UserProfile";
import NotFound from "./Components/NotFound";
import { TicketMasterGrid } from "./Components/Private/MainDashboard/TicketMaster/TicketMaserGrid";
import Feedback  from "./Components/Public/Feedback";
import { ServiceMasterGrid } from "./Components/Private/MainDashboard/ServiceMaster/ServiceMasterGrid";


import { SalesMasterGrid } from "./Components/Private/MainDashboard/SalesMaster/SalesMasterGrid";

import { MarketingMasterGrid } from "./Components/Private/MainDashboard/MarketingMaster/MarketingMasterGrid";

import { AMCMasterGrid } from "./Components/Private/MainDashboard/AMCMaster/AMCMasterGrid";


import { InventoryMasterGrid } from "./Components/Private/MainDashboard/InventryMaster/InventoryMasterGrid";

import { VendorMasterGrid } from "./Components/Private/MainDashboard/VendorMaster/VendorMasterGrid";

import { ProductMasterGrid } from "./Components/Private/MainDashboard/ProductMaster/ProductMasterGrid";

import { PurchaseOrderMasterGrid } from "./Components/Private/MainDashboard/PurchaseOrderMaster/PurchaseOrderMasterGrid";

import { GRNMasterGrid } from "./Components/Private/MainDashboard/GRNMaster/GRNMasterGrid";

import { QCMasterGrid } from "./Components/Private/MainDashboard/QCMaster/QCMasterGrid";

import { DCMasterGrid } from "./Components/Private/MainDashboard/DeliveryChallanMaster/DCMasterGrid";

import { MRFMasterGrid } from "./Components/Private/MainDashboard/MRFMaster/MRFMasterGrid";

import { EmployeeMyServiceMasterGrid } from "./Components/Private/EmployeeDashboard/EmployeeMyServiceMasterGrid/EmployeeMyServiceMasterGrid";
import { EmployeeFeedbackMasterGrid } from "./Components/Private/EmployeeDashboard/EmployeesFeedbackMasterGrid/EmployeeFeedbackMasterGrid";
import AutoLoggedIn from "./utils/AutoLoggedIn";

import LeadApis from "./Components/Private/MainDashboard/LeadApisMaster/LeadApis";
import { ChangePassword } from "./Components/Public/ChangePassword";
import { ForgotPasswordConfirm } from "./Components/Public/ForgotPasswordConfirm";
import ProtectRoute from "./utils/ProtectRoute";
const AllRoutes = () => {

const {user} = useContext(UserContext);

    return (
        <>
            <Router>
                <Routes>
                    <Route exact path="/" element={<AutoLoggedIn  Component={LogIn} />} />
                    <Route exact path="/ForgotPassword" element={<ForgotPassword />} />
                    <Route exact path="/Mailsentsuccessfully" element={<Mailsentsuccessfully />} />
                    <Route exact path="/ResetPassword/:id/:token" element={<ForgotPasswordConfirm />} />
                    <Route exact path="/feedback/:id" element={<Feedback />} />


                    <Route exact path="/ChangePassword" element={<ProtectRoute Component={ChangePassword} />} />
                    <Route exact path="/UserProfile" element={<ProtectRoute Component={UserProfile} />} />
            
                    <Route exact path="/CustomerMasterGrid" element={<ProtectRoute Component={CustomerMasterGrid} />} />
                    <Route exact path="/EmployeeMasterGrid" element={<ProtectRoute Component={EmployeeMasterGrid} />} />
                    <Route exact path="/ServiceMasterGrid" element={<ProtectRoute Component={ServiceMasterGrid} />} />
                    <Route exact path="/TaskMasterGrid" element={<ProtectRoute Component={TaskMasterGrid} />} />
                    <Route exact path="/TicketMasterGrid" element={<ProtectRoute Component={TicketMasterGrid} />} />
                    <Route exact path="/ProjectMasterGrid" element={<ProtectRoute Component={ProjectMasterGrid} />} />
                    <Route exact path="/DepartmentMasterGrid" element={<ProtectRoute Component={DepartmentMasterGrid} />} />
                    <Route exact path="/DesignationMasterGird" element={<ProtectRoute Component={DesignationMasterGird} />} />
                    <Route exact path="/project/:id" element={<ProtectRoute Component={TaskSheetMaster} />} />

                    <Route exact path="/SalesMasterGrid" element={<ProtectRoute Component={SalesMasterGrid} />} />

                    <Route exact path="/MarketingMasterGrid" element={<ProtectRoute Component={MarketingMasterGrid} />} />

                    <Route exact path="/AMCMasterGrid" element={<ProtectRoute Component={AMCMasterGrid} />} />

                    <Route exact path="/InventoryMasterGrid" element={<ProtectRoute Component={InventoryMasterGrid} />} />
                    
                    <Route exact path="/VendorMasterGrid" element={<ProtectRoute Component={VendorMasterGrid} />} />
                     
                    <Route exact path="/ProductMasterGrid" element={<ProtectRoute Component={ProductMasterGrid} />} />

                    <Route exact path="/PurchaseOrderMasterGrid" element={<ProtectRoute Component={PurchaseOrderMasterGrid} />} />

                    <Route exact path="/GRNMasterGrid" element={<ProtectRoute Component={GRNMasterGrid} />} />

                    <Route exact path="/QCMasterGrid" element={<ProtectRoute Component={QCMasterGrid} />} />

                    <Route exact path="/DCMasterGrid" element={<ProtectRoute Component={DCMasterGrid} />} />

                    <Route exact path="/MRFMasterGrid" element={<ProtectRoute Component={MRFMasterGrid} />} />
                    
                    {/* Company */}

                    {user && user?.user==='company'?(
                        <>
                            <Route exact path="/MainDashboard" element={<MainDashboard />} />
                            <Route exact path="/leadApis" element={<LeadApis />} />
                        </>
                    ):null}


                    {/* Admin  */}
                    {user && user.user==='admin'?(
                        <>
                        <Route exact path="/AdminMainDashboard" element={<AdminMainDashboard />} />
                        <Route exact path="/AdminCompanyMasterGrid" element={<AdminCompanyMasterGrid />} />
                        <Route exact path="/AdminmasterGrid" element={<AdminmasterGrid />} />

                    </>
                    ):null}

                    {/* Employee  */}
                    {user && user.user==='employee'?(
                        <> 
                            <Route exact path="/EmployeeMainDashboard" element={<EmployeeMainDashboard />} />
                            <Route exact path="/EmployeeTaskGrid" element={<EmployeeTaskGrid />} />
                            <Route exact path="/EmployeeMyServiceMasterGrid" element={<EmployeeMyServiceMasterGrid />} />
          
                            {/* <Route exact path="/EmployeeMySalesMasterGrid" element={<EmployeeMySalesMasterGrid />} /> */}

                            <Route exact path="/EmployeeFeedbackMasterGrid" element={<EmployeeFeedbackMasterGrid />} />
             
                            
                        </>
                    ):null}

                    <Route path="*" element={<NotFound/>} />

                </Routes>
            </Router>
        </>
    )
}

export default AllRoutes;