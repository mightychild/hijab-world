import React from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box, Alert } from '@mui/material';
import { isAuthenticated, getStoredUserInfo } from '../services/authService';

const AdminProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const checkAdmin = async () => {
      try {
        const authenticated = isAuthenticated();
        if (authenticated) {
          const userInfo = getStoredUserInfo();
          setIsAdmin(userInfo?.isAdmin || false);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Admin check error:', error);
        setIsAdmin(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAdmin();
  }, []);

  if (isChecking) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#7a3cff' }} />
      </Box>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} replace />;
  }

  if (!isAdmin) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ p: 3 }}
      >
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          You don't have permission to access this page. Admin privileges required.
        </Alert>
      </Box>
    );
  }

  return children;
};

export default AdminProtectedRoute;