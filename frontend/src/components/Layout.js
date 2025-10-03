import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  Notifications,
  AccountCircle,
  Search,
  Home,
  Store,
  Category,
  LocalOffer,
  Favorite,
  History,
  Person,
  Settings,
  Support,
  Dashboard,
  Logout,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getStoredUserInfo, logoutUser } from '../services/authService';

const SIDEBAR_WIDTH = 280;

export default function Layout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { cartItems } = useCart();
  const userInfo = getStoredUserInfo();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);
  const openProfileMenu = (e) => setProfileMenuAnchor(e.currentTarget);
  const closeProfileMenu = () => setProfileMenuAnchor(null);

  const handleLogout = () => {
    logoutUser();
    closeProfileMenu();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Products', icon: <Store />, path: '/products' },
    // { text: 'Categories', icon: <Category />, path: '/categories' },
    // { text: 'Special Offers', icon: <LocalOffer />, path: '/offers' },
    { text: 'Wishlist', icon: <Favorite />, path: '/wishlist' },
    { text: 'Order History', icon: <History />, path: '/my-orders' },
  ];

  const accountItems = [
    { text: 'My Profile', icon: <Person />, path: '/profile' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
    { text: 'Help & Support', icon: <Support />, path: '/support' },
  ];

  const isActive = (path) => location.pathname === path;

  

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  

  const SidebarContent = () => (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* User Profile Section */}
      <Box sx={{ textAlign: 'center', mb: 3, p: 2, bgcolor: 'rgba(122, 60, 255, 0.05)', borderRadius: 2 }}>
        <Avatar
          sx={{
            width: 60,
            height: 60,
            mx: 'auto',
            mb: 2,
            bgcolor: '#7a3cff',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          {userInfo?.firstName?.[0]}{userInfo?.lastName?.[0]}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {userInfo?.firstName} {userInfo?.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {userInfo?.email}
        </Typography>
        {userInfo?.isAdmin && (
          <Chip
            label="Admin"
            size="small"
            color="primary"
            sx={{ mt: 1, fontSize: '0.75rem' }}
          />
        )}
      </Box>

      {/* Main Navigation */}
      <List sx={{ flexGrow: 1 }}>
        <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontSize: '0.8rem' }}>
          Shopping
        </Typography>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileSidebarOpen(false);
              }}
              selected={isActive(item.path)}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider sx={{ my: 2 }} />

        <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontSize: '0.8rem' }}>
          Account
        </Typography>
        {accountItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileSidebarOpen(false);
              }}
              selected={isActive(item.path)}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Shopping Cart Item */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate('/cart');
              if (isMobile) setMobileSidebarOpen(false);
            }}
            selected={isActive('/cart')}
            sx={{
              borderRadius: '8px',
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <ShoppingCart />
            </ListItemIcon>
            <ListItemText primary="Shopping Cart" />
            <Badge badgeContent={cartItems.length} color="error" />
          </ListItemButton>
        </ListItem>

        {/* Admin Dashboard Link */}
        {userInfo?.isAdmin && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontSize: '0.8rem' }}>
              Administration
            </Typography>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate('/admin');
                  if (isMobile) setMobileSidebarOpen(false);
                }}
                selected={isActive('/admin')}
                sx={{
                  borderRadius: '8px',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Admin Dashboard" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>

      {/* Logout Button */}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '8px',
              color: 'error.main',
              '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.08)' },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: `${SIDEBAR_WIDTH}px 1fr` },
      gridTemplateRows: '64px 1fr',
      minHeight: '100vh',
      bgcolor: '#f8f9fa'
    }}>
      {/* Header - spans both columns */}
      <AppBar

        position="sticky"
        className={scrolled ? 'scrolled' : ''}
        sx={{
          gridColumn: '1 / -1',
          gridRow: '1 / 2',
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {/* Show menu icon only on mobile */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleMobileSidebar}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Hijab World
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton color="inherit" onClick={() => navigate('/cart')}>
              <Badge badgeContent={cartItems.length} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={openProfileMenu}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#7a3cff' }}>
                {userInfo?.firstName?.[0]}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileSidebarOpen}
        onClose={toggleMobileSidebar}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            mt: '64px',
            height: 'calc(100vh - 64px)',
            border: 'none',
            boxShadow: '2px 0 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <SidebarContent />
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        sx={{
          gridColumn: '1 / 2',
          gridRow: '2 / 3',
          display: { xs: 'none', md: 'block' },
          width: SIDEBAR_WIDTH,
          bgcolor: 'white',
          borderRight: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '2px 0 20px rgba(0, 0, 0, 0.1)',
          height: 'calc(100vh - 64px)',
          position: 'sticky',
          top: '64px',
          overflowY: 'auto',
        }}
      >
        <SidebarContent />
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          gridColumn: { xs: '1 / -1', md: '2 / 3' },
          gridRow: '2 / 3',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          p: 3,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1400px',
            bgcolor: 'white',
            borderRadius: '16px',
            p: { xs: 2, md: 4 },
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.08)',
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={closeProfileMenu}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              mx: 'auto',
              mb: 1,
              bgcolor: '#7a3cff',
            }}
          >
            {userInfo?.firstName?.[0]}
          </Avatar>
          <Typography variant="subtitle2" fontWeight="bold">
            {userInfo?.firstName} {userInfo?.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {userInfo?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => { navigate('/profile'); closeProfileMenu(); }}>
          <AccountCircle sx={{ mr: 2 }} />
          My Profile
        </MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); closeProfileMenu(); }}>
          <AccountCircle sx={{ mr: 2 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <AccountCircle sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}