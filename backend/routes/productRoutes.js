const express = require('express');
const {
  getProducts,
  getFeaturedProducts,
  getBestSellers,
  getProduct,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
} = require('../controllers/productController');
const {
  createProductValidator,
  updateProductValidator,
  updateStockValidator,
} = require('../validators/productValidators');
const { protect, restrictTo, softAuth } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload/multerConfig');

const router = express.Router();

// ---------- Public ----------
router.get('/', softAuth, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/best-sellers', getBestSellers);
router.get('/:idOrSlug', softAuth, getProduct);

// ---------- Admin ----------
router.post('/', protect, restrictTo('admin'), upload.array('images', 8), createProductValidator, createProduct);
router.patch('/:id', protect, restrictTo('admin'), upload.array('images', 8), updateProductValidator, updateProduct);
router.patch('/:id/stock', protect, restrictTo('admin'), updateStockValidator, updateStock);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

module.exports = router;
