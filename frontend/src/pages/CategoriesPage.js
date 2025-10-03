import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Category as CategoryIcon,
  ShoppingBag as ShoppingIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getProductCategories } from '../services/productService';

// Category details mapping
const categoryDetails = {
  hijab: { 
    label: 'Hijabs', 
    description: 'Beautiful and modest hijabs in various styles and fabrics',
    image: '/images/hijab-category.jpg'
  },
  abaya: { 
    label: 'Abayas', 
    description: 'Elegant and stylish abayas for every occasion',
    image: '/images/abaya-category.jpg'
  },
  jalabiya: { 
    label: 'Jalabiyas', 
    description: 'Comfortable and fashionable jalabiyas for daily wear',
    image: '/images/jalabiya-category.jpg'
  },
  accessory: { 
    label: 'Accessories', 
    description: 'Complete your look with beautiful accessories',
    image: '/images/accessory-category.jpg'
  }
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get categories from the database
      const response = await getProductCategories();
      
      // Handle different response structures
      const categoriesData = Array.isArray(response) ? response : 
                           response.data ? response.data : [];
      
      // Enrich category data with details
      const enrichedCategories = categoriesData.map(category => {
        const details = categoryDetails[category.value || category.name] || {
          label: category.label || category.name || 'Unknown',
          description: category.description || 'Explore our collection',
          image: '/images/default-category.jpg'
        };
        
        return {
          value: category.value || category.name,
          label: details.label,
          description: details.description,
          image: details.image,
          count: category.count || 0,
          featuredCount: category.featuredCount || 0
        };
      });
      
      setCategories(enrichedCategories);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryValue) => {
    navigate(`/products?category=${categoryValue}`);
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
      <Typography variant="h4" gutterBottom sx={{ 
        mb: 3, 
        display: 'flex', 
        alignItems: 'center',
        fontWeight: 'bold',
        color: '#7a3cff'
      }}>
        <CategoryIcon sx={{ mr: 2 }} />
        Shop by Category
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {categories.length === 0 && !loading ? (
        <Box textAlign="center" sx={{ py: 8 }}>
          <CategoryIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No categories available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Categories will appear here once they are added to the system.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/products')}
            sx={{
              bgcolor: '#7a3cff',
              '&:hover': { bgcolor: '#692fd9' }
            }}
          >
            Browse All Products
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.value}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                  }
                }}
                onClick={() => handleCategoryClick(category.value)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={category.image || '/images/default-category.jpg'}
                  alt={category.label}
                  sx={{ 
                    objectFit: 'cover',
                    filter: 'brightness(0.9)'
                  }}
                />
                <CardContent sx={{ 
                  flexGrow: 1, 
                  p: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: '600' }}>
                      {category.label}
                    </Typography>
                    <Chip 
                      label={`${category.count} items`} 
                      size="small" 
                      color="primary" 
                      variant="filled"
                      sx={{ fontWeight: '500' }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {category.description}
                  </Typography>
                  {category.featuredCount > 0 && (
                    <Chip 
                      label={`${category.featuredCount} featured`} 
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  )}
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingIcon />}
                    sx={{
                      bgcolor: '#7a3cff',
                      '&:hover': { 
                        bgcolor: '#692fd9',
                        transform: 'translateY(-2px)'
                      },
                      borderRadius: '8px',
                      py: 1
                    }}
                  >
                    Browse {category.label}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}