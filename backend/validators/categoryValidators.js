const { body } = require('express-validator');
const { validate } = require('./validate');

const createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 80 })
    .withMessage('Category name cannot exceed 80 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('parent').optional({ checkFalsy: true }).isMongoId().withMessage('Invalid parent category ID'),
  validate,
];

const updateCategoryValidator = [
  body('name').optional().trim().isLength({ min: 1, max: 80 }).withMessage('Category name must be between 1 and 80 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('parent').optional({ checkFalsy: true }).isMongoId().withMessage('Invalid parent category ID'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  validate,
];

module.exports = { createCategoryValidator, updateCategoryValidator };
