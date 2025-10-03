import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Grid,
  TextField,
  Divider,
  Paper,
  Fade,
  Zoom,
  Snackbar
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  LocalMall,
  ArrowBack,
  Payment,
  Store,
  RemoveShoppingCart
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const showSnackbar = (message) => {
    setSnackbar({ open: true, message });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      showSnackbar('Product removed from cart');
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showSnackbar('Your cart is empty. Add some items first!');
      return;
    }
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    showSnackbar(`${productName} removed from cart`);
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) {
      showSnackbar('Cart is already empty');
      return;
    }
    clearCart();
    showSnackbar('Cart cleared successfully');
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in={true} timeout={800}>
          <Box textAlign="center" sx={{ py: 8 }}>
            <LocalMall 
              sx={{ 
                fontSize: 80, 
                color: 'grey.300', 
                mb: 2,
                animation: 'pulse 2s infinite'
              }} 
            />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              Your Cart is Empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              Looks like you haven't added any beautiful items to your cart yet. Start shopping to discover our collection!
            </Typography>
            <Button
              variant="contained"
              onClick={handleContinueShopping}
              startIcon={<Store />}
              sx={{
                bgcolor: '#7a3cff',
                '&:hover': { 
                  bgcolor: '#692fd9',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(122, 60, 255, 0.3)'
                },
                borderRadius: '12px',
                py: 1.5,
                px: 4,
                fontSize: '1.1rem'
              }}
            >
              Start Shopping
            </Button>
          </Box>
        </Fade>
        
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in={true} timeout={600}>
        <Box>
          {/* Header */}
          <Box display="flex" alignItems="center" mb={4}>
            <IconButton
              component={RouterLink}
              to="/"
              sx={{ 
                mr: 2,
                color: '#7a3cff',
                '&:hover': { 
                  bgcolor: 'rgba(122, 60, 255, 0.1)',
                  transform: 'translateX(-2px)'
                }
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
              Shopping Cart
            </Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid item xs={12} md={8}>
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    layout
                  >
                    <Card sx={{ 
                      mb: 2, 
                      borderRadius: '16px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                        transform: 'translateY(-2px)'
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center">
                          {/* Product Image */}
                          <CardMedia
                            component="img"
                            image={item.images?.[0]?.url || '/placeholder-image.jpg'}
                            alt={item.name}
                            sx={{ 
                              width: 100, 
                              height: 100, 
                              objectFit: 'cover', 
                              mr: 3,
                              borderRadius: '12px',
                              cursor: 'pointer'
                            }}
                            onClick={() => navigate(`/product/${item._id}`)}
                          />

                          {/* Product Details */}
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography 
                              variant="h6" 
                              gutterBottom 
                              sx={{ 
                                fontWeight: 600,
                                cursor: 'pointer',
                                '&:hover': { color: 'primary.main' }
                              }}
                              onClick={() => navigate(`/product/${item._id}`)}
                            >
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Category: {item.category}
                            </Typography>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                              ₦{(item.price * item.quantity).toLocaleString()}
                              <Typography variant="body2" color="text.secondary" component="span">
                                {' '}(₦{item.price.toLocaleString()} each)
                              </Typography>
                            </Typography>
                          </Box>

                          {/* Quantity Controls */}
                          <Box display="flex" alignItems="center" sx={{ mx: 2 }}>
                            <IconButton
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              size="small"
                              sx={{ 
                                color: '#7a3cff',
                                '&:hover': { 
                                  bgcolor: 'rgba(122, 60, 255, 0.1)',
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              <Remove />
                            </IconButton>
                            
                            <TextField
                              value={item.quantity}
                              size="small"
                              sx={{ 
                                width: 60, 
                                mx: 1,
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  textAlign: 'center'
                                }
                              }}
                              inputProps={{ 
                                style: { textAlign: 'center' },
                                min: 1,
                                max: 99
                              }}
                              onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                            />
                            
                            <IconButton
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              size="small"
                              sx={{ 
                                color: '#7a3cff',
                                '&:hover': { 
                                  bgcolor: 'rgba(122, 60, 255, 0.1)',
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              <Add />
                            </IconButton>
                          </Box>

                          {/* Remove Button */}
                          <IconButton
                            onClick={() => handleRemoveItem(item._id, item.name)}
                            color="error"
                            sx={{ 
                              '&:hover': { 
                                bgcolor: 'rgba(244, 67, 54, 0.1)',
                                transform: 'scale(1.1)'
                              }
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Clear Cart Button */}
              <Button
                onClick={handleClearCart}
                color="error"
                startIcon={<RemoveShoppingCart />}
                sx={{ 
                  mt: 2,
                  borderRadius: '12px',
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Clear Entire Cart
              </Button>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={4}>
              <Zoom in={true} timeout={800}>
                <Paper elevation={4} sx={{ p: 3, borderRadius: '16px', position: 'sticky', top: 20 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <ShoppingCart sx={{ mr: 1, color: '#7a3cff' }} />
                    Order Summary
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
                      <Typography variant="body1">Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items):</Typography>
                      <Typography variant="body1" fontWeight="600">
                        ₦{getCartTotalPrice().toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
                      <Typography variant="body1">Shipping:</Typography>
                      <Typography variant="body1" color="success.main" fontWeight="600">
                        Free
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
                      <Typography variant="body1">Tax (0):</Typography>
                      <Typography variant="body1">
                        ₦{(getCartTotalPrice()).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary" fontWeight="700">
                      ₦{(getCartTotalPrice()).toLocaleString()}
                    </Typography>
                  </Box>
                  
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleCheckout}
                    startIcon={<Payment />}
                    sx={{
                      bgcolor: '#7a3cff',
                      '&:hover': { 
                        bgcolor: '#692fd9',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(122, 60, 255, 0.3)'
                      },
                      borderRadius: "12px",
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      mb: 2
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleContinueShopping}
                    sx={{ 
                      borderRadius: "12px",
                      py: 1.2,
                      '&:hover': {
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Continue Shopping
                  </Button>

                  {/* Security Badge */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: '12px', textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      🔒 Secure Checkout • SSL Encrypted
                    </Typography>
                  </Box>
                </Paper>
              </Zoom>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Container>
  );
}