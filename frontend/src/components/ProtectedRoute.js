import React from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { isAuthenticated } from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = React.useState(true);
  const [isAuth, setIsAuth] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = isAuthenticated();
        setIsAuth(authenticated);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuth(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
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

  if (!isAuth) {
    // Redirect to login page with return url
    return <Navigate to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} replace />;
  }

  return children;
};

export default ProtectedRoute;