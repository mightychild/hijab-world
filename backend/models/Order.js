const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    }
  }],
  shippingAddress: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'Nigeria'
    }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'successful', 'failed', 'cancelled', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['card', 'bank', 'ussd', 'transfer'],
      default: 'card'
    },
    paystackReference: {
      type: String,
      default: ''
    },
    transactionId: {
      type: String,
      default: ''
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'NGN'
    },
    paidAt: {
      type: Date
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  trackingNumber: {
    type: String,
    default: ''
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// order number generation
orderSchema.pre('validate', function(next) {
  console.log('Pre-validate hook called');
  
  if (!this.orderNumber) {
    console.log('Generating order number...');
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `HW${timestamp.slice(-8)}${random}`;
    console.log('Generated order number:', this.orderNumber);
  }
  
  next();
});

orderSchema.pre('save', function(next) {
  console.log('Pre-save hook called');
  console.log('Current orderNumber:', this.orderNumber);
  
  // Ensure orderNumber exists
  if (!this.orderNumber) {
    console.log('No orderNumber, generating fallback...');
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000);
    this.orderNumber = `HW-FB${timestamp}${random}`;
    console.log('Fallback order number:', this.orderNumber);
  }

  // Calculate final amount
  if (this.isModified('totalAmount') || this.isModified('shippingFee') || 
      this.isModified('taxAmount') || this.isModified('discountAmount')) {
    this.finalAmount = this.totalAmount + this.shippingFee + this.taxAmount - this.discountAmount;
  }
  
  next();
});

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);
