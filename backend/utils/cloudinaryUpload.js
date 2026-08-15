const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const logger = require('../config/logger');

/**
 * Uploads a single in-memory file buffer (from Multer's memoryStorage) to
 * Cloudinary and returns its secure URL + public ID.
 *
 * @param {Buffer} buffer
 * @param {string} folder - Cloudinary folder, e.g. "ecommerce/products"
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadBufferToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ width: 1600, height: 1600, crop: 'limit', quality: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Uploads multiple buffers in parallel. Any single failure rejects the whole
 * batch so the caller can decide whether to roll back already-uploaded images.
 *
 * @param {Array<{buffer: Buffer}>} files - Multer file objects
 * @param {string} folder
 */
const uploadMultipleToCloudinary = async (files, folder) => {
  return Promise.all(files.map((file) => uploadBufferToCloudinary(file.buffer, folder)));
};

/**
 * Deletes a single image from Cloudinary by public ID.
 * Swallows errors (logs them) since a failed cleanup shouldn't block the
 * primary DB operation the caller is performing.
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error(`Cloudinary delete failed for ${publicId}: ${error.message}`);
  }
};

/**
 * Deletes multiple images from Cloudinary in parallel.
 */
const deleteManyFromCloudinary = async (publicIds = []) => {
  await Promise.all(publicIds.filter(Boolean).map((id) => deleteFromCloudinary(id)));
};

module.exports = {
  uploadBufferToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  deleteManyFromCloudinary,
};
