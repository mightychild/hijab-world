import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  LocalShipping,
  Payment,
  AssignmentTurnedIn
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import ShippingForm from '../components/checkout/ShippingForm';
import PaymentForm from '../components/checkout/PaymentForm';
import ReviewOrder from '../components/checkout/ReviewOrder';
import { useNavigate } from 'react-router-dom';

const steps = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { cartItems, getCartTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const showSnackbar = (message) => {
    setSnackbar({ open: true, message });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleNext = (data) => {
    if (activeStep === 0) {
      setShippingData(data);
    } else if (activeStep === 1) {
      setPaymentData(data);
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        throw new Error('Please log in to continue. No authentication token found.');
      }

      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0]?.url || ''
        })),
        shippingAddress: shippingData,
        notes: shippingData.notes || ''
      };

      console.log('Sending order data to backend...');
      
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(orderData)
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        throw new Error('Server returned non-JSON response. Please check if backend is running on port 5000.');
      }

      const data = await response.json();
      
      console.log('Full API response:', data);

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      // DEBUG: Check what paymentLink contains
      console.log(' Payment link value:', data.data?.paymentLink);
      console.log('Payment response data:', data.data);
      
      // Handle the payment link redirect
      if (data.data?.paymentLink && data.data.paymentLink !== 'null' && data.data.paymentLink !== 'undefined') {
        console.log('Redirecting to payment page:', data.data.paymentLink);
        
        // Clear cart before redirecting
        clearCart();
        
        // Redirect to Paystack payment page
        window.location.href = data.data.paymentLink;
        
      } else {
        console.log('No payment link provided, showing success message');
        
        // Clear cart
        clearCart();
        
        // Show success message and redirect to order success page
        setSuccess('Order created successfully! Please check your email for payment instructions.');
        
        // Redirect to order confirmation page
        setTimeout(() => {
          navigate('/order-success', { 
            state: { 
              order: data.data?.order || data.order,
              message: data.message || 'Order created successfully. Please complete payment to confirm your order.' 
            }
          });
        }, 2000);
      }

    } catch (error) {
      console.error('Order error:', error);
      setError(error.message || 'Failed to create order. Please check if backend server is running.');
      
      // Show detailed error in snackbar
      showSnackbar(error.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <ShippingForm onNext={handleNext} initialData={shippingData} />;
      case 1:
        return (
          <PaymentForm
            onNext={handleNext}
            onBack={handleBack}
            shippingData={shippingData}
          />
        );
      case 2:
        return (
          <ReviewOrder
            onPlaceOrder={handlePlaceOrder}
            onBack={handleBack}
            shippingData={shippingData}
            loading={loading}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  if (cartItems.length === 0 && !success) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Your cart is empty. Please add some items to proceed to checkout.
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>
              {index === 0 && <LocalShipping sx={{ mr: 1 }} />}
              {index === 1 && <Payment sx={{ mr: 1 }} />}
              {index === 2 && <AssignmentTurnedIn sx={{ mr: 1 }} />}
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Debug info for development */}
      {/* {process.env.NODE_ENV === 'development' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            API Endpoint: http://localhost:5000/api/orders
          </Typography>
          <Typography variant="body2">
            Cart Items: {cartItems.length}
          </Typography>
          <Typography variant="body2">
            Current Step: {activeStep + 1} of {steps.length}
          </Typography>
        </Alert>
      )} */}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {getStepContent(activeStep)}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '16px' }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />

            {cartItems.map((item) => (
              <Box key={item._id} sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="medium">
                  {item.name} × {item.quantity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 1 }}>
              <Typography variant="body2">
                Subtotal: ₦{getCartTotalPrice().toLocaleString()}
              </Typography>
              <Typography variant="body2">
                Shipping: Free
              </Typography>
              <Typography variant="body2">
                Tax (0%): ₦{(getCartTotalPrice()).toLocaleString()}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              Total: ₦{(getCartTotalPrice()).toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />

      {/* Loading overlay */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6">Processing your order...</Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we redirect you to payment
            </Typography>
          </Paper>
        </Box>
      )}
    </Container>
  );
}