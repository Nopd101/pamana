import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role');

  // 1. Check if logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check if role is allowed
  if (allowedRoles.includes(userRole)) {
    return <Outlet />; // ✅ Access Granted
  } else {
    // ⛔ Role mismatch! Redirect to their appropriate home
    if (userRole === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
    if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/homepage" replace />;
  }
};

export default PrivateRoute;