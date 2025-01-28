// multerConfig.js
const multer = require('multer');

// Multer diskStorage configuration to temporarily store files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Store files in 'uploads' folder temporarily
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Allow only image files
    } else {
      cb(new Error('Only image files are allowed'), false); // Reject non-image files
    }
  }
});

module.exports = upload;
