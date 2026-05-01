import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Loading from './Loading'; // Import your loading component
import axios from 'axios';

function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserRole = async () => {
        try {
          const res = await axios.get(`${VITE_API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setUserRole(res.data.role);
        } catch (err) {
          console.error('Error fetching user role:', err);
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchUserRole();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return <Loading />; // Replace with your loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Restrict course creation and editing to admins
  if (
    (location.pathname === '/create-course' ||
      location.pathname.startsWith('/edit-course')) &&
    userRole !== 'admin'
  ) {
    return <Navigate to="/" replace />;
  }

  // Restrict admin routes to admins
  if (location.pathname.startsWith('/admin') && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;