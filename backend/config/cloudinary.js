// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Utility function to upload to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'hijabworld') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${folder}/products`,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('Cloudinary upload successful:', result.secure_url);
          resolve(result);
        }
      }
    );
    
    uploadStream.end(fileBuffer);
  });
};

module.exports = { cloudinary, uploadToCloudinary };