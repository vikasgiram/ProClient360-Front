import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

const AutoLoggedIn = ({Component}) => {
  const { user } = useContext(UserContext);
  if(!Component){
    return null;
  }
  if (!user) {
    return <Component/>
  }

  switch (user.user) {
      case "company":
      return <Navigate to="/MainDashboard" />;
      case "admin":
      return <Navigate to="/AdminMainDashboard" />;
      case "employee":
      return <Navigate to="/EmployeeMainDashboard" />;
      default:
      return <Component/>
    };

}

export default AutoLoggedIn;
