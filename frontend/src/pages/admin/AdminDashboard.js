import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
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
} from '@mui/material';
import {
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  AttachMoney as SalesIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { getDashboardStats } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, color, onClick }) => (
  <Card 
    sx={{ 
      height: '100%', 
      backgroundColor: color || 'primary.main', 
      color: 'white',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s',
      '&:hover': onClick ? {
        transform: 'translateY(-4px)',
        boxShadow: 3
      } : {}
    }}
    onClick={onClick}
  >
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h4" component="div" gutterBottom>
            {value}
          </Typography>
          <Typography variant="body2">{title}</Typography>
        </Box>
        <Box sx={{ opacity: 0.8 }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard statistics');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatCardClick = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!stats) {
    return <Alert severity="info">No data available</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <DashboardIcon sx={{ mr: 2 }} />
        Admin Dashboard
      </Typography>

      {/* Statistics Cards with Navigation */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.usersCount}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="#1976d2"
            onClick={() => handleStatCardClick('/admin/users')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats.productsCount}
            icon={<ProductsIcon sx={{ fontSize: 40 }} />}
            color="#2e7d32"
            onClick={() => handleStatCardClick('/admin/products')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats.ordersCount}
            icon={<OrdersIcon sx={{ fontSize: 40 }} />}
            color="#ed6c02"
            onClick={() => handleStatCardClick('/admin/orders')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sales"
            value={`₦${stats.totalSales?.toLocaleString()}`}
            icon={<SalesIcon sx={{ fontSize: 40 }} />}
            color="#d32f2f"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Quick Actions</Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button 
              variant="contained" 
              startIcon={<PeopleIcon />}
              onClick={() => navigate('/admin/users')}
              sx={{
                bgcolor: '#1976d2',
                '&:hover': { bgcolor: '#1565c0' }
              }}
            >
              Manage Users
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              startIcon={<ProductsIcon />}
              onClick={() => navigate('/admin/products')}
              sx={{
                bgcolor: '#2e7d32',
                '&:hover': { bgcolor: '#1b5e20' }
              }}
            >
              Manage Products
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              startIcon={<OrdersIcon />}
              onClick={() => navigate('/admin/orders')}
              sx={{
                bgcolor: '#ed6c02',
                '&:hover': { bgcolor: '#e65100' }
              }}
            >
              Manage Orders
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Recent Orders */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Recent Orders</Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/admin/orders')}
              >
                View All Orders
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order #</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentOrders?.map((order) => (
                    <TableRow key={order._id} hover>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>
                        {order.user?.firstName} {order.user?.lastName}
                      </TableCell>
                      <TableCell>₦{order.totalAmount?.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={
                            order.status === 'delivered' ? 'success' :
                            order.status === 'shipped' ? 'primary' :
                            order.status === 'processing' ? 'secondary' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}