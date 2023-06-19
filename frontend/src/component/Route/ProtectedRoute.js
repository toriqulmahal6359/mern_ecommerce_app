import React, { Component, createElement, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route } from 'react-router-dom'
import Loader from '../layout/Loader/Loader';
import { Outlet } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, isAdmin, ...rest }) => {

    const { loading, isAuthenticated, user } = useSelector((state) => state.user);
    // if(loading){
    //     return <Loader />
    // }

    // if (!isAuthenticated) {
    //     return <Navigate to="/login" replace />;
    // }

    if (isAdmin === true && user.role !== "admin") {
        return <Navigate to="/login" replace />;
    }

    // return <Route {...rest} element={<Component {...rest} />} />;
    return isAuthenticated ? <Component { ...rest } /> : <Navigate to="/login" replace />
    // return <Route {...rest} element={<Component />} />;
    // return <Route {...rest} render={(props) => <Component {...props} />} />;
    // return !isAuthenticated ? <Navigate to="/login" replace /> : <Route {...rest} element={<Component />} />;
    // return isAuthenticated ? <Route { ...rest } element={<Component { ...rest } />} /> : <Navigate to="/login" replace />



    
    // if (!loading && isAuthenticated === false) {
    //     return <Navigate to="/login" />;
    // }

    // if (!loading && isAdmin === true && user?.role !== "admin") {
    //     return <Navigate to="/login" />;
    // }

    // if (isAuthenticated === undefined) {
    //     return null; // <-- or loading indicator/spinner/etc
    // }
    
    // if (!isAuthenticated || (isAdmin && user.role !== "admin")) {
    //     return <Navigate to="/login" replace />;
    // }
       
    // return children ? children : <Outlet />;

    // return (
    //     <Fragment>
    //       {loading === false ? (
    //        <Component {...rest} />
    //       ) : null}
    //     </Fragment>
    //   );
};

export default ProtectedRoute