const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const paystack = require('../config/paystack'); // Fixed import - direct instance

// @desc    Create new order and payment initialization
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    console.log('Received order creation request');
    console.log('User:', req.user._id);
    
    const { items, shippingAddress, notes } = req.body;
    const user = req.user;

    // Validate request data
    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Please add items to your cart before checkout.',
        field: 'items'
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required.',
        field: 'shippingAddress'
      });
    }

    // Validate required shipping fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required shipping fields: ${missingFields.join(', ')}`,
        fields: missingFields
      });
    }

    // Calculate totals and validate stock
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.name} not found`,
          field: 'items'
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stock} available.`,
          field: 'items',
          productId: product._id
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]?.url || '',
        size: item.size || '',
        color: item.color || ''
      });
    }

    // FREE SHIPPING - Always 0
    const shippingFee = 0;
    const taxAmount = subtotal;
    const totalAmount = subtotal;

    console.log('💰 Calculated totals:', { subtotal, shippingFee, taxAmount, totalAmount });

    // Manual order number generation as fallback
    const generateOrderNumber = () => {
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      return `HW${timestamp.slice(-8)}${random}`;
    };

    // Create order with manual order number as fallback
    const order = new Order({
      user: user._id,
      orderNumber: generateOrderNumber(), // Manual fallback
      items: orderItems,
      shippingAddress,
      totalAmount: subtotal,
      shippingFee,
      taxAmount,
      finalAmount: totalAmount,
      notes,
      payment: {
        amount: totalAmount,
        currency: 'NGN'
      }
    });

    console.log('Order instance created with orderNumber:', order.orderNumber);
    console.log('Order data before save:', {
      hasOrderNumber: !!order.orderNumber,
      orderNumber: order.orderNumber,
      itemsCount: order.items.length,
      totalAmount: order.totalAmount
    });

    const savedOrder = await order.save();
    console.log('Order saved successfully. Order Number:', savedOrder.orderNumber);

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Create order confirmation notification
    await Notification.create({
      user: user._id,
      type: 'order_confirm',
      title: 'Order Confirmed',
      message: `Your order #${savedOrder.orderNumber} has been received and is being processed.`,
      data: {
        orderId: savedOrder._id.toString(),
        link: `/my-orders/${savedOrder._id}`
      },
      priority: 'high'
    });

    // Initialize Paystack payment
    console.log('Initializing Paystack payment...');

    try {
      // Check if Paystack is properly configured
      if (!process.env.PAYSTACK_SECRET_KEY) {
        throw new Error('Paystack payment gateway is not configured. Missing PAYSTACK_SECRET_KEY.');
      }

      // Verify paystack instance is available
      if (!paystack || typeof paystack.transaction?.initialize !== 'function') {
        throw new Error('Paystack instance is not properly initialized.');
      }

      const paymentData = {
        amount: Math.round(totalAmount * 100), // Convert to kobo
        email: shippingAddress.email,
        reference: savedOrder.orderNumber,
        currency: 'NGN',
        callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-confirmation/${savedOrder._id}`,
        metadata: {
          order_id: savedOrder._id.toString(),
          customer_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          custom_fields: [
            {
              display_name: "Order Number",
              variable_name: "order_number",
              value: savedOrder.orderNumber
            },
            {
              display_name: "Customer Phone",
              variable_name: "customer_phone",
              value: shippingAddress.phone
            }
          ]
        }
      };

      console.log('Paystack payment data:', paymentData);

      // Initialize Paystack transaction
      const response = await paystack.transaction.initialize(paymentData);
      
      console.log('Paystack response:', response);
      
      if (response.status && response.data && response.data.authorization_url) {
        console.log('Paystack payment initialized successfully');
        
        res.status(201).json({
          success: true,
          message: 'Order created successfully. Redirecting to payment...',
          data: {
            order: savedOrder,
            paymentLink: response.data.authorization_url,
            reference: response.data.reference
          }
        });
      } else {
        console.error('Invalid response from Paystack:', response);
        throw new Error('Invalid response from payment gateway. Please try again.');
      }

    } catch (paymentError) {
      console.error('Paystack payment error:', paymentError.message);
      
      // Order created successfully, but payment initialization failed
      res.status(201).json({
        success: true,
        message: 'Order created successfully. Please contact support for payment instructions.',
        data: {
          order: savedOrder,
          paymentLink: null,
          warning: 'Payment gateway temporarily unavailable. Your order is saved and will be processed once payment is confirmed.',
          orderNumber: savedOrder.orderNumber,
          supportEmail: 'support@hijabworld.com',
          supportPhone: '+234-XXX-XXXX-XXX'
        }
      });
    }

  } catch (error) {
    console.error('Create order error:', error);
    
    // error logging
    if (error.name === 'ValidationError') {
      console.error('Validation errors details:');
      Object.values(error.errors).forEach(err => {
        console.error(`  - ${err.path}: ${err.message}`);
      });
      
      return res.status(400).json({
        success: false,
        message: 'Validation error. Please check your input.',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    // Specific handling for order number issues
    if (error.message.includes('orderNumber') || error.errors?.orderNumber) {
      return res.status(400).json({
        success: false,
        message: 'Order number generation failed. Please try again.',
        error: 'ORDER_NUMBER_GENERATION_FAILED'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating order. Please try again.'
    });
  }
};

// @desc    Verify Paystack payment
// @route   POST /api/orders/verify-payment
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { reference, order_id } = req.body;

    console.log('Verifying payment:', { reference, order_id });

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required'
      });
    }

    // Verify payment with Paystack
    console.log('Verifying with Paystack...');
    const response = await paystack.transaction.verify(reference);
    
    console.log('Paystack verification response:', response);

    if (response.status && response.data.status === 'success') {
      console.log('Payment verified successfully');
      
      // Find order and update payment status
      const order = await Order.findOneAndUpdate(
        { orderNumber: reference },
        {
          'payment.status': 'successful',
          'payment.transactionId': response.data.id,
          'payment.paystackReference': response.data.reference,
          'payment.paidAt': new Date(),
          status: 'confirmed'
        },
        { new: true }
      ).populate('user', 'firstName lastName email');

      if (!order) {
        console.log('Order not found for reference:', reference);
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Create payment success notification
      await Notification.create({
        user: order.user._id,
        type: 'payment_success',
        title: 'Payment Successful',
        message: `Your payment for order #${order.orderNumber} was successful.`,
        data: {
          orderId: order._id.toString(),
          link: `/my-orders/${order._id}`
        },
        priority: 'high'
      });

      res.json({
        success: true,
        order,
        message: 'Payment verified successfully'
      });
    } else {
      console.log('Payment failed or pending:', response.data.status);
      
      // Update order status to failed
      await Order.findOneAndUpdate(
        { orderNumber: reference },
        {
          'payment.status': 'failed',
          status: 'pending'
        }
      );

      res.status(400).json({
        success: false,
        message: `Payment ${response.data.status}`
      });
    }

  } catch (error) {
    console.error('Verify payment error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment'
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = { user: req.user._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('items.product', 'name images');

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalOrders: total
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
};

// @desc    Get recent orders for dashboard
// @route   GET /api/orders/recent
// @access  Private
exports.getRecentOrders = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('orderNumber status totalAmount createdAt');

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent orders'
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason || '';
    await order.save();

    // Create cancellation notification
    await Notification.create({
      user: req.user._id,
      type: 'system',
      title: 'Order Cancelled',
      message: `Your order #${order.orderNumber} has been cancelled.`,
      data: {
        orderId: order._id.toString(),
        link: `/my-orders/${order._id}`
      }
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order'
    });
  }
};

// @desc    Test endpoint
// @route   GET /api/orders/test
// @access  Public
exports.testEndpoint = async (req, res) => {
  res.json({
    success: true,
    message: 'Orders endpoint is working!',
    timestamp: new Date().toISOString(),
    paystackConfigured: !!process.env.PAYSTACK_SECRET_KEY
  });
};

// @desc    Test Paystack connection
// @route   GET /api/orders/test-paystack
// @access  Public
exports.testPaystack = async (req, res) => {
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return res.json({
        success: false,
        message: 'Paystack secret key not configured',
        configured: false
      });
    }

    // Test Paystack connection by listing transactions
    const response = await paystack.transaction.list({ perPage: 1 });
    
    res.json({
      success: true,
      message: 'Paystack connection successful',
      configured: true,
      response: response.status ? 'Connected' : 'Failed'
    });

  } catch (error) {
    res.json({
      success: true,
      message: 'Paystack module loaded but connection test failed',
      configured: true,
      error: error.message
    });
  }
};