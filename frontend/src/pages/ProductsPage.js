import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Container,
  TextField,
  MenuItem,
  Pagination,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Rating,
  Fab,
  Slider,
  FormControlLabel,
  Checkbox,
  Snackbar
} from '@mui/material';
import {
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
  Search,
  FilterList,
  ShoppingCart,
  LocalOffer,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProducts, getProductCategories } from '../services/productService';
import { addToWishlist, removeFromWishlist, getWishlist } from '../services/wishlistService';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('newest');
  const [inStock, setInStock] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  
  const itemsPerPage = 12;
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchWishlist();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, priceRange, sortBy, inStock, featured]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Fetching products...');
      
      // Create filters object from your state variables
      const filters = {
        page,
        limit: itemsPerPage,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchTerm,
        featured: featured ? 'true' : undefined,
        inStock: inStock ? 'true' : undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortBy,
        sortOrder: 'desc'
      };
      
      console.log('📋 Filters:', filters);
      
      const response = await getProducts(filters);
      console.log('📦 Products API response:', response);
      
      // Handle different response formats
      let productsData = [];
      
      if (Array.isArray(response)) {
        productsData = response;
      } else if (response && response.products && Array.isArray(response.products)) {
        productsData = response.products;
      } else if (response && response.data && Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response && response.data && response.data.products && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      } else {
        console.warn('⚠️ Unexpected products response format:', response);
        productsData = [];
      }
      
      setProducts(productsData);
      
      // Set price range based on actual products
      if (productsData.length > 0) {
        const prices = productsData.map(p => p.price).filter(price => price != null);
        if (prices.length > 0) {
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange([minPrice, maxPrice]);
        }
      }
      
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError('Failed to load products: ' + err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('🔄 Fetching categories...');
      let categoriesData;
      
      try {
        const response = await getProductCategories();
        console.log('📦 Categories API response:', response);
        
        // Try multiple response formats
        if (Array.isArray(response)) {
          categoriesData = response;
        } else if (response && response.data) {
          categoriesData = response.data;
        } else if (response && Array.isArray(response.categories)) {
          categoriesData = response.categories;
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (apiError) {
        console.warn('⚠️ Categories API failed, using fallback');
        // Use hardcoded fallback categories
        categoriesData = ['hijab', 'abaya', 'jalabiya', 'accessory'];
      }
      
      // Ensure we have an array and format it properly
      const safeCategories = Array.isArray(categoriesData) 
        ? categoriesData.filter(cat => cat && typeof cat === 'string')
        : ['hijab', 'abaya', 'jalabiya', 'accessory'];
      
      console.log('✅ Final categories:', safeCategories);
      setCategories(safeCategories);
      
    } catch (err) {
      console.error('❌ Failed to load categories:', err);
      // Ultimate fallback
      setCategories(['hijab', 'abaya', 'jalabiya', 'accessory']);
    }
  };

  const fetchWishlist = async () => {
    try {
      const wishlistData = await getWishlist();
      setWishlist(wishlistData.items || wishlistData || []);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = Array.isArray(products) ? [...products] : [];

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product?.category === selectedCategory);
    }

    if (priceRange[0] > 0 || priceRange[1] < 100000) {
      filtered = filtered.filter(product => 
        product?.price >= priceRange[0] && product?.price <= priceRange[1]
      );
    }

    if (inStock) {
      filtered = filtered.filter(product => product?.stock > 0);
    }

    if (featured) {
      filtered = filtered.filter(product => product?.featured);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a?.price || 0) - (b?.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b?.price || 0) - (a?.price || 0));
        break;
      case 'name':
        filtered.sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
        break;
      case 'rating':
        filtered.sort((a, b) => (b?.rating || 0) - (a?.rating || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
        break;
    }

    setFilteredProducts(filtered);
    setPage(1); // Reset to first page when filters change
  };

  const handleAddToCart = (product) => {
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

  const handleToggleWishlist = async (product) => {
    if (!product?._id) return;
    
    try {
      const isInWishlist = wishlist.some(item => item?.product?._id === product._id || item._id === product._id);
      
      if (isInWishlist) {
        await removeFromWishlist(product._id);
        setWishlist(wishlist.filter(item => item?.product?._id !== product._id && item._id !== product._id));
        showSnackbar('Removed from wishlist');
      } else {
        await addToWishlist(product._id);
        setWishlist([...wishlist, product]);
        showSnackbar('Added to wishlist!');
      }
    } catch (err) {
      showSnackbar('Failed to update wishlist');
    }
  };

  const showSnackbar = (message) => {
    setSnackbar({ open: true, message });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 100000]);
    setInStock(false);
    setFeatured(false);
    setSortBy('newest');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold', 
          color: '#7a3cff',
        }}>
          Our Collection
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover beautiful modest fashion pieces
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Search */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          {/* Category Filter - FIXED */}
          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Price Range */}
          <Grid item xs={12} md={3}>
            <Box>
              <Typography gutterBottom>Price Range: ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}</Typography>
              <Slider
                value={priceRange}
                onChange={(e, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={100000}
                step={1000}
                sx={{ color: '#7a3cff' }}
              />
            </Box>
          </Grid>

          {/* Sort By */}
          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
            </TextField>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={clearFilters}
              sx={{ mb: 1 }}
            >
              Clear Filters
            </Button>
          </Grid>

          {/* Checkbox Filters with Debug Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    color="primary"
                  />
                }
                label="In Stock Only"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    color="primary"
                  />
                }
                label="Featured Only"
              />
              
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Count */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Showing {paginatedProducts.length} of {filteredProducts.length} products
        </Typography>
        <Chip 
          label={`${filteredProducts.length} products found`} 
          color="primary" 
          variant="outlined" 
        />
      </Box>

      {/* Products Grid */}
      <Grid container spacing={2}>
        {paginatedProducts.map((product) => {
          if (!product) return null;
          
          const isInWishlist = wishlist.some(item => 
            item?.product?._id === product._id || item._id === product._id
          );
          const isOutOfStock = product.stock === 0;
          const discountedPrice = product.discount > 0 
            ? product.price * (1 - product.discount / 100)
            : null;

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id} sx={{ display: 'flex' }}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                width: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                }
              }}>
                {/* Product Image */}
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images?.[0]?.url || '/placeholder-image.jpg'}
                    alt={product.name}
                    sx={{ 
                      objectFit: 'cover',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                    onClick={() => navigate(`/product/${product._id}`)}
                  />
                  
                  {/* Wishlist Button */}
                  <IconButton
                    onClick={() => handleToggleWishlist(product)}
                    sx={{ 
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'white',
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    {isInWishlist ? (
                      <Favorite color="error" />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>

                  {/* Badges */}
                  <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 1 }}>
                    {product.featured && (
                      <Chip
                        label="Featured"
                        color="primary"
                        size="small"
                      />
                    )}
                    {product.discount > 0 && (
                      <Chip
                        icon={<LocalOffer />}
                        label={`${product.discount}% OFF`}
                        color="error"
                        size="small"
                      />
                    )}
                    {isOutOfStock && (
                      <Chip
                        label="Out of Stock"
                        color="error"
                        size="small"
                      />
                    )}
                  </Box>
                </Box>

                <CardContent sx={{ 
                  flexGrow: 1, 
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}>
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    gutterBottom 
                    noWrap
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { color: 'primary.main' },
                      fontSize: '1rem',
                      lineHeight: 1.3,
                      minHeight: '2.6em'
                    }}
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    {product.name}
                  </Typography>
                  
                  {/* Rating */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Rating value={product.rating || 0} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary">
                      ({product.numReviews || 0})
                    </Typography>
                  </Box>

                  {/* Category */}
                  <Chip 
                    label={product.category} 
                    size="small" 
                    variant="outlined"
                    sx={{ 
                      alignSelf: 'flex-start',
                      fontSize: '0.7rem',
                      height: '24px'
                    }}
                  />

                  {/* Price */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
                    {discountedPrice ? (
                      <>
                        <Typography variant="h6" color="primary" fontWeight="bold" fontSize="1.1rem">
                          ₦{discountedPrice.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          ₦{product.price.toLocaleString()}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="h6" color="primary" fontWeight="bold" fontSize="1.1rem">
                        ₦{product.price.toLocaleString()}
                      </Typography>
                    )}
                  </Box>

                  {/* Stock */}
                  <Typography variant="caption" color={product.stock > 0 ? 'success.main' : 'error.main'}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddShoppingCart />}
                    disabled={isOutOfStock}
                    onClick={() => handleAddToCart(product)}
                    sx={{
                      bgcolor: '#7a3cff',
                      '&:hover': { bgcolor: '#692fd9' },
                      fontSize: '0.9rem',
                      py: 0.8,
                      minHeight: '40px'
                    }}
                  >
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* No Products Found */}
      {!loading && paginatedProducts.length === 0 && (
        <Box textAlign="center" sx={{ py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search or filter criteria
          </Typography>
          <Button 
            variant="outlined" 
            onClick={clearFilters}
            sx={{ mt: 2 }}
          >
            Clear All Filters
          </Button>
        </Box>
      )}

      {/* Pagination */}
      {filteredProducts.length > itemsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(filteredProducts.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* Floating Action Button for Cart */}
      <Fab
        color="primary"
        aria-label="cart"
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24,
          bgcolor: '#7a3cff'
        }}
        onClick={() => navigate('/cart')}
      >
        <ShoppingCart />
      </Fab>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
  );
}