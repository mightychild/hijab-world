import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  Fade,
  Zoom,
  Slide,
  Container,
  Paper
} from "@mui/material";
import {
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
  ShoppingBag
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginUser(formData);
      console.log('Login successful:', data);
      
      if (data.token) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        
        // Redirect based on user role
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect') || (data.isAdmin ? '/admin' : '/');
        
        navigate(redirectUrl);
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Show specific error messages
      if (error.message.includes('Failed to fetch')) {
        setError('Cannot connect to server. Please check your internet connection and try again.');
      } else if (error.message.includes('Invalid email or password')) {
        setError('Invalid email or password. Please try again.');
      } else if (error.message.includes('User already exists')) {
        setError('An account with this email already exists.');
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{ 
        minHeight: '100vh',
        backgroundImage: `url('/assets/hijab3.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed', // Creates parallax effect
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(122, 60, 255, 0.1) 0%, rgba(157, 106, 255, 0.2) 100%)',
          backdropFilter: 'blur(2px)',
        }
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{ 
          position: 'relative',
          zIndex: 1,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          component={Paper}
          elevation={8}
          sx={{
            p: 4,
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            width: '100%',
            maxWidth: 450
          }}
        >
          {/* Rest of your login form code remains exactly the same */}
          <Slide direction="down" in={true} timeout={800}>
            <Box textAlign="center" mb={3}>
              <ShoppingBag 
                sx={{ 
                  fontSize: 48, 
                  color: '#7a3cff',
                  animation: 'pulse 2s infinite',
                  mb: 1
                }} 
              />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: "bold",
                  background: 'linear-gradient(45deg, #7a3cff 30%, #9d6aff 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5
                }}
              >
                Hijab World
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Welcome back
              </Typography>
            </Box>
          </Slide>

          <Fade in={true} timeout={1000}>
            <Box component="form" onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: '12px',
                    animation: 'bounce 0.5s ease-in-out'
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Email Input */}
              <TextField
                label="Email Address"
                name="email"
                variant="outlined"
                fullWidth
                required
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                sx={{
                  mb: 2,
                  bgcolor: "white",
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '12px',
                    paddingLeft: 1,
                  },
                }}
                InputProps={{
                  startAdornment: <Email sx={{ color: '#7a3cff', mr: 1 }} />,
                }}
              />

              {/* Password Input */}
              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                required
                value={formData.password}
                onChange={handleInputChange}
                sx={{
                  mb: 1,
                  bgcolor: "white",
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '12px',
                    paddingLeft: 1,
                  },
                }}
                InputProps={{
                  startAdornment: <Lock sx={{ color: '#7a3cff', mr: 1 }} />,
                  endAdornment: (
                    <Button
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{ minWidth: 'auto', p: 0.5 }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  ),
                }}
              />

              {/* Forgot Password */}
              <Box sx={{ mb: 3, textAlign: 'right' }}>
                <Link href="#" underline="hover" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                  Forgot password?
                </Link>
              </Box>

              {/* Login Button */}
              <Zoom in={true} timeout={1200}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mb: 3,
                    bgcolor: "#7a3cff",
                    ":hover": { 
                      bgcolor: "#692fd9",
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(122, 60, 255, 0.3)'
                    },
                    borderRadius: "12px",
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Zoom>

              {/* Divider */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'grey.300' }} />
                <Typography variant="body2" sx={{ px: 2, color: 'grey.600' }}>
                  or continue with
                </Typography>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'grey.300' }} />
              </Box>

              {/* Create & Guest Buttons */}
              <Box display="flex" gap={2}>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="outlined"
                  fullWidth
                  startIcon={<Person />}
                  sx={{
                    borderRadius: "12px",
                    bgcolor: "white",
                    ":hover": { 
                      bgcolor: "grey.50",
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                    },
                    py: 1.2,
                    fontWeight: 500
                  }}
                >
                  Create Account
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderRadius: "12px",
                    bgcolor: "white",
                    ":hover": { 
                      bgcolor: "grey.50",
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                    },
                    py: 1.2,
                    fontWeight: 500
                  }}
                >
                  Continue as Guest
                </Button>
              </Box>
            </Box>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
}