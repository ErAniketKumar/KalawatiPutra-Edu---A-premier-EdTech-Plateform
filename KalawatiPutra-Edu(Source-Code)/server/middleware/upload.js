const multer = require('multer');
    const path = require('path');
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const cloudinary = require('cloudinary').v2;

    // Configure Cloudinary storage
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: process.env.CLOUDINARY_KEY_NAME, // e.g., 'kalawatiPutra'
        allowed_formats: ['jpeg', 'jpg', 'png', 'pdf'],
        public_id: (req, file) => `kalawatiputratutor/articles/${path.basename(file.originalname, path.extname(file.originalname))}${file.mimetype === 'application/pdf' ? '.pdf' : ''}`
      }
    });

    // File filter for JPEG, JPG, PNG, PDF
    const fileFilter = (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|pdf/;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);
      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new Error('Only images and PDFs are allowed'));
      }
    };

    const upload = multer({
      storage,
      fileFilter
    });

    module.exports = upload;