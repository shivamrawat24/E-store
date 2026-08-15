const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { createCategoryValidator, updateCategoryValidator } = require('../validators/categoryValidators');
const { protect, restrictTo, softAuth } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload/multerConfig');

const router = express.Router();

router.get('/', softAuth, getCategories);
router.get('/:idOrSlug', getCategory);

router.post('/', protect, restrictTo('admin'), upload.single('image'), createCategoryValidator, createCategory);
router.patch('/:id', protect, restrictTo('admin'), upload.single('image'), updateCategoryValidator, updateCategory);
router.delete('/:id', protect, restrictTo('admin'), deleteCategory);

module.exports = router;
