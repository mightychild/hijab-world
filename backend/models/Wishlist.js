// models/Wishlist.js
const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  size: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  }
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [wishlistItemSchema],
  notificationEnabled: {
    type: Boolean,
    default: true
  },
  lastViewed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate items
wishlistSchema.index({ user: 1, 'items.product': 1 }, { unique: true });

// Update lastViewed when wishlist is accessed
wishlistSchema.pre('save', function(next) {
  this.lastViewed = new Date();
  next();
});

// Add text search index for better performance
wishlistSchema.index({ user: 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);