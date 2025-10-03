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
  ShoppingBag,
  Badge
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const data = await registerUser(formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setSuccess('Account created successfully! Redirecting to dashboard...');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ 
        bgcolor: "#f9f7fd",
        p: 2,
        background: 'linear-gradient(135deg, #f9f7fd 0%, #e8e2f9 100%)'
      }}
    >
      <Container maxWidth="md">
        <Box
          component={Paper}
          elevation={6}
          sx={{
            p: 4,
            borderRadius: '20px',
            background: 'white',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Animated Logo */}
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
                Create Your Account
              </Typography>
            </Box>
          </Slide>

          <Fade in={true} timeout={1000}>
            <Box component="form" onSubmit={handleSubmit}>
              {/* Error & Success Messages */}
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
              
              {success && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: 3,
                    borderRadius: '12px',
                    animation: 'scaleIn 0.5s ease-out'
                  }}
                >
                  {success}
                </Alert>
              )}

              {/* Name Fields */}
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  label="First Name"
                  name="firstName"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  sx={{
                    bgcolor: "white",
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: '12px',
                      paddingLeft: 1,
                    },
                  }}
                  InputProps={{
                    startAdornment: <Badge sx={{ color: '#7a3cff', mr: 1 }} />,
                  }}
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  sx={{
                    bgcolor: "white",
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: '12px',
                      paddingLeft: 1,
                    },
                  }}
                  InputProps={{
                    startAdornment: <Badge sx={{ color: '#7a3cff', mr: 1 }} />,
                  }}
                />
              </Box>

              {/* Email Input */}
              <TextField
                label="Email Address"
                name="email"
                type="email"
                variant="outlined"
                fullWidth
                required
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

              {/* Password Fields */}
              <Box display="flex" gap={2} mb={2}>
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
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  sx={{
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </Button>
                    ),
                  }}
                />
              </Box>

              {/* Sign Up Button */}
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
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </Zoom>

              {/* Back to Login Link */}
              <Box textAlign="center">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Already have an account?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/login" 
                    underline="hover"
                    sx={{ 
                      color: '#7a3cff',
                      fontWeight: 500,
                      '&:hover': { color: '#692fd9' }
                    }}
                  >
                    Log In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
}