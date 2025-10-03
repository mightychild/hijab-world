import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
  IconButton,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { getMyOrders } from '../services/orderService';

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getMyOrders();
      setOrders(response.orders || []);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'primary';
      case 'processing': return 'secondary';
      case 'pending': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <ReceiptIcon sx={{ mr: 2 }} />
        My Orders
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No orders yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start shopping to see your orders here
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.href = '/'}
            sx={{
              bgcolor: '#7a3cff',
              '&:hover': { bgcolor: '#692fd9' }
            }}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order #</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.items.length} item(s)
                    </TableCell>
                    <TableCell>₦{order.totalAmount?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => window.location.href = `/order-success?orderId=${order._id}`}
                      >
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}