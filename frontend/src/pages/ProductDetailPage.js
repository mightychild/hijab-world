import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Button,
  Chip,
  Rating,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
  ArrowBack,
  Share,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProduct } from '../services/productService';
import { addToWishlist, removeFromWishlist, getWishlist } from '../services/wishlistService';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    console.log('Product ID from URL:', id);
    if (id) {
      loadProduct();
      checkWishlist();
    } else {
      setError('Product ID is missing');
      setLoading(false);
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading product with ID:', id);
      
      const response = await getProduct(id);
      console.log('Product API response:', response);
      
      // Handle different response structures
      let productData;
      
      if (response && response.product) {
        productData = response.product;
      } else if (response && response.data) {
        productData = response.data.product || response.data;
      } else if (response && response._id) {
        productData = response;
      } else {
        console.error('Unexpected response format:', response);
        setError('Product not found in response');
        return;
      }
      
      console.log('Processed product data:', productData);
      
      if (productData && productData._id) {
        setProduct(productData);
      } else {
        setError('Invalid product data received');
      }
    } catch (err) {
      console.error('Error loading product:', err);
      setError('Product not found or failed to load: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const wishlist = await getWishlist();
      const wishlistItems = wishlist.items || wishlist || [];
      const inWishlist = wishlistItems.some(item => {
        const itemId = item.product?._id || item._id;
        return itemId === id;
      });
      setIsInWishlist(inWishlist);
    } catch (err) {
      console.error('Error checking wishlist:', err);
    }
  };

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        images: product.images,
        category: product.category,
        stock: product.stock
      });
      showSnackbar(`${product.name} added to cart!`);
    } else {
      showSnackbar('Product is out of stock');
    }
  };

  const handleToggleWishlist = async () => {
    try {
      if (isInWishlist) {
        await removeFromWishlist(product._id);
        setIsInWishlist(false);
        showSnackbar('Removed from wishlist');
      } else {
        await addToWishlist(product._id);
        setIsInWishlist(true);
        showSnackbar('Added to wishlist!');
      }
    } catch (err) {
      showSnackbar('Failed to update wishlist');
    }
  };

  const showSnackbar = (message) => {
    setSnackbar({ open: true, message });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading product...
        </Typography>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Product not found'}
        </Alert>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            onClick={loadProduct} 
            variant="contained"
            sx={{
              bgcolor: '#7a3cff',
              '&:hover': { bgcolor: '#692fd9' }
            }}
          >
            Retry Loading
          </Button>
          <Button 
            onClick={() => navigate('/products')} 
            variant="outlined"
          >
            Back to Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box>
            {/* Main Image */}
            <Card 
              sx={{ 
                mb: 2,
                height: { xs: '280px', sm: '320px', md: '340px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                backgroundColor: '#fafafa'
              }}
            >
              <CardMedia
                component="img"
                image={product.images?.[selectedImage]?.url || '/placeholder-image.jpg'}
                alt={product.name}
                sx={{ 
                  objectFit: 'contain',
                  width: 'auto',
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '100%'
                }}
              />
            </Card>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  overflowX: 'auto',
                  py: 0.5,
                  maxHeight: '70px',
                  alignItems: 'center'
                }}
              >
                {product.images.map((image, index) => (
                  <Card 
                    key={index}
                    sx={{ 
                      minWidth: 60,
                      height: 60,
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid' : '1px solid',
                      borderColor: selectedImage === index ? 'primary.main' : 'grey.200',
                      borderRadius: 1,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.light',
                        transform: 'scale(1.05)'
                      }
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <CardMedia
                      component="img"
                      image={image.url}
                      alt={`${product.name} ${index + 1}`}
                      sx={{ 
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Rating value={product.rating || 0} readOnly />
            <Typography variant="body2" color="text.secondary">
              ({product.numReviews || 0} reviews)
            </Typography>
            <Chip label={product.category} color="primary" size="small" />
          </Box>

          <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
            ₦{product.price?.toLocaleString()}
          </Typography>

          {product.discount > 0 && (
            <Typography variant="h6" color="error" gutterBottom>
              {product.discount}% OFF
            </Typography>
          )}

          <Typography variant="body1" paragraph sx={{ lineHeight: 1.6, mb: 3 }}>
            {product.description}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="body2" 
              color={product.stock > 0 ? 'success.main' : 'error.main'}
              sx={{ fontWeight: 'bold' }}
            >
              {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
            </Typography>
          </Box>

          {product.sizes && product.sizes.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Available Sizes:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {product.sizes.map((size, index) => (
                  <Chip key={index} label={size} variant="outlined" size="small" />
                ))}
              </Box>
            </Box>
          )}

          {product.colors && product.colors.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Available Colors:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {product.colors.map((color, index) => (
                  <Chip 
                    key={index} 
                    label={color} 
                    variant="outlined" 
                    size="small"
                    sx={{ 
                      borderColor: 'grey.400',
                      color: 'text.primary'
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              sx={{
                bgcolor: '#7a3cff',
                '&:hover': { bgcolor: '#692fd9' },
                flexGrow: 1,
                minWidth: '200px'
              }}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            
            <IconButton
              size="large"
              color={isInWishlist ? 'error' : 'default'}
              onClick={handleToggleWishlist}
              sx={{
                border: '1px solid',
                borderColor: 'grey.300',
                width: '56px',
                height: '56px'
              }}
            >
              {isInWishlist ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
  );
}