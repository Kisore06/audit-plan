import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, requiredRole, ...rest }) => {
    const isAuthenticated = localStorage.getItem('token') !== null;
    const userRole = localStorage.getItem('role');

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated && (requiredRole ? userRole === requiredRole : true) ? (
                    <Component {...props} />
                ) : (
                    <Navigate to={{ pathname: '/login', state: { from: props.location } }} />
                )
            }
        />
    );
};

export default ProtectedRoute;
