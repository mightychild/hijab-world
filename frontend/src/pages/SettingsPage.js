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
  Switch,
  FormControlLabel,
  Card,
  CardContent,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { getStoredUserInfo } from '../services/authService';

export default function SettingsPage() {
  const userInfo = getStoredUserInfo();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    language: 'english',
    currency: 'NGN',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Settings updated successfully!');
    } catch (err) {
      setError('Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchChange = (field) => (event) => {
    setSettings({
      ...settings,
      [field]: event.target.checked
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <SettingsIcon sx={{ mr: 2 }} />
        Settings
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <NotificationsIcon sx={{ mr: 1, color: '#7a3cff' }} />
                Notifications
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={handleSwitchChange('emailNotifications')}
                    color="primary"
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.smsNotifications}
                    onChange={handleSwitchChange('smsNotifications')}
                    color="primary"
                  />
                }
                label="SMS Notifications"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Appearance Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PaletteIcon sx={{ mr: 1, color: '#7a3cff' }} />
                Appearance
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={handleSwitchChange('darkMode')}
                    color="primary"
                  />
                }
                label="Dark Mode"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Account Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ mr: 1, color: '#7a3cff' }} />
              Account Settings
            </Typography>
            

            <Box sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={loading}
                onClick={handleSubmit}
                sx={{
                  bgcolor: '#7a3cff',
                  '&:hover': { bgcolor: '#692fd9' },
                  minWidth: '120px'
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}