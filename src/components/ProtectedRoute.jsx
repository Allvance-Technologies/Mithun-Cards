import React from 'react';
import { Navigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useData();

    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
