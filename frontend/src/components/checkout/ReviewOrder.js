import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import { AssignmentTurnedIn } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';

export default function ReviewOrder({ onPlaceOrder, onBack, shippingData, loading }) {
  const { cartItems, getCartTotalPrice } = useCart();

  const subtotal = getCartTotalPrice();
  const shippingFee = subtotal > 50000 ? 0 : 0; 
  const taxAmount = 0;
  const totalAmount = subtotal + shippingFee + taxAmount;

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <AssignmentTurnedIn sx={{ mr: 1 }} />
        Review Your Order
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Shipping Information</Typography>
        <Typography>
          {shippingData.firstName} {shippingData.lastName}
        </Typography>
        <Typography>{shippingData.email}</Typography>
        <Typography>{shippingData.phone}</Typography>
        <Typography>{shippingData.address}</Typography>
        <Typography>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</Typography>
        <Typography>{shippingData.country}</Typography>
        
        {shippingData.notes && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Order Notes:</Typography>
            <Typography variant="body2" color="text.secondary">
              {shippingData.notes}
            </Typography>
          </>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Order Items</Typography>
        <List>
          {cartItems.map((item) => (
            <ListItem key={item._id} divider>
              <ListItemText
                primary={item.name}
                secondary={`Quantity: ${item.quantity} × ₦${item.price.toLocaleString()}`}
              />
              <Typography variant="body1">
                ₦{(item.price * item.quantity).toLocaleString()}
              </Typography>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: 'right' }}>
          <Typography>Subtotal: ₦{subtotal.toLocaleString()}</Typography>
          <Typography>Shipping: ₦{shippingFee.toLocaleString()}</Typography>
          <Typography>Tax: ₦{taxAmount.toLocaleString()}</Typography>
          <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
            Total: ₦{totalAmount.toLocaleString()}
          </Typography>
        </Box>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        You will be redirected to Paystack secure payment page to complete your purchase.
      </Alert>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={onPlaceOrder}
          disabled={loading}
          sx={{
            bgcolor: '#7a3cff',
            '&:hover': { bgcolor: '#692fd9' },
            minWidth: '120px'
          }}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </Button>
      </Box>
    </Box>
  );
}