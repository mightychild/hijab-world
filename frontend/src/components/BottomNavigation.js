import React from 'react';
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Badge
} from '@mui/material';
import {
  Home,
  ShoppingCart,
  Person,
  Favorite,
  Menu
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function MobileBottomNavigation({ handleDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();

  const navigationItems = [
    { label: 'Home', icon: <Home />, path: '/' },
    { label: 'Wishlist', icon: <Favorite />, path: '/wishlist' },
    { label: 'Cart', icon: <ShoppingCart />, path: '/cart', badge: cartItems.length },
    { label: 'Profile', icon: <Person />, path: '/profile' },
    { label: 'Menu', icon: <Menu />, action: handleDrawerToggle },
  ];

  const handleChange = (event, newValue) => {
    const item = navigationItems[newValue];
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const currentIndex = navigationItems.findIndex(item => 
    item.path === location.pathname || (item.path === '/' && location.pathname === '/')
  );

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        display: { xs: 'block', md: 'none' },
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)'
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={currentIndex}
        onChange={handleChange}
        showLabels
        sx={{
          bgcolor: 'background.paper',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            px: 1,
            color: 'text.secondary',
            '&.Mui-selected': {
              color: '#7a3cff',
            },
          },
        }}
      >
        {navigationItems.map((item, index) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={
              item.badge > 0 ? (
                <Badge badgeContent={item.badge} color="error" overlap="circular">
                  <Box sx={{ color: currentIndex === index ? '#7a3cff' : 'inherit' }}>
                    {item.icon}
                  </Box>
                </Badge>
              ) : (
                <Box sx={{ color: currentIndex === index ? '#7a3cff' : 'inherit' }}>
                  {item.icon}
                </Box>
              )
            }
            sx={{
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                mt: 0.5,
                ...(currentIndex === index && {
                  fontWeight: 600,
                }),
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}