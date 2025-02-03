// Import multer
const multer = require('multer');

// Disk storage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let uploadFolder = './products'; // Default folder
    callback(null, uploadFolder);

  },
  
  filename: (req, file, callback) => {
    const filename = `image-${Date.now()}-${file.originalname}`;
    callback(null, filename);
  },
});

// File filter
const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    callback(null, true); // Accept the file
  } else {
    callback(null, false); // Reject the file
    return callback(new Error('Only PNG, JPG, JPEG files are allowed.'));
  }
};

// Multer configuration
const productmulterconfig = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Optional: limit file size to 5MB
  },
});

// Export the multer instance
module.exports = productmulterconfig;
