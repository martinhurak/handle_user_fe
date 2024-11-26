import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkAuthentication, logout, setupAuthSync } from '../services/authService';
import { Spinner } from 'react-bootstrap';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setupAuthSync(() => {
        logout();
        window.location.href = '/login';
    });
}, []);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuthentication();
      setIsAuth(authStatus);
      setLoading(false);
    };
    verifyAuth();
  }, []);

  if (loading) return (   
  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" variant="primary" />
  </div>)
  return isAuth ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;