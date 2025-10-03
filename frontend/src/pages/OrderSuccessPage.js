import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Grid
} from '@mui/material';
import {
  CheckCircle,
  ShoppingBag,
  Email,
  LocalShipping,
  Payment,
  Assignment,
  SupportAgent
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const order = state?.order;
  const message = state?.message || 'Order created successfully!';

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">Order Information Not Found</Typography>
          <Typography>No order information could be retrieved. Please check your email for confirmation or contact support.</Typography>
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{
            bgcolor: '#7a3cff',
            '&:hover': { bgcolor: '#692fd9' }
          }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  const isPaymentSuccessful = order.payment?.status === 'successful';
  const isPaymentPending = !order.payment?.status || order.payment?.status === 'pending';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box textAlign="center" sx={{ mb: 4 }}>
        <CheckCircle sx={{ fontSize: 60, color: isPaymentSuccessful ? 'success.main' : 'info.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {isPaymentSuccessful ? 'Payment Successful!' : 'Order Received!'}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Thank you for your {isPaymentSuccessful ? 'purchase' : 'order'}
        </Typography>
        
        <Chip
          label={`Order #${order.orderNumber}`}
          color="primary"
          sx={{ mt: 2, fontSize: '1.1rem', px: 2, py: 1 }}
        />
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Order Details */}
        <Grid item xs={12} md={8}>
          {/* Payment Status Alert */}
          {isPaymentSuccessful && (
            <Alert 
              severity="success" 
              icon={<CheckCircle fontSize="large" />}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              <Typography variant="h6" gutterBottom>
                Payment Confirmed!
              </Typography>
              <Typography>
                Your payment of ₦{order.totalAmount?.toLocaleString()} was successful. 
                Your order is now being processed.
              </Typography>
            </Alert>
          )}

          {isPaymentPending && (
            <Alert 
              severity="info" 
              icon={<Payment fontSize="large" />}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              <Typography variant="h6" gutterBottom>
                Payment Pending
              </Typography>
              <Typography>
                Your order has been received! Please complete your payment to confirm your order.
              </Typography>
            </Alert>
          )}

          {/* Order Summary */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Assignment sx={{ mr: 1 }} />
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="medium">Order Status:</Typography>
                <Chip 
                  label={order.status?.toUpperCase()} 
                  color={
                    order.status === 'delivered' ? 'success' :
                    order.status === 'shipped' ? 'primary' :
                    order.status === 'processing' ? 'secondary' : 'default'
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="medium">Payment Status:</Typography>
                <Chip 
                  label={order.payment?.status?.toUpperCase() || 'PENDING'} 
                  color={
                    order.payment?.status === 'successful' ? 'success' :
                    order.payment?.status === 'failed' ? 'error' : 'warning'
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="medium">Order Date:</Typography>
                <Typography variant="body1">
                  {new Date(order.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="medium">Total Amount:</Typography>
                <Typography variant="h6" color="primary">
                  ₦{order.totalAmount?.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Items List */}
            <Typography variant="h6" gutterBottom>Order Items</Typography>
            <List>
              {order.items?.map((item, index) => (
                <ListItem key={index} divider>
                  <ListItemIcon>
                    <ShoppingBag color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.quantity} × ₦${item.price?.toLocaleString()}`}
                  />
                  <Typography variant="body1" fontWeight="medium">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </Typography>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Order Totals */}
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body1">
                Subtotal: ₦{(order.totalAmount - order.shippingFee - order.taxAmount)?.toLocaleString()}
              </Typography>
              <Typography variant="body1">
                Shipping: ₦{order.shippingFee?.toLocaleString()}
              </Typography>
              <Typography variant="body1">
                Tax: ₦{order.taxAmount?.toLocaleString()}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                Total: ₦{order.totalAmount?.toLocaleString()}
              </Typography>
            </Box>
          </Paper>

          {/* Shipping Information */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalShipping sx={{ mr: 1 }} />
              Shipping Information
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="medium">Name:</Typography>
                <Typography variant="body1">
                  {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="medium">Email:</Typography>
                <Typography variant="body1">{order.shippingAddress?.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="medium">Phone:</Typography>
                <Typography variant="body1">{order.shippingAddress?.phone}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" fontWeight="medium">Address:</Typography>
                <Typography variant="body1">{order.shippingAddress?.address}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body1" fontWeight="medium">City:</Typography>
                <Typography variant="body1">{order.shippingAddress?.city}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body1" fontWeight="medium">State:</Typography>
                <Typography variant="body1">{order.shippingAddress?.state}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body1" fontWeight="medium">ZIP Code:</Typography>
                <Typography variant="body1">{order.shippingAddress?.zipCode}</Typography>
              </Grid>
            </Grid>

            {order.notes && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" fontWeight="medium">Order Notes:</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  {order.notes}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        {/* Right Column - Actions & Support */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>Next Steps</Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <Email color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Email Confirmation"
                  secondary="Check your email for order details"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Assignment color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Order Processing"
                  secondary="We'll prepare your order within 24 hours"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <LocalShipping color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Shipping"
                  secondary="Expect delivery in 3-5 business days"
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<ShoppingBag />}
                onClick={() => navigate('/')}
                sx={{
                  bgcolor: '#7a3cff',
                  '&:hover': { bgcolor: '#692fd9' },
                  mb: 2,
                  py: 1.5
                }}
              >
                Continue Shopping
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<SupportAgent />}
                onClick={() => navigate('/contact')}
                sx={{ mb: 2 }}
              >
                Contact Support
              </Button>

              <Typography variant="body2" color="text.secondary">
                Need help? Email us at support@hijabworld.com
              </Typography>
            </Box>
          </Paper>

          {/* Support Information */}
          <Paper sx={{ p: 3, mt: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Support Information</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              📧 Email: support@hijabworld.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              📞 Phone: +234-XXX-XXXX-XXX
            </Typography>
            <Typography variant="body2">
              ⏰ Hours: Mon-Fri, 9AM-6PM
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}