import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ShoppingBag,
  Favorite,
  History,
  Person,
  Receipt,
  LocalMall,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getStoredUserInfo } from '../services/authService';
import { getRecentOrders } from '../services/orderService';
import { getWishlist } from '../services/wishlistService';

const StatCard = ({ title, value, icon, color, onClick }) => (
  <Card 
    sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
      border: `1px solid ${color}30`,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      '&:hover': onClick ? {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 25px ${color}40`,
      } : {}
    }}
    onClick={onClick}
  >
    <CardContent sx={{ textAlign: 'center', p: 3 }}>
      <Box sx={{ 
        display: 'inline-flex',
        p: 1.5,
        borderRadius: '12px',
        bgcolor: `${color}20`,
        mb: 2
      }}>
        {React.cloneElement(icon, { sx: { fontSize: 32, color } })}
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1, color }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const user = getStoredUserInfo();
      setUserInfo(user);

      // Load recent orders
      try {
        const orders = await getRecentOrders();
        setRecentOrders(orders.slice(0, 3));
      } catch (error) {
        console.error('Error loading orders:', error);
        setRecentOrders([]);
      }

      // Load wishlist count
      try {
        const wishlist = await getWishlist();
        setWishlistCount(wishlist.items?.length || 0);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        setWishlistCount(0);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const dashboardItems = [
    {
      title: 'Continue Shopping',
      description: 'Browse our latest collection',
      icon: <ShoppingBag />,
      path: '/products',
      color: '#7a3cff',
      stat: 'Shop Now'
    },
    {
      title: 'My Wishlist',
      description: 'Your saved items',
      icon: <Favorite />,
      path: '/wishlist',
      color: '#ff4757',
      stat: `${wishlistCount} items`
    },
    {
      title: 'Order History',
      description: 'View past orders',
      icon: <History />,
      path: '/my-orders',
      color: '#2ecc71',
      stat: `${recentOrders.length} recent`
    },
    {
      title: 'My Profile',
      description: 'Update personal information',
      icon: <Person />,
      path: '/profile',
      color: '#3498db',
      stat: 'Edit'
    }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2,
            bgcolor: '#7a3cff',
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        >
          {userInfo?.firstName?.[0]}{userInfo?.lastName?.[0]}
        </Avatar>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome back, {userInfo?.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your account today
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={recentOrders.length}
            icon={<Receipt />}
            color="#7a3cff"
            onClick={() => navigate('/my-orders')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Wishlist Items"
            value={wishlistCount}
            icon={<Favorite />}
            color="#ff4757"
            onClick={() => navigate('/wishlist')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Account Status"
            value="Active"
            icon={<Person />}
            color="#2ecc71"
            onClick={() => navigate('/profile')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Member Since"
            value="2024"
            icon={<LocalMall />}
            color="#3498db"
          />
        </Grid>
      </Grid>

      {/* Main Dashboard Grid */}
      <Grid container spacing={3}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                }
              }}
              onClick={() => navigate(item.path)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: '12px', 
                  bgcolor: `${item.color}20`,
                  color: item.color
                }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: 24 } })}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: '600' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
                <Chip
                  label={item.stat}
                  size="small"
                  sx={{ 
                    bgcolor: `${item.color}20`,
                    color: item.color,
                    fontWeight: '500'
                  }}
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <Card sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', mb: 3 }}>
            Recent Orders
          </Typography>
          <Grid container spacing={2}>
            {recentOrders.map((order, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 2, 
                  borderRadius: '8px',
                  bgcolor: 'grey.50',
                  gap: 2
                }}>
                  <Receipt sx={{ color: 'primary.main' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight="500">
                      Order #{order.orderNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Chip
                    label={order.status}
                    size="small"
                    color={
                      order.status === 'delivered' ? 'success' :
                      order.status === 'processing' ? 'primary' : 'default'
                    }
                  />
                  <Typography variant="body2" fontWeight="600">
                    ₦{order.totalAmount?.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
      )}
    </Box>
  );
}