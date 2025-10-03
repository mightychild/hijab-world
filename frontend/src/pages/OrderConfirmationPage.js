import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { CheckCircle, ShoppingBag } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const transactionId = urlParams.get('transaction_id');
        
        if (transactionId) {
          const response = await fetch('/api/orders/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              transaction_id: transactionId,
              order_id: orderId
            })
          });

          const data = await response.json();

          if (data.success) {
            setOrder(data.order);
          } else {
            setError(data.message || 'Payment verification failed');
          }
        }
      } catch (error) {
        setError('Error verifying payment');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [orderId]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Verifying your payment...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/cart')}>
          Back to Cart
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center" sx={{ mb: 4 }}>
        <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Order Confirmed!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Thank you for your purchase
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Order #: {order?.orderNumber}
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Order Details</Typography>
        <Typography>Status: {order?.status}</Typography>
        <Typography>Total: ₦{order?.totalAmount?.toLocaleString()}</Typography>
        <Typography>Payment: {order?.payment?.status}</Typography>
      </Paper>

      <Box textAlign="center">
        <Button
          variant="contained"
          startIcon={<ShoppingBag />}
          onClick={() => navigate('/')}
          sx={{
            bgcolor: '#7a3cff',
            '&:hover': { bgcolor: '#692fd9' },
            mr: 2
          }}
        >
          Continue Shopping
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/my-orders')}
        >
          View Orders
        </Button>
      </Box>
    </Container>
  );
}