import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '../Loading';

function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);

    if (loading) {
        return <Loading />;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;