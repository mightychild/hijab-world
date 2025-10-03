import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Support as SupportIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

export default function SupportPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <SupportIcon sx={{ mr: 2, color: '#7a3cff' }} />
        Help & Support
      </Typography>

      <Grid container spacing={3}>
        {/* Contact Methods */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Get in Touch
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Our support team is here to help you with any questions or concerns.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Avatar sx={{ bgcolor: '#7a3cff', mx: 'auto', mb: 2 }}>
                    <EmailIcon />
                  </Avatar>
                  <Typography variant="h6" gutterBottom>Email Support</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    support@hijabworld.com
                  </Typography>
                  <Button variant="outlined" size="small">
                    Send Email
                  </Button>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Avatar sx={{ bgcolor: '#7a3cff', mx: 'auto', mb: 2 }}>
                    <PhoneIcon />
                  </Avatar>
                  <Typography variant="h6" gutterBottom>Phone Support</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    +234-XXX-XXXX-XXX
                  </Typography>
                  <Button variant="outlined" size="small">
                    Call Now
                  </Button>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Avatar sx={{ bgcolor: '#7a3cff', mx: 'auto', mb: 2 }}>
                    <ScheduleIcon />
                  </Avatar>
                  <Typography variant="h6" gutterBottom>Business Hours</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Mon - Fri: 9AM - 6PM
                  </Typography>
                  <Button variant="outlined" size="small">
                    View Hours
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* FAQ Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Frequently Asked Questions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                How do I track my order?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You can track your order from the Order History page.
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                What is your return policy?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We accept returns within 30 days of purchase.
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                How do I change my password?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You can change your password in the Settings page.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}