import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { getStoredUserInfo } from '../services/authService';

export default function UserProfile() {
  const userInfo = getStoredUserInfo();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: userInfo?.firstName || '',
    lastName: userInfo?.lastName || '',
    email: userInfo?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call - you'll need to create this endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <PersonIcon sx={{ mr: 2 }} />
        My Profile
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="email"
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="ZIP Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
              sx={{
                bgcolor: '#7a3cff',
                '&:hover': { bgcolor: '#692fd9' },
                minWidth: '120px'
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}