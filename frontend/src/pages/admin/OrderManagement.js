// components/admin/OrderManagement.js
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
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { getOrders, updateOrderStatus } from '../../services/adminService';

const StatusChip = ({ status }) => {
  const getColor = (status) => {
    switch (status) {
      case 'pending': return 'default';
      case 'processing': return 'secondary';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Chip
      label={status?.charAt(0).toUpperCase() + status?.slice(1)}
      color={getColor(status)}
      size="small"
    />
  );
};

const PaymentChip = ({ status }) => {
  const getColor = (status) => {
    switch (status) {
      case 'successful': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Chip
      label={status?.charAt(0).toUpperCase() + status?.slice(1)}
      color={getColor(status)}
      size="small"
    />
  );
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Fetching orders...');
      
      const ordersData = await getOrders();
      console.log('📦 Orders data received:', ordersData);
      
      // Ensure orders is always an array
      const safeOrders = Array.isArray(ordersData) ? ordersData : [];
      setOrders(safeOrders);
      
      console.log('✅ Orders set:', safeOrders.length, 'orders');
      
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
      setOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders(); // Refresh the list
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>Loading orders...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Order Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Order Status</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {error ? 'Error loading orders' : 'No orders found'}
                    </Typography>
                    {!error && (
                      <Button 
                        variant="outlined" 
                        onClick={fetchOrders}
                        sx={{ mt: 2 }}
                      >
                        Retry Loading Orders
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id || order.orderNumber}>
                    <TableCell>{order.orderNumber || 'N/A'}</TableCell>
                    <TableCell>
                      {order.user?.firstName} {order.user?.lastName}
                    </TableCell>
                    <TableCell>₦{order.totalAmount?.toLocaleString() || '0'}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        size="small"
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="processing">Processing</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <PaymentChip status={order.payment?.status} />
                    </TableCell>
                    <TableCell>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewDetails(order)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Order Details Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Order Details - {selectedOrder?.orderNumber || 'N/A'}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="h6" gutterBottom>Customer Information</Typography>
              <Typography>
                {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}
              </Typography>
              <Typography>{selectedOrder.user?.email}</Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Shipping Address</Typography>
              <Typography>{selectedOrder.shippingAddress?.address}</Typography>
              <Typography>
                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
              </Typography>
              <Typography>{selectedOrder.shippingAddress?.country}</Typography>
              <Typography>Phone: {selectedOrder.shippingAddress?.phone}</Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Order Items</Typography>
              {selectedOrder.items?.map((item, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography>
                    {item.quantity} × {item.name} - ₦{item.price?.toLocaleString()} each
                  </Typography>
                </Box>
              ))}

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Payment Information</Typography>
              <Typography>Total: ₦{selectedOrder.totalAmount?.toLocaleString()}</Typography>
              <Typography>Status: {selectedOrder.payment?.status}</Typography>
              {selectedOrder.payment?.transactionId && (
                <Typography>Transaction ID: {selectedOrder.payment.transactionId}</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}