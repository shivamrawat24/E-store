const { body } = require('express-validator');
const { validate } = require('./validate');

const createProductValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required').isLength({ max: 140 }).withMessage('Name cannot exceed 140 characters'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('shortDescription').optional().trim().isLength({ max: 200 }).withMessage('Short description cannot exceed 200 characters'),
  body('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('comparePrice')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Compare-at price must be a positive number'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('category').notEmpty().withMessage('Category is required').isMongoId().withMessage('Invalid category ID'),
  body('brand').optional({ checkFalsy: true }).isMongoId().withMessage('Invalid brand ID'),
  body('stock').notEmpty().withMessage('Stock quantity is required').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('status').optional().isIn(['active', 'draft', 'archived']).withMessage('Invalid status value'),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),
  body('isBestSeller').optional().isBoolean().withMessage('isBestSeller must be a boolean'),
  validate,
];

const updateProductValidator = [
  body('name').optional().trim().isLength({ min: 1, max: 140 }).withMessage('Name must be between 1 and 140 characters'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('shortDescription').optional().trim().isLength({ max: 200 }).withMessage('Short description cannot exceed 200 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('comparePrice').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Compare-at price must be a positive number'),
  body('category').optional().isMongoId().withMessage('Invalid category ID'),
  body('brand').optional({ checkFalsy: true }).isMongoId().withMessage('Invalid brand ID'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('status').optional().isIn(['active', 'draft', 'archived']).withMessage('Invalid status value'),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),
  body('isBestSeller').optional().isBoolean().withMessage('isBestSeller must be a boolean'),
  validate,
];

const updateStockValidator = [
  body('stock').notEmpty().withMessage('Stock quantity is required').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  validate,
];

module.exports = { createProductValidator, updateProductValidator, updateStockValidator };
