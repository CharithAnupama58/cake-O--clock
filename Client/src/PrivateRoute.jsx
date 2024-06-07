import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../src/Context/AuthProvider';

const PrivateRoute = ({ allowedRoles, children }) => {
    const { authState } = useContext(AuthContext);
    const { isAuthenticated, jobRole } = authState;

    if (!isAuthenticated) {
        return <Navigate to="/Login" />;
    }

    if (!allowedRoles.includes(jobRole)) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;
