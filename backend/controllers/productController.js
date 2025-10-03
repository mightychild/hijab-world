const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Create a product with images
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  try {
    console.log('=== 🎯 PRODUCT CREATION REQUEST DIAGNOSTICS ===');
    console.log('📋 Request Details:');
    console.log('  - URL:', req.originalUrl);
    console.log('  - Method:', req.method);
    console.log('  - Content-Type:', req.headers['content-type']);
    console.log('  - Authorization:', req.headers.authorization ? 'Present' : 'Missing');
    
    console.log('📦 Request Body Analysis:');
    console.log('  - Body keys:', Object.keys(req.body));
    
    console.log('🖼️ Files Analysis:');
    console.log('  - Files count:', req.files ? req.files.length : 0);
    
    console.log('👤 User Info:');
    console.log('  - User ID:', req.user?._id);
    console.log('  - Is Admin:', req.user?.isAdmin);

    // Check if we have any data at all
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('❌ CRITICAL: No form data received in req.body');
      return res.status(400).json({
        success: false,
        message: 'No form data received. The form might not be sending data correctly.',
      });
    }

    // SIMPLE VALIDATION - Check required fields directly from req.body
    if (!req.body.name || !req.body.price || !req.body.category) {
      console.log('❌ Validation failed - missing required fields in req.body');
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category are required',
      });
    }

    let images = [];
    
    // Handle image upload if files exist - USING CLOUDINARY
    if (req.files && req.files.length > 0) {
      console.log('🖼️ Processing images with Cloudinary...');
      console.log('Number of files:', req.files.length);
      
      try {
        const uploadPromises = req.files.map(async (file, index) => {
          console.log(`📤 Uploading image ${index + 1} to Cloudinary:`, file.originalname);
          
          try {
            const result = await uploadToCloudinary(file.buffer);
            console.log(`✅ Image ${index + 1} uploaded successfully:`, result.secure_url);
            
            return {
              public_id: result.public_id,
              url: result.secure_url,
              alt: req.body.name || `Product image ${index + 1}`
            };
          } catch (uploadError) {
            console.error(`❌ Failed to upload image ${index + 1}:`, uploadError);
            throw uploadError;
          }
        });

        // Wait for all uploads to complete
        images = await Promise.all(uploadPromises);
        console.log('✅ All images processed successfully:', images.length);
        
      } catch (uploadError) {
        console.error('❌ Cloudinary upload failed:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload product images. Please try again.',
        });
      }
    } else {
      console.log('⚠️  No images provided for product');
      return res.status(400).json({
        success: false,
        message: 'At least one product image is required',
      });
    }

    // Parse product data from form fields
    const productData = {
      name: req.body.name ? req.body.name.trim() : '',
      description: req.body.description ? req.body.description.trim() : '',
      price: req.body.price ? parseFloat(req.body.price) : 0,
      category: req.body.category ? req.body.category.trim() : '',
      stock: req.body.stock ? parseInt(req.body.stock) : 0,
      featured: req.body.featured === 'true',
      discount: req.body.discount ? parseFloat(req.body.discount) : 0,
      images: images
    };

    // Parse arrays from JSON strings if provided
    if (req.body.sizes) {
      try {
        productData.sizes = typeof req.body.sizes === 'string' ? JSON.parse(req.body.sizes) : req.body.sizes;
      } catch (e) {
        productData.sizes = [];
      }
    }

    if (req.body.colors) {
      try {
        productData.colors = typeof req.body.colors === 'string' ? JSON.parse(req.body.colors) : req.body.colors;
      } catch (e) {
        productData.colors = [];
      }
    }

    if (req.body.tags) {
      try {
        productData.tags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags;
      } catch (e) {
        // If JSON parsing fails, try comma-separated string
        if (typeof req.body.tags === 'string') {
          productData.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        } else {
          productData.tags = [];
        }
      }
    }

    console.log('📊 Final product data to save:');
    console.log('- Name:', productData.name);
    console.log('- Price:', productData.price);
    console.log('- Category:', productData.category);
    console.log('- Stock:', productData.stock);
    console.log('- Images:', productData.images.length);
    console.log('- Image URLs:', productData.images.map(img => img.url));

    // Validate price is positive
    if (productData.price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      });
    }

    // Create and save product
    console.log('💾 Saving product to database...');
    const product = new Product(productData);
    const savedProduct = await product.save();
    
    console.log('✅ Product created successfully! ID:', savedProduct._id);
    console.log('=== PRODUCT CREATION COMPLETE ===');

    res.status(201).json({
      success: true,
      message: `Product created successfully with ${images.length} images`,
      data: savedProduct
    });

  } catch (error) {
    console.error('❌ Product creation error:', error);
    
    // Specific error handling for Cloudinary
    if (error.message.includes('Cloudinary') || error.message.includes('upload')) {
      return res.status(500).json({
        success: false,
        message: 'Image upload failed. Please check your Cloudinary configuration.',
        error: error.message
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating product'
    });
  }
});

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = { ...req.body };

    // If images are being updated, handle Cloudinary upload
    if (req.files && req.files.length > 0) {
      console.log('🖼️ Processing updated images with Cloudinary...');
      
      const uploadPromises = req.files.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer);
        return {
          public_id: result.public_id,
          url: result.secure_url,
          alt: updateData.name || `Product image`
        };
      });

      const images = await Promise.all(uploadPromises);
      updateData.images = images;
    }

    const product = await Product.findByIdAndUpdate(
      productId, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Product updated successfully', 
      data: product 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// Other controller functions remain the same...
const getProducts = asyncHandler(async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      featured, 
      search, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt',
      sortOrder = 'desc',
      inStock,
      tags
    } = req.query;

    let query = {};
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Stock filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    } else if (inStock === 'false') {
      query.stock = 0;
    }
    
    // Tags filter
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Product.countDocuments(query);
    
    // Get min and max prices for filter ranges
    const priceStats = await Product.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          totalProducts: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        filters: {
          minPrice: priceStats[0]?.minPrice || 0,
          maxPrice: priceStats[0]?.maxPrice || 0,
          totalProducts: priceStats[0]?.totalProducts || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

const searchProducts = asyncHandler(async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const products = await Product.find({ $text: { $search: query } })
      .select('-__v')
      .limit(20);

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ featured: true })
      .select('-__v')
      .limit(12);
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category })
      .select('-__v')
      .limit(20);

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
});

// Export all functions
module.exports = {
  createProduct,
  getProducts,
  getCategories,
  searchProducts,
  getFeaturedProducts,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
};