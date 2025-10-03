import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  AddShoppingCart as AddCartIcon,
  Remove as RemoveIcon,
  ShoppingBag,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getWishlist, removeFromWishlist } from '../services/wishlistService';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError('');
      const wishlistData = await getWishlist();
      
      // Handle different response structures
      const items = wishlistData.items || wishlistData || [];
      setWishlistItems(Array.isArray(items) ? items : []);
    } catch (err) {
      setError('Failed to load wishlist');
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlistItems(items => items.filter(item => 
        item.product?._id !== productId && item._id !== productId
      ));
      showSnackbar('Product removed from wishlist');
    } catch (err) {
      setError('Failed to remove item from wishlist');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const productData = product.product || product;
      addToCart({
        _id: productData._id,
        name: productData.name,
        price: productData.price,
        images: productData.images,
        category: productData.category,
        stock: productData.stock
      });
      showSnackbar('Product added to cart!');
    } catch (err) {
      setError('Failed to add product to cart');
    }
  };

  const showSnackbar = (message) => {
    setSnackbar({ open: true, message });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
        <FavoriteIcon sx={{ mr: 2, color: 'error.main' }} />
        My Wishlist
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {wishlistItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <FavoriteIcon sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Save your favorite items here for easy access
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/products')}
            startIcon={<ShoppingBag />}
            sx={{
              bgcolor: '#7a3cff',
              '&:hover': { bgcolor: '#692fd9' }
            }}
          >
            Browse Products
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {wishlistItems.map((item) => {
            const product = item.product || item;
            return (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images?.[0]?.url || '/placeholder-image.jpg'}
                    alt={product.name}
                    sx={{ 
                      objectFit: 'cover',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/product/${product._id}`)}
                  />

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' }
                      }}
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.category}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      ₦{product.price?.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<AddCartIcon />}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      sx={{
                        flexGrow: 1,
                        bgcolor: '#7a3cff',
                        '&:hover': { bgcolor: '#692fd9' }
                      }}
                    >
                      Add to Cart
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      sx={{
                        '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' }
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Box>
  );
}