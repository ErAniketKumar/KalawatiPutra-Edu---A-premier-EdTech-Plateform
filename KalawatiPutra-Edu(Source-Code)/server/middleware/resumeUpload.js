const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Log Cloudinary config for debugging
// console.log('Cloudinary config:', {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY ? 'set' : 'missing',
//   api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing',
// });

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: process.env.CLOUDINARY_KEY_NAME || 'kalawatiPutra',
    allowed_formats: ['jpeg', 'jpg', 'png', 'pdf', 'doc', 'docx'],
    public_id: (req, file) => `kalawatiputratutor/resumes/${Date.now()}${path.extname(file.originalname)}`,
  },
});

// File filter for JPEG, JPG, PNG, PDF, DOC, DOCX
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images, PDFs, and Word documents are allowed'));
  }
};

const resumeUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = resumeUpload;