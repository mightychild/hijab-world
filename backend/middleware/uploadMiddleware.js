// middleware/uploadMiddleware.js
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

// Enhanced middleware with better error handling and logging
const uploadProductImages = (req, res, next) => {
  console.log('Multer middleware processing request...');
  console.log('Content-Type:', req.headers['content-type']);
  
  // Use multer to process the form data - handle both fields and files
  upload.any()(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    console.log('Multer processed successfully');
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request files count:', req.files ? req.files.length : 0);
    
    // Log all form fields for debugging
    console.log('Form data received:');
    Object.keys(req.body).forEach(key => {
      console.log(`  ${key}:`, req.body[key]);
    });
    
    // Log files info
    if (req.files && req.files.length > 0) {
      console.log('Files received:', req.files.length);
      req.files.forEach((file, index) => {
        console.log(`  File ${index + 1}:`, file.fieldname, file.originalname, file.size, 'bytes');
      });
    }
    
    next();
  });
};

module.exports = { uploadProductImages };