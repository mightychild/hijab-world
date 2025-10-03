import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography
} from '@mui/material';
import { LocalShipping } from '@mui/icons-material';

export default function ShippingForm({ onNext, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <LocalShipping sx={{ mr: 1 }} />
        Shipping Information
      </Typography>

      <Grid container spacing={2}>
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
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="ZIP Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Order Notes (Optional)"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Special instructions for delivery"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{
            bgcolor: '#7a3cff',
            '&:hover': { bgcolor: '#692fd9' }
          }}
        >
          Continue to Payment
        </Button>
      </Box>
    </Box>
  );
}