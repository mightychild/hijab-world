// controllers/wishlistController.js
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const asyncHandler = require('express-async-handler');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching wishlist for user:', req.user._id);
    
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('items.product', 'name price images category stock rating featured')
      .select('-__v');

    if (!wishlist) {
      console.log('Creating new empty wishlist for user:', req.user._id);
      // Create empty wishlist if it doesn't exist
      wishlist = await Wishlist.create({ 
        user: req.user._id, 
        items: [] 
      });
    }

    console.log('Wishlist fetched successfully');
    res.json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist',
      error: error.message
    });
  }
});

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
// controllers/wishlistController.js - Update the addToWishlist function
const addToWishlist = asyncHandler(async (req, res) => {
  try {
    console.log('Adding to wishlist for user:', req.user._id);
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    // Check if request body exists
    if (!req.body) {
      console.log('No request body received');
      return res.status(400).json({
        success: false,
        message: 'No data received in request body'
      });
    }

    const { productId, size, color } = req.body;

    if (!productId) {
      console.log('Product ID is required but not provided');
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
        receivedData: req.body // Include what was actually received
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      console.log('Product not found:', productId);
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      console.log('Creating new wishlist for user');
      // Create new wishlist if it doesn't exist
      wishlist = new Wishlist({
        user: req.user._id,
        items: [{ product: productId, size, color }]
      });
    } else {
      // Check if product already in wishlist
      const existingItemIndex = wishlist.items.findIndex(
        item => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        console.log('Updating existing wishlist item');
        // Update existing item
        wishlist.items[existingItemIndex].size = size || wishlist.items[existingItemIndex].size;
        wishlist.items[existingItemIndex].color = color || wishlist.items[existingItemIndex].color;
        wishlist.items[existingItemIndex].addedAt = new Date();
      } else {
        console.log('Adding new item to wishlist');
        // Add new item
        wishlist.items.push({ product: productId, size, color });
      }
    }

    await wishlist.save();
    await wishlist.populate('items.product', 'name price images category stock rating featured');

    console.log('Item added to wishlist successfully');
    res.json({
      success: true,
      message: 'Product added to wishlist',
      data: wishlist
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to wishlist',
      error: error.message
    });
  }
});

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    console.log('Removing from wishlist - Product ID:', productId, 'User:', req.user._id);

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      console.log('Wishlist not found for user:', req.user._id);
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    // Remove item from wishlist
    const initialLength = wishlist.items.length;
    wishlist.items = wishlist.items.filter(
      item => item.product.toString() !== productId
    );

    if (wishlist.items.length === initialLength) {
      console.log('Item not found in wishlist');
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist'
      });
    }

    await wishlist.save();
    await wishlist.populate('items.product', 'name price images category stock rating featured');

    console.log('Item removed from wishlist successfully');
    res.json({
      success: true,
      message: 'Product removed from wishlist',
      data: wishlist
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from wishlist',
      error: error.message
    });
  }
});

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = asyncHandler(async (req, res) => {
  try {
    console.log('Clearing wishlist for user:', req.user._id);
    
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.items = [];
    await wishlist.save();

    console.log('Wishlist cleared successfully');
    res.json({
      success: true,
      message: 'Wishlist cleared successfully',
      data: wishlist
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing wishlist',
      error: error.message
    });
  }
});

// @desc    Move wishlist item to cart
// @route   POST /api/wishlist/:productId/move-to-cart
// @access  Private
const moveToCart = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity = 1 } = req.body;

    console.log('Moving item to cart - Product ID:', productId, 'User:', req.user._id);

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    const itemIndex = wishlist.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist'
      });
    }

    const item = wishlist.items[itemIndex];
    
    // Remove from wishlist
    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    // Return the product info for frontend to add to cart
    const product = await Product.findById(productId)
      .select('name price images stock');

    console.log('Item moved to cart successfully');
    res.json({
      success: true,
      message: 'Item moved to cart',
      data: {
        product: {
          ...product.toObject(),
          size: item.size,
          color: item.color
        },
        quantity
      }
    });
  } catch (error) {
    console.error('Error moving item to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error moving item to cart',
      error: error.message
    });
  }
});

// @desc    Check for wishlist notifications (restock, price drop)
// @route   GET /api/wishlist/notifications/check
// @access  Private
const checkWishlistNotifications = asyncHandler(async (req, res) => {
  try {
    console.log('Checking wishlist notifications for user:', req.user._id);
    
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('items.product', 'name price stock previousPrice');

    if (!wishlist || !wishlist.items.length) {
      console.log('No wishlist or empty wishlist');
      return res.json({
        success: true,
        data: { hasNotifications: false, notifications: [] }
      });
    }

    const notifications = [];
    const now = new Date();

    for (const item of wishlist.items) {
      const product = item.product;

      // Check for restock notification
      if (product.stock > 0 && wishlist.notificationEnabled) {
        // Check if we already notified about this restock
        const existingNotification = await Notification.findOne({
          user: req.user._id,
          type: 'wishlist_restock',
          'data.productId': product._id.toString(),
          createdAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) } // Last 24 hours
        });

        if (!existingNotification) {
          notifications.push({
            type: 'wishlist_restock',
            title: 'Back in Stock!',
            message: `${product.name} is back in stock!`,
            productId: product._id,
            productName: product.name
          });
        }
      }

      // Check for price drop notification
      if (product.previousPrice && product.price < product.previousPrice && wishlist.notificationEnabled) {
        const priceDropPercent = Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100);
        
        notifications.push({
          type: 'wishlist_price_drop',
          title: 'Price Drop!',
          message: `${product.name} price dropped by ${priceDropPercent}%!`,
          productId: product._id,
          productName: product.name,
          oldPrice: product.previousPrice,
          newPrice: product.price,
          discount: priceDropPercent
        });
      }
    }

    console.log('Wishlist notifications checked:', notifications.length);
    res.json({
      success: true,
      data: {
        hasNotifications: notifications.length > 0,
        notifications
      }
    });
  } catch (error) {
    console.error('Error checking wishlist notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking wishlist notifications',
      error: error.message
    });
  }
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveToCart,
  checkWishlistNotifications
};