const multer = require('multer');
const ApiError = require('../../utils/ApiError');

// Memory storage: files stay as buffers in RAM and are streamed straight to
// Cloudinary — nothing is ever written to local disk.
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(ApiError.badRequest('Only JPEG, PNG, WEBP, and AVIF image files are allowed.'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 8, // max images per product
  },
});

module.exports = upload;
