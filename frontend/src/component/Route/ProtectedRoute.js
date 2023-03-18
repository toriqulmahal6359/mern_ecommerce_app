import React, { Component, createElement, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route } from 'react-router-dom'

const ProtectedRoute = ({ Component }) => {
    const { loading, isAuthenticated, user } = useSelector((state) => state.user);

    return isAuthenticated ? <Component /> : <Navigate to="/login" />
};

export default ProtectedRoute