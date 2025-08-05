import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectRoute = ({Component}) => {
    const { user } = useContext(UserContext);
    if (!Component) {
        return null;
    }
    if (!user) {
        return <Navigate to="/" />;
    }
    return <Component />;
}

export default ProtectRoute;