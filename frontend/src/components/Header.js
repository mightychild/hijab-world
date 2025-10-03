import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge
} from '@mui/material';
import {
  Menu,
  ShoppingCart,
  Search,
  AccountCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  return (
    <AppBar 
      position="sticky"
      elevation={2} 
      sx={{ 
        bgcolor: 'background.paper', 
        color: 'text.primary',
        borderRadius: '0px', 
        mb: 3,
        top: 0, 
        zIndex: 1100, 
        width: '100%',
        transition: 'all 0.3s ease',
        '&.MuiAppBar-root': {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)' // Optional: semi-transparent
        }
      }}
    >
      <Toolbar sx={{ minHeight: '64px' }}>
        {/* Menu Button (Mobile only) */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <Menu />
        </IconButton>

        {/* Logo */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #7a3cff 30%, #9d6aff 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
            fontSize: { xs: '1.1rem', sm: '1.25rem' } 
          }}
          onClick={() => navigate('/')}
        >
          Hijab World
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          
          <IconButton 
            color="inherit" 
            size="medium"
            onClick={() => navigate('/cart')}
          >
            <Badge badgeContent={cartItems.length} color="error" max={99}>
              <ShoppingCart />
            </Badge>
          </IconButton>
          
          <IconButton 
            color="inherit"
            size="medium"
            onClick={() => navigate('/profile')}
          >
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}