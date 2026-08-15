const express = require('express');
const { getBrands, getBrand, createBrand, updateBrand, deleteBrand } = require('../controllers/brandController');
const { createCategoryValidator, updateCategoryValidator } = require('../validators/categoryValidators');
const { protect, restrictTo, softAuth } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload/multerConfig');

const router = express.Router();

// Brand payload shape mirrors Category (name/description/isActive), so we
// reuse the same validator chains rather than duplicating identical rules.
router.get('/', softAuth, getBrands);
router.get('/:idOrSlug', getBrand);

router.post('/', protect, restrictTo('admin'), upload.single('logo'), createCategoryValidator, createBrand);
router.patch('/:id', protect, restrictTo('admin'), upload.single('logo'), updateCategoryValidator, updateBrand);
router.delete('/:id', protect, restrictTo('admin'), deleteBrand);

module.exports = router;
