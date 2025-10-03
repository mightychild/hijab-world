// components/admin/ProductManagement.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Chip,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  Card,
  CardMedia,
  Input,
  FormHelperText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteImageIcon,
} from '@mui/icons-material';
import { getAdminProducts, createProduct, deleteProduct } from '../../services/adminService';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Add Product Dialog State
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '0',
    featured: false,
    sizes: [],
    colors: [],
    tags: '',
    discount: '0'
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const categories = [
    { value: 'hijab', label: 'Hijabs' },
    { value: 'abaya', label: 'Abayas' },
    { value: 'jalabiya', label: 'Jalabiyas' },
    { value: 'accessory', label: 'Accessories' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  const colors = ['Black', 'White', 'Navy', 'Burgundy', 'Gray', 'Brown', 'Beige', 'Pink', 'Blue', 'Green', 'Purple'];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const filters = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
      };

      const response = await getAdminProducts(filters);
      
      setProducts(response.products || []);
      setTotalProducts(response.total || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products: ' + error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  // Handle image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length + images.length > 4) {
      setError('Maximum 4 images allowed');
      return;
    }

    // Validate files
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        setError(`Invalid file type: ${file.name}. Please upload images only.`);
        return false;
      }
      
      if (!isValidSize) {
        setError(`File too large: ${file.name}. Maximum size is 5MB.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    const newImages = [...images, ...validFiles];
    setImages(newImages);

    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    
    setError(''); // Clear errors
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
    
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
  };

  const handleAddProduct = async () => {
    try {
      setCreating(true);
      setError('');
      setSuccess('');
      
      // Basic validation
      if (!newProduct.name || !newProduct.price || !newProduct.category) {
        setError('Please fill in Name, Price, and Category fields');
        return;
      }

      if (images.length === 0) {
        setError('Please upload at least one product image');
        return;
      }

      // Create FormData - SIMPLIFIED VERSION
      const formData = new FormData();
      
      // Append basic fields as strings
      formData.append('name', newProduct.name.trim());
      formData.append('description', (newProduct.description || '').trim());
      formData.append('price', newProduct.price.toString());
      formData.append('category', newProduct.category);
      formData.append('stock', (parseInt(newProduct.stock) || 0).toString());
      formData.append('featured', newProduct.featured.toString());
      formData.append('discount', (parseFloat(newProduct.discount) || 0).toString());
      
      // Append arrays as JSON strings (only if they have values)
      if (newProduct.sizes.length > 0) {
        formData.append('sizes', JSON.stringify(newProduct.sizes));
      }
      if (newProduct.colors.length > 0) {
        formData.append('colors', JSON.stringify(newProduct.colors));
      }
      if (newProduct.tags && newProduct.tags.trim()) {
        const tagsArray = newProduct.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        formData.append('tags', JSON.stringify(tagsArray));
      }
      
      // Append images
      images.forEach((image) => {
        formData.append('images', image); // Field name should be 'images'
      });

      console.log('🔄 Creating product with FormData');
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }
      
      const response = await createProduct(formData);
      
      if (response.success) {
        setSuccess('Product created successfully!');
        setAddDialogOpen(false);
        resetForm();
        fetchProducts();
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.message || 'Failed to create product. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '0',
      featured: false,
      sizes: [],
      colors: [],
      tags: '',
      discount: '0'
    });
    
    // Revoke all image preview URLs
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    setImages([]);
    setImagePreviews([]);
    setError('');
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await deleteProduct(productId);
        setSuccess('Product deleted successfully!');
        fetchProducts();
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete product: ' + error.message);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#7a3cff' }}>
        Product Management
      </Typography>

      {/* Success and Error Alerts */}
      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Search and Add Section */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            placeholder="Search products by name, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ flexGrow: 1 }}
            size="small"
          />
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
            sx={{
              bgcolor: '#7a3cff',
              '&:hover': { bgcolor: '#692fd9' },
              borderRadius: 2,
              minWidth: '140px'
            }}
          >
            Add Product
          </Button>
        </Box>
      </Paper>

      {/* Products Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Product Info</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>Loading products...</Typography>
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {searchTerm ? 'No products found matching your search' : 'No products available'}
                    </Typography>
                    {!searchTerm && (
                      <Button 
                        variant="outlined" 
                        onClick={() => setAddDialogOpen(true)}
                        sx={{ mt: 2 }}
                      >
                        Add Your First Product
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product._id} hover>
                    <TableCell>
                      <CardMedia
                        component="img"
                        src={product.images?.[0]?.url || '/placeholder-image.jpg'}
                        alt={product.name}
                        sx={{ width: 60, height: 60, borderRadius: 1, objectFit: 'cover' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {product.description?.substring(0, 50)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={product.category} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        ₦{product.price?.toLocaleString()}
                      </Typography>
                      {product.discount > 0 && (
                        <Typography variant="caption" color="error">
                          {product.discount}% OFF
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {product.stock} units
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={product.stock > 0 ? 'In Stock' : 'Out of Stock'} 
                          color={product.stock > 0 ? 'success' : 'error'} 
                          size="small" 
                        />
                        {product.featured && (
                          <Chip label="Featured" color="primary" size="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalProducts > itemsPerPage && (
          <Box display="flex" justifyContent="center" p={3}>
            <Pagination
              count={Math.ceil(totalProducts / itemsPerPage)}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
            />
          </Box>
        )}
      </Paper>

      {/* Add Product Dialog */}
      <Dialog 
        open={addDialogOpen} 
        onClose={() => !creating && setAddDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#7a3cff', 
          color: 'white',
          fontWeight: 'bold'
        }}>
          Add New Product
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Left Column - Product Details */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: '#7a3cff' }}>
                Product Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Product Name *"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    required
                    error={!newProduct.name}
                    helperText={!newProduct.name ? 'Product name is required' : ''}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Describe the product features, materials, etc."
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Price (₦) *"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                    error={!newProduct.price}
                    helperText={!newProduct.price ? 'Price is required' : ''}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Discount (%)"
                    type="number"
                    value={newProduct.discount}
                    onChange={(e) => setNewProduct({...newProduct, discount: e.target.value})}
                    inputProps={{ min: 0, max: 100 }}
                    helperText="Enter 0 for no discount"
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Stock Quantity"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <FormControl fullWidth required error={!newProduct.category}>
                    <InputLabel>Category *</InputLabel>
                    <Select
                      value={newProduct.category}
                      label="Category *"
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.value} value={category.value}>
                          {category.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {!newProduct.category && (
                      <FormHelperText>Category is required</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tags"
                    value={newProduct.tags}
                    onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})}
                    placeholder="e.g., summer, new, popular (comma separated)"
                    helperText="Separate tags with commas"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newProduct.featured}
                        onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                        color="primary"
                      />
                    }
                    label="Feature this product on homepage"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Right Column - Images & Variants */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: '#7a3cff' }}>
                Images & Variants
              </Typography>
              
              {/* Image Upload */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Product Images ({images.length}/4) *
                </Typography>
                
                <Input
                  type="file"
                  inputProps={{ 
                    accept: "image/*", 
                    multiple: true,
                  }}
                  onChange={handleImageUpload}
                  id="product-images"
                  sx={{ display: 'none' }}
                />
                <label htmlFor="product-images">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{ 
                      mb: 1,
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      height: 80
                    }}
                  >
                    <Box textAlign="center">
                      <CloudUploadIcon sx={{ fontSize: 30, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Click to upload images
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        PNG, JPG, WEBP (max 4 images, 5MB each)
                      </Typography>
                    </Box>
                  </Button>
                </label>
                <FormHelperText error={images.length === 0}>
                  {images.length === 0 ? 'At least one image is required' : 'Click × to remove images'}
                </FormHelperText>
                
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                    {imagePreviews.map((preview, index) => (
                      <Card 
                        key={index} 
                        sx={{ 
                          position: 'relative', 
                          width: 80, 
                          height: 80,
                          border: '2px solid',
                          borderColor: 'primary.main'
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={preview}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <IconButton
                          size="small"
                          sx={{ 
                            position: 'absolute', 
                            top: -8, 
                            right: -8, 
                            bgcolor: 'error.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'error.dark' },
                            width: 24,
                            height: 24
                          }}
                          onClick={() => removeImage(index)}
                        >
                          <DeleteImageIcon fontSize="small" />
                        </IconButton>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
              
              {/* Sizes */}
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Sizes</InputLabel>
                  <Select
                    multiple
                    value={newProduct.sizes}
                    label="Sizes"
                    onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {sizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              {/* Colors */}
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Colors</InputLabel>
                  <Select
                    multiple
                    value={newProduct.colors}
                    label="Colors"
                    onChange={(e) => setNewProduct({...newProduct, colors: e.target.value})}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {colors.map((color) => (
                      <MenuItem key={color} value={color}>
                        {color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={() => {
              if (!creating) {
                setAddDialogOpen(false);
                resetForm();
              }
            }}
            disabled={creating}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddProduct}
            variant="contained"
            disabled={creating || !newProduct.name || !newProduct.price || !newProduct.category || images.length === 0}
            startIcon={creating ? <CircularProgress size={16} /> : <AddIcon />}
            sx={{
              bgcolor: '#7a3cff',
              '&:hover': { bgcolor: '#692fd9' },
              minWidth: 120
            }}
          >
            {creating ? 'Creating...' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}