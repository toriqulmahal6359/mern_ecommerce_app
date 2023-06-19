import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route } from 'react-router-dom';

const AdminProtectedRoute = ({ component: Component, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (!isAuthenticated || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <Route {...rest} element={<Component />} />;
};

export default AdminProtectedRoute;
