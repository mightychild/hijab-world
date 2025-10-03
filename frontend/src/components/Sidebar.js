import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Typography,
  Badge,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home,
  ShoppingCart,
  Person,
  Favorite,
  History,
  Settings,
  Store,
  Category,
  Dashboard,
  Logout,
  MenuBook,
  Support,
  AccountCircle,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getStoredUserInfo, logoutUser } from '../services/authService';

const drawerWidth = 300;

const menuItems = [
  { text: 'Home', icon: <Home />, path: '/' },
  { text: 'Products', icon: <Store />, path: '/products' },
  { text: 'Categories', icon: <Category />, path: '/categories' },
  { text: 'Wishlist', icon: <Favorite />, path: '/wishlist' },
  { text: 'Order History', icon: <History />, path: '/my-orders' },
];

const accountItems = [
  { text: 'My Profile', icon: <Person />, path: '/profile' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
  { text: 'Help & Support', icon: <Support />, path: '/support' },
];

export default function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const userInfo = getStoredUserInfo();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const UserProfileSection = () => (
    <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(122, 60, 255, 0.05)' }}>
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
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        {userInfo?.firstName} {userInfo?.lastName}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {userInfo?.email}
      </Typography>
      {userInfo?.isAdmin && (
        <Chip
          label="Admin"
          size="small"
          color="primary"
          sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
        />
      )}
    </Box>
  );

  const MenuItem = ({ item }) => (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        onClick={() => navigate(item.path)}
        selected={location.pathname === item.path}
        sx={{
          borderRadius: '12px',
          mx: 1,
          '&.Mui-selected': {
            bgcolor: 'primary.main',
            color: 'white',
            boxShadow: '0 4px 12px rgba(122, 60, 255, 0.3)',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '& .MuiListItemIcon-root': {
              color: 'white',
            },
          },
          '&:hover': {
            bgcolor: 'rgba(122, 60, 255, 0.08)',
            transform: 'translateX(4px)',
            transition: 'all 0.2s ease',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText 
          primary={item.text} 
          primaryTypographyProps={{ 
            fontWeight: location.pathname === item.path ? '600' : '500',
            fontSize: '0.95rem'
          }}
        />
        {item.text === 'Shopping Cart' && cartItems.length > 0 && (
          <Badge
            badgeContent={cartItems.length}
            color="error"
            sx={{ mr: 1 }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
    }}>
      {/* Header */}
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #7a3cff 30%, #9d6aff 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          Hijab World
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Modest Fashion Destination
        </Typography>
      </Box>

      {/* User Profile */}
      <UserProfileSection />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
        {/* Main Navigation */}
        <List sx={{ px: 1 }}>
          <Typography variant="overline" sx={{ px: 3, color: 'text.secondary', fontWeight: '600', fontSize: '0.8rem' }}>
            Shopping
          </Typography>
          {menuItems.map((item) => (
            <MenuItem key={item.text} item={item} />
          ))}
        </List>

        <Divider sx={{ my: 2, mx: 2 }} />

        {/* Account Section */}
        <List sx={{ px: 1 }}>
          <Typography variant="overline" sx={{ px: 3, color: 'text.secondary', fontWeight: '600', fontSize: '0.8rem' }}>
            Account
          </Typography>
          {accountItems.map((item) => (
            <MenuItem key={item.text} item={item} />
          ))}
        </List>

        <Divider sx={{ my: 2, mx: 2 }} />

        {/* Cart Item */}
        <List sx={{ px: 1 }}>
          <MenuItem item={{ text: 'Shopping Cart', icon: <ShoppingCart />, path: '/cart' }} />
        </List>

        {/* Admin Dashboard Link */}
        {userInfo?.isAdmin && (
          <>
            <Divider sx={{ my: 2, mx: 2 }} />
            <List sx={{ px: 1 }}>
              <Typography variant="overline" sx={{ px: 3, color: 'text.secondary', fontWeight: '600', fontSize: '0.8rem' }}>
                Administration
              </Typography>
              <MenuItem item={{ text: 'Admin Dashboard', icon: <Dashboard />, path: '/admin' }} />
            </List>
          </>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: '12px',
            color: 'error.main',
            '&:hover': {
              bgcolor: 'rgba(244, 67, 54, 0.08)',
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
            boxShadow: '2px 0 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
            boxShadow: '2px 0 20px rgba(0, 0, 0, 0.1)',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}